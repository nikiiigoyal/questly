"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Check, ChevronRight, Play } from "lucide-react";
import ChunkyButton from "@/components/ChunkyButton";
import ProgressBar from "@/components/ProgressBar";
import SubjectAvatar from "@/components/SubjectAvatar";
import { getCategory, nextUpTopic } from "@/lib/curriculum";
import { loadProgress, type Progress } from "@/lib/progress";
import { playSound, primeSounds } from "@/lib/sounds";

// Duolingo-style section colors, cycled per unit.
const UNIT_STYLES = [
  "bg-brand text-white",
  "bg-sky text-white",
  "bg-beetle text-white",
  "bg-fox text-white",
  "bg-sun text-white",
  "bg-berry text-white",
];

export default function CategoryPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [progress, setProgress] = useState<Progress | null>(null);

  const category = getCategory(String(id));

  useEffect(() => {
    void primeSounds();
    // Deferred so the first client render matches the server (no hydration
    // mismatch when localStorage already has progress).
    const idTimer = window.setTimeout(() => {
      setProgress(loadProgress());
    }, 0);
    return () => window.clearTimeout(idTimer);
  }, [id]);

  const doneSet = useMemo(
    () => new Set((progress?.questsDone ?? []).map((t) => t.toLowerCase())),
    [progress]
  );

  if (!category) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center px-5 text-center">
        <div className="text-7xl">🧭</div>
        <h1 className="mt-4 text-2xl font-bold">That world doesn&apos;t exist (yet!)</h1>
        <ChunkyButton className="mt-6" onClick={() => router.push("/")}>
          Back home
        </ChunkyButton>
      </main>
    );
  }

  // Progress is loaded async from localStorage — show a skeleton while we wait.
  if (!progress) {
    return (
      <main className="mx-auto min-h-dvh w-full max-w-2xl px-5 pb-16">
        <header className="flex items-center gap-3 py-4">
          <div className="animate-pulse rounded-full bg-line h-10 w-10" aria-hidden />
          <div className="animate-pulse rounded-xl bg-line h-9 w-52" aria-hidden />
        </header>
        <div className="animate-pulse rounded-xl bg-line mx-auto h-5 w-3/4" aria-hidden />
        <div className="animate-pulse rounded-2xl bg-line mt-4 h-20 w-full" aria-hidden />
        <div className="animate-pulse rounded-3xl bg-line mt-5 h-24 w-full" aria-hidden />
        <div className="animate-pulse rounded-2xl bg-line mt-8 h-12 w-full" aria-hidden />
        <div className="mt-3 grid gap-2.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl bg-line h-[68px] w-full" aria-hidden />
          ))}
        </div>
      </main>
    );
  }


  const startTopic = (topic: string) => {
    playSound("tap");
    router.push(`/quest?topic=${encodeURIComponent(topic)}&cat=${category.id}`);
  };

  const total = category.units.reduce((n, u) => n + u.topics.length, 0);
  const doneCount = category.units
    .flatMap((u) => u.topics)
    .filter((t) => doneSet.has(t.toLowerCase())).length;
  const continueTopic = nextUpTopic(category, progress?.questsDone ?? []);

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
        <h1 className="flex items-center gap-2.5 text-2xl font-bold">
          <SubjectAvatar id={category.id} emoji={category.emoji} className="h-12 w-12 text-2xl" />
          {category.name}
        </h1>
      </header>

      <p className="text-center text-lg text-muted">{category.blurb}</p>

      <div className="mt-4 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm">
        <div className="flex-1">
          <div className="mb-1.5 flex justify-between text-sm font-bold">
            <span className="text-muted">Your progress</span>
            <span className="text-brand-dark">
              {doneCount}/{total} topics
            </span>
          </div>
          <ProgressBar value={total ? (doneCount / total) * 100 : 0} />
        </div>
      </div>

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => startTopic(continueTopic)}
        className="mt-5 flex w-full items-center justify-between rounded-3xl bg-gradient-to-r from-brand to-brand-dark p-5 text-left text-white shadow-lg shadow-brand/25 transition-transform active:scale-[0.99]"
      >
        <div>
          <div className="text-sm font-bold uppercase tracking-wider opacity-80">
            {doneCount === 0 ? "Start learning" : "Continue"}
          </div>
          <div className="mt-0.5 flex items-center gap-2 text-xl font-bold">
            <Play size={20} className="fill-white" /> {continueTopic}
          </div>
        </div>
        <ChevronRight size={28} />
      </motion.button>

      {category.units.map((unit, ui) => {
        const unitDone = unit.topics.filter((t) => doneSet.has(t.toLowerCase())).length;
        return (
          <section key={unit.name} className="mt-8">
            <div
              className={`flex items-center justify-between rounded-2xl px-5 py-3.5 ${UNIT_STYLES[ui % UNIT_STYLES.length]}`}
            >
              <div className="flex items-center gap-2 text-lg font-bold">
                <span className="text-xl">{unit.emoji}</span> {unit.name}
              </div>
              <div className="rounded-full bg-black/15 px-3 py-1 text-sm font-bold">
                {unitDone}/{unit.topics.length}
              </div>
            </div>

            <div className="mt-3 grid gap-2.5">
              {unit.topics.map((topic, ti) => {
                const done = doneSet.has(topic.toLowerCase());
                return (
                  <button
                    key={topic}
                    onClick={() => startTopic(topic)}
                    className="flex items-center gap-4 rounded-2xl border-2 border-b-4 border-line bg-white p-4 text-left transition-all hover:border-faint active:translate-y-[2px] active:border-b-2"
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                        done ? "bg-brand text-white" : "bg-line text-muted"
                      }`}
                    >
                      {done ? <Check size={18} /> : ti + 1}
                    </span>
                    <span className="flex-1 font-bold">{topic}</span>
                    <span
                      className={`text-xs font-bold uppercase tracking-wider ${
                        done ? "text-brand" : "text-faint"
                      }`}
                    >
                      {done ? "Replay" : "Start"}
                    </span>
                    <ChevronRight size={18} className="text-faint" />
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}
    </main>
  );
}
