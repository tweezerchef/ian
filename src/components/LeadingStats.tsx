"use client";

import { motion, type Variants } from "motion/react";

type StatRecord = {
  category: string;
  number: string;
  player: string;
  team: string;
  detail: string;
  accent: "magenta" | "yellow" | "ice" | "lilac";
  icon: "trophy" | "puck" | "assist" | "gloves" | "whistle" | "calendar";
  tilt: number;
};

const records: StatRecord[] = [
  {
    category: "Most MVPs",
    number: "9",
    player: "Wayne Gretzky",
    team: "Oilers / Kings",
    detail: "Won the Hart Trophy as the league's MVP nine times — more than any other player.",
    accent: "magenta",
    icon: "trophy",
    tilt: -2,
  },
  {
    category: "Most Assists",
    number: "1,963",
    player: "Wayne Gretzky",
    team: "Oilers / Kings / Rangers",
    detail: "More assists than anyone else has TOTAL career points.",
    accent: "yellow",
    icon: "assist",
    tilt: 2,
  },
  {
    category: "Most Stanley Cups",
    number: "11",
    player: "Henri Richard",
    team: "Montreal Canadiens",
    detail: "Won 11 Stanley Cups in 20 seasons. No player has ever lifted the Cup more times.",
    accent: "ice",
    icon: "trophy",
    tilt: -1.5,
  },
  {
    category: "Most Penalty Minutes",
    number: "3,966",
    player: "Tiger Williams",
    team: "Maple Leafs / Canucks",
    detail: "That's over 66 HOURS in the penalty box. Six full work-days of sitting down.",
    accent: "lilac",
    icon: "whistle",
    tilt: 1.5,
  },
  {
    category: "Most Fights",
    number: "333",
    player: "Tie Domi",
    team: "Toronto Maple Leafs",
    detail: "Career enforcer. Dropped the gloves more times than anyone else in NHL history.",
    accent: "magenta",
    icon: "gloves",
    tilt: 2,
  },
  {
    category: "Most Games Played",
    number: "1,779",
    player: "Patrick Marleau",
    team: "San Jose Sharks",
    detail: "23 seasons of pro hockey. The iron man of the modern era.",
    accent: "yellow",
    icon: "calendar",
    tilt: -2,
  },
];

const accentMap: Record<
  StatRecord["accent"],
  {
    cardBg: string;
    cardBorder: string;
    bandBg: string;
    bandText: string;
    numberText: string;
    numberShadow: string;
    playerText: string;
    teamText: string;
    detailText: string;
    iconBg: string;
    iconText: string;
    shadow: string;
    hoverShadow: string;
  }
> = {
  magenta: {
    cardBg: "bg-magenta-bloom-950",
    cardBorder: "border-magenta-bloom-400",
    bandBg: "bg-magenta-bloom-500",
    bandText: "text-neon-ice-50",
    numberText: "text-yellow-green-400",
    numberShadow: "[text-shadow:0_6px_0_var(--color-magenta-bloom-900),0_0_24px_var(--color-yellow-green-500)]",
    playerText: "text-neon-ice-50",
    teamText: "text-magenta-bloom-200",
    detailText: "text-magenta-bloom-100",
    iconBg: "bg-yellow-green-400",
    iconText: "text-magenta-bloom-950",
    shadow: "shadow-[8px_8px_0_0_var(--color-magenta-bloom-500)]",
    hoverShadow: "group-hover:shadow-[14px_14px_0_0_var(--color-yellow-green-400)]",
  },
  yellow: {
    cardBg: "bg-magenta-bloom-950",
    cardBorder: "border-yellow-green-400",
    bandBg: "bg-yellow-green-400",
    bandText: "text-magenta-bloom-950",
    numberText: "text-yellow-green-300",
    numberShadow: "[text-shadow:0_6px_0_var(--color-magenta-bloom-900),0_0_24px_var(--color-yellow-green-500)]",
    playerText: "text-neon-ice-50",
    teamText: "text-yellow-green-200",
    detailText: "text-yellow-green-100",
    iconBg: "bg-magenta-bloom-500",
    iconText: "text-neon-ice-50",
    shadow: "shadow-[8px_8px_0_0_var(--color-yellow-green-400)]",
    hoverShadow: "group-hover:shadow-[14px_14px_0_0_var(--color-magenta-bloom-500)]",
  },
  ice: {
    cardBg: "bg-icy-blue-950",
    cardBorder: "border-neon-ice-300",
    bandBg: "bg-neon-ice-300",
    bandText: "text-icy-blue-950",
    numberText: "text-neon-ice-200",
    numberShadow: "[text-shadow:0_6px_0_var(--color-icy-blue-900),0_0_24px_var(--color-neon-ice-400)]",
    playerText: "text-neon-ice-50",
    teamText: "text-neon-ice-300",
    detailText: "text-neon-ice-100",
    iconBg: "bg-magenta-bloom-500",
    iconText: "text-neon-ice-50",
    shadow: "shadow-[8px_8px_0_0_var(--color-neon-ice-400)]",
    hoverShadow: "group-hover:shadow-[14px_14px_0_0_var(--color-magenta-bloom-500)]",
  },
  lilac: {
    cardBg: "bg-magenta-bloom-950",
    cardBorder: "border-lilac-300",
    bandBg: "bg-lilac-300",
    bandText: "text-magenta-bloom-950",
    numberText: "text-lilac-200",
    numberShadow: "[text-shadow:0_6px_0_var(--color-magenta-bloom-900),0_0_24px_var(--color-lilac-400)]",
    playerText: "text-neon-ice-50",
    teamText: "text-lilac-200",
    detailText: "text-lilac-100",
    iconBg: "bg-yellow-green-400",
    iconText: "text-magenta-bloom-950",
    shadow: "shadow-[8px_8px_0_0_var(--color-lilac-400)]",
    hoverShadow: "group-hover:shadow-[14px_14px_0_0_var(--color-yellow-green-400)]",
  },
};

const container: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 70, scale: 0.85, rotate: 0 },
  shown: (tilt: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    rotate: tilt,
    transition: { type: "spring", stiffness: 150, damping: 16 },
  }),
};

const numberPop: Variants = {
  hidden: { scale: 0.5, opacity: 0 },
  shown: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring", stiffness: 190, damping: 13, delay: 0.18 },
  },
};

const headlineWord: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.7 },
  shown: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 180, damping: 14 } },
};

function StatIcon({ kind }: { kind: StatRecord["icon"] }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
    xmlns: "http://www.w3.org/2000/svg",
  };
  switch (kind) {
    case "trophy":
      return (
        <svg {...common}>
          <path d="M7 4 H17 V10 A5 5 0 0 1 7 10 Z" />
          <path d="M5 5 H3 V8 A3 3 0 0 0 7 10" />
          <path d="M19 5 H21 V8 A3 3 0 0 1 17 10" />
          <path d="M9 14 H15 V20 H9 Z" />
        </svg>
      );
    case "puck":
      return (
        <svg {...common}>
          <ellipse cx="12" cy="9" rx="8" ry="2.5" />
          <ellipse cx="12" cy="15" rx="8" ry="2.5" fill="currentColor" />
          <path d="M4 9 V15" />
          <path d="M20 9 V15" />
        </svg>
      );
    case "assist":
      return (
        <svg {...common}>
          <circle cx="5.5" cy="5" r="2" />
          <path d="M5.5 7 V11" />
          <path d="M3.5 14 L5.5 11 L7.5 14" />
          <path d="M5.5 9 L11.5 17" />
          <circle cx="18.5" cy="5" r="2" />
          <path d="M18.5 7 V11" />
          <path d="M16.5 14 L18.5 11 L20.5 14" />
          <path d="M18.5 9 L12.5 17" />
          <circle cx="12" cy="18.5" r="1.6" fill="currentColor" />
        </svg>
      );
    case "gloves":
      return (
        <svg {...common}>
          <path d="M6 4 V14 Q6 18 10 18 H14 Q18 18 18 14 V9" />
          <path d="M9 14 V4" />
          <path d="M12 14 V5" />
          <path d="M15 14 V7" />
          <path d="M6 18 V21 H18 V18" />
        </svg>
      );
    case "whistle":
      return (
        <svg {...common}>
          <circle cx="9" cy="13" r="5" />
          <path d="M13.5 11 L21 8 L20 14 L14 14" />
          <path d="M9 8 V4" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M3 10 H21" />
          <path d="M8 3 V7" />
          <path d="M16 3 V7" />
          <circle cx="12" cy="15" r="1.5" fill="currentColor" stroke="none" />
        </svg>
      );
  }
}

export function LeadingStats() {
  return (
    <section className="relative z-10 mx-auto max-w-6xl px-6 pt-4 pb-10 md:pt-6 md:pb-12">
      <motion.div
        initial="hidden"
        whileInView="shown"
        viewport={{ once: false, amount: 0.4 }}
        variants={container}
        className="mb-5 flex flex-col items-center text-center"
      >
        <motion.span
          variants={headlineWord}
          className="inline-flex items-center gap-2 rounded-full border-2 border-yellow-green-400 bg-yellow-green-400/10 px-3 py-0.5 text-xs font-bold uppercase tracking-widest text-yellow-green-300"
        >
          <span className="h-2 w-2 rounded-full bg-yellow-green-400 animate-pulse" />
          Record Book
        </motion.span>

        <h2 className="mt-2 flex flex-wrap justify-center gap-x-3 gap-y-0 font-black uppercase leading-[0.85] tracking-tight text-3xl md:text-5xl lg:text-6xl">
          <motion.span variants={headlineWord} className="inline-block -rotate-2 text-neon-ice-50">
            All-Time
          </motion.span>
          <motion.span
            variants={headlineWord}
            className="inline-block rotate-1 text-magenta-bloom-400 [text-shadow:0_5px_0_var(--color-magenta-bloom-950)]"
          >
            Leaders
          </motion.span>
        </h2>

        <motion.p
          variants={headlineWord}
          className="mt-2 max-w-xl text-sm md:text-base font-semibold text-neon-ice-100/85"
        >
          The biggest numbers in the record book.
        </motion.p>
      </motion.div>

      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 md:gap-8 lg:gap-10 max-w-5xl mx-auto">
        {records.map((r) => {
          const a = accentMap[r.accent];
          return (
            <motion.li
              key={r.category}
              custom={r.tilt}
              variants={cardVariant}
              initial="hidden"
              whileInView="shown"
              viewport={{ once: false, amount: 0.4 }}
              whileHover={{
                rotate: 0,
                scale: 1.04,
                transition: { type: "spring", stiffness: 320, damping: 14 },
              }}
              whileTap={{ scale: 0.97 }}
              className={`group relative ${a.shadow} ${a.hoverShadow} transition-shadow duration-200 rounded-2xl border-4 ${a.cardBorder} ${a.cardBg} overflow-hidden`}
            >
              <div className={`flex items-center gap-2 ${a.bandBg} px-3 py-1.5`}>
                <span
                  className={`inline-flex h-6 w-6 items-center justify-center rounded-md ${a.iconBg} ${a.iconText}`}
                >
                  <StatIcon kind={r.icon} />
                </span>
                <span
                  className={`flex-1 text-[11px] md:text-xs font-black uppercase tracking-widest ${a.bandText}`}
                >
                  {r.category}
                </span>
              </div>

              <div className="relative px-4 pt-3 pb-4">
                <motion.div
                  variants={numberPop}
                  className={`text-center font-black leading-none ${a.numberText} ${a.numberShadow} text-5xl md:text-6xl`}
                >
                  {r.number}
                </motion.div>

                <div className="mt-3 text-center">
                  <div className={`font-black uppercase tracking-tight text-base md:text-lg ${a.playerText}`}>
                    {r.player}
                  </div>
                  <div className={`mt-0.5 text-[11px] md:text-xs font-bold uppercase tracking-wider ${a.teamText}`}>
                    {r.team}
                  </div>
                </div>

                <p className={`mt-2 text-center text-xs md:text-sm leading-snug font-semibold ${a.detailText}`}>
                  {r.detail}
                </p>
              </div>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}
