"use client";

import { useState } from "react";
import { motion, type Variants } from "motion/react";
import { MiniHockeyModal } from "./MiniHockeyModal";
import { LeaderboardModal } from "./LeaderboardModal";

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
    x: 70 * c.side,
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
    transition: { type: "spring", stiffness: 170, damping: 12 },
  }),
};

const sticker: Variants = {
  hidden: { opacity: 0, scale: 0, rotate: 60 },
  shown: {
    opacity: 1,
    scale: 1,
    rotate: -8,
    transition: { type: "spring", stiffness: 190, damping: 11, delay: 1.2 },
  },
};

const stickerLeft: Variants = {
  hidden: { opacity: 0, scale: 0, rotate: -60 },
  shown: {
    opacity: 1,
    scale: 1,
    rotate: 6,
    transition: { type: "spring", stiffness: 190, damping: 11, delay: 1.35 },
  },
};

const puck: Variants = {
  hidden: { opacity: 0, y: -180, rotate: 0 },
  shown: {
    opacity: 1,
    y: 0,
    rotate: -420,
    transition: { type: "spring", stiffness: 100, damping: 10, delay: 0.85 },
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
    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 md:gap-x-10 lg:gap-x-12">
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
  const [gameOpen, setGameOpen] = useState(false);
  const [boardOpen, setBoardOpen] = useState(false);
  return (
    <section className="relative pt-2 pb-2 md:pt-3 md:pb-2">
      <motion.div
        initial="hidden"
        whileInView="shown"
        viewport={{ once: false, amount: 0.4 }}
        variants={container}
        className="relative mx-auto max-w-6xl px-6"
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
            viewport={{ once: false, amount: 0.4 }}
            transition={{ duration: 0.8, delay: s.delay, ease: "backOut" }}
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

        <div className="relative flex flex-col items-center gap-1 md:gap-1.5">
          <WordRow words={row1} offset={0} />
          <WordRow words={row2} offset={row1.length} />
        </div>

        <motion.div
          variants={stickerLeft}
          className="absolute left-2 -bottom-8 md:left-6 md:-bottom-6"
        >
          <motion.button
            type="button"
            onClick={() => setBoardOpen(true)}
            aria-label="View leaderboard"
            animate={{
              rotate: [0, -3, 0, -3, 0],
              scale: [1, 1.06, 1, 1.06, 1],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2.1,
            }}
            className="relative inline-flex cursor-pointer items-center gap-2 rounded-full border-4 border-magenta-bloom-900 bg-neon-ice-400 px-5 py-2 text-lg md:text-xl font-black uppercase tracking-tight text-magenta-bloom-900 shadow-[5px_5px_0_0_var(--color-magenta-bloom-900)] transition-transform hover:scale-110 hover:bg-neon-ice-300 active:translate-y-1 active:translate-x-1 active:shadow-[2px_2px_0_0_var(--color-magenta-bloom-900)]"
          >
            <svg
              className="h-5 w-5 md:h-6 md:w-6"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden
            >
              <path d="M3 21h4V10H3v11zm6 0h4V3H9v18zm6 0h4V14h-4v7z" />
            </svg>
            Top Shooters
            <span className="pointer-events-none absolute -left-2 -top-2 flex h-5 w-5 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-yellow-green-400 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-yellow-green-400 border border-magenta-bloom-900" />
            </span>
          </motion.button>
          <div className="mt-1.5 text-center text-[10px] md:text-xs font-black uppercase tracking-widest text-neon-ice-300">
            See the board
          </div>
        </motion.div>

        <motion.div
          variants={sticker}
          className="absolute right-2 -bottom-8 md:right-6 md:-bottom-6"
        >
          <motion.button
            type="button"
            onClick={() => setGameOpen(true)}
            aria-label="Open mini hockey game"
            animate={{
              rotate: [0, 3, 0, 3, 0],
              scale: [1, 1.06, 1, 1.06, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.8,
            }}
            className="relative inline-flex cursor-pointer items-center gap-2 rounded-full border-4 border-magenta-bloom-900 bg-yellow-green-400 px-5 py-2 text-lg md:text-xl font-black uppercase tracking-tight text-magenta-bloom-900 shadow-[5px_5px_0_0_var(--color-magenta-bloom-900)] transition-transform hover:scale-110 hover:bg-yellow-green-300 active:translate-y-1 active:translate-x-1 active:shadow-[2px_2px_0_0_var(--color-magenta-bloom-900)]"
          >
            <svg
              className="h-5 w-5 md:h-6 md:w-6"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden
            >
              <path d="M8 5v14l11-7z" />
            </svg>
            Game On!
            <span className="pointer-events-none absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-magenta-bloom-400 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-magenta-bloom-500 border border-magenta-bloom-900" />
            </span>
          </motion.button>
          <div className="mt-1.5 text-center text-[10px] md:text-xs font-black uppercase tracking-widest text-yellow-green-300">
            Tap to play
          </div>
        </motion.div>
      </motion.div>

      <MiniHockeyModal open={gameOpen} onClose={() => setGameOpen(false)} />
      <LeaderboardModal open={boardOpen} onClose={() => setBoardOpen(false)} />
    </section>
  );
}
