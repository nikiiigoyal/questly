"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, CloudUpload, Flame, Search, Sparkles, Swords, Volume2, VolumeX, Zap } from "lucide-react";
import ChunkyButton from "@/components/ChunkyButton";
import AuthModal from "@/components/AuthModal";
import ChallengeModal from "@/components/ChallengeModal";
import IntroSplashScreen from "@/components/IntroSplashScreen";
import NamasteGreeting from "@/components/NamasteGreeting";
import SubjectAvatar from "@/components/SubjectAvatar";
import UserAvatar from "@/components/UserAvatar";
import { useAuthUser } from "@/lib/authUser";
import { CURRICULUM } from "@/lib/curriculum";
import { loadProgress, type Progress } from "@/lib/progress";
import { isMuted, playSound, primeSounds, setMuted } from "@/lib/sounds";

const CATEGORIES = CURRICULUM.map((c) => ({
  id: c.id,
  name: c.name,
  emoji: c.emoji,
  topics: c.units.reduce((n, u) => n + u.topics.length, 0),
}));

const TRENDING = [
  "Generative AI",
  "Chandrayaan-3",
  "India's Digital Revolution (UPI)",
  "Seven Wonders of the World",
  "Humanoid Robots",
  "Quantum Computing",
  "Volcanoes",
  "Solar System",
  "Mughal Empire",
];

export default function Home() {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [progress, setProgress] = useState<Progress | null>(null);
  const [muted, setMutedState] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isChallengeOpen, setIsChallengeOpen] = useState(false);
  const { email: authEmail } = useAuthUser();
  // Appears immediately in the beginning on page visit
  const [isIntroOpen, setIsIntroOpen] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem("questly_intro_dismissed") !== "true";
  });

  useEffect(() => {
    void primeSounds();
    // Deferred so the first client render matches the server (no hydration
    // mismatch when localStorage already has progress).
    const id = window.setTimeout(() => {
      setProgress(loadProgress());
      setMutedState(isMuted());
    }, 0);

    // If user has completed at least 1 quest, gently suggest syncing streak
    const hasPrompted = sessionStorage.getItem("questly_prompted_sync");
    if (!hasPrompted && loadProgress().questsDone.length >= 1) {
      sessionStorage.setItem("questly_prompted_sync", "1");
      const timer = setTimeout(() => setIsAuthOpen(true), 1500);
      return () => {
        window.clearTimeout(id);
        clearTimeout(timer);
      };
    }
    return () => window.clearTimeout(id);
  }, []);

  const handleCloseIntro = () => {
    sessionStorage.setItem("questly_intro_dismissed", "true");
    setIsIntroOpen(false);
  };

  const start = (t: string) => {
    playSound("tap");
    let clean = t.trim();
    // Empty search should never be a dead click — pick a surprise topic.
    if (!clean) clean = TRENDING[Math.floor(Math.random() * TRENDING.length)];
    router.push(`/quest?topic=${encodeURIComponent(clean)}`);
  };

  const toggleSound = () => {
    const next = !muted;
    setMuted(next);
    setMutedState(next);
    if (!next) playSound("tap");
  };

  return (
    <main className="mx-auto min-h-dvh w-full max-w-2xl px-5 pb-16">
      <header className="flex items-center justify-between py-5">
        <div className="flex items-center gap-1.5 text-2xl font-bold">
          <span className="text-3xl">🦚</span>
          <span className="text-brand">quest</span>ly
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              playSound("tap");
              setIsIntroOpen(true);
            }}
            className="flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-xs font-bold text-muted transition-all hover:border-brand hover:text-brand"
            title="Watch 3D Intro Splash Animation"
          >
            <Sparkles size={14} className="text-sun-dark" />
            <span className="hidden sm:inline">3D Intro</span>
          </button>
          <button
            onClick={() => {
              playSound("tap");
              setIsChallengeOpen(true);
            }}
            className="flex items-center gap-1.5 rounded-full border border-fox/40 bg-fox-soft px-3 py-1.5 text-xs font-bold text-fox transition-all hover:bg-fox hover:text-white"
            title="Challenge your friends to a 5-minute quest duel"
          >
            <Swords size={15} />
            <span className="hidden sm:inline">Challenge</span>
          </button>
          {authEmail ? (
            <button
              onClick={() => {
                playSound("tap");
                router.push("/profile");
              }}
              className="flex items-center gap-1.5 rounded-full border border-line bg-white p-1 pr-3 transition-all hover:border-brand"
              title="Your explorer profile"
            >
              <UserAvatar email={authEmail} className="h-7 w-7 text-[11px]" />
              <span className="hidden max-w-24 truncate text-xs font-bold text-muted sm:inline">
                {authEmail.split("@")[0]}
              </span>
            </button>
          ) : (
            <button
              onClick={() => {
                playSound("tap");
                setIsAuthOpen(true);
              }}
              className="flex items-center gap-1.5 rounded-full border border-line bg-white px-3.5 py-1.5 text-xs font-bold text-muted transition-all hover:border-brand hover:text-brand"
              title="Save streak & cloud records with Supabase"
            >
              <CloudUpload size={15} className="text-brand" />
              <span className="hidden sm:inline">Save Streak</span>
            </button>
          )}
          <button
            onClick={toggleSound}
            aria-label="Toggle sound"
            className="rounded-full p-2 text-faint transition-colors hover:bg-line"
          >
            {muted ? <VolumeX size={22} /> : <Volume2 size={22} />}
          </button>
        </div>
      </header>

      {/* Animated Namaste Greeting & Mascot Hero */}
      <NamasteGreeting />

      {/* Interactive Streak and XP Pills */}
      <div className="mt-4 flex items-center justify-center gap-3">
        {authEmail ? (
          <span
            className="flex items-center gap-1.5 rounded-full bg-fox-soft px-4 py-2 font-bold text-fox"
            title="Streak saved to your account"
          >
            <Flame size={18} className="fill-fox text-fox" />
            {progress?.streak ?? 0} day{progress?.streak === 1 ? "" : "s"}
          </span>
        ) : (
          <button
            onClick={() => {
              playSound("tap");
              setIsAuthOpen(true);
            }}
            className="group flex items-center gap-1.5 rounded-full bg-fox-soft px-4 py-2 font-bold text-fox transition-transform hover:scale-105 active:scale-95"
            title="Click to save streak to Supabase"
          >
            <Flame size={18} className="fill-fox text-fox transition-transform group-hover:scale-110" />
            {progress?.streak ?? 0} day{progress?.streak === 1 ? "" : "s"}
            <span className="text-xs font-normal opacity-70">· Save</span>
          </button>
        )}
        <span className="flex items-center gap-1.5 rounded-full bg-sun-soft px-4 py-2 font-bold text-sun-dark">
          <Zap size={18} className="fill-sun text-sun" />
          {progress?.xp ?? 0} XP
        </span>
      </div>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-8"
      >
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-faint" />
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && start(topic)}
              placeholder="Learn about anything… e.g. Generative AI"
              className="w-full rounded-2xl border-2 border-line bg-white py-4 pl-12 pr-4 text-lg outline-none transition-colors placeholder:text-faint focus:border-brand"
            />
          </div>
          <ChunkyButton onClick={() => start(topic)} aria-label="Generate quest" className="shrink-0">
            <ArrowRight size={22} />
          </ChunkyButton>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1 text-sm font-semibold text-faint">
            <Sparkles size={15} /> Trending:
          </span>
          {TRENDING.map((t) => (
            <button
              key={t}
              onClick={() => start(t)}
              className="rounded-full border-2 border-line bg-white px-3.5 py-1.5 text-xs font-semibold text-muted transition-all hover:border-brand hover:text-foreground active:scale-95 sm:text-sm"
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
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-bold">Pick a world to explore</h2>
          <span className="text-xs font-bold uppercase tracking-wider text-muted">
            {CATEGORIES.length} Worlds
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {CATEGORIES.map((c, i) => (
            <button
              key={c.id}
              onClick={() => {
                playSound("tap");
                router.push(`/category/${c.id}`);
              }}
              className="group rounded-2xl border-2 border-b-4 border-line bg-white p-4 text-left transition-all hover:border-faint hover:shadow-sm active:translate-y-[2px] active:border-b-2"
            >
              <SubjectAvatar id={c.id} emoji={c.emoji} index={i} />
              <div className="mt-2 font-bold">{c.name}</div>
              <div className="text-sm text-faint">{c.topics} topics</div>
            </button>
          ))}
        </div>
      </motion.section>

      {/* Gentle Cloud Sync / Streak Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSyncSuccess={(synced) => setProgress(synced)}
      />

      {/* 3D Intro Splash Screen — persists dismissal so it won't re-open in the same session */}
      <IntroSplashScreen
        isOpen={isIntroOpen}
        onClose={handleCloseIntro}
      />

      {/* Challenge Friends Modal */}
      <ChallengeModal
        isOpen={isChallengeOpen}
        onClose={() => setIsChallengeOpen(false)}
      />

      <footer className="mt-12 border-t border-line pt-6 pb-8 text-center text-xs text-faint">
       
        <div className="mt-2 flex items-center justify-center gap-3">
          <a
            href="https://github.com/nikiiigoyal/questly"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1 text-xs font-bold text-muted transition-colors hover:border-foreground hover:text-foreground"
          >
            {/* GitHub icon */}
            <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.605-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            GitHub
          </a>
          <a
            href="https://nikita-goyal.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1 text-xs font-bold text-muted transition-colors hover:border-brand hover:text-brand"
          >
            {/* Globe icon */}
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            Portfolio
          </a>
        </div>
      </footer>
    </main>
  );
}
