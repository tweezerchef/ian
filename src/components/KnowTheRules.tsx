"use client";

import { motion, type Variants } from "motion/react";

type Word = {
  text: string;
  color: string;
  rotate: number;
  big: boolean;
};

const row1: Word[] = [
  { text: "KNOW", color: "text-magenta-bloom-400", rotate: -6, big: true },
  { text: "THE", color: "text-lilac-300", rotate: 7, big: false },
  { text: "RULES", color: "text-yellow-green-400", rotate: -3, big: true },
];

const row2: Word[] = [
  { text: "OF", color: "text-lilac-300", rotate: 9, big: false },
  { text: "THE", color: "text-lilac-300", rotate: -5, big: false },
  { text: "GAME", color: "text-neon-ice-300", rotate: 5, big: true },
];

const sparkles = [
  { top: "12%", left: "12%", delay: 0.4, color: "var(--color-yellow-green-400)", size: 24 },
  { top: "22%", left: "82%", delay: 0.7, color: "var(--color-neon-ice-300)", size: 20 },
  { top: "78%", left: "6%", delay: 1.0, color: "var(--color-magenta-bloom-400)", size: 22 },
  { top: "82%", left: "70%", delay: 1.3, color: "var(--color-yellow-green-300)", size: 18 },
];

const container: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.14, delayChildren: 0.05 } },
};

type WordCustom = { side: 1 | -1; rotate: number };

const wordVariant: Variants = {
  hidden: (c: WordCustom) => ({
    opacity: 0,
    x: 120 * c.side,
    y: -40,
    rotate: 0,
    scale: 0.55,
  }),
  shown: (c: WordCustom) => ({
    opacity: 1,
    x: 0,
    y: 0,
    rotate: c.rotate,
    scale: 1,
    transition: { type: "spring", stiffness: 240, damping: 11 },
  }),
};

const sticker: Variants = {
  hidden: { opacity: 0, scale: 0, rotate: 60 },
  shown: {
    opacity: 1,
    scale: 1,
    rotate: -8,
    transition: { type: "spring", stiffness: 260, damping: 10, delay: 1.2 },
  },
};

const puck: Variants = {
  hidden: { opacity: 0, y: -180, rotate: 0 },
  shown: {
    opacity: 1,
    y: 0,
    rotate: -420,
    transition: { type: "spring", stiffness: 140, damping: 9, delay: 0.85 },
  },
};

function Sparkle({ color, size }: { color: string; size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z"
        fill={color}
      />
    </svg>
  );
}

function WordRow({
  words,
  offset,
}: {
  words: Word[];
  offset: number;
}) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 md:gap-x-6">
      {words.map((w, i) => {
        const globalIndex = offset + i;
        return (
          <motion.span
            key={`${w.text}-${globalIndex}`}
            custom={{
              side: (globalIndex % 2 === 0 ? -1 : 1) as 1 | -1,
              rotate: w.rotate,
            }}
            variants={wordVariant}
            className={`inline-block origin-center font-black uppercase tracking-tight leading-none ${w.color} ${
              w.big
                ? "text-4xl md:text-6xl lg:text-7xl [text-shadow:0_4px_0_var(--color-magenta-bloom-950)]"
                : "text-xl md:text-3xl lg:text-4xl"
            }`}
          >
            {w.text}
          </motion.span>
        );
      })}
    </div>
  );
}

export function KnowTheRules() {
  return (
    <section className="relative overflow-hidden py-12 md:py-16">
      <motion.div
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, amount: 0.4 }}
        variants={container}
        className="relative mx-auto max-w-4xl px-6"
      >
        {sparkles.map((s, i) => (
          <motion.div
            key={i}
            className="pointer-events-none absolute"
            style={{ top: s.top, left: s.left }}
            initial={{ scale: 0, rotate: -90, opacity: 0 }}
            whileInView={{
              scale: [0, 1.3, 1],
              rotate: 180,
              opacity: 1,
            }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: s.delay, ease: "backOut" }}
          >
            <Sparkle color={s.color} size={s.size} />
          </motion.div>
        ))}

        <motion.div
          variants={puck}
          className="pointer-events-none absolute -top-2 right-6 md:right-12"
        >
          <svg
            viewBox="0 0 60 30"
            width="46"
            height="23"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
            className="drop-shadow-[0_4px_0_var(--color-magenta-bloom-900)]"
          >
            <ellipse
              cx="30"
              cy="15"
              rx="28"
              ry="12"
              fill="var(--color-magenta-bloom-950)"
              stroke="var(--color-neon-ice-300)"
              strokeWidth="2"
            />
            <ellipse
              cx="30"
              cy="9"
              rx="18"
              ry="3"
              fill="var(--color-magenta-bloom-700)"
              opacity="0.6"
            />
          </svg>
        </motion.div>

        <div className="relative flex flex-col items-center gap-2 md:gap-3">
          <WordRow words={row1} offset={0} />
          <WordRow words={row2} offset={row1.length} />
        </div>

        <motion.div
          variants={sticker}
          className="pointer-events-none absolute right-2 -bottom-4 md:right-6 md:-bottom-2"
        >
          <div className="rounded-full border-4 border-magenta-bloom-900 bg-yellow-green-400 px-4 py-2 text-lg md:text-xl font-black uppercase tracking-tight text-magenta-bloom-900 shadow-[5px_5px_0_0_var(--color-magenta-bloom-900)]">
            Game On!
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
