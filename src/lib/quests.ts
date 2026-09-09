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
  relatedTopics: string[];
};

export function levelXp(level: QuestLevel): number {
  return level.type === "story" ? 5 : 10;
}

export const SAMPLE_TOPICS = [
  "Volcanoes",
  "Generative AI",
  "Seven Wonders of the World",
  "India's Digital Revolution (UPI)",
  "Mughal Empire",
  "Solar System",
];

const SAMPLE_QUESTS: Record<string, Quest> = {
  volcanoes: {
    topic: "Volcanoes",
    title: "Journey to the Ring of Fire",
    description: "Why the Earth burps fire — a 6-level quest about volcanoes.",
    emoji: "🌋",
    generatedBy: "sample",
    relatedTopics: [
      "Earthquakes & Fault Lines",
      "Tsunamis & Ocean Surges",
      "Geysers & Hot Springs",
    ],
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
    relatedTopics: [
      "Taj Mahal & Mughal Architecture",
      "Akbar the Great",
      "The Delhi Sultanate",
    ],
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
    relatedTopics: [
      "Black Holes",
      "Life as an Astronaut",
      "ISRO and Indian Space Missions",
    ],
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
  "generative ai": {
    topic: "Generative AI",
    title: "Inside the AI Revolution",
    description: "How machines learned to write, draw, and imagine.",
    emoji: "🤖",
    generatedBy: "sample",
    relatedTopics: [
      "How ChatGPT & LLMs Work",
      "Humanoid Robots",
      "Quantum Computing",
    ],
    levels: [
      {
        type: "story",
        title: "When machines learned to imagine",
        emoji: "💡",
        text: "For decades, computers could only calculate numbers. But with deep neural networks trained on vast amounts of data, AI learned to predict patterns so accurately that it can now paint art, compose music, and write poems from scratch.",
      },
      {
        type: "quiz",
        question: "What does 'LLM' stand for in modern AI?",
        options: [
          "Logical Learning Machine",
          "Large Language Model",
          "Linear Linked Matrix",
          "Layered Logic Memory",
        ],
        correctIndex: 1,
        explanation:
          "Large Language Models (LLMs) are AI systems trained on massive amounts of text to understand and generate human-like language.",
      },
      {
        type: "story",
        title: "Tokens: the currency of thought",
        emoji: "🧩",
        text: "AI models don't read whole words like humans do. Instead, they break words down into tiny fragments called tokens. A model predicts what token should come next, one puzzle piece at a time.",
      },
      {
        type: "truefalse",
        question: "Generative AI truly feels emotions and understands concepts just like a human.",
        answer: false,
        explanation:
          "AI models are statistical pattern predictors — they simulate human understanding brilliantly, but do not possess consciousness or emotions.",
      },
      {
        type: "quiz",
        question: "What is the famous architecture behind ChatGPT and modern generative models?",
        options: ["Transformer", "Steam engine", "Transistor", "Relational Database"],
        correctIndex: 0,
        explanation:
          "The Transformer architecture, introduced by researchers in 2017, powers almost all modern frontier language and vision models.",
      },
      {
        type: "quiz",
        question: "Which field of AI teaches computers to see and understand images and video?",
        options: ["Audio Engineering", "Computer Vision", "Quantum Mechanics", "Blockchain"],
        correctIndex: 1,
        explanation:
          "Computer Vision enables machines to identify objects, recognise faces, and navigate self-driving cars.",
      },
    ],
  },
  "seven wonders of the world": {
    topic: "Seven Wonders of the World",
    title: "Monuments of Human Genius",
    description: "The most awe-inspiring architectural marvels on planet Earth.",
    emoji: "🏛️",
    generatedBy: "sample",
    relatedTopics: [
      "Taj Mahal",
      "Ancient Egypt",
      "World's Tallest Buildings",
    ],
    levels: [
      {
        type: "story",
        title: "Stones that touched the clouds",
        emoji: "🗿",
        text: "Across human history, civilizations built breathtaking monuments that defied physics. The original Seven Wonders were celebrated by ancient Greek travelers, while modern voting in 2007 established the New Seven Wonders.",
      },
      {
        type: "quiz",
        question: "Which of the original Ancient Seven Wonders is the ONLY one still standing today?",
        options: [
          "Hanging Gardens of Babylon",
          "Great Pyramid of Giza",
          "Colossus of Rhodes",
          "Lighthouse of Alexandria",
        ],
        correctIndex: 1,
        explanation:
          "Built over 4,500 years ago, the Great Pyramid of Giza in Egypt is the only ancient wonder that still stands.",
      },
      {
        type: "story",
        title: "The marble monument of love",
        emoji: "🕌",
        text: "Among the New Seven Wonders of the World is the Taj Mahal in Agra, India. Built with pure white Makrana marble that changes colour from blush pink at dawn to shimmering gold at midnight, it is regarded as a pinnacle of symmetry.",
      },
      {
        type: "truefalse",
        question: "The Great Wall of China is visible from the Moon with the naked human eye.",
        answer: false,
        explanation:
          "This is a common myth! Astronauts have confirmed it is not visible from the Moon without high-powered optics.",
      },
      {
        type: "quiz",
        question: "In which country is the ancient mountain citadel of Machu Picchu located?",
        options: ["Peru", "Mexico", "Chile", "Brazil"],
        correctIndex: 0,
        explanation:
          "Machu Picchu was built high in the Andes mountains of Peru by the Inca civilization in the 15th century.",
      },
      {
        type: "quiz",
        question: "The ancient city of Petra, carved directly into rose-red desert rock cliffs, is in which country?",
        options: ["Egypt", "Jordan", "Greece", "Turkey"],
        correctIndex: 1,
        explanation:
          "Petra, the rose-red stone city, is a world-famous archaeological treasure located in southern Jordan.",
      },
    ],
  },
  "india's digital revolution (upi)": {
    topic: "India's Digital Revolution (UPI)",
    title: "The Tap of a QR Code",
    description: "How India built the world's most successful instant payment network.",
    emoji: "📲",
    generatedBy: "sample",
    relatedTopics: [
      "Invention of the Internet",
      "Microchips & Semiconductors",
      "Cybersecurity Secrets",
    ],
    levels: [
      {
        type: "story",
        title: "From paper cash to lightning taps",
        emoji: "⚡",
        text: "Just a decade ago, almost every transaction in India required paper notes and coins. Today, street vendors selling chai, large supermarkets, and millions of citizens send money in milliseconds using a simple QR code.",
      },
      {
        type: "quiz",
        question: "What does 'UPI' stand for?",
        options: [
          "Universal Payment Identifier",
          "Unified Payments Interface",
          "United Public Infrastructure",
          "Ultra-fast Private Invoice",
        ],
        correctIndex: 1,
        explanation:
          "UPI stands for Unified Payments Interface, launched in 2016 by the National Payments Corporation of India (NPCI).",
      },
      {
        type: "story",
        title: "The magic of interoperability",
        emoji: "🌐",
        text: "Unlike walled gardens where you can only send money inside the same app, UPI is open and interoperable. A user on Google Pay or PhonePe can instantly transfer funds to someone using Paytm or any bank app.",
      },
      {
        type: "truefalse",
        question: "UPI transactions can only be completed during regular banking hours.",
        answer: false,
        explanation:
          "UPI operates 24 hours a day, 7 days a week, 365 days a year in real time.",
      },
      {
        type: "quiz",
        question: "Roughly what percentage of global real-time digital payments take place in India?",
        options: ["Around 5%", "Around 15%", "Over 40%", "Over 90%"],
        correctIndex: 2,
        explanation:
          "India accounts for over 45% of all real-time digital payment transactions worldwide!",
      },
      {
        type: "quiz",
        question: "What public infrastructure backbone powers digital identity and payments in India?",
        options: ["India Stack", "Crypto Network", "Swift Gateway", "EuroClear"],
        correctIndex: 0,
        explanation:
          "India Stack is the foundational open digital public infrastructure combining Aadhaar, UPI, DigiLocker, and Account Aggregator.",
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

  // Some models return the index as a string; coerce both shapes.
  let idx = l?.correctIndex != null ? Math.round(Number(l.correctIndex)) : -1;
  if (!Number.isFinite(idx)) idx = -1;
  if (idx < 0 || idx >= options.length) {
    // Some models return the answer as text instead of an index — try to match it.
    const answerText = str(l?.answer).toLowerCase();
    idx = options.findIndex((o) => o.toLowerCase() === answerText);
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

const asBool = (v: unknown): boolean => v === true || v === "true" || v === "True";

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
    relatedTopics?: unknown;
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
        answer: asBool(l?.answer),
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

  const rawRelated = Array.isArray(r.relatedTopics) ? (r.relatedTopics as unknown[]) : [];
  let relatedTopics = rawRelated
    .map((t) => str(t))
    .filter((t) => t.length > 0 && t.toLowerCase() !== topic.toLowerCase())
    .slice(0, 3);
  if (relatedTopics.length < 2) {
    const defaults = [
      "Generative AI",
      "Seven Wonders of the World",
      "India's Digital Revolution (UPI)",
      "Solar System",
      "Quantum Computing",
    ];
    relatedTopics = defaults
      .filter((t) => t.toLowerCase() !== topic.toLowerCase())
      .slice(0, 3);
  }

  return {
    topic,
    title: str(r.title, topic),
    description: str(r.description),
    emoji: str(r.emoji, "✨"),
    levels,
    generatedBy: "gemini",
    relatedTopics,
  };
}
