"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Dices, Languages, Palette, Sparkles } from "lucide-react";
import { playSound } from "@/lib/sounds";
import { vibrateTap } from "@/lib/haptics";

const PALETTES = [
  { id: "emerald", name: "Duolingo Green", gradient: "from-brand/15 via-sky/10 to-transparent", ring: "ring-brand" },
  { id: "sky", name: "Sky Blue", gradient: "from-sky/20 via-brand/10 to-transparent", ring: "ring-sky" },
  { id: "sun", name: "Solar Sun", gradient: "from-sun/20 via-fox/15 to-transparent", ring: "ring-sun" },
  { id: "beetle", name: "Cosmic Purple", gradient: "from-beetle/20 via-sky/10 to-transparent", ring: "ring-beetle" },
];

const HOOKS = [
  {
    hi: "चलो, कुछ तूफ़ानी सीखते हैं! 🌪️",
    en: "Ready to blow your own mind? 🚀",
    subHi: "किताबें नहीं, ये 5 मिनट का लाइव एडवेंचर है।",
    subEn: "Search any topic. Get an instant 5-minute quest. Flex your streak.",
    bubbleHi: "मित्र: आज क्या तूफ़ानी खोजना है?",
    bubbleEn: "Mitra: Ready for today's brain gym?",
  },
  {
    hi: "क्या चल रहा है, Genius? 💡",
    en: "What's buzzing, Genius? ⚡",
    subHi: "दिमाग को भूखा मत रखो, आज कुछ नया सीखो!",
    subEn: "Feed your hungry brain with bite-sized, interactive quests.",
    bubbleHi: "मित्र: कुछ अनोखा ट्राय करें?",
    bubbleEn: "Mitra: Let's pick a wild curiosity!",
  },
  {
    hi: "सीखो. जीतो. Flex your streak! 🔥",
    en: "Play. Learn. Flex your streak! 🏆",
    subHi: "हर रोज़ 5 मिनट, और ज्ञान का स्तर 100!",
    subEn: "5 minutes a day. Zero boring lectures. 100% interactive delight.",
    bubbleHi: "मित्र: अपनी स्ट्रीक को जिंदा रखो!",
    bubbleEn: "Mitra: Keep your streak alive today!",
  },
  {
    hi: "पढ़ाई नहीं, ये तो Quest है! ⚔️",
    en: "Not study. It's a Quest! 🎯",
    subHi: "दुनिया के रहस्य सुलझाओ, XP जीतो।",
    subEn: "Solve mysteries, conquer quizzes, and level up your brain XP.",
    bubbleHi: "मित्र: कौन सा वर्ल्ड जीतना है?",
    bubbleEn: "Mitra: Which world shall we conquer?",
  },
  {
    hi: "नमस्ते, खोजी! 🙏",
    en: "Namaste, Explorer! 🦚",
    subHi: "कुछ भी खोजो। तुरंत 5 मिनट का मजेदार क्विज पाओ।",
    subEn: "Search anything. Get an instant 5-minute quest. Keep your daily streak alive.",
    bubbleHi: "मित्र: आज क्या नया सीखना चाहते हो?",
    bubbleEn: "Mitra: What adventure shall we explore today?",
  },
];

export default function NamasteGreeting() {
  const [hookIndex, setHookIndex] = useState(0);
  const [lang, setLang] = useState<"hi" | "en">("hi");
  const [paletteIndex, setPaletteIndex] = useState(0);

  // Auto-flip from Hindi to English on first load after 3.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setLang("en");
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  const toggleLanguage = () => {
    playSound("tap");
    vibrateTap();
    setLang((prev) => (prev === "hi" ? "en" : "hi"));
  };

  const nextHook = () => {
    playSound("tap");
    vibrateTap();
    setHookIndex((prev) => (prev + 1) % HOOKS.length);
  };

  const cyclePalette = () => {
    playSound("tap");
    vibrateTap();
    setPaletteIndex((prev) => (prev + 1) % PALETTES.length);
  };

  const activePalette = PALETTES[paletteIndex];
  const activeHook = HOOKS[hookIndex];

  return (
    <section className="relative pt-3 text-center">
      {/* Dynamic atmospheric aura */}
      <div
        className={`pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 h-56 w-full max-w-lg rounded-full bg-gradient-to-b ${activePalette.gradient} blur-3xl opacity-80 transition-all duration-700`}
      />

      {/* Top micro controls: Slogan Shuffle, Language toggle & Palette switch */}
      <div className="relative mb-3 flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={nextHook}
          className="flex items-center gap-1.5 rounded-full border border-line bg-white/90 px-3 py-1 text-xs font-bold text-muted backdrop-blur-xs transition-all hover:border-fox hover:text-fox"
          title="Shuffle to another fun slogan"
        >
          <Dices size={14} className="text-fox" />
          <span>Shuffle Vibe</span>
        </button>

        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 rounded-full border border-line bg-white/90 px-3 py-1 text-xs font-bold text-muted backdrop-blur-xs transition-all hover:border-brand hover:text-brand"
          title="Switch greeting language"
        >
          <Languages size={14} />
          {lang === "hi" ? "हिंदी (Hindi)" : "English"}
        </button>

        <button
          onClick={cyclePalette}
          className="flex items-center gap-1.5 rounded-full border border-line bg-white/90 px-3 py-1 text-xs font-bold text-muted backdrop-blur-xs transition-all hover:border-sky hover:text-sky"
          title="Switch theme accent"
        >
          <Palette size={14} />
          <span>Theme</span>
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
        key={hookIndex + lang}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mx-auto mt-3 inline-flex items-center gap-2 rounded-2xl border-2 border-line bg-white px-4 py-1.5 text-xs font-bold text-muted shadow-xs"
      >
        <Sparkles size={14} className="text-sun-dark" />
        <span>{lang === "hi" ? activeHook.bubbleHi : activeHook.bubbleEn}</span>
      </motion.div>

      {/* Animated Greeting Heading */}
      <div className="mt-3 min-h-[50px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.h1
            key={hookIndex + lang}
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            className="text-3xl font-extrabold tracking-tight sm:text-4xl"
          >
            <span className="bg-gradient-to-r from-fox via-sun-dark to-brand bg-clip-text text-transparent">
              {lang === "hi" ? activeHook.hi : activeHook.en}
            </span>
          </motion.h1>
        </AnimatePresence>
      </div>

      <p className="mx-auto mt-2 max-w-md text-base leading-relaxed text-muted sm:text-lg">
        {lang === "hi" ? activeHook.subHi : activeHook.subEn}
      </p>
    </section>
  );
}
