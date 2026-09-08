export type StoryLevel = {
  type: "story";
  title: string;
  emoji: string;
  text: string;
};

export type QuizLevel = {
  type: "quiz";
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type TrueFalseLevel = {
  type: "truefalse";
  question: string;
  answer: boolean;
  explanation: string;
};

export type QuestLevel = StoryLevel | QuizLevel | TrueFalseLevel;

export type Quest = {
  topic: string;
  title: string;
  description: string;
  emoji: string;
  levels: QuestLevel[];
  generatedBy: "gemini" | "sample";
};

export function levelXp(level: QuestLevel): number {
  return level.type === "story" ? 5 : 10;
}

export const SAMPLE_TOPICS = ["Volcanoes", "Mughal Empire", "Solar System"];

const SAMPLE_QUESTS: Record<string, Quest> = {
  volcanoes: {
    topic: "Volcanoes",
    title: "Journey to the Ring of Fire",
    description: "Why the Earth burps fire — a 6-level quest about volcanoes.",
    emoji: "🌋",
    generatedBy: "sample",
    levels: [
      {
        type: "story",
        title: "A mountain with a secret",
        emoji: "🌋",
        text: "Deep under every volcano lies a chamber of melted rock, heated until it glows. When pressure builds up, that rock forces its way upward — and a quiet mountain can wake up overnight.",
      },
      {
        type: "quiz",
        question: "What is molten rock called while it is still underground?",
        options: ["Lava", "Magma", "Crater", "Ash"],
        correctIndex: 1,
        explanation:
          "Underground it's magma. The moment it erupts onto the surface, it gets a new name: lava.",
      },
      {
        type: "story",
        title: "The planet's fiery necklace",
        emoji: "🌏",
        text: "Around the edge of the Pacific Ocean, tectonic plates collide and dive beneath each other. This creates a horseshoe-shaped zone packed with volcanoes — scientists call it the Ring of Fire.",
      },
      {
        type: "quiz",
        question: "The Ring of Fire surrounds which ocean?",
        options: ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"],
        correctIndex: 2,
        explanation:
          "The Pacific 'Ring of Fire' holds about three-quarters of Earth's active volcanoes.",
      },
      {
        type: "truefalse",
        question: "Mount Everest is a volcano.",
        answer: false,
        explanation:
          "Everest is a fold mountain, pushed up by colliding plates — no magma chamber involved.",
      },
      {
        type: "quiz",
        question: "Which country has the most active volcanoes?",
        options: ["Indonesia", "Japan", "Chile", "Iceland"],
        correctIndex: 0,
        explanation:
          "Indonesia sits right on the Ring of Fire and has around 130 active volcanoes.",
      },
    ],
  },
  "mughal empire": {
    topic: "Mughal Empire",
    title: "Emperors of India",
    description: "Six levels through the rise of the Mughals, from Babur to the Taj Mahal.",
    emoji: "🕌",
    generatedBy: "sample",
    levels: [
      {
        type: "story",
        title: "A king with a small army and a big dream",
        emoji: "🐎",
        text: "In 1526, a young Central Asian ruler named Babur marched into India with roughly 12,000 soldiers. At Panipat he faced an army ten times larger — and won, using cannons and clever tactics. That victory founded the Mughal Empire.",
      },
      {
        type: "quiz",
        question: "Who founded the Mughal Empire?",
        options: ["Akbar", "Babur", "Shah Jahan", "Aurangzeb"],
        correctIndex: 1,
        explanation:
          "Babur won the First Battle of Panipat in 1526, which marked the beginning of Mughal rule in India.",
      },
      {
        type: "story",
        title: "The emperor who married a Rajput princess",
        emoji: "🤝",
        text: "Babur's grandson Akbar ruled for almost 50 years. He married Rajput princesses, removed the tax on non-Muslim pilgrims, and filled his court with artists and scholars of every faith.",
      },
      {
        type: "quiz",
        question: "Which Mughal emperor built the Taj Mahal?",
        options: ["Humayun", "Akbar", "Shah Jahan", "Babur"],
        correctIndex: 2,
        explanation:
          "Shah Jahan built it as a marble tomb for his beloved wife, Mumtaz Mahal.",
      },
      {
        type: "truefalse",
        question: "The Taj Mahal is a Hindu temple.",
        answer: false,
        explanation:
          "It's an Islamic mausoleum — one of the most famous tombs in the world, not a temple.",
      },
      {
        type: "quiz",
        question: "At Panipat in 1526, Babur defeated which sultan?",
        options: ["Ibrahim Lodi", "Rana Sanga", "Sher Shah Suri", "Hemu"],
        correctIndex: 0,
        explanation:
          "Ibrahim Lodi was the last sultan of Delhi; his defeat ended the Lodi dynasty.",
      },
    ],
  },
  "solar system": {
    topic: "Solar System",
    title: "A Grand Tour of the Sun's Family",
    description: "Eight planets, one star, and a lot of empty space.",
    emoji: "🪐",
    generatedBy: "sample",
    levels: [
      {
        type: "story",
        title: "One star, eight worlds",
        emoji: "☀️",
        text: "Our solar system is one ordinary star with eight planets circling it. If the Sun were a football, Earth would be a tiny seed about 25 metres away — and most of that space in between is completely empty.",
      },
      {
        type: "quiz",
        question: "Which is the largest planet in our solar system?",
        options: ["Saturn", "Jupiter", "Neptune", "Earth"],
        correctIndex: 1,
        explanation:
          "Jupiter is so big that all the other planets could fit inside it — more than 1,300 times over.",
      },
      {
        type: "story",
        title: "The ring of leftovers",
        emoji: "☄️",
        text: "Between Mars and Jupiter floats the asteroid belt — millions of rocky leftovers that never managed to become a planet. Jupiter's giant gravity keeps stirring them, so they never clump together.",
      },
      {
        type: "quiz",
        question: "Which planet is closest to the Sun?",
        options: ["Venus", "Mercury", "Mars", "Earth"],
        correctIndex: 1,
        explanation:
          "Mercury hugs the Sun, completing one orbit in just 88 Earth days.",
      },
      {
        type: "truefalse",
        question: "Venus is the hottest planet in the solar system.",
        answer: true,
        explanation:
          "Surprising but true — its thick carbon-dioxide blanket traps heat so well that Venus beats even Mercury.",
      },
      {
        type: "quiz",
        question: "How long does sunlight take to reach Earth?",
        options: ["8 seconds", "8 minutes", "8 hours", "8 days"],
        correctIndex: 1,
        explanation:
          "Light travels about 300,000 km every second — the Sun is 150 million km away, so it takes roughly 8 minutes.",
      },
    ],
  },
};

export function getSampleQuest(topic: string): Quest {
  const t = topic.toLowerCase();
  const pool = Object.values(SAMPLE_QUESTS);
  const match = pool.find(
    (q) => t.includes(q.topic.toLowerCase()) || q.topic.toLowerCase().includes(t)
  );
  const quest = match ?? pool[Math.floor(Math.random() * pool.length)];
  return structuredClone(quest);
}

type RawLevel = {
  type?: unknown;
  title?: unknown;
  emoji?: unknown;
  text?: unknown;
  question?: unknown;
  options?: unknown;
  correctIndex?: unknown;
  answer?: unknown;
  explanation?: unknown;
};

const str = (v: unknown, fallback = ""): string =>
  typeof v === "string" && v.trim() ? v.trim() : fallback;

function normalizeQuiz(l: RawLevel): QuizLevel | null {
  const options = Array.isArray(l?.options)
    ? (l.options as unknown[])
        .map((o) => str(o))
        .filter(Boolean)
        .slice(0, 4)
    : [];
  if (options.length < 2) return null;

  let idx =
    typeof l?.correctIndex === "number" ? Math.round(l.correctIndex) : -1;
  if (idx < 0 || idx >= options.length) {
    // Some models return the answer as text instead of an index — try to match it.
    const answerText = str(l?.answer).toLowerCase();
    const matched = options.findIndex((o) => o.toLowerCase() === answerText);
    idx = matched;
  }
  if (idx < 0 || idx >= options.length) return null;

  return {
    type: "quiz",
    question: str(l?.question, "Quick question"),
    options,
    correctIndex: idx,
    explanation: str(l?.explanation),
  };
}

/**
 * Validates and repairs the JSON Gemini returns, level by level. Anything
 * malformed is dropped; if too little survives we throw and the API route
 * falls back to a sample quest so the game never breaks.
 */
export function normalizeGeminiQuest(raw: unknown, topic: string): Quest {
  const r = (raw ?? {}) as {
    title?: unknown;
    description?: unknown;
    emoji?: unknown;
    levels?: unknown;
  };
  const rawLevels: RawLevel[] = Array.isArray(r.levels) ? (r.levels as RawLevel[]) : [];

  const levels: QuestLevel[] = [];
  for (const l of rawLevels.slice(0, 8)) {
    const type = str(l?.type);
    if (type === "story" && str(l?.text)) {
      levels.push({
        type: "story",
        title: str(l?.title, topic),
        emoji: str(l?.emoji, "✨"),
        text: str(l?.text),
      });
    } else if (type === "quiz") {
      const quiz = normalizeQuiz(l);
      if (quiz) levels.push(quiz);
    } else if (type === "truefalse" && str(l?.question)) {
      levels.push({
        type: "truefalse",
        question: str(l?.question),
        answer: l?.answer === true,
        explanation: str(l?.explanation),
      });
    }
  }

  // Accept a slightly thinner quest rather than rejecting the generation —
  // newer "thinking" models occasionally return 4-5 levels instead of 6.
  const hasQuiz = levels.some((l) => l.type === "quiz");
  if (levels.length < 3 || !hasQuiz) {
    console.error(
      "Rejected quest payload:",
      JSON.stringify(raw).slice(0, 600)
    );
    throw new Error("Gemini returned too few valid levels");
  }

  return {
    topic,
    title: str(r.title, topic),
    description: str(r.description),
    emoji: str(r.emoji, "✨"),
    levels,
    generatedBy: "gemini",
  };
}
