"use client";

import { useCallback, useEffect, useState } from "react";

type Difficulty = "easy" | "medium" | "hard";

type Entry = {
  name: string;
  goals: number;
  shots: number;
  time: number;
  date: string;
  difficulty?: Difficulty;
};

const DIFFICULTY_META: Record<
  Difficulty,
  { label: string; short: string; multiplier: number; chip: string }
> = {
  easy: {
    label: "Rookie",
    short: "Rkie",
    multiplier: 1,
    chip: "bg-icy-blue-300 text-magenta-bloom-900 border-magenta-bloom-900",
  },
  medium: {
    label: "Pro",
    short: "Pro",
    multiplier: 2,
    chip: "bg-yellow-green-400 text-magenta-bloom-900 border-magenta-bloom-900",
  },
  hard: {
    label: "All-Star",
    short: "All",
    multiplier: 3,
    chip: "bg-magenta-bloom-500 text-neon-ice-50 border-yellow-green-400",
  },
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
    return "border-yellow-green-300 bg-yellow-green-400 text-magenta-bloom-900 shadow-[4px_4px_0_0_var(--color-magenta-bloom-900)]";
  if (rank === 1)
    return "border-neon-ice-200 bg-neon-ice-400 text-magenta-bloom-900 shadow-[3px_3px_0_0_var(--color-magenta-bloom-900)]";
  if (rank === 2)
    return "border-magenta-bloom-300 bg-magenta-bloom-500 text-neon-ice-50 shadow-[3px_3px_0_0_var(--color-magenta-bloom-900)]";
  return "border-magenta-bloom-700 bg-icy-blue-900/80 text-neon-ice-100";
}

function rankLabel(rank: number) {
  if (rank === 0) return "1st";
  if (rank === 1) return "2nd";
  if (rank === 2) return "3rd";
  return `#${rank + 1}`;
}

export function LeaderboardModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [scores, setScores] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    const s = await fetchScores();
    setScores(s);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    refresh();
    document.body.style.overflow = "hidden";
    const onUpdate = () => refresh();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("scores-updated", onUpdate);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("scores-updated", onUpdate);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, refresh, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-icy-blue-950/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[60vh] w-full max-w-md flex-col rounded-3xl border-4 border-neon-ice-400 bg-icy-blue-950 p-5 shadow-[0_18px_0_0_var(--color-magenta-bloom-900)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex shrink-0 items-center justify-between gap-3">
          <div>
            <span className="inline-block rounded-full border border-neon-ice-300 bg-neon-ice-400/10 px-2 py-0.5 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-neon-ice-300">
              Live scoreboard
            </span>
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-neon-ice-300">
              Top Shooters
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={refresh}
              disabled={loading}
              className="rounded-full border-2 border-yellow-green-400 bg-magenta-bloom-700 px-3 py-1 text-xs font-bold uppercase tracking-widest text-yellow-green-300 hover:bg-magenta-bloom-600 disabled:opacity-60"
            >
              {loading ? "..." : "Refresh"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border-2 border-yellow-green-400 bg-magenta-bloom-500 px-3 py-1 text-xs font-bold uppercase tracking-widest text-neon-ice-50 hover:bg-magenta-bloom-400"
            >
              Close
            </button>
          </div>
        </div>

        {loading && scores.length === 0 && (
          <p className="py-6 text-center text-lilac-300">
            Loading scoreboard…
          </p>
        )}

        {!loading && scores.length === 0 && (
          <div className="rounded-2xl border-4 border-dashed border-yellow-green-400/50 bg-icy-blue-950/60 p-8 text-center">
            <p className="text-xl font-black uppercase tracking-tight text-yellow-green-300">
              No scores yet!
            </p>
            <p className="mt-2 text-xs font-bold uppercase tracking-widest text-lilac-300">
              Be the first — tap Game On to play
            </p>
          </div>
        )}

        {scores.length > 0 && (
          <ol className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
            {scores.map((e, i) => {
              const diff = e.difficulty ?? "medium";
              const meta = DIFFICULTY_META[diff];
              const total = e.goals * meta.multiplier;
              return (
                <li
                  key={`${e.name}-${e.date}-${i}`}
                  className={`flex items-center gap-2 rounded-xl border-4 px-3 py-2 ${rowStyle(
                    i
                  )}`}
                >
                  <span className="w-10 shrink-0 font-black uppercase tracking-tight text-sm md:text-base">
                    {rankLabel(i)}
                  </span>
                  <span className="flex-1 truncate font-black uppercase tracking-tight text-base md:text-lg">
                    {e.name}
                  </span>
                  <span
                    className={`shrink-0 rounded-full border-2 px-1.5 py-0.5 text-[9px] md:text-[10px] font-black uppercase tracking-widest ${meta.chip}`}
                    title={`${meta.label} (×${meta.multiplier})`}
                  >
                    {meta.short}×{meta.multiplier}
                  </span>
                  <span className="shrink-0 text-right font-black uppercase tracking-tight tabular-nums">
                    <span className="text-lg md:text-2xl">{total}</span>
                    <span className="ml-1 text-[10px] opacity-70">
                      {e.goals}/{e.shots}
                    </span>
                  </span>
                  <span className="w-12 shrink-0 text-right text-xs md:text-sm font-bold opacity-80">
                    {e.time.toFixed(1)}s
                  </span>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </div>
  );
}
