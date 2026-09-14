"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CloudUpload,
  Compass,
  Flame,
  LogOut,
  Sparkles,
  Zap,
} from "lucide-react";
import ChunkyButton from "@/components/ChunkyButton";
import ProgressBar from "@/components/ProgressBar";
import AuthModal from "@/components/AuthModal";
import SubjectAvatar from "@/components/SubjectAvatar";
import UserAvatar from "@/components/UserAvatar";
import { CURRICULUM, allTopicsOf } from "@/lib/curriculum";
import { loadProgress, type Progress } from "@/lib/progress";
import { playSound, primeSounds } from "@/lib/sounds";
import { useAuthUser } from "@/lib/authUser";

export default function ProfilePage() {
  const router = useRouter();
  const { email, signOut } = useAuthUser();
  const [progress, setProgress] = useState<Progress | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    void primeSounds();
    // Deferred so the first client render matches the server.
    const id = window.setTimeout(() => setProgress(loadProgress()), 0);
    return () => window.clearTimeout(id);
  }, []);

  const stats = useMemo(() => {
    const done = new Set((progress?.questsDone ?? []).map((t) => t.toLowerCase()));
    const curriculumTopics = CURRICULUM.map((c) => ({
      category: c,
      total: allTopicsOf(c).length,
      doneTopics: allTopicsOf(c).filter((t) => done.has(t.toLowerCase())),
    }));
    const inCurriculum = new Set(
      CURRICULUM.flatMap(allTopicsOf).map((t) => t.toLowerCase())
    );
    const wildcards = (progress?.questsDone ?? []).filter(
      (t) => !inCurriculum.has(t.toLowerCase())
    );
    return { curriculumTopics, wildcards };
  }, [progress]);

  const questsDone = progress?.questsDone.length ?? 0;
  const worldsExplored = stats.curriculumTopics.filter((s) => s.doneTopics.length > 0).length;

  return (
    <main className="mx-auto min-h-dvh w-full max-w-2xl px-5 pb-16">
      <header className="flex items-center gap-3 py-4">
        <button
          onClick={() => router.push("/")}
          aria-label="Back home"
          className="rounded-full p-2 text-faint transition-colors hover:bg-line"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-2xl font-bold">Your Explorer Profile</h1>
      </header>

      {/* Identity card */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border-2 border-line bg-white p-6 shadow-sm"
      >
        <div className="flex items-center gap-4">
          {email ? (
            <UserAvatar email={email} className="h-16 w-16 text-xl" />
          ) : (
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-soft text-3xl">
              🦚
            </span>
          )}
          <div className="min-w-0 flex-1">
            <div className="truncate text-xl font-extrabold">
              {email ? email.split("@")[0] : "Guest Explorer"}
            </div>
            <div className="truncate text-sm text-muted">
              {email ?? "Playing as guest — your progress lives on this device"}
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="flex items-center gap-1.5 rounded-full bg-sun-soft px-3.5 py-1.5 text-sm font-bold text-sun-dark">
            <Zap size={15} className="fill-sun text-sun" />
            {progress?.xp ?? 0} XP
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-fox-soft px-3.5 py-1.5 text-sm font-bold text-fox">
            <Flame size={15} className="fill-fox text-fox" />
            {progress?.streak ?? 0} day{(progress?.streak ?? 0) === 1 ? "" : "s"}
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-sky-soft px-3.5 py-1.5 text-sm font-bold text-sky-dark">
            🎯 {questsDone} quest{questsDone === 1 ? "" : "s"} done
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-beetle-soft px-3.5 py-1.5 text-sm font-bold text-beetle-dark">
            <Compass size={15} />
            {worldsExplored}/{CURRICULUM.length} worlds
          </span>
        </div>

        <div className="mt-4">
          {email ? (
            <button
              onClick={() => {
                playSound("tap");
                void signOut();
              }}
              className="flex items-center gap-1.5 rounded-xl border-2 border-line px-4 py-2 text-xs font-bold text-muted transition-all hover:border-berry hover:text-berry"
            >
              <LogOut size={14} />
              Sign out
            </button>
          ) : (
            <ChunkyButton onClick={() => setIsAuthOpen(true)} className="w-full">
              <span className="flex items-center justify-center gap-2">
                <CloudUpload size={16} />
                Save my streak & see this everywhere
              </span>
            </ChunkyButton>
          )}
        </div>
      </motion.section>

      {/* Subjects explored */}
      <section className="mt-8">
        <h2 className="mb-3 text-xl font-bold">Subjects you&apos;re exploring</h2>
        <div className="grid gap-2.5">
          {stats.curriculumTopics.map(({ category, total, doneTopics }, i) => (
            <button
              key={category.id}
              onClick={() => {
                playSound("tap");
                router.push(`/category/${category.id}`);
              }}
              className="flex items-start gap-4 rounded-2xl border-2 border-b-4 border-line bg-white p-4 text-left transition-all hover:border-faint active:translate-y-[2px] active:border-b-2"
            >
              <SubjectAvatar
                id={category.id}
                emoji={category.emoji}
                index={i}
                className="mt-0.5 h-12 w-12 text-2xl"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold">{category.name}</span>
                  <span
                    className={`text-xs font-bold ${
                      doneTopics.length ? "text-brand-dark" : "text-faint"
                    }`}
                  >
                    {doneTopics.length}/{total} topics
                  </span>
                </div>
                <div className="mt-2">
                  <ProgressBar value={total ? (doneTopics.length / total) * 100 : 0} />
                </div>
                {doneTopics.length > 0 ? (
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {doneTopics.map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-brand-soft px-2.5 py-0.5 text-[11px] font-bold text-brand-dark"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="mt-2 text-xs font-semibold text-faint">
                    Not started yet — tap to open this world
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Wildcard topics searched outside the curriculum */}
      {stats.wildcards.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-1 flex items-center gap-1.5 text-xl font-bold">
            <Sparkles size={18} className="text-brand" />
            Wildcard quests you searched
          </h2>
          <p className="mb-3 text-sm text-muted">
            Topics the AI turned into quests just for you.
          </p>
          <div className="flex flex-wrap gap-1.5">
            {stats.wildcards.map((t) => (
              <button
                key={t}
                onClick={() => router.push(`/quest?topic=${encodeURIComponent(t)}`)}
                className="rounded-full border-2 border-line bg-white px-3 py-1 text-xs font-bold text-muted transition-all hover:border-brand hover:text-brand"
              >
                {t}
              </button>
            ))}
          </div>
        </section>
      )}

      {questsDone === 0 && (
        <section className="mt-8 rounded-3xl border-2 border-dashed border-line p-8 text-center">
          <div className="text-5xl">🧭</div>
          <p className="mt-3 font-bold">No quests yet!</p>
          <p className="mt-1 text-sm text-muted">
            Finish any 5-minute quest and it will show up here.
          </p>
          <ChunkyButton onClick={() => router.push("/")} className="mt-4">
            Explore worlds
          </ChunkyButton>
        </section>
      )}

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </main>
  );
}
