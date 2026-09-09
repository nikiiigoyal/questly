"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, Languages, Palette } from "lucide-react";
import { playSound } from "@/lib/sounds";

const PALETTES = [
  { id: "emerald", name: "Duolingo Green", gradient: "from-brand/15 via-sky/10 to-transparent", ring: "ring-brand" },
  { id: "sky", name: "Sky Blue", gradient: "from-sky/20 via-brand/10 to-transparent", ring: "ring-sky" },
  { id: "sun", name: "Solar Sun", gradient: "from-sun/20 via-fox/15 to-transparent", ring: "ring-sun" },
  { id: "beetle", name: "Cosmic Purple", gradient: "from-beetle/20 via-sky/10 to-transparent", ring: "ring-beetle" },
];

export default function NamasteGreeting() {
  const [lang, setLang] = useState<"hi" | "en">("hi");
  const [paletteIndex, setPaletteIndex] = useState(0);

  // Auto-flip from Hindi to English on first load after 3.2 seconds, or let user toggle
  useEffect(() => {
    const timer = setTimeout(() => {
      setLang("en");
    }, 3200);
    return () => clearTimeout(timer);
  }, []);

  const toggleLanguage = () => {
    playSound("tap");
    setLang((prev) => (prev === "hi" ? "en" : "hi"));
  };

  const cyclePalette = () => {
    playSound("tap");
    setPaletteIndex((prev) => (prev + 1) % PALETTES.length);
  };

  const activePalette = PALETTES[paletteIndex];

  return (
    <section className="relative pt-3 text-center">
      {/* Dynamic atmospheric aura */}
      <div
        className={`pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 h-56 w-full max-w-lg rounded-full bg-gradient-to-b ${activePalette.gradient} blur-3xl opacity-80 transition-all duration-700`}
      />

      {/* Top micro controls: Language toggle & Palette switch */}
      <div className="relative mb-3 flex items-center justify-center gap-2">
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 rounded-full border border-line bg-white/90 px-3 py-1 text-xs font-bold text-muted backdrop-blur-xs transition-all hover:border-brand hover:text-brand"
          title="Switch greeting language"
        >
          <Languages size={14} />
          {lang === "hi" ? "नमस्ते (Hindi)" : "Namaste (English)"}
        </button>

        <button
          onClick={cyclePalette}
          className="flex items-center gap-1.5 rounded-full border border-line bg-white/90 px-3 py-1 text-xs font-bold text-muted backdrop-blur-xs transition-all hover:border-sky hover:text-sky"
          title="Switch theme accent"
        >
          <Palette size={14} />
          <span>Vibe</span>
        </button>
      </div>

      {/* Mascot with lively bounce and floating sparkles */}
      <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
        <motion.div
          animate={{
            y: [0, -8, 0],
            rotate: [0, -3, 3, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 2.8,
            ease: "easeInOut",
          }}
          className={`flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-brand via-sky to-brand-dark text-5xl shadow-xl shadow-brand/25 ring-4 ${activePalette.ring} ring-offset-2 transition-all duration-500`}
        >
          🦚
        </motion.div>

        {/* Floating playful particle */}
        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-sun text-sm shadow-md"
        >
          ✨
        </motion.div>
      </div>

      {/* Speech Bubble from Mascot */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15 }}
        className="mx-auto mt-3 inline-flex items-center gap-2 rounded-2xl border-2 border-line bg-white px-4 py-1.5 text-xs font-bold text-muted shadow-xs"
      >
        <Sparkles size={14} className="text-sun-dark" />
        <span>
          {lang === "hi"
            ? "मित्र: आज क्या नया खोजना है?"
            : "Mitra: What adventure shall we explore today?"}
        </span>
      </motion.div>

      {/* Animated Greeting Heading */}
      <div className="mt-3 min-h-[44px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {lang === "hi" ? (
            <motion.h1
              key="hindi"
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="text-3xl font-extrabold tracking-tight sm:text-4xl"
            >
              <span className="bg-gradient-to-r from-fox via-sun-dark to-brand bg-clip-text text-transparent">
                नमस्ते, खोजी!
              </span>{" "}
              <span>🙏</span>
            </motion.h1>
          ) : (
            <motion.h1
              key="english"
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="text-3xl font-extrabold tracking-tight sm:text-4xl"
            >
              <span>Namaste, explorer!</span>{" "}
              <span className="inline-block animate-wave">🦚</span>
            </motion.h1>
          )}
        </AnimatePresence>
      </div>

      <p className="mx-auto mt-2 max-w-md text-base leading-relaxed text-muted sm:text-lg">
        Search any curiosity. Get an instant 5-minute quest. Keep your daily streak alive.
      </p>
    </section>
  );
}
