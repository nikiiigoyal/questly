"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Flame, Sparkles, X, Zap } from "lucide-react";
import ChunkyButton from "@/components/ChunkyButton";
import { playSound } from "@/lib/sounds";
import { vibrateCelebration, vibrateTap } from "@/lib/haptics";

type IntroSplashProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function IntroSplashScreen({ isOpen, onClose }: IntroSplashProps) {
  const [rotate, setRotate] = useState({ x: 8, y: -6 });

  // Interactive 3D mouse parallax tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setRotate({
      x: -(y / rect.height) * 22,
      y: (x / rect.width) * 22,
    });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 6, y: -5 });
  };

  const handleEnter = () => {
    playSound("complete");
    vibrateCelebration();
    onClose();
  };

  // Keyboard shortcut to skip with ESC
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-md"
        >
          {/* Ambient 3D background light orbs */}
          <div className="pointer-events-none absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-brand/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 right-1/4 h-96 w-96 rounded-full bg-sky/20 blur-3xl" />
          <div className="pointer-events-none absolute top-1/3 right-1/3 h-80 w-80 rounded-full bg-sun/15 blur-3xl" />

          {/* Quick Skip Button */}
          <button
            onClick={onClose}
            aria-label="Close intro"
            className="absolute right-5 top-5 z-20 flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-bold text-white/80 backdrop-blur-sm transition-all hover:bg-white/20 hover:text-white"
          >
            <span>Skip</span>
            <X size={15} />
          </button>

          {/* 3D Viewport with Perspective */}
          <div
            className="relative w-full max-w-lg"
            style={{ perspective: 1200 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <motion.div
              animate={{
                rotateX: rotate.x,
                rotateY: rotate.y,
              }}
              transition={{ type: "spring", stiffness: 220, damping: 20 }}
              style={{ transformStyle: "preserve-3d" }}
              className="relative overflow-hidden rounded-3xl border-2 border-white/20 bg-gradient-to-b from-white/95 via-white to-page p-7 text-center shadow-2xl shadow-brand/20 sm:p-9"
            >
              {/* 3D Floating Layers */}

              {/* Layer 1: Floating 3D Streak Badge */}
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotateZ: [-4, 4, -4],
                }}
                transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut" }}
                style={{ transform: "translateZ(75px)" }}
                className="absolute left-6 top-6 flex items-center gap-1 rounded-2xl border border-fox/30 bg-fox-soft px-3 py-1.5 text-xs font-extrabold text-fox shadow-lg shadow-fox/20"
              >
                <Flame size={15} className="fill-fox text-fox" />
                <span>Streak On!</span>
              </motion.div>

              {/* Layer 2: Floating 3D XP Gem Badge */}
              <motion.div
                animate={{
                  y: [0, 8, 0],
                  rotateZ: [3, -3, 3],
                }}
                transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
                style={{ transform: "translateZ(65px)" }}
                className="absolute right-6 top-6 flex items-center gap-1 rounded-2xl border border-sun/30 bg-sun-soft px-3 py-1.5 text-xs font-extrabold text-sun-dark shadow-lg shadow-sun/20"
              >
                <Zap size={15} className="fill-sun text-sun" />
                <span>Instant XP</span>
              </motion.div>

              {/* Layer 3: Central 3D Mascot Portal */}
              <div
                style={{ transform: "translateZ(90px)" }}
                className="mx-auto mt-4 flex h-32 w-32 items-center justify-center"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.06, 1],
                    rotateZ: [0, -2, 2, 0],
                  }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                  className="relative flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-br from-brand via-sky to-brand-dark text-6xl shadow-2xl shadow-brand/35 ring-4 ring-white/60"
                >
                  🦚
                  <motion.span
                    animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
                    transition={{ repeat: Infinity, duration: 1.8 }}
                    className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-sun text-sm shadow-md"
                  >
                    ✨
                  </motion.span>
                </motion.div>
              </div>

              {/* Layer 4: Punchy 3D Headings */}
              <div style={{ transform: "translateZ(50px)" }} className="mt-5">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3.5 py-1 text-xs font-bold text-brand-dark">
                  <Sparkles size={14} />
                  <span>The 5-Minute Brain Quest</span>
                </div>

                <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                  चलो, कुछ तूफ़ानी <br />
                  <span className="bg-gradient-to-r from-brand via-sky-dark to-fox bg-clip-text text-transparent">
                    सीखते हैं!
                  </span>{" "}
                  🌪️
                </h1>

                <p className="mt-2 text-sm font-semibold text-muted sm:text-base">
                  Ready to turn random curiosity into an epic streak?
                  No boring textbooks — just addictive, 5-minute interactive quests.
                </p>
              </div>

              {/* Layer 5: Interactive 3D Action Button */}
              <div style={{ transform: "translateZ(80px)" }} className="mt-7 space-y-3">
                <ChunkyButton
                  onClick={handleEnter}
                  className="w-full flex items-center justify-center gap-2 py-4 text-base shadow-xl shadow-brand/30"
                >
                  <span>Start Exploring Now</span>
                  <ArrowRight size={20} />
                </ChunkyButton>

                <button
                  onClick={() => {
                    vibrateTap();
                    onClose();
                  }}
                  className="text-xs font-bold text-muted transition-colors hover:text-foreground"
                >
                  Jump straight to home
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
