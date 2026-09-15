"use client";

import { motion } from "framer-motion";

/**
 * A collectible game-badge subject icon.
 * – Gradient tile with gentle bob + hover pop
 * – Soft pulsing halo glow behind the tile
 * – Shine sweep gliding across every few seconds
 * – Two tiny floating accent emojis unique to each subject
 * No blinking eyes.
 */

const SUBJECT_STYLES: Record<
  string,
  { grad: string; glow: string; shadow: string; accents: [string, string] }
> = {
  history:   { grad: "from-fox to-sun",      glow: "from-fox/40",     shadow: "shadow-fox/30",    accents: ["⚔️", "🏺"] },
  geography: { grad: "from-sky to-brand",    glow: "from-sky/40",     shadow: "shadow-sky/30",    accents: ["🌍", "🗺️"] },
  culture:   { grad: "from-beetle to-fox",   glow: "from-beetle/40",  shadow: "shadow-beetle/30", accents: ["🎭", "🎨"] },
  space:     { grad: "from-beetle to-sky",   glow: "from-sky/40",     shadow: "shadow-sky/30",    accents: ["🚀", "🪐"] },
  science:   { grad: "from-brand to-sky",    glow: "from-brand/40",   shadow: "shadow-brand/30",  accents: ["🧪", "🔬"] },
  sports:    { grad: "from-berry to-fox",    glow: "from-berry/40",   shadow: "shadow-berry/30",  accents: ["🏆", "⚡"] },
  "ai-tech": { grad: "from-sky to-beetle",   glow: "from-beetle/40",  shadow: "shadow-beetle/30", accents: ["🤖", "💻"] },
  gk:        { grad: "from-sun to-brand",    glow: "from-sun/40",     shadow: "shadow-sun/30",    accents: ["🧠", "💡"] },
  news:      { grad: "from-fox to-berry",    glow: "from-fox/40",     shadow: "shadow-fox/30",    accents: ["📰", "🌐"] },
};

const FALLBACK = {
  grad: "from-brand to-sky",
  glow: "from-brand/40",
  shadow: "shadow-brand/30",
  accents: ["✨", "⭐"] as [string, string],
};

export default function SubjectAvatar({
  id,
  emoji,
  index = 0,
  className = "h-14 w-14 text-3xl",
}: {
  id: string;
  emoji: string;
  index?: number;
  className?: string;
}) {
  const style = SUBJECT_STYLES[id] ?? FALLBACK;
  const bobDelay = (index % 5) * 0.3;
  const shineDelay = (index % 4) * 1.4;
  const accentDelay1 = (index % 3) * 0.5;
  const accentDelay2 = accentDelay1 + 0.7;

  return (
    <motion.div
      animate={{ y: [0, -4, 0] }}
      transition={{
        repeat: Infinity,
        duration: 2.8,
        delay: bobDelay,
        ease: "easeInOut",
      }}
      whileHover={{ scale: 1.12, rotate: -4 }}
      className="relative shrink-0"
    >
      {/* Pulsing glow halo behind the tile */}
      <motion.div
        animate={{ scale: [1, 1.18, 1], opacity: [0.55, 0.85, 0.55] }}
        transition={{ repeat: Infinity, duration: 2.5, delay: bobDelay, ease: "easeInOut" }}
        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${style.glow} to-transparent blur-md`}
      />

      {/* Main tile */}
      <div
        className={`relative flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br ${style.grad} shadow-lg ${style.shadow} ${className}`}
      >
        {/* Shine sweep */}
        <motion.div
          className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-white/30"
          animate={{ translateX: ["−100%", "200%"] }}
          transition={{
            repeat: Infinity,
            duration: 0.6,
            delay: shineDelay,
            repeatDelay: 4,
            ease: "easeInOut",
          }}
        />
        <span className="relative drop-shadow-sm">{emoji}</span>
      </div>

      {/* Floating accent — top-right */}
      <motion.span
        animate={{ y: [0, -4, 0], rotate: [0, 10, -10, 0] }}
        transition={{ repeat: Infinity, duration: 2.2, delay: accentDelay1, ease: "easeInOut" }}
        className="pointer-events-none absolute -right-2 -top-2 text-[0.7rem] drop-shadow"
        aria-hidden
      >
        {style.accents[0]}
      </motion.span>

      {/* Floating accent — bottom-left */}
      <motion.span
        animate={{ y: [0, 4, 0], rotate: [0, -8, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2.6, delay: accentDelay2, ease: "easeInOut" }}
        className="pointer-events-none absolute -bottom-2 -left-2 text-[0.7rem] drop-shadow"
        aria-hidden
      >
        {style.accents[1]}
      </motion.span>
    </motion.div>
  );
}
