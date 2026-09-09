"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, MessageCircle, Share2, Swords, Trophy, Users, X, Zap } from "lucide-react";
import ChunkyButton from "@/components/ChunkyButton";
import { playSound } from "@/lib/sounds";
import { vibrateSuccess, vibrateTap } from "@/lib/haptics";

type ChallengeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  topic?: string;
  score?: number;
  xp?: number;
};

export default function ChallengeModal({
  isOpen,
  onClose,
  topic = "Generative AI",
  score = 100,
  xp = 45,
}: ChallengeModalProps) {
  const [challengerName, setChallengerName] = useState("Your Friend");
  const [challengeTopic, setChallengeTopic] = useState(topic);
  const [copied, setCopied] = useState(false);

  // Sync prop changes into state
  const currentTopic = challengeTopic || topic || "Generative AI";

  const getShareUrl = () => {
    if (typeof window === "undefined") return "";
    const origin = window.location.origin;
    const name = challengerName.trim() || "A Friend";
    return `${origin}/quest?topic=${encodeURIComponent(currentTopic)}&challenge=true&challenger=${encodeURIComponent(name)}&score=${score}&xp=${xp}`;
  };

  const getShareText = () => {
    const name = challengerName.trim() || "I";
    return `⚔️ ${name} scored ${score}% and earned +${xp} XP in "${currentTopic}" on Questly!\nCan you beat this score? Take the 5-minute quest challenge now:\n${getShareUrl()}`;
  };

  const handleCopy = async () => {
    playSound("tap");
    vibrateTap();
    const url = getShareUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      playSound("correct");
      vibrateSuccess();
      setTimeout(() => setCopied(false), 2400);
    } catch {
      // fallback
    }
  };

  const handleWhatsApp = () => {
    playSound("tap");
    vibrateTap();
    const text = encodeURIComponent(getShareText());
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const handleNativeShare = async () => {
    playSound("tap");
    vibrateTap();
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `Questly Challenge: ${currentTopic}`,
          text: getShareText(),
          url: getShareUrl(),
        });
      } catch {
        // user cancelled share
      }
    } else {
      await handleCopy();
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
            className="absolute inset-0 bg-black/50 backdrop-blur-xs"
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
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand via-sky to-brand-dark text-3xl shadow-md shadow-brand/20">
                ⚔️
              </div>
              <h2 className="mt-3 text-2xl font-bold">Challenge Your Friends!</h2>
              <p className="mt-1 text-sm text-muted">
                Ditch boring homework. Challenge friends to beat your score in a rapid 5-minute quest!
              </p>
            </div>

            {/* Duel Score Preview Card */}
            <div className="mt-4 rounded-2xl border-2 border-line bg-page p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <Trophy size={16} className="text-sun-dark" />
                  <span>Your Record</span>
                </div>
                <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-bold text-brand-dark">
                  Target to Beat
                </span>
              </div>

              <div className="mt-2 text-lg font-extrabold text-foreground">
                {currentTopic}
              </div>

              <div className="mt-2 flex items-center gap-3">
                <span className="flex items-center gap-1 rounded-full bg-sky-soft px-3 py-1 text-xs font-bold text-sky-dark">
                  🎯 {score}% Accuracy
                </span>
                <span className="flex items-center gap-1 rounded-full bg-sun-soft px-3 py-1 text-xs font-bold text-sun-dark">
                  <Zap size={14} className="fill-sun text-sun" /> +{xp} XP
                </span>
              </div>
            </div>

            {/* Challenger Name & Topic input */}
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted">
                  Your Nickname
                </label>
                <input
                  type="text"
                  value={challengerName}
                  onChange={(e) => setChallengerName(e.target.value)}
                  placeholder="e.g. Aryan or QuizMaster"
                  className="mt-1 w-full rounded-xl border-2 border-line bg-white px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-brand"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted">
                  Topic to Duel On
                </label>
                <input
                  type="text"
                  value={challengeTopic}
                  onChange={(e) => setChallengeTopic(e.target.value)}
                  placeholder="e.g. Generative AI, Black Holes..."
                  className="mt-1 w-full rounded-xl border-2 border-line bg-white px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-brand"
                />
              </div>
            </div>

            {/* Quick Share Buttons */}
            <div className="mt-5 space-y-2.5">
              <button
                onClick={handleWhatsApp}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] py-3 text-center text-sm font-bold text-white shadow-md transition-transform hover:brightness-105 active:scale-98"
              >
                <MessageCircle size={18} />
                <span>Challenge via WhatsApp</span>
              </button>

              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-line bg-white py-2.5 text-sm font-bold text-foreground transition-all hover:border-brand active:scale-98"
                >
                  {copied ? (
                    <>
                      <Check size={16} className="text-brand" />
                      <span className="text-brand">Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={16} className="text-muted" />
                      <span>Copy Challenge Link</span>
                    </>
                  )}
                </button>

                {typeof navigator !== "undefined" && "share" in navigator && (
                  <button
                    onClick={handleNativeShare}
                    className="flex items-center justify-center rounded-2xl border-2 border-line bg-white px-4 py-2.5 text-foreground transition-all hover:border-brand active:scale-98"
                    title="More Share Options"
                  >
                    <Share2 size={18} />
                  </button>
                )}
              </div>
            </div>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={onClose}
                className="text-xs font-bold text-muted transition-colors hover:text-foreground"
              >
                Done
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
