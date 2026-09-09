/**
 * The curriculum: categories → units → topics. Topics are plain strings —
 * each one is fed straight into the AI quest generator, so growing the
 * syllabus is just adding lines here.
 */

export type Unit = {
  name: string;
  emoji: string;
  topics: string[];
};

export type Category = {
  id: string;
  name: string;
  emoji: string;
  blurb: string;
  units: Unit[];
};

export const CURRICULUM: Category[] = [
  {
    id: "history",
    name: "History",
    emoji: "🏛️",
    blurb: "From ancient kingdoms to the freedom struggle — and the wider world.",
    units: [
      {
        name: "Ancient India",
        emoji: "🏺",
        topics: [
          "Indus Valley Civilisation",
          "The Vedic Age",
          "Buddhism and Jainism",
          "The Mauryan Empire",
          "Ashoka the Great",
          "The Gupta Empire",
          "The Chola Kingdoms",
        ],
      },
      {
        name: "Medieval India",
        emoji: "🕌",
        topics: [
          "The Delhi Sultanate",
          "The Mughal Empire",
          "Rajput Kingdoms",
          "Vijayanagara Empire",
          "The Marathas and Shivaji",
          "Bhakti and Sufi Movements",
        ],
      },
      {
        name: "Modern India",
        emoji: "🇮🇳",
        topics: [
          "The East India Company",
          "Revolt of 1857",
          "Rise of the Indian National Congress",
          "Gandhi and the Freedom Struggle",
          "Independence and Partition",
          "The Constitution of India",
        ],
      },
      {
        name: "World History",
        emoji: "🌍",
        topics: [
          "Ancient Egypt",
          "Greek and Roman Civilisations",
          "The French Revolution",
          "World War I",
          "World War II",
          "The Cold War",
        ],
      },
    ],
  },
  {
    id: "geography",
    name: "Geography",
    emoji: "🗺️",
    blurb: "Mountains, monsoons, states and the whole planet.",
    units: [
      {
        name: "Physical India",
        emoji: "🗻",
        topics: [
          "The Himalayas",
          "Rivers of India",
          "The Monsoon",
          "Deserts of India",
          "Coasts and Islands of India",
        ],
      },
      {
        name: "India Political",
        emoji: "🇮🇳",
        topics: [
          "States of India",
          "Union Territories of India",
          "Neighbouring Countries of India",
          "Major Cities of India",
        ],
      },
      {
        name: "World Geography",
        emoji: "🌐",
        topics: [
          "Continents and Oceans",
          "Volcanoes",
          "Earthquakes",
          "Latitude and Longitude",
          "Layers of the Atmosphere",
        ],
      },
    ],
  },
  {
    id: "culture",
    name: "Culture",
    emoji: "🪔",
    blurb: "Festivals, food, music and the everyday colour of India.",
    units: [
      {
        name: "Festivals & Celebrations",
        emoji: "🎉",
        topics: ["Diwali", "Holi", "Eid in India", "Onam", "Durga Puja", "Baisakhi"],
      },
      {
        name: "Arts & Performance",
        emoji: "💃",
        topics: [
          "Classical Dances of India",
          "Classical Music of India",
          "Indian Cinema",
          "Traditional Paintings of India",
        ],
      },
      {
        name: "Food & Daily Life",
        emoji: "🍛",
        topics: [
          "Indian Cuisine",
          "Clothing and Textiles of India",
          "Languages of India",
          "Indian Weddings and Traditions",
        ],
      },
    ],
  },
  {
    id: "space",
    name: "Space",
    emoji: "🚀",
    blurb: "The Sun's family and everything beyond it.",
    units: [
      {
        name: "Solar System",
        emoji: "🪐",
        topics: ["The Solar System", "The Sun", "Phases of the Moon", "Eclipses"],
      },
      {
        name: "Exploring Space",
        emoji: "🛰️",
        topics: ["ISRO and Indian Space Missions", "Satellites", "Space Telescopes", "Life as an Astronaut"],
      },
      {
        name: "Deep Space",
        emoji: "🌌",
        topics: ["Stars and Galaxies", "Black Holes", "Comets and Asteroids", "The Big Bang"],
      },
    ],
  },
  {
    id: "science",
    name: "Science",
    emoji: "🔬",
    blurb: "How your body, matter and the Earth actually work.",
    units: [
      {
        name: "Life Science",
        emoji: "🌱",
        topics: ["Photosynthesis", "The Human Digestive System", "The Heart and Blood", "Food Chains"],
      },
      {
        name: "Matter & Energy",
        emoji: "⚡",
        topics: ["States of Matter", "Light and Reflection", "Sound", "Electricity"],
      },
      {
        name: "Earth Science",
        emoji: "💧",
        topics: ["The Water Cycle", "The Rock Cycle", "Weather vs Climate"],
      },
    ],
  },
  {
    id: "sports",
    name: "Sports",
    emoji: "🏆",
    blurb: "Cricket crazy? Olympics proud? Start here.",
    units: [
      {
        name: "Cricket",
        emoji: "🏏",
        topics: ["Cricket World Cup", "The IPL", "Legends of Indian Cricket"],
      },
      {
        name: "Indian Sports",
        emoji: "🥇",
        topics: ["Indian Hockey", "Kabaddi", "Chess in India", "India at the Olympics"],
      },
      {
        name: "World Sports",
        emoji: "⚽",
        topics: ["The Olympic Games", "Football World Cup", "Tennis Grand Slams"],
      },
    ],
  },
  {
    id: "ai-tech",
    name: "AI & Tech",
    emoji: "🤖",
    blurb: "Artificial intelligence, futuristic tech, and the silicon brain revolution.",
    units: [
      {
        name: "Generative AI & LLMs",
        emoji: "✨",
        topics: [
          "Generative AI",
          "How ChatGPT & LLMs Work",
          "Prompt Engineering",
          "AI Ethics & Deepfakes",
        ],
      },
      {
        name: "Robotics & Autonomous Tech",
        emoji: "🦾",
        topics: [
          "Humanoid Robots",
          "Self-Driving Cars",
          "Drones & Flying Tech",
          "Computer Vision",
        ],
      },
      {
        name: "Frontiers of Computing",
        emoji: "⚡",
        topics: [
          "Quantum Computing",
          "Neural Networks",
          "Microchips & Semiconductors",
          "Cybersecurity Secrets",
        ],
      },
    ],
  },
  {
    id: "gk",
    name: "General Knowledge",
    emoji: "🧠",
    blurb: "Mind-bending facts, world records, wonders, and quirky curiosities.",
    units: [
      {
        name: "Wonders of the World",
        emoji: "🏛️",
        topics: [
          "Seven Wonders of the World",
          "Ancient Wonders of the World",
          "Mysterious Architectural Marvels",
          "World's Tallest Buildings",
        ],
      },
      {
        name: "Mind-Blowing Records",
        emoji: "📜",
        topics: [
          "Guinness World Records",
          "Deepest & Highest Places on Earth",
          "Oldest Living Things on Earth",
          "Fastest Machines on Earth",
        ],
      },
      {
        name: "Everyday Inventions",
        emoji: "💡",
        topics: [
          "Invention of the Internet",
          "History of the Wheel",
          "Accidental Scientific Discoveries",
          "Who Invented Electricity?",
        ],
      },
    ],
  },
  {
    id: "news",
    name: "Current News & World",
    emoji: "📰",
    blurb: "Today's hot headlines, space breakthroughs, climate tech, and global shifts.",
    units: [
      {
        name: "Global Innovations & Trends",
        emoji: "🚀",
        topics: [
          "India's Digital Revolution (UPI)",
          "Chandrayaan-3 and Lunar Missions",
          "Electric Vehicles & Clean Energy",
          "The Global Microchip Race",
        ],
      },
      {
        name: "Planet & Climate Action",
        emoji: "🌱",
        topics: [
          "Renewable Energy Breakthroughs",
          "Ocean Cleanup Innovations",
          "Extreme Weather & Climate Science",
          "Cities of the Future",
        ],
      },
      {
        name: "World Summits & Society",
        emoji: "🌐",
        topics: [
          "The United Nations & Global Summits",
          "Commercial Space Flights",
          "Future of Digital Payments",
          "Global Sports Milestones",
        ],
      },
    ],
  },
];

export function getCategory(id: string): Category | undefined {
  return CURRICULUM.find((c) => c.id === id);
}

export function allTopicsOf(category: Category): string[] {
  return category.units.flatMap((u) => u.topics);
}

/** The first topic in the category the player hasn't completed yet. */
export function nextUpTopic(category: Category, done: string[]): string {
  const doneSet = new Set(done.map((t) => t.toLowerCase()));
  return allTopicsOf(category).find((t) => !doneSet.has(t.toLowerCase())) ?? allTopicsOf(category)[0];
}

/** The topic that follows `topic` inside this category, or null at the end. */
export function topicAfter(category: Category, topic: string): string | null {
  const all = allTopicsOf(category);
  const i = all.findIndex((t) => t.toLowerCase() === topic.toLowerCase());
  return i >= 0 && i + 1 < all.length ? all[i + 1] : null;
}
