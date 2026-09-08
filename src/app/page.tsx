"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Flame, Search, Sparkles, Volume2, VolumeX, Zap } from "lucide-react";
import ChunkyButton from "@/components/ChunkyButton";
import { loadProgress, type Progress } from "@/lib/progress";
import { isMuted, setMuted } from "@/lib/sounds";

const CATEGORIES = [
  { name: "History", emoji: "🏛️", sample: "Mughal Empire" },
  { name: "Geography", emoji: "🗺️", sample: "Volcanoes" },
  { name: "Culture", emoji: "🪔", sample: "Festivals of India" },
  { name: "Space", emoji: "🚀", sample: "Solar System" },
  { name: "Science", emoji: "🔬", sample: "Photosynthesis" },
  { name: "Sports", emoji: "🏆", sample: "Cricket World Cup" },
];

const TRENDING = [
  "Volcanoes",
  "Mughal Empire",
  "Solar System",
  "Monsoon",
  "Taj Mahal",
  "Great Wall of China",
];

export default function Home() {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [progress, setProgress] = useState<Progress | null>(null);
  const [muted, setMutedState] = useState(false);

  useEffect(() => {
    setProgress(loadProgress());
    setMutedState(isMuted());
  }, []);

  const start = (t: string) => {
    const clean = t.trim();
    if (!clean) return;
    router.push(`/quest?topic=${encodeURIComponent(clean)}`);
  };

  const toggleSound = () => {
    const next = !muted;
    setMuted(next);
    setMutedState(next);
  };

  return (
    <main className="mx-auto min-h-dvh w-full max-w-2xl px-5 pb-16">
      <header className="flex items-center justify-between py-5">
        <div className="flex items-center gap-1.5 text-2xl font-bold">
          <span className="text-3xl">🦚</span>
          <span className="text-brand">quest</span>ly
        </div>
        <button
          onClick={toggleSound}
          aria-label="Toggle sound"
          className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100"
        >
          {muted ? <VolumeX size={22} /> : <Volume2 size={22} />}
        </button>
      </header>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-4 text-center"
      >
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-brand to-sky text-5xl shadow-lg shadow-brand/20">
          🦚
        </div>
        <h1 className="mt-4 text-3xl font-bold">Namaste, explorer!</h1>
        <p className="mx-auto mt-2 max-w-md text-lg text-gray-500">
          Search anything. Get an instant 5-minute quest. Keep your streak alive.
        </p>
        <div className="mt-4 flex items-center justify-center gap-3">
          <span className="flex items-center gap-1.5 rounded-full bg-orange-50 px-4 py-2 font-bold text-orange-500">
            <Flame size={18} className="fill-orange-400 text-orange-400" />
            {progress?.streak ?? 0} day{progress?.streak === 1 ? "" : "s"}
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-sun-soft px-4 py-2 font-bold text-sun-dark">
            <Zap size={18} className="fill-sun text-sun" />
            {progress?.xp ?? 0} XP
          </span>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-8"
      >
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && start(topic)}
              placeholder="Learn about anything… e.g. monsoons"
              className="w-full rounded-2xl border-2 border-gray-200 bg-white py-4 pl-12 pr-4 text-lg outline-none transition-colors placeholder:text-gray-300 focus:border-brand"
            />
          </div>
          <ChunkyButton onClick={() => start(topic)} aria-label="Generate quest" className="shrink-0">
            <ArrowRight size={22} />
          </ChunkyButton>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1 text-sm font-semibold text-gray-400">
            <Sparkles size={15} /> Trending:
          </span>
          {TRENDING.map((t) => (
            <button
              key={t}
              onClick={() => start(t)}
              className="rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-500 transition-colors hover:bg-gray-200 hover:text-foreground"
            >
              {t}
            </button>
          ))}
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mt-10"
      >
        <h2 className="mb-3 text-xl font-bold">Pick a world to explore</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {CATEGORIES.map((c) => (
            <button
              key={c.name}
              onClick={() => start(c.sample)}
              className="rounded-2xl border-2 border-b-4 border-gray-200 bg-white p-4 text-left transition-all hover:border-gray-300 active:translate-y-[2px] active:border-b-2"
            >
              <div className="text-4xl">{c.emoji}</div>
              <div className="mt-2 font-bold">{c.name}</div>
              <div className="text-sm text-gray-400">e.g. {c.sample}</div>
            </button>
          ))}
        </div>
      </motion.section>

      <footer className="mt-12 text-center text-xs text-gray-300">
        Built for the AI Builders Hackathon 2026 · working name “questly”
      </footer>
    </main>
  );
}
