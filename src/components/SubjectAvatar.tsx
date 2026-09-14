"use client";

import { motion } from "framer-motion";

/**
 * A living subject icon: the world's emoji wearing a pair of eyes that blink
 * on its own loop, gently bobbing like the mascot. Same trick Duolingo uses —
 * slap a face on anything and it becomes a character.
 */

const SUBJECT_STYLES: Record<string, { grad: string; glow: string }> = {
  history: { grad: "from-fox to-sun", glow: "shadow-fox/30" },
  geography: { grad: "from-sky to-brand", glow: "shadow-sky/30" },
  culture: { grad: "from-beetle to-fox", glow: "shadow-beetle/30" },
  space: { grad: "from-beetle to-sky", glow: "shadow-beetle/30" },
  science: { grad: "from-brand to-sky", glow: "shadow-brand/30" },
  sports: { grad: "from-berry to-fox", glow: "shadow-berry/30" },
  "ai-tech": { grad: "from-sky to-beetle", glow: "shadow-sky/30" },
  gk: { grad: "from-sun to-brand", glow: "shadow-sun/30" },
  news: { grad: "from-fox to-berry", glow: "shadow-fox/30" },
};

const FALLBACK = { grad: "from-brand to-sky", glow: "shadow-brand/30" };

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
  const blinkDuration = 3.6 + (index % 4) * 0.9;
  const blinkDelay = 0.6 + (index % 5) * 0.55;

  return (
    <motion.div
      animate={{ y: [0, -4, 0] }}
      transition={{
        repeat: Infinity,
        duration: 2.8,
        delay: (index % 5) * 0.3,
        ease: "easeInOut",
      }}
      whileHover={{ scale: 1.12, rotate: -4 }}
      className={`relative flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${style.grad} shadow-lg ${style.glow} ${className}`}
    >
      <span className="drop-shadow-sm">{emoji}</span>

      {/* Eyes — blink together, out of sync with the other subjects */}
      <motion.div
        className="absolute inset-x-[26%] top-[30%] flex items-start justify-between"
        style={{ transformOrigin: "center" }}
        animate={{ scaleY: [1, 1, 0.08, 1, 1] }}
        transition={{
          repeat: Infinity,
          duration: blinkDuration,
          delay: blinkDelay,
          times: [0, 0.88, 0.93, 0.97, 1],
        }}
      >
        {[0, 1].map((i) => (
          <span
            key={i}
            className="relative block h-[0.85em] w-[0.62em] rounded-full bg-white/95 shadow-sm"
          >
            <span className="absolute bottom-[12%] left-1/2 h-[42%] w-[48%] -translate-x-1/2 rounded-full bg-slate-800" />
          </span>
        ))}
      </motion.div>
    </motion.div>
  );
}
