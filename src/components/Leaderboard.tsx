"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "motion/react";

type Entry = {
  name: string;
  goals: number;
  shots: number;
  time: number;
  date: string;
};

async function fetchScores(): Promise<Entry[]> {
  try {
    const res = await fetch("/api/scores", { cache: "no-store" });
    if (!res.ok) return [];
    const data = (await res.json()) as { scores?: Entry[] };
    return Array.isArray(data.scores) ? data.scores : [];
  } catch {
    return [];
  }
}

function rowStyle(rank: number) {
  if (rank === 0)
    return "border-yellow-green-300 bg-yellow-green-400 text-magenta-bloom-900 shadow-[6px_6px_0_0_var(--color-magenta-bloom-900)]";
  if (rank === 1)
    return "border-neon-ice-200 bg-neon-ice-400 text-magenta-bloom-900 shadow-[5px_5px_0_0_var(--color-magenta-bloom-900)]";
  if (rank === 2)
    return "border-magenta-bloom-300 bg-magenta-bloom-500 text-neon-ice-50 shadow-[5px_5px_0_0_var(--color-magenta-bloom-900)]";
  return "border-magenta-bloom-700 bg-icy-blue-950/70 text-neon-ice-100";
}

function rankLabel(rank: number) {
  if (rank === 0) return "1st";
  if (rank === 1) return "2nd";
  if (rank === 2) return "3rd";
  return `#${rank + 1}`;
}

export function Leaderboard() {
  const [scores, setScores] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    const s = await fetchScores();
    setScores(s);
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    refresh();
    const onUpdate = () => refresh();
    window.addEventListener("scores-updated", onUpdate);
    window.addEventListener("focus", onUpdate);
    document.addEventListener("visibilitychange", onUpdate);
    return () => {
      window.removeEventListener("scores-updated", onUpdate);
      window.removeEventListener("focus", onUpdate);
      document.removeEventListener("visibilitychange", onUpdate);
    };
  }, [refresh]);

  return (
    <section
      id="leaderboard"
      className="relative scroll-mt-20 py-12 md:py-20"
    >
      <div className="mx-auto max-w-3xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ type: "spring", stiffness: 220, damping: 18 }}
          className="mb-6 flex items-end justify-between gap-4"
        >
          <div>
            <span className="inline-block rounded-full border-2 border-neon-ice-300 bg-neon-ice-400/10 px-3 py-1 text-[10px] md:text-xs font-bold uppercase tracking-widest text-neon-ice-300">
              Live scoreboard
            </span>
            <h2 className="mt-2 font-black uppercase leading-[0.9] tracking-tight text-4xl md:text-6xl text-yellow-green-300 [text-shadow:0_4px_0_var(--color-magenta-bloom-950)]">
              Top Shooters
            </h2>
          </div>
          <button
            type="button"
            onClick={refresh}
            disabled={refreshing}
            className="shrink-0 rounded-full border-2 border-yellow-green-400 bg-magenta-bloom-500 px-3 py-1 text-xs font-bold uppercase tracking-widest text-neon-ice-50 hover:bg-magenta-bloom-400 disabled:opacity-60"
          >
            {refreshing ? "..." : "Refresh"}
          </button>
        </motion.div>

        {loading && (
          <p className="rounded-2xl border-4 border-dashed border-magenta-bloom-700 bg-icy-blue-950/60 py-8 text-center text-lilac-300">
            Loading the scoreboard…
          </p>
        )}

        {!loading && scores.length === 0 && (
          <div className="rounded-2xl border-4 border-dashed border-yellow-green-400/50 bg-icy-blue-950/60 p-10 text-center">
            <p className="text-2xl font-black uppercase tracking-tight text-yellow-green-300">
              No scores yet!
            </p>
            <p className="mt-2 text-sm font-bold uppercase tracking-widest text-lilac-300">
              Be the first on the board — tap Game On above
            </p>
          </div>
        )}

        {scores.length > 0 && (
          <ol className="space-y-2">
            {scores.map((e, i) => (
              <motion.li
                key={`${e.name}-${e.date}-${i}`}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  delay: i * 0.05,
                  type: "spring",
                  stiffness: 240,
                  damping: 18,
                }}
                className={`flex items-center gap-3 rounded-2xl border-4 px-4 py-3 ${rowStyle(
                  i
                )}`}
              >
                <span className="w-14 shrink-0 font-black uppercase tracking-tight text-base md:text-lg">
                  {rankLabel(i)}
                </span>
                <span className="flex-1 truncate text-lg md:text-2xl font-black uppercase tracking-tight">
                  {e.name}
                </span>
                <span className="shrink-0 text-right font-black uppercase tracking-tight">
                  <span className="text-2xl md:text-3xl">{e.goals}</span>
                  <span className="opacity-70">/{e.shots}</span>
                </span>
                <span className="w-16 shrink-0 text-right text-sm md:text-base font-bold opacity-80">
                  {e.time.toFixed(1)}s
                </span>
              </motion.li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
