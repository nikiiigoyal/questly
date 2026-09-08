import { NextResponse } from "next/server";
import { getSampleQuest, normalizeGeminiQuest } from "@/lib/quests";

const MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";

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
        required: ["type"],
      },
    },
  },
  required: ["title", "description", "levels"],
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
    "- Only real, verifiable facts. Simple English a curious teenager enjoys. Encouraging tone.",
  ].join("\n");
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

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: buildPrompt(topic) }] }],
          generationConfig: {
            temperature: 0.9,
            responseMimeType: "application/json",
            responseSchema,
          },
        }),
      }
    );
    if (!res.ok) throw new Error(`Gemini API responded ${res.status}`);

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    const quest = normalizeGeminiQuest(JSON.parse(text), topic);
    return NextResponse.json(quest);
  } catch (err) {
    console.error("Quest generation failed:", err);
    return NextResponse.json({
      ...getSampleQuest(topic),
      note: "AI generation hiccuped, so here's a sample quest instead.",
    });
  }
}
