import { NextResponse } from "next/server";
import { getSampleQuest, normalizeGeminiQuest, type Quest } from "@/lib/quests";

// Retired models can still appear in the models list, so we try candidates in
// order and keep the first that actually generates. The *-latest aliases are
// Google-managed and always point at a live model. Lite variants think less,
// truncate less, and are usually under less demand — so they lead.
const MODEL_CANDIDATES = [
  "gemini-flash-lite-latest",
  "gemini-3.5-flash-lite",
  "gemini-flash-latest",
  "gemini-3.5-flash",
  "gemini-3.6-flash",
];
let cachedModel: string | null = null;

async function candidateModels(key: string): Promise<string[]> {
  if (cachedModel) return [cachedModel];
  let available: Set<string> | null = null;
  try {
    const res = await fetch("https://generativelanguage.googleapis.com/v1beta/models?pageSize=100", {
      headers: { "x-goog-api-key": key },
      signal: AbortSignal.timeout(8000),
    });
    if (res.ok) {
      const data = await res.json();
      available = new Set(
        (data?.models ?? [])
          .filter((m: { supportedGenerationMethods?: string[] }) =>
            (m.supportedGenerationMethods ?? []).includes("generateContent")
          )
          .map((m: { name: string }) => String(m.name).replace(/^models\//, ""))
      );
    }
  } catch {
    // Without a list we just try the candidates blind.
  }

  const preferred = MODEL_CANDIDATES.filter(
    (m) => !available || available.has(m)
  );
  const candidates = preferred.length ? preferred : [...MODEL_CANDIDATES];
  if (available) {
    const extras = [...available].filter(
      (n) =>
        n.includes("flash") &&
        !n.includes("tts") &&
        !n.includes("image") &&
        !n.includes("preview") &&
        !candidates.includes(n)
    );
    candidates.push(...extras.slice(0, 2));
  }
  return candidates;
}

// Forces Gemini to answer with exactly the JSON shape a playable quest needs.
const responseSchema = {
  type: "OBJECT",
  properties: {
    title: { type: "STRING" },
    description: { type: "STRING" },
    emoji: { type: "STRING" },
    levels: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          type: { type: "STRING", enum: ["story", "quiz", "truefalse"] },
          title: { type: "STRING" },
          emoji: { type: "STRING" },
          text: { type: "STRING" },
          question: { type: "STRING" },
          options: { type: "ARRAY", items: { type: "STRING" } },
          correctIndex: { type: "INTEGER" },
          answer: { type: "BOOLEAN" },
          explanation: { type: "STRING" },
        },
        // Every field must be marked required — if only "type" is required,
        // models under token pressure emit empty {"type":"quiz"} skeletons.
        required: [
          "type",
          "title",
          "emoji",
          "text",
          "question",
          "options",
          "correctIndex",
          "answer",
          "explanation",
        ],
      },
    },
    relatedTopics: {
      type: "ARRAY",
      items: { type: "STRING" },
    },
  },
  required: ["title", "description", "levels", "relatedTopics"],
};

function buildPrompt(topic: string): string {
  return [
    "You are Mitra, a playful learning guide inside a gamified study app.",
    `Create a fun, factual 6-level learning quest about: "${topic}".`,
    "Use exactly this level plan, in order: story, quiz, story, quiz, truefalse, quiz.",
    "Rules:",
    "- story: a title, one emoji, and 2-3 vivid, simple sentences.",
    "- quiz: a question, 3-4 short options, the 0-based correctIndex, and a 1-2 sentence explanation.",
    "- truefalse: a question, the boolean answer, and a 1-2 sentence explanation.",
    "- relatedTopics: exactly 3 engaging, curiosity-sparking topics closely related to this one that the learner can explore next.",
    "- Only real, verifiable facts. Simple English a curious teenager enjoys. Encouraging tone.",
    "- Fill EVERY field of every level, even ones a level type doesn't need.",
    "- Output compact JSON — never pad with extra newlines or whitespace.",
  ].join("\n");
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Quests that generated successfully are cached — instant replays and a
// reliable fallback when the free tier is under load.
const questCache = new Map<string, Quest>();
const CACHE_LIMIT = 60;

function cacheQuest(quest: Quest): void {
  const key = quest.topic.toLowerCase();
  if (!questCache.has(key) && questCache.size >= CACHE_LIMIT) {
    questCache.delete(questCache.keys().next().value as string);
  }
  questCache.set(key, quest);
}

const isTimeout = (err: unknown) =>
  err instanceof Error && (err.name === "TimeoutError" || err.name === "AbortError");

async function generateQuest(topic: string, key: string): Promise<Quest> {
  const candidates = await candidateModels(key);
  let lastStatus = "unknown";

  for (const model of candidates) {
    // 503 (overloaded), 429 (rate limited) and timeouts are all transient
    // under free-tier load — retry the same model with backoff before moving on.
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        // New-format AI Studio keys (AQ...) are only accepted via the
        // x-goog-api-key header, never the ?key= query parameter.
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json", "x-goog-api-key": key },
            body: JSON.stringify({
              contents: [{ parts: [{ text: buildPrompt(topic) }] }],
              generationConfig: {
                temperature: 0.9,
                responseMimeType: "application/json",
                responseSchema,
                // Thinking models spend reasoning tokens from this same
                // budget — 8k truncates the quest JSON mid-string. 32k leaves
                // room for thinking plus the full quest.
                maxOutputTokens: 32768,
                // The 2.5 family supports disabling thinking; newer models
                // reject the field, so only send it where it's known valid.
                ...(model.includes("2.5")
                  ? { thinkingConfig: { thinkingBudget: 0 } }
                  : {}),
              },
            }),
            // Lite models can exceed 45s while Google's free tier is spiking.
            signal: AbortSignal.timeout(60_000),
          }
        );
        if (res.ok) {
          const data = await res.json();
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          const quest = normalizeGeminiQuest(JSON.parse(text), topic);
          cachedModel = model; // remember the winner for future requests
          return quest;
        }
        lastStatus = String(res.status);
        console.error(`Gemini API ${res.status} on ${model} (attempt ${attempt})`);
        if (res.status === 503 || res.status === 429) {
          await sleep(1200 * attempt);
          continue;
        }
        break; // 404/400 — this model is a dead end, try the next one
      } catch (err) {
        lastStatus = String(err instanceof Error ? err.message : err);
        console.error(`Generation attempt on ${model} failed:`, lastStatus);
        if (isTimeout(err) && attempt < 3) {
          await sleep(1200 * attempt);
          continue;
        }
        break; // other failure — next model
      }
    }
  }
  throw new Error(`All Gemini models failed (last: ${lastStatus})`);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const topic = String(body?.topic ?? "")
    .trim()
    .slice(0, 80);
  if (!topic) {
    return NextResponse.json({ error: "Please enter a topic." }, { status: 400 });
  }

  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    // No key configured yet — serve a curated sample quest so the whole loop
    // stays playable, and tell the client why.
    return NextResponse.json({
      ...getSampleQuest(topic),
      note: "Sample quest — add your free GEMINI_API_KEY in .env.local to generate quests on ANY topic.",
    });
  }

  const cached = questCache.get(topic.toLowerCase());
  if (cached) return NextResponse.json(structuredClone(cached));

  try {
    const quest = await generateQuest(topic, key);
    cacheQuest(quest);
    return NextResponse.json(quest);
  } catch (err) {
    console.error("Quest generation failed:", err);
    return NextResponse.json({
      ...getSampleQuest(topic),
      note: "AI generation hiccuped, so here's a sample quest instead.",
    });
  }
}
