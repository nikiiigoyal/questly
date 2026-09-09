"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import { ArrowLeft, ArrowRight, Check, Sparkles, Volume2, VolumeX, Zap } from "lucide-react";
import ChunkyButton from "@/components/ChunkyButton";
import ProgressBar from "@/components/ProgressBar";
import AuthModal from "@/components/AuthModal";
import { getCategory, topicAfter } from "@/lib/curriculum";
import { levelXp, SAMPLE_TOPICS, type Quest, type QuestLevel } from "@/lib/quests";
import { isMuted, playSound, primeSounds, setMuted } from "@/lib/sounds";
import {
  vibrateCelebration,
  vibrateError,
  vibrateSuccess,
  vibrateTap,
} from "@/lib/haptics";
import { recordQuestComplete } from "@/lib/progress";

type Status = "loading" | "error" | "playing" | "done";

type Results = {
  xp: number;
  accuracy: number;
  streak: number;
  topic: string;
  title: string;
  nextTopic: string | null;
  catId: string | null;
  relatedTopics: string[];
};

const LOADING_TIPS = [
  "Picking the juiciest facts…",
  "Hiding one sneaky wrong answer…",
  "Sprinkling story dust…",
  "Drawing a tiny map in our heads…",
  "Warming up the mascot…",
];

export default function QuestPage() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("loading");
  const [quest, setQuest] = useState<Quest | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [tipIndex, setTipIndex] = useState(0);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [tfChoice, setTfChoice] = useState<boolean | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [sessionXp, setSessionXp] = useState(0);
  const [floatXp, setFloatXp] = useState<{ amount: number; key: number } | null>(null);
  const [muted, setMutedState] = useState<boolean>(() =>
    typeof window !== "undefined" ? isMuted() : false
  );
  const [results, setResults] = useState<Results | null>(null);
  const [catId, setCatId] = useState<string | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const load = useCallback(async () => {
    setStatus("loading");
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("cat");
    setCatId(cat && getCategory(cat) ? cat : null);
    const topic =
      params.get("topic")?.trim() ||
      SAMPLE_TOPICS[Math.floor(Math.random() * SAMPLE_TOPICS.length)];
    try {
      const res = await fetch("/api/quest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Could not build that quest");
      setQuest(data);
      setNote(data?.note ?? null);
      setIndex(0);
      setSelected(null);
      setTfChoice(null);
      setMistakes(0);
      setSessionXp(0);
      setResults(null);
      setStatus("playing");
    } catch {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    void primeSounds();
    const timer = setTimeout(() => {
      void load();
    }, 0);
    return () => clearTimeout(timer);
  }, [load]);

  useEffect(() => {
    const id = setInterval(
      () => setTipIndex((i) => (i + 1) % LOADING_TIPS.length),
      1600
    );
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!floatXp) return;
    const id = setTimeout(() => setFloatXp(null), 1100);
    return () => clearTimeout(id);
  }, [floatXp]);

  if (status === "loading") return <LoadingScreen tipIndex={tipIndex} />;
  if (status === "error") return <ErrorScreen onRetry={() => void load()} />;
  if (status === "done" && results)
    return (
      <>
        <DoneScreen
          results={results}
          onOpenAuth={() => setIsAuthOpen(true)}
        />
        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
        />
      </>
    );

  if (!quest) return null;

  const level: QuestLevel = quest.levels[index];
  const answered =
    level.type === "quiz" ? selected !== null : level.type === "truefalse" ? tfChoice !== null : true;
  const wasCorrect =
    level.type === "quiz"
      ? selected === level.correctIndex
      : level.type === "truefalse"
        ? tfChoice === level.answer
        : true;

  const celebrate = () => {
    confetti({ particleCount: 45, spread: 60, startVelocity: 25, origin: { y: 0.65 } });
  };

  const bigCelebration = () => {
    confetti({ particleCount: 130, spread: 75, origin: { y: 0.6 } });
    setTimeout(
      () => confetti({ particleCount: 70, angle: 60, spread: 60, origin: { x: 0, y: 0.7 } }),
      250
    );
    setTimeout(
      () => confetti({ particleCount: 70, angle: 120, spread: 60, origin: { x: 1, y: 0.7 } }),
      450
    );
  };

  const answerQuiz = (i: number) => {
    if (level.type !== "quiz" || selected !== null) return;
    setSelected(i);
    if (i === level.correctIndex) {
      playSound("correct");
      vibrateSuccess();
      celebrate();
    } else {
      playSound("wrong");
      vibrateError();
      setMistakes((m) => m + 1);
    }
  };

  const answerTf = (choice: boolean) => {
    if (level.type !== "truefalse" || tfChoice !== null) return;
    setTfChoice(choice);
    if (choice === level.answer) {
      playSound("correct");
      vibrateSuccess();
      celebrate();
    } else {
      playSound("wrong");
      vibrateError();
      setMistakes((m) => m + 1);
    }
  };

  const nextLevel = () => {
    playSound("tap");
    vibrateTap();
    const gained = levelXp(level);
    const xp = sessionXp + gained;
    setSessionXp(xp);
    setFloatXp({ amount: gained, key: Date.now() });
    setSelected(null);
    setTfChoice(null);

    if (index + 1 >= quest.levels.length) {
      const interactive = quest.levels.filter((l) => l.type !== "story").length;
      const accuracy =
        interactive === 0
          ? 100
          : Math.round(((interactive - mistakes) / interactive) * 100);
      const updated = recordQuestComplete(xp, quest.topic);
      const category = catId ? getCategory(catId) : undefined;
      setResults({
        xp,
        accuracy,
        streak: updated.streak,
        topic: quest.topic,
        title: quest.title,
        nextTopic: category ? topicAfter(category, quest.topic) : null,
        catId,
        relatedTopics: quest.relatedTopics ?? [],
      });
      setStatus("done");
      playSound("complete");
      vibrateCelebration();
      bigCelebration();
    } else {
      setIndex(index + 1);
    }
  };

  const toggleSound = () => {
    const next = !muted;
    setMuted(next);
    setMutedState(next);
    if (!next) playSound("tap");
  };

  return (
    <main className="mx-auto min-h-dvh w-full max-w-2xl px-5 pb-44">
      <header className="flex items-center gap-3 py-4">
        <button
          onClick={() => router.push(catId ? `/category/${catId}` : "/")}
          aria-label="Back"
          className="rounded-full p-2 text-faint transition-colors hover:bg-line"
        >
          <ArrowLeft size={22} />
        </button>
        <div className="relative flex-1">
          <ProgressBar value={(index / quest.levels.length) * 100} />
        </div>
        <div className="relative flex items-center gap-1 font-bold text-sun-dark">
          <Zap size={18} className="fill-sun text-sun" />
          {sessionXp}
          <AnimatePresence>
            {floatXp && (
              <motion.span
                key={floatXp.key}
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 0, y: -34 }}
                transition={{ duration: 1 }}
                className="absolute -top-2 right-0 text-sm font-bold text-brand"
              >
                +{floatXp.amount}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <button
          onClick={toggleSound}
          aria-label="Toggle sound"
          className="rounded-full p-2 text-faint transition-colors hover:bg-line"
        >
          {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      </header>

      {note && (
        <div className="mb-4 flex flex-wrap items-center justify-center gap-3 rounded-2xl bg-beetle-soft px-4 py-2.5 text-center text-sm font-semibold text-beetle-dark">
          <span>{note}</span>
          {quest?.generatedBy === "sample" && (
            <button
              onClick={() => void load()}
              className="rounded-full bg-beetle px-3 py-1 text-xs font-bold uppercase tracking-wider text-white"
            >
              Try AI again
            </button>
          )}
        </div>
      )}

      <div className="mb-6 flex items-center justify-center gap-3">
        {quest.levels.map((_, i) => (
          <div
            key={i}
            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
              i < index
                ? "bg-brand text-white"
                : i === index
                  ? "animate-pop bg-white text-brand ring-4 ring-brand"
                  : "bg-line text-faint"
            }`}
          >
            {i < index ? <Check size={16} /> : i + 1}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.25 }}
        >
          {level.type === "story" ? (
            <div className="rounded-3xl border-2 border-line bg-white p-8 text-center">
              <div className="text-6xl">{level.emoji}</div>
              <h2 className="mt-4 text-2xl font-bold">{level.title}</h2>
              <p className="mt-3 text-lg leading-relaxed text-muted">{level.text}</p>
              <ChunkyButton onClick={nextLevel} className="mt-6 w-full">
                Continue
              </ChunkyButton>
            </div>
          ) : (
            <div>
              <h2 className="mt-2 text-center text-2xl font-bold leading-snug">
                {level.question}
              </h2>
              {level.type === "quiz" ? (
                <div className="mt-6 grid gap-3">
                  {level.options.map((opt, i) => {
                    const isCorrect = selected !== null && i === level.correctIndex;
                    const isWrongPick = selected === i && i !== level.correctIndex;
                    return (
                      <button
                        key={i}
                        onClick={() => answerQuiz(i)}
                        disabled={selected !== null}
                        className={`rounded-2xl border-2 border-b-4 px-5 py-4 text-left text-lg font-semibold transition-all duration-100 ${
                          isCorrect
                            ? "animate-pop border-brand bg-brand-soft text-brand-dark"
                            : isWrongPick
                              ? "animate-shake border-berry bg-berry-soft text-berry-dark"
                              : selected !== null
                                ? "border-line bg-white opacity-60"
                                : "border-line bg-white hover:bg-page active:translate-y-[2px] active:border-b-2"
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="mt-8 grid grid-cols-2 gap-3">
                  {[true, false].map((v) => {
                    const isCorrect = tfChoice !== null && v === level.answer;
                    const isWrongPick = tfChoice === v && v !== level.answer;
                    return (
                      <button
                        key={String(v)}
                        onClick={() => answerTf(v)}
                        disabled={tfChoice !== null}
                        className={`rounded-2xl border-2 border-b-4 px-5 py-6 text-xl font-bold uppercase tracking-wider transition-all duration-100 ${
                          isCorrect
                            ? "animate-pop border-brand bg-brand-soft text-brand-dark"
                            : isWrongPick
                              ? "animate-shake border-berry bg-berry-soft text-berry-dark"
                              : tfChoice !== null
                                ? "border-line bg-white opacity-60"
                                : "border-line bg-white hover:bg-page active:translate-y-[2px] active:border-b-2"
                        }`}
                      >
                        {v ? "True" : "False"}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {level.type === "story" ? null : (
        <AnimatePresence>
          {answered && (
            <motion.div
              initial={{ y: 140 }}
              animate={{ y: 0 }}
              exit={{ y: 140 }}
              transition={{ type: "spring", damping: 26, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 z-10"
            >
              <div className="mx-auto max-w-2xl px-5 pb-6">
                <div
                  className={`rounded-3xl border-2 p-5 ${
                    wasCorrect ? "border-brand bg-brand-soft" : "border-berry bg-berry-soft"
                  }`}
                >
                  <div
                    className={`flex items-center gap-2 text-xl font-bold ${
                      wasCorrect ? "text-brand-dark" : "text-berry-dark"
                    }`}
                  >
                    <span className="text-2xl">{wasCorrect ? "🎉" : "💪"}</span>
                    {wasCorrect ? "Nice one!" : "Not quite!"}
                  </div>
                  {level.explanation && (
                    <p className="mt-1 text-foreground">{level.explanation}</p>
                  )}
                  <ChunkyButton
                    variant={wasCorrect ? "green" : "red"}
                    onClick={nextLevel}
                    className="mt-4 w-full"
                  >
                    Continue
                  </ChunkyButton>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </main>
  );
}

function LoadingScreen({ tipIndex }: { tipIndex: number }) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-5 text-center">
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
        className="text-7xl"
      >
        🦚
      </motion.div>
      <h2 className="mt-6 text-2xl font-bold">Mitra is crafting your quest…</h2>
      <p className="mt-2 h-6 text-muted">{LOADING_TIPS[tipIndex]}</p>
    </main>
  );
}

function ErrorScreen({ onRetry }: { onRetry: () => void }) {
  const router = useRouter();
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-5 text-center">
      <div className="text-7xl">🙈</div>
      <h2 className="mt-6 text-2xl font-bold">We couldn&apos;t craft that quest</h2>
      <p className="mt-2 text-muted">Check your connection and try again.</p>
      <div className="mt-6 flex gap-3">
        <ChunkyButton onClick={onRetry}>Try again</ChunkyButton>
        <ChunkyButton variant="white" onClick={() => router.push("/")}>
          Back home
        </ChunkyButton>
      </div>
    </main>
  );
}

function DoneScreen({
  results,
  onOpenAuth,
}: {
  results: Results;
  onOpenAuth: () => void;
}) {
  const router = useRouter();

  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col items-center justify-center px-5 py-12 text-center">
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", damping: 12 }}
        className="text-8xl"
      >
        🏆
      </motion.div>
      <h2 className="mt-4 text-3xl font-bold">Quest complete!</h2>
      <p className="mt-1 text-base text-muted sm:text-lg">{results.title}</p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <span className="flex items-center gap-1.5 rounded-full bg-sun-soft px-4 py-2 font-bold text-sun-dark shadow-xs">
          <Zap size={18} className="fill-sun text-sun" /> +{results.xp} XP
        </span>
        <span className="rounded-full bg-sky-soft px-4 py-2 font-bold text-sky-dark shadow-xs">
          {results.accuracy}% accuracy
        </span>
        <button
          onClick={onOpenAuth}
          className="flex items-center gap-1.5 rounded-full bg-fox-soft px-4 py-2 font-bold text-fox shadow-xs transition-transform hover:scale-105 active:scale-95"
          title="Save streak to Supabase"
        >
          🔥 {results.streak} day{results.streak === 1 ? "" : "s"} · Save Streak
        </button>
      </div>

      {/* Primary Path Continuation (if started from curriculum) */}
      {results.nextTopic && (
        <div className="mt-8 w-full max-w-md">
          <div className="mb-2 text-left text-xs font-bold uppercase tracking-wider text-muted">
            Next on Your Path
          </div>
          <ChunkyButton
            className="w-full flex items-center justify-center gap-2 text-base"
            onClick={() =>
              router.push(
                `/quest?topic=${encodeURIComponent(results.nextTopic!)}&cat=${results.catId}`
              )
            }
          >
            <span>Continue: {results.nextTopic}</span>
            <ArrowRight size={18} />
          </ChunkyButton>
        </div>
      )}

      {/* Engaging Next Topics Recommendations (Continuous learning loop) */}
      {results.relatedTopics && results.relatedTopics.length > 0 && (
        <div className="mt-8 w-full max-w-md">
          <div className="mb-3 flex items-center justify-between text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1">
              <Sparkles size={14} className="text-brand" /> Explore Next Topics
            </span>
            <span className="text-xs font-semibold text-brand-dark">Instant 5-min Quests</span>
          </div>

          <div className="grid gap-2.5">
            {results.relatedTopics.map((relTopic, idx) => (
              <button
                key={relTopic}
                onClick={() => router.push(`/quest?topic=${encodeURIComponent(relTopic)}`)}
                className="group flex items-center justify-between rounded-2xl border-2 border-b-4 border-line bg-white p-4 text-left transition-all hover:border-brand hover:bg-brand-soft/10 active:translate-y-[2px] active:border-b-2"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sun-soft text-xl transition-transform group-hover:scale-110">
                    {idx === 0 ? "🚀" : idx === 1 ? "💡" : "✨"}
                  </span>
                  <div>
                    <div className="font-bold text-foreground transition-colors group-hover:text-brand-dark">
                      {relTopic}
                    </div>
                    <div className="text-xs text-muted">Jump straight into this quest</div>
                  </div>
                </div>
                <ArrowRight
                  size={18}
                  className="shrink-0 text-muted transition-all group-hover:translate-x-1 group-hover:text-brand-dark"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Secondary Actions */}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {results.catId && (
          <ChunkyButton
            variant="white"
            onClick={() => router.push(`/category/${results.catId}`)}
          >
            Back to path
          </ChunkyButton>
        )}
        <ChunkyButton
          variant="white"
          onClick={() =>
            router.push(
              `/quest?topic=${encodeURIComponent(results.topic)}${results.catId ? `&cat=${results.catId}` : ""}`
            )
          }
        >
          Replay this quest
        </ChunkyButton>
        <ChunkyButton variant="white" onClick={() => router.push("/")}>
          Home
        </ChunkyButton>
      </div>
    </main>
  );
}
