"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, type Variants } from "motion/react";

type Team = {
  id: string;
  name: string;
  category: string;
  bigStat: string;
  bigStatLabel: string;
  description: string;
  founded: number;
  cups: number;
  arena: string;
  signatureFact: string;
  funnyFact: string;
  homepage: string;
  logo: string;
  bannerBg: string;
  bannerText: string;
  softOnBanner: string;
  topStripe: string;
  tileBg: string;
  softOnTile: string;
  tileNumColor: string;
  accentBg: string;
  accentOn: string;
  shadowVar: string;
};

const teams: Team[] = [
  {
    id: "mtl",
    name: "Montreal Canadiens",
    category: "Most Cups Ever",
    bigStat: "23",
    bigStatLabel: "Stanley Cups",
    description:
      "Hockey's most decorated franchise. Founded in 1909, the Habs have lifted the Stanley Cup more times than any other team — by a wide margin.",
    founded: 1909,
    cups: 23,
    arena: "Bell Centre",
    signatureFact:
      "Won 5 Cups in a row from 1956 to 1960. No team has matched that streak since.",
    funnyFact:
      "Their mascot Youppi! is the only mascot in pro-sports history to switch leagues — he started as the Montreal Expos' baseball mascot before the Canadiens hired him in 2005.",
    homepage: "https://www.nhl.com/canadiens",
    logo: "MTL_dark.svg",
    bannerBg: "bg-magenta-bloom-500",
    bannerText: "text-neon-ice-50",
    softOnBanner: "text-neon-ice-100",
    topStripe: "bg-magenta-bloom-900",
    tileBg: "bg-magenta-bloom-900",
    softOnTile: "text-magenta-bloom-100",
    tileNumColor: "text-yellow-green-400",
    accentBg: "bg-yellow-green-400",
    accentOn: "text-magenta-bloom-950",
    shadowVar: "var(--color-magenta-bloom-950)",
  },
  {
    id: "tor",
    name: "Toronto Maple Leafs",
    category: "Most Loyal Fans",
    bigStat: "58",
    bigStatLabel: "Years of Waiting",
    description:
      "The Leafs haven't won the Cup since 1967 — and yet they pack the arena every single night. The most loyal fanbase in hockey, no contest.",
    founded: 1917,
    cups: 13,
    arena: "Scotiabank Arena",
    signatureFact:
      "If they ever win another Cup, downtown Toronto will literally never recover.",
    funnyFact:
      "The Leafs are one of the most valuable teams in ALL of sports — worth over 2 BILLION dollars — even though they haven't won a Cup in 58+ years.",
    homepage: "https://www.nhl.com/mapleleafs",
    logo: "TOR_dark.svg",
    bannerBg: "bg-icy-blue-700",
    bannerText: "text-neon-ice-50",
    softOnBanner: "text-icy-blue-100",
    topStripe: "bg-icy-blue-950",
    tileBg: "bg-icy-blue-950",
    softOnTile: "text-icy-blue-200",
    tileNumColor: "text-yellow-green-400",
    accentBg: "bg-yellow-green-400",
    accentOn: "text-icy-blue-950",
    shadowVar: "var(--color-icy-blue-950)",
  },
  {
    id: "bos",
    name: "Boston Bruins",
    category: "Best Season Ever",
    bigStat: "135",
    bigStatLabel: "Points (2022–23)",
    description:
      "Set the NHL record for most wins (65) and most points (135) in a single regular season. A wrecking ball from October to April.",
    founded: 1924,
    cups: 6,
    arena: "TD Garden",
    signatureFact:
      "They lost in the first round of the playoffs that year. Ouch.",
    funnyFact:
      "Their mascot Blades the Bruin once delivered a pizza to a fan's home as part of a promotion. He drove the whole way in full costume.",
    homepage: "https://www.nhl.com/bruins",
    logo: "BOS_dark.svg",
    bannerBg: "bg-yellow-green-400",
    bannerText: "text-magenta-bloom-950",
    softOnBanner: "text-magenta-bloom-900",
    topStripe: "bg-magenta-bloom-950",
    tileBg: "bg-magenta-bloom-950",
    softOnTile: "text-yellow-green-200",
    tileNumColor: "text-yellow-green-300",
    accentBg: "bg-magenta-bloom-500",
    accentOn: "text-neon-ice-50",
    shadowVar: "var(--color-magenta-bloom-950)",
  },
  {
    id: "det",
    name: "Detroit Red Wings",
    category: "Hockeytown",
    bigStat: "25",
    bigStatLabel: "Straight Playoff Years",
    description:
      "Made the playoffs 25 seasons in a row (1991–2016). Longest streak of any team across the four major North American pro sports.",
    founded: 1926,
    cups: 11,
    arena: "Little Caesars Arena",
    signatureFact:
      "Fans throw real octopuses on the ice during playoff games. It's a tradition that started in 1952.",
    funnyFact:
      "The octopus tradition started in 1952 because back then a team only needed 8 playoff wins for the Cup — one for each tentacle. It stuck even after the playoffs got longer.",
    homepage: "https://www.nhl.com/redwings",
    logo: "DET_centennial_dark.svg",
    bannerBg: "bg-magenta-bloom-700",
    bannerText: "text-neon-ice-50",
    softOnBanner: "text-magenta-bloom-100",
    topStripe: "bg-magenta-bloom-950",
    tileBg: "bg-magenta-bloom-950",
    softOnTile: "text-magenta-bloom-100",
    tileNumColor: "text-neon-ice-300",
    accentBg: "bg-neon-ice-300",
    accentOn: "text-magenta-bloom-950",
    shadowVar: "var(--color-magenta-bloom-950)",
  },
  {
    id: "edm",
    name: "Edmonton Oilers",
    category: "Most Star Power",
    bigStat: "97",
    bigStatLabel: "McDavid & Draisaitl",
    description:
      "The two best players on Earth wear the same jersey. Connor McDavid and Leon Draisaitl are a one-two punch nobody can match.",
    founded: 1972,
    cups: 5,
    arena: "Rogers Place",
    signatureFact:
      "Wayne Gretzky won 4 of his Cups here in the 1980s. The original dynasty city.",
    funnyFact:
      "Connor McDavid was clocked at 24.61 mph on ice during the NHL's fastest-skater contest. That's quicker than most cars roll through a school zone.",
    homepage: "https://www.nhl.com/oilers",
    logo: "EDM_dark.svg",
    bannerBg: "bg-lilac-600",
    bannerText: "text-neon-ice-50",
    softOnBanner: "text-lilac-100",
    topStripe: "bg-magenta-bloom-950",
    tileBg: "bg-magenta-bloom-950",
    softOnTile: "text-lilac-100",
    tileNumColor: "text-yellow-green-400",
    accentBg: "bg-yellow-green-400",
    accentOn: "text-magenta-bloom-950",
    shadowVar: "var(--color-magenta-bloom-950)",
  },
  {
    id: "fla",
    name: "Florida Panthers",
    category: "Newest Dynasty",
    bigStat: "2",
    bigStatLabel: "Cups in a Row",
    description:
      "Back-to-back Stanley Cup champions (2024, 2025). The new gold standard for tough, defense-first hockey.",
    founded: 1993,
    cups: 2,
    arena: "Amerant Bank Arena",
    signatureFact:
      "Fans throw plastic RATS on the ice when their team scores. (Yes, really.)",
    funnyFact:
      "After their first Cup win in 2024, fans tossed so many plastic rats during the celebration that arena workers had to bring out snow shovels to clear the ice.",
    homepage: "https://www.nhl.com/panthers",
    logo: "FLA_2425_dark.svg",
    bannerBg: "bg-icy-blue-900",
    bannerText: "text-neon-ice-50",
    softOnBanner: "text-icy-blue-100",
    topStripe: "bg-magenta-bloom-500",
    tileBg: "bg-icy-blue-950",
    softOnTile: "text-icy-blue-200",
    tileNumColor: "text-yellow-green-400",
    accentBg: "bg-yellow-green-400",
    accentOn: "text-magenta-bloom-950",
    shadowVar: "var(--color-magenta-bloom-950)",
  },
];

const headerContainer: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const headerItem: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.7 },
  shown: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 250, damping: 12 },
  },
};

const gridContainer: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};

const discDrop: Variants = {
  hidden: { opacity: 0, y: -80, scale: 0.6, rotate: -180 },
  shown: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotate: 0,
    transition: { type: "spring", stiffness: 180, damping: 14 },
  },
};

const backdropVariant: Variants = {
  hidden: { opacity: 0 },
  shown: { opacity: 1, transition: { duration: 0.2 } },
};

const modalVariant: Variants = {
  hidden: { opacity: 0, scale: 0.85, y: 30 },
  shown: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 240, damping: 18 },
  },
};

function Banner({
  team,
  index,
  onSelect,
}: {
  team: Team;
  index: number;
  onSelect: () => void;
}) {
  return (
    <motion.div variants={discDrop} className="flex flex-col items-center">
      <motion.button
        type="button"
        onClick={onSelect}
        aria-label={`Open details for ${team.name}`}
        animate={{
          y: [0, -4, 0, -4, 0],
          rotate: [-1.5, 1.5, -1.5],
        }}
        transition={{
          duration: 4.5 + index * 0.35,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        whileHover={{
          rotate: 10,
          scale: 1.08,
          transition: { type: "spring", stiffness: 280, damping: 14 },
        }}
        whileTap={{ scale: 0.94 }}
        style={{
          filter: `drop-shadow(8px 10px 0 ${team.shadowVar})`,
        }}
        className={`relative aspect-square w-full max-w-[240px] cursor-pointer rounded-full border-4 border-magenta-bloom-950 p-2 ${team.bannerBg}`}
      >
        <div
          className={`relative h-full w-full overflow-hidden rounded-full ${team.tileBg} flex items-center justify-center shadow-[inset_0_0_0_2px_var(--color-magenta-bloom-950)]`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/teamLogos/${team.logo}`}
            alt=""
            aria-hidden
            className="h-[78%] w-[78%] object-contain"
          />
        </div>

        <span
          className={`absolute -top-2 -right-2 inline-flex h-12 min-w-12 -rotate-12 items-center justify-center rounded-full border-4 border-magenta-bloom-950 px-2 ${team.accentBg} ${team.accentOn} shadow-[3px_3px_0_0_var(--color-magenta-bloom-950)]`}
        >
          <span className="font-black leading-none text-base">
            {team.bigStat}
          </span>
        </span>
      </motion.button>

      <div className="mt-5 max-w-[260px] text-center">
        <div className="text-xs md:text-sm font-black uppercase tracking-widest text-yellow-green-400">
          {team.category}
        </div>
        <div className="mt-1 font-black uppercase tracking-tight leading-[0.95] text-xl md:text-2xl text-neon-ice-50">
          {team.name}
        </div>
        <div className="mt-1.5 text-sm md:text-base font-bold uppercase tracking-wide text-neon-ice-100">
          {team.bigStatLabel}
        </div>
      </div>
    </motion.div>
  );
}

function TeamModal({ team, onClose }: { team: Team; onClose: () => void }) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="team-modal-title"
      variants={backdropVariant}
      initial="hidden"
      animate="shown"
      exit="hidden"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-magenta-bloom-950/85 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        variants={modalVariant}
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-lg overflow-hidden rounded-3xl border-4 border-magenta-bloom-950 ${team.bannerBg} shadow-[10px_10px_0_0_var(--color-magenta-bloom-950)] max-h-[92vh] overflow-y-auto`}
      >
        <div className={`h-3 w-full ${team.topStripe}`} />

        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className={`absolute right-4 top-5 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-magenta-bloom-950 ${team.tileBg} text-neon-ice-50 transition-transform hover:scale-110 active:scale-95`}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            aria-hidden
          >
            <path d="M6 6 L18 18" />
            <path d="M18 6 L6 18" />
          </svg>
        </button>

        <div
          className={`flex items-center justify-center border-b-4 border-magenta-bloom-950 px-6 py-5 ${team.tileBg}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/teamLogos/${team.logo}`}
            alt={`${team.name} logo`}
            className="h-24 md:h-28 object-contain"
          />
        </div>

        <div className="px-6 pt-5 pb-6 md:px-8 md:pt-6 md:pb-7">
          <div
            className={`text-xs font-black uppercase tracking-widest ${team.softOnBanner}`}
          >
            {team.category}
          </div>
          <h3
            id="team-modal-title"
            className={`mt-1 font-black uppercase tracking-tight leading-[0.9] text-3xl md:text-4xl ${team.bannerText}`}
          >
            {team.name}
          </h3>

          <p
            className={`mt-4 text-sm md:text-base leading-snug font-semibold ${team.bannerText}`}
          >
            {team.description}
          </p>

          <div className="mt-5 grid grid-cols-3 gap-2">
            <div
              className={`rounded-xl border-2 border-magenta-bloom-950 ${team.tileBg} p-2 text-center`}
            >
              <div
                className={`text-[10px] font-black uppercase tracking-widest ${team.softOnTile}`}
              >
                Founded
              </div>
              <div
                className={`mt-0.5 font-black text-lg ${team.tileNumColor}`}
              >
                {team.founded}
              </div>
            </div>
            <div
              className={`rounded-xl border-2 border-magenta-bloom-950 ${team.tileBg} p-2 text-center`}
            >
              <div
                className={`text-[10px] font-black uppercase tracking-widest ${team.softOnTile}`}
              >
                Cups
              </div>
              <div
                className={`mt-0.5 font-black text-lg ${team.tileNumColor}`}
              >
                {team.cups}
              </div>
            </div>
            <div
              className={`rounded-xl border-2 border-magenta-bloom-950 ${team.tileBg} p-2 text-center`}
            >
              <div
                className={`text-[10px] font-black uppercase tracking-widest ${team.softOnTile}`}
              >
                Arena
              </div>
              <div
                className={`mt-0.5 font-black text-[11px] leading-tight ${team.tileNumColor}`}
              >
                {team.arena}
              </div>
            </div>
          </div>

          <div
            className={`mt-4 rounded-xl border-2 border-magenta-bloom-950 ${team.tileBg} p-3`}
          >
            <div
              className={`text-[10px] font-black uppercase tracking-widest ${team.softOnTile}`}
            >
              Why be a fan?
            </div>
            <p className={`mt-1 text-sm font-semibold text-neon-ice-50`}>
              {team.signatureFact}
            </p>
          </div>

          <div
            className={`mt-3 rounded-xl border-2 border-magenta-bloom-950 ${team.tileBg} p-3`}
          >
            <div
              className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${team.softOnTile}`}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M9 11h.01" />
                <path d="M15 11h.01" />
                <circle cx="12" cy="12" r="10" />
                <path d="M8 15c1.2 1.5 2.7 2 4 2s2.8-.5 4-2" />
              </svg>
              Funny Fact
            </div>
            <p className={`mt-1 text-sm font-semibold text-neon-ice-50`}>
              {team.funnyFact}
            </p>
          </div>

          <a
            href={team.homepage}
            target="_blank"
            rel="noopener noreferrer"
            className={`mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl border-4 border-magenta-bloom-950 ${team.accentBg} ${team.accentOn} px-4 py-3 text-base font-black uppercase tracking-tight shadow-[4px_4px_0_0_var(--color-magenta-bloom-950)] transition-transform hover:scale-[1.03] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0_0_var(--color-magenta-bloom-950)]`}
          >
            Visit Team Site
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M7 17 L17 7" />
              <path d="M9 7 H17 V15" />
            </svg>
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function TeamPicker() {
  const [selected, setSelected] = useState<Team | null>(null);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [selected]);

  return (
    <section className="relative z-10 mx-auto max-w-6xl px-6 pt-6 pb-12 md:pt-8 md:pb-16">
      <motion.div
        initial="hidden"
        whileInView="shown"
        viewport={{ once: false, amount: 0.3 }}
        variants={headerContainer}
        className="mb-8 flex flex-col items-center text-center"
      >
        <motion.span
          variants={headerItem}
          className="inline-flex items-center gap-2 rounded-full border-2 border-neon-ice-300 bg-neon-ice-300/10 px-3 py-0.5 text-xs font-bold uppercase tracking-widest text-neon-ice-300"
        >
          <span className="h-2 w-2 rounded-full bg-neon-ice-300 animate-pulse" />
          Pick a Side
        </motion.span>

        <h2 className="mt-3 flex flex-wrap items-end justify-center gap-x-3 gap-y-1 font-black uppercase leading-[0.85] tracking-tight">
          <motion.span
            variants={headerItem}
            className="inline-block -rotate-2 text-neon-ice-50 text-3xl md:text-5xl"
          >
            What Team
          </motion.span>
          <motion.span
            variants={headerItem}
            className="inline-block rotate-1 text-lilac-300 text-xl md:text-3xl"
          >
            to Be a
          </motion.span>
          <motion.span
            variants={headerItem}
            className="inline-block -rotate-1 text-yellow-green-400 [text-shadow:0_5px_0_var(--color-magenta-bloom-950)] text-3xl md:text-5xl"
          >
            Fan For
          </motion.span>
        </h2>

        <motion.p
          variants={headerItem}
          className="mt-3 max-w-xl text-sm md:text-base font-semibold text-neon-ice-100/85"
        >
          Six contenders for your loyalty. Tap a logo to learn more.
        </motion.p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="shown"
        viewport={{ once: false, amount: 0.15 }}
        variants={gridContainer}
        className="mx-auto grid max-w-5xl grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3"
      >
        {teams.map((t, i) => (
          <Banner
            key={t.id}
            team={t}
            index={i}
            onSelect={() => setSelected(t)}
          />
        ))}
      </motion.div>

      <AnimatePresence>
        {selected && (
          <TeamModal team={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
