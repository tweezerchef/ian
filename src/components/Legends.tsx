"use client";

import { motion, type Variants } from "motion/react";

type Player = {
  number: string;
  first: string;
  last: string;
  nickname: string;
  team: string;
  stat: { label: string; value: string };
  fact: string;
  accent: "magenta" | "yellow" | "ice" | "lilac";
  tilt: number;
};

const players: Player[] = [
  {
    number: "99",
    first: "Wayne",
    last: "Gretzky",
    nickname: "The Great One",
    team: "Edmonton Oilers",
    stat: { label: "Career Points", value: "2,857" },
    fact: "The only player whose jersey number is retired across the ENTIRE league. Nobody else gets to wear 99.",
    accent: "magenta",
    tilt: -3,
  },
  {
    number: "8",
    first: "Alex",
    last: "Ovechkin",
    nickname: "The Great 8",
    team: "Washington Capitals",
    stat: { label: "Career Goals", value: "897" },
    fact: "Passed Gretzky in 2025 to become the all-time goals leader. People said it could never happen.",
    accent: "yellow",
    tilt: 2.5,
  },
  {
    number: "97",
    first: "Connor",
    last: "McDavid",
    nickname: "McJesus",
    team: "Edmonton Oilers",
    stat: { label: "Top Speed", value: "24.61 mph" },
    fact: "Probably the fastest skater alive. Goes from blue line to blue line before most players blink.",
    accent: "ice",
    tilt: -2,
  },
  {
    number: "87",
    first: "Sidney",
    last: "Crosby",
    nickname: "Sid the Kid",
    team: "Pittsburgh Penguins",
    stat: { label: "Stanley Cups", value: "3" },
    fact: "Scored the gold-medal goal for Canada at the 2010 Olympics. They call it the Golden Goal.",
    accent: "lilac",
    tilt: 3,
  },
  {
    number: "4",
    first: "Bobby",
    last: "Orr",
    nickname: "Number Four",
    team: "Boston Bruins",
    stat: { label: "Norris Trophies", value: "8" },
    fact: "Changed hockey forever by being a defenseman who could SCORE. The famous flying-goal photo is him.",
    accent: "yellow",
    tilt: -2,
  },
  {
    number: "66",
    first: "Mario",
    last: "Lemieux",
    nickname: "Le Magnifique",
    team: "Pittsburgh Penguins",
    stat: { label: "Career Points", value: "1,723" },
    fact: "Beat cancer in the middle of his career and came back to win more Cups. Pure giant of the game.",
    accent: "magenta",
    tilt: 2,
  },
];

const accentMap: Record<
  Player["accent"],
  {
    cardBg: string;
    cardBorder: string;
    nameText: string;
    numText: string;
    numStroke: string;
    pillBg: string;
    pillText: string;
    statBg: string;
    statValue: string;
    statLabel: string;
    bodyText: string;
    shadow: string;
    hoverShadow: string;
    stripe: string;
  }
> = {
  magenta: {
    cardBg: "bg-magenta-bloom-500",
    cardBorder: "border-magenta-bloom-950",
    nameText: "text-neon-ice-50",
    numText: "text-magenta-bloom-700",
    numStroke: "[text-shadow:0_4px_0_var(--color-magenta-bloom-950)]",
    pillBg: "bg-yellow-green-400",
    pillText: "text-magenta-bloom-950",
    statBg: "bg-magenta-bloom-900",
    statValue: "text-yellow-green-300",
    statLabel: "text-magenta-bloom-200",
    bodyText: "text-magenta-bloom-50",
    shadow: "shadow-[8px_8px_0_0_var(--color-magenta-bloom-950)]",
    hoverShadow: "group-hover:shadow-[14px_14px_0_0_var(--color-yellow-green-400)]",
    stripe: "from-yellow-green-400 via-neon-ice-300 to-yellow-green-400",
  },
  yellow: {
    cardBg: "bg-yellow-green-400",
    cardBorder: "border-magenta-bloom-950",
    nameText: "text-magenta-bloom-950",
    numText: "text-yellow-green-200",
    numStroke: "[text-shadow:0_4px_0_var(--color-magenta-bloom-950)]",
    pillBg: "bg-magenta-bloom-500",
    pillText: "text-neon-ice-50",
    statBg: "bg-magenta-bloom-950",
    statValue: "text-yellow-green-300",
    statLabel: "text-yellow-green-100",
    bodyText: "text-magenta-bloom-950",
    shadow: "shadow-[8px_8px_0_0_var(--color-magenta-bloom-950)]",
    hoverShadow: "group-hover:shadow-[14px_14px_0_0_var(--color-neon-ice-300)]",
    stripe: "from-magenta-bloom-500 via-neon-ice-300 to-magenta-bloom-500",
  },
  ice: {
    cardBg: "bg-neon-ice-300",
    cardBorder: "border-icy-blue-950",
    nameText: "text-icy-blue-950",
    numText: "text-neon-ice-100",
    numStroke: "[text-shadow:0_4px_0_var(--color-icy-blue-950)]",
    pillBg: "bg-magenta-bloom-500",
    pillText: "text-neon-ice-50",
    statBg: "bg-icy-blue-950",
    statValue: "text-neon-ice-200",
    statLabel: "text-neon-ice-300",
    bodyText: "text-icy-blue-900",
    shadow: "shadow-[8px_8px_0_0_var(--color-icy-blue-950)]",
    hoverShadow: "group-hover:shadow-[14px_14px_0_0_var(--color-magenta-bloom-500)]",
    stripe: "from-magenta-bloom-500 via-yellow-green-400 to-magenta-bloom-500",
  },
  lilac: {
    cardBg: "bg-lilac-300",
    cardBorder: "border-magenta-bloom-950",
    nameText: "text-magenta-bloom-950",
    numText: "text-lilac-100",
    numStroke: "[text-shadow:0_4px_0_var(--color-magenta-bloom-950)]",
    pillBg: "bg-magenta-bloom-700",
    pillText: "text-neon-ice-50",
    statBg: "bg-magenta-bloom-950",
    statValue: "text-yellow-green-300",
    statLabel: "text-lilac-200",
    bodyText: "text-magenta-bloom-950",
    shadow: "shadow-[8px_8px_0_0_var(--color-magenta-bloom-950)]",
    hoverShadow: "group-hover:shadow-[14px_14px_0_0_var(--color-yellow-green-400)]",
    stripe: "from-yellow-green-400 via-magenta-bloom-500 to-yellow-green-400",
  },
};

const container: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 80, scale: 0.8, rotate: 0 },
  shown: (tilt: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    rotate: tilt,
    transition: { type: "spring", stiffness: 140, damping: 16 },
  }),
};

const headlineWord: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.7 },
  shown: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 180, damping: 14 } },
};

export function Legends() {
  return (
    <section className="relative z-10 mx-auto max-w-6xl px-6 pt-2 pb-6 md:pt-3 md:pb-8">
      <motion.div
        initial="hidden"
        whileInView="shown"
        viewport={{ once: false, amount: 0.4 }}
        variants={container}
        className="mb-4 flex flex-col items-center text-center"
      >
        <motion.span
          variants={headlineWord}
          className="inline-flex items-center gap-2 rounded-full border-2 border-magenta-bloom-400 bg-magenta-bloom-400/10 px-3 py-0.5 text-xs font-bold uppercase tracking-widest text-magenta-bloom-300"
        >
          <span className="h-2 w-2 rounded-full bg-magenta-bloom-400 animate-pulse" />
          Hall of Fame
        </motion.span>

        <h2 className="mt-2 flex flex-wrap justify-center gap-x-3 gap-y-0 font-black uppercase leading-[0.85] tracking-tight text-4xl md:text-5xl lg:text-6xl">
          <motion.span variants={headlineWord} className="inline-block -rotate-2 text-neon-ice-50">
            Legends
          </motion.span>
          <motion.span variants={headlineWord} className="inline-block rotate-1 text-lilac-300 text-2xl md:text-3xl lg:text-4xl self-end">
            of the
          </motion.span>
          <motion.span
            variants={headlineWord}
            className="inline-block -rotate-1 text-yellow-green-400 [text-shadow:0_5px_0_var(--color-magenta-bloom-950)]"
          >
            Ice
          </motion.span>
        </h2>

        <motion.p
          variants={headlineWord}
          className="mt-2 max-w-xl text-sm md:text-base font-semibold text-neon-ice-100/85"
        >
          The names every hockey fan knows by heart.
        </motion.p>
      </motion.div>

      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 md:gap-4 max-w-5xl mx-auto">
        {players.map((p) => {
          const a = accentMap[p.accent];
          return (
            <motion.li
              key={`${p.first}-${p.last}`}
              custom={p.tilt}
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
              className={`group relative ${a.shadow} ${a.hoverShadow} transition-shadow duration-200 rounded-3xl border-4 ${a.cardBorder} ${a.cardBg} overflow-hidden`}
            >
              <div className={`h-1.5 w-full bg-gradient-to-r ${a.stripe}`} />

              <div className="relative px-4 pt-2 pb-3">
                <div className="flex items-start justify-between gap-2">
                  <span
                    className={`inline-flex items-center rounded-full border-2 ${a.cardBorder} ${a.pillBg} ${a.pillText} px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest`}
                  >
                    {p.nickname}
                  </span>
                  <span
                    aria-hidden
                    className={`pointer-events-none font-black leading-none ${a.numText} ${a.numStroke} text-5xl md:text-6xl select-none -mr-1 -mt-1`}
                  >
                    {p.number}
                  </span>
                </div>

                <h3 className={`mt-1 font-black uppercase tracking-tight leading-[0.9] ${a.nameText}`}>
                  <span className="block text-lg md:text-xl">{p.first}</span>
                  <span className="block text-xl md:text-2xl">{p.last}</span>
                </h3>

                <p
                  className={`mt-1 text-[11px] md:text-xs font-bold uppercase tracking-wider opacity-80 ${a.nameText}`}
                >
                  {p.team}
                </p>

                <div
                  className={`mt-2 flex items-center justify-between gap-3 rounded-xl border-2 ${a.cardBorder} ${a.statBg} px-3 py-1.5`}
                >
                  <span
                    className={`text-[10px] font-black uppercase tracking-widest ${a.statLabel}`}
                  >
                    {p.stat.label}
                  </span>
                  <span className={`text-lg md:text-xl font-black ${a.statValue}`}>
                    {p.stat.value}
                  </span>
                </div>

                <p className={`mt-1.5 text-xs md:text-sm leading-snug font-semibold ${a.bodyText}`}>
                  {p.fact}
                </p>
              </div>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}
