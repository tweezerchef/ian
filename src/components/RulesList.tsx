"use client";

import { motion, type Variants } from "motion/react";

type Rule = {
  num: string;
  title: string;
  body: string;
  accent: "magenta" | "yellow" | "ice" | "lilac";
  tilt: number;
  icon: "stick" | "line" | "puck" | "box" | "clock" | "skate";
};

const rules: Rule[] = [
  {
    num: "01",
    title: "No High Sticks",
    body: "Keep your stick BELOW your shoulders. Swing too high and you're heading to the box.",
    accent: "magenta",
    tilt: -2,
    icon: "stick",
  },
  {
    num: "02",
    title: "Offsides!",
    body: "The puck has to cross the blue line FIRST. Skate in too early and the whistle blows.",
    accent: "yellow",
    tilt: 2,
    icon: "line",
  },
  {
    num: "03",
    title: "No Icing",
    body: "You can't blast the puck from your own half all the way past the other team's goal line.",
    accent: "ice",
    tilt: -1.5,
    icon: "puck",
  },
  {
    num: "04",
    title: "Penalty Box",
    body: "Minor = 2 minutes. Double minor = 4 (usually means blood). Major = 5 for dangerous fouls. Misconduct = 10.",
    accent: "lilac",
    tilt: 1.5,
    icon: "box",
  },
  {
    num: "05",
    title: "Three Periods",
    body: "A game is THREE 20-minute periods — not quarters, not halves. Hockey is its own thing.",
    accent: "yellow",
    tilt: -2,
    icon: "clock",
  },
  {
    num: "06",
    title: "No Kicking Goals",
    body: "You can knock the puck with your skate, but you can't kick it into the net. Stick only!",
    accent: "magenta",
    tilt: 2,
    icon: "skate",
  },
];

const accentMap: Record<
  Rule["accent"],
  {
    cardBg: string;
    cardBorder: string;
    titleText: string;
    numText: string;
    numBg: string;
    bodyText: string;
    shadow: string;
    hoverShadow: string;
  }
> = {
  magenta: {
    cardBg: "bg-magenta-bloom-500",
    cardBorder: "border-magenta-bloom-900",
    titleText: "text-neon-ice-50",
    numText: "text-magenta-bloom-900",
    numBg: "bg-yellow-green-400",
    bodyText: "text-magenta-bloom-50",
    shadow: "shadow-[8px_8px_0_0_var(--color-magenta-bloom-900)]",
    hoverShadow: "hover:shadow-[12px_12px_0_0_var(--color-yellow-green-400)]",
  },
  yellow: {
    cardBg: "bg-yellow-green-400",
    cardBorder: "border-magenta-bloom-900",
    titleText: "text-magenta-bloom-900",
    numText: "text-yellow-green-100",
    numBg: "bg-magenta-bloom-500",
    bodyText: "text-magenta-bloom-900",
    shadow: "shadow-[8px_8px_0_0_var(--color-magenta-bloom-900)]",
    hoverShadow: "hover:shadow-[12px_12px_0_0_var(--color-neon-ice-300)]",
  },
  ice: {
    cardBg: "bg-neon-ice-300",
    cardBorder: "border-icy-blue-900",
    titleText: "text-icy-blue-950",
    numText: "text-neon-ice-100",
    numBg: "bg-icy-blue-800",
    bodyText: "text-icy-blue-900",
    shadow: "shadow-[8px_8px_0_0_var(--color-icy-blue-900)]",
    hoverShadow: "hover:shadow-[12px_12px_0_0_var(--color-magenta-bloom-500)]",
  },
  lilac: {
    cardBg: "bg-lilac-300",
    cardBorder: "border-magenta-bloom-900",
    titleText: "text-magenta-bloom-950",
    numText: "text-lilac-100",
    numBg: "bg-magenta-bloom-700",
    bodyText: "text-magenta-bloom-900",
    shadow: "shadow-[8px_8px_0_0_var(--color-magenta-bloom-900)]",
    hoverShadow: "hover:shadow-[12px_12px_0_0_var(--color-yellow-green-400)]",
  },
};

const container: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const card: Variants = {
  hidden: { opacity: 0, y: 60, scale: 0.85, rotate: 0 },
  shown: (tilt: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    rotate: tilt,
    transition: { type: "spring", stiffness: 220, damping: 14 },
  }),
};

function RuleIcon({ kind }: { kind: Rule["icon"] }) {
  const common = {
    width: 28,
    height: 28,
    viewBox: "0 0 32 32",
    xmlns: "http://www.w3.org/2000/svg",
    "aria-hidden": true as const,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (kind) {
    case "stick":
      return (
        <svg {...common}>
          <path d="M4 28 L24 8" />
          <path d="M22 6 L28 12 L26 14 L20 8 Z" fill="currentColor" />
        </svg>
      );
    case "line":
      return (
        <svg {...common}>
          <path d="M4 16 L28 16" strokeDasharray="3 3" />
          <circle cx="10" cy="16" r="3" fill="currentColor" stroke="none" />
          <path d="M22 10 L28 16 L22 22" />
        </svg>
      );
    case "puck":
      return (
        <svg {...common}>
          <ellipse cx="16" cy="20" rx="10" ry="3" fill="currentColor" />
          <ellipse cx="16" cy="14" rx="10" ry="3" />
          <path d="M6 14 L6 20" />
          <path d="M26 14 L26 20" />
        </svg>
      );
    case "box":
      return (
        <svg {...common}>
          <rect x="5" y="8" width="22" height="18" rx="2" />
          <path d="M5 14 L27 14" />
          <path d="M11 14 L11 26" />
          <path d="M21 14 L21 26" />
        </svg>
      );
    case "clock":
      return (
        <svg {...common}>
          <circle cx="16" cy="17" r="10" />
          <path d="M16 11 L16 17 L20 19" />
          <path d="M12 4 L20 4" />
        </svg>
      );
    case "skate":
      return (
        <svg {...common}>
          <path d="M6 10 L6 18 Q6 22 10 22 L24 22 Q28 22 28 18 L24 16 L20 14 L18 10 L14 10 Z" />
          <path d="M5 26 L29 26" />
          <path d="M9 22 L9 26" />
          <path d="M19 22 L19 26" />
        </svg>
      );
  }
}

export function RulesList() {
  return (
    <section className="relative z-10 mx-auto max-w-6xl px-6 pt-1 pb-6 md:pb-8">
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.6 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="mx-auto mt-0 mb-3 max-w-xl text-center text-sm md:text-base font-semibold text-neon-ice-100/85"
      >
        Six things to know before you watch the games.
      </motion.p>

      <motion.ul
        initial="hidden"
        whileInView="shown"
        viewport={{ once: false, amount: 0.15 }}
        variants={container}
        className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 md:gap-4"
      >
        {rules.map((r) => {
          const a = accentMap[r.accent];
          return (
            <motion.li
              key={r.num}
              custom={r.tilt}
              variants={card}
              whileHover={{
                scale: 1.04,
                rotate: 0,
                transition: { type: "spring", stiffness: 320, damping: 14 },
              }}
              whileTap={{ scale: 0.97 }}
              className={`group relative rounded-2xl border-4 ${a.cardBorder} ${a.cardBg} ${a.shadow} ${a.hoverShadow} transition-shadow duration-200 p-4 md:p-5`}
            >
              <div className="flex items-start justify-between gap-2">
                <span
                  className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-4 ${a.cardBorder} ${a.numBg} ${a.numText} font-black text-base shadow-[3px_3px_0_0_var(--color-magenta-bloom-900)] -rotate-6 group-hover:rotate-3 transition-transform duration-200`}
                >
                  {r.num}
                </span>
                <span className={`${a.titleText} opacity-80`}>
                  <RuleIcon kind={r.icon} />
                </span>
              </div>

              <h3
                className={`mt-2 font-black uppercase tracking-tight leading-none text-xl md:text-2xl ${a.titleText}`}
              >
                {r.title}
              </h3>

              <p
                className={`mt-1.5 text-sm md:text-[15px] leading-snug font-semibold ${a.bodyText}`}
              >
                {r.body}
              </p>
            </motion.li>
          );
        })}
      </motion.ul>
    </section>
  );
}
