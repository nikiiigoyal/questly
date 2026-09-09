"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Flame, Lock, Mail, ShieldCheck, Sparkles, X, Zap } from "lucide-react";
import ChunkyButton from "@/components/ChunkyButton";
import { loadProgress, saveProgress, type Progress } from "@/lib/progress";
import {
  isSupabaseConfigured,
  loadProgressFromSupabase,
  saveProgressToSupabase,
  supabase,
} from "@/lib/supabase";

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSyncSuccess?: (progress: Progress) => void;
};

export default function AuthModal({
  isOpen,
  onClose,
  onSyncSuccess,
}: AuthModalProps) {
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const localProgress = loadProgress();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim() || !password) {
      setErrorMsg("Please provide both email and password.");
      return;
    }

    if (!isSupabaseConfigured || !supabase) {
      // Demo preview simulation
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setSuccessMsg(
          "Demo mode: Progress saved locally! Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local for live cloud sync."
        );
        setTimeout(() => {
          onClose();
        }, 2200);
      }, 700);
      return;
    }

    setLoading(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        });
        if (error) throw error;
        if (data.user) {
          await saveProgressToSupabase(data.user, localProgress);
          setSuccessMsg("Account created! Your streak and XP are saved to the cloud.");
          onSyncSuccess?.(localProgress);
          setTimeout(onClose, 1600);
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;
        if (data.user) {
          // Sync existing remote progress if any
          const { progress: remoteProgress } = await loadProgressFromSupabase(data.user);
          let merged = localProgress;
          if (remoteProgress) {
            merged = {
              xp: Math.max(localProgress.xp, remoteProgress.xp),
              streak: Math.max(localProgress.streak, remoteProgress.streak),
              lastActive: localProgress.lastActive || remoteProgress.lastActive,
              questsDone: Array.from(
                new Set([...localProgress.questsDone, ...remoteProgress.questsDone])
              ),
            };
            saveProgress(merged);
            await saveProgressToSupabase(data.user, merged);
          } else {
            await saveProgressToSupabase(data.user, localProgress);
          }

          setSuccessMsg("Welcome back! Your streak and records are synced.");
          onSyncSuccess?.(merged);
          setTimeout(onClose, 1400);
        }
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-xs"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="relative w-full max-w-md rounded-3xl border-2 border-line bg-white p-6 shadow-2xl"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 rounded-full p-2 text-faint hover:bg-line hover:text-foreground"
            >
              <X size={20} />
            </button>

            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-fox to-sun text-3xl shadow-md shadow-fox/20">
                🔥
              </div>
              <h2 className="mt-3 text-2xl font-bold">Keep Your Streak Alive!</h2>
              <p className="mt-1 text-sm text-muted">
                Save your records and pick up right where you left off on any device.
              </p>

              <div className="mt-3 flex items-center justify-center gap-2">
                <span className="flex items-center gap-1 rounded-full bg-fox-soft px-3 py-1 text-xs font-bold text-fox">
                  <Flame size={14} className="fill-fox" />
                  {localProgress.streak} day streak
                </span>
                <span className="flex items-center gap-1 rounded-full bg-sun-soft px-3 py-1 text-xs font-bold text-sun-dark">
                  <Zap size={14} className="fill-sun" />
                  {localProgress.xp} XP
                </span>
                <span className="flex items-center gap-1 rounded-full bg-brand-soft px-3 py-1 text-xs font-bold text-brand-dark">
                  <ShieldCheck size={14} />
                  Supabase Cloud
                </span>
              </div>
            </div>

            {!isSupabaseConfigured && (
              <div className="mt-4 rounded-2xl border border-sun-dark/30 bg-sun-soft p-3 text-xs text-foreground">
                <div className="flex items-center gap-1.5 font-bold text-sun-dark">
                  <Sparkles size={14} /> Optional Cloud Sync
                </div>
                <p className="mt-1 text-muted">
                  Supabase keys aren&apos;t set yet in <code>.env.local</code>. You can test the sync flow in demo mode or continue as a guest!
                </p>
              </div>
            )}

            <div className="mt-4 flex rounded-xl border border-line bg-page p-1">
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setErrorMsg(null);
                }}
                className={`flex-1 rounded-lg py-2 text-xs font-bold transition-colors ${
                  mode === "signup" ? "bg-white text-brand-dark shadow-xs" : "text-muted"
                }`}
              >
                Create Account
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("signin");
                  setErrorMsg(null);
                }}
                className={`flex-1 rounded-lg py-2 text-xs font-bold transition-colors ${
                  mode === "signin" ? "bg-white text-brand-dark shadow-xs" : "text-muted"
                }`}
              >
                Sign In
              </button>
            </div>

            <form onSubmit={handleAuth} className="mt-4 space-y-3">
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-faint" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full rounded-xl border-2 border-line bg-white py-3 pl-10 pr-3 text-sm outline-none transition-colors focus:border-brand"
                />
              </div>

              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-faint" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password (at least 6 chars)"
                  className="w-full rounded-xl border-2 border-line bg-white py-3 pl-10 pr-3 text-sm outline-none transition-colors focus:border-brand"
                />
              </div>

              {errorMsg && (
                <div className="rounded-xl bg-berry-soft p-2.5 text-center text-xs font-semibold text-berry-dark">
                  {errorMsg}
                </div>
              )}

              {successMsg && (
                <div className="rounded-xl bg-brand-soft p-2.5 text-center text-xs font-semibold text-brand-dark">
                  {successMsg}
                </div>
              )}

              <ChunkyButton
                type="submit"
                disabled={loading}
                className="w-full"
              >
                {loading
                  ? "Saving..."
                  : mode === "signup"
                    ? "Save Streak & Sign Up"
                    : "Sign In & Sync"}
              </ChunkyButton>
            </form>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={onClose}
                className="text-xs font-bold text-muted transition-colors hover:text-foreground"
              >
                Maybe later · Continue exploring as guest
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
