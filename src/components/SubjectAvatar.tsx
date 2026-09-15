"use client";

import { motion } from "framer-motion";

/**
 * A collectible game-badge subject icon.
 * – Gradient tile with gentle bob + hover pop
 * – Soft pulsing halo glow behind the tile
 * – Shine sweep gliding across every few seconds
 */

const SUBJECT_STYLES: Record<string, { grad: string; glow: string; shadow: string }> = {
  history:   { grad: "from-fox to-sun",     glow: "from-fox/40",    shadow: "shadow-fox/30"    },
  geography: { grad: "from-sky to-brand",   glow: "from-sky/40",    shadow: "shadow-sky/30"    },
  culture:   { grad: "from-beetle to-fox",  glow: "from-beetle/40", shadow: "shadow-beetle/30" },
  space:     { grad: "from-beetle to-sky",  glow: "from-sky/40",    shadow: "shadow-sky/30"    },
  science:   { grad: "from-brand to-sky",   glow: "from-brand/40",  shadow: "shadow-brand/30"  },
  sports:    { grad: "from-berry to-fox",   glow: "from-berry/40",  shadow: "shadow-berry/30"  },
  "ai-tech": { grad: "from-sky to-beetle",  glow: "from-beetle/40", shadow: "shadow-beetle/30" },
  gk:        { grad: "from-sun to-brand",   glow: "from-sun/40",    shadow: "shadow-sun/30"    },
  news:      { grad: "from-fox to-berry",   glow: "from-fox/40",    shadow: "shadow-fox/30"    },
};

const FALLBACK = { grad: "from-brand to-sky", glow: "from-brand/40", shadow: "shadow-brand/30" };

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

  return (
    <motion.div
      animate={{ y: [0, -4, 0] }}
      transition={{ repeat: Infinity, duration: 2.8, delay: bobDelay, ease: "easeInOut" }}
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
          animate={{ translateX: ["-100%", "200%"] }}
          transition={{ repeat: Infinity, duration: 0.6, delay: shineDelay, repeatDelay: 4, ease: "easeInOut" }}
        />
        <span className="relative drop-shadow-sm">{emoji}</span>
      </div>
    </motion.div>
  );
}
