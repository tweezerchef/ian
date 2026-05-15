"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";

const W = 600;
const H = 400;
const PLAYER = { x: W / 2, y: H - 50 };
const GOAL = { x1: 150, x2: 450, y: 36, depth: 22 };
const GOALIE_W = 72;
const GOALIE_H = 16;
const PUCK_R = 8;
const SHOT_SPEED = 12;
const AIM_LIMIT = 1.15;
const ROUND_SHOTS = 20;
const ROUND_TIME_MS = 60000;
const STORAGE_KEY = "ice-breakers-hockey-scores";
const LEADERBOARD_SIZE = 10;
const MAX_NAME = 12;
const GOALIE_HISTORY = 5;
const GOALIE_LINE_Y = GOAL.y + 14;
const GOALIE_BIAS_PULL = 0.3;

export type Difficulty = "easy" | "medium" | "hard";

type DifficultyConfig = {
  label: string;
  blurb: string;
  multiplier: number;
  goalieMaxSpeed: number;
  reactFrames: number;
  shotError: number;
  interceptFuzz: number;
};

const DIFFICULTY: Record<Difficulty, DifficultyConfig> = {
  easy: {
    label: "Rookie",
    blurb: "Slow goalie · big openings",
    multiplier: 1,
    goalieMaxSpeed: 1.35,
    reactFrames: 12,
    shotError: 46,
    interceptFuzz: 36,
  },
  medium: {
    label: "Pro",
    blurb: "Standard challenge",
    multiplier: 2,
    goalieMaxSpeed: 2.0,
    reactFrames: 22,
    shotError: 28,
    interceptFuzz: 22,
  },
  hard: {
    label: "All-Star",
    blurb: "Reads your aim · barely misses",
    multiplier: 3,
    goalieMaxSpeed: 2.85,
    reactFrames: 34,
    shotError: 12,
    interceptFuzz: 10,
  },
};

const DIFFICULTY_ORDER: Difficulty[] = ["easy", "medium", "hard"];

function multiplierFor(d: Difficulty | undefined): number {
  return DIFFICULTY[d ?? "medium"].multiplier;
}

function weightedScore(e: { goals: number; difficulty?: Difficulty }): number {
  return e.goals * multiplierFor(e.difficulty);
}

type Puck = { x: number; y: number; vx: number; vy: number; active: boolean };
type Entry = {
  name: string;
  goals: number;
  shots: number;
  time: number;
  date: string;
  difficulty?: Difficulty;
};

function isValidEntry(v: unknown): v is Entry {
  if (!v || typeof v !== "object") return false;
  const e = v as Partial<Entry>;
  if (
    typeof e.name !== "string" ||
    typeof e.goals !== "number" ||
    typeof e.shots !== "number" ||
    typeof e.time !== "number"
  ) {
    return false;
  }
  if (
    e.difficulty !== undefined &&
    e.difficulty !== "easy" &&
    e.difficulty !== "medium" &&
    e.difficulty !== "hard"
  ) {
    return false;
  }
  return true;
}

function loadLocal(): Entry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidEntry);
  } catch {
    return [];
  }
}

function persistLocal(s: Entry[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {}
}

async function fetchScores(): Promise<Entry[]> {
  try {
    const res = await fetch("/api/scores", { cache: "no-store" });
    if (!res.ok) throw new Error(`status ${res.status}`);
    const data: unknown = await res.json();
    if (!data || typeof data !== "object") throw new Error("bad payload");
    const scores = (data as { scores?: unknown }).scores;
    if (!Array.isArray(scores)) throw new Error("no scores");
    return scores.filter(isValidEntry);
  } catch {
    return loadLocal();
  }
}

async function submitScore(entry: Entry): Promise<Entry[]> {
  try {
    const res = await fetch("/api/scores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry),
    });
    if (!res.ok) throw new Error(`status ${res.status}`);
    const data: unknown = await res.json();
    const scores = (data as { scores?: unknown })?.scores;
    if (!Array.isArray(scores)) throw new Error("no scores");
    const valid = scores.filter(isValidEntry);
    persistLocal(valid);
    return valid;
  } catch {
    const local = [...loadLocal(), entry]
      .sort(compareEntries)
      .slice(0, LEADERBOARD_SIZE);
    persistLocal(local);
    return local;
  }
}

function compareEntries(a: Entry, b: Entry) {
  const sa = weightedScore(a);
  const sb = weightedScore(b);
  if (sa !== sb) return sb - sa;
  if (a.goals !== b.goals) return b.goals - a.goals;
  if (a.shots !== b.shots) return a.shots - b.shots;
  return a.time - b.time;
}

function rankFor(scores: Entry[], pending: Entry): number {
  let rank = 0;
  for (const e of scores) {
    if (compareEntries(e, pending) < 0) rank++;
  }
  return rank;
}

function idleTarget(history: number[], now: number): number {
  const center = (GOAL.x1 + GOAL.x2) / 2;
  if (history.length === 0) {
    return center + Math.sin(now * 0.0018) * 50;
  }
  let sum = 0;
  let weight = 0;
  for (let i = 0; i < history.length; i++) {
    const w = i + 1;
    sum += history[i] * w;
    weight += w;
  }
  const bias = sum / weight;
  const pulled = center + (bias - center) * GOALIE_BIAS_PULL;
  return pulled + Math.sin(now * 0.0024) * 22;
}

function drawPlayer(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save();
  ctx.translate(x, y);

  ctx.fillStyle = "#011723";
  ctx.fillRect(-15, 16, 11, 7);
  ctx.fillRect(4, 16, 11, 7);
  ctx.fillStyle = "#d0fbfb";
  ctx.fillRect(-15, 21, 11, 2);
  ctx.fillRect(4, 21, 11, 2);

  ctx.fillStyle = "#2c0713";
  ctx.fillRect(-13, 4, 11, 14);
  ctx.fillRect(2, 4, 11, 14);
  ctx.fillStyle = "#a5d629";
  ctx.fillRect(-13, 5, 11, 2);
  ctx.fillRect(2, 5, 11, 2);

  ctx.fillStyle = "#da2561";
  ctx.beginPath();
  ctx.moveTo(-16, 6);
  ctx.lineTo(-19, -10);
  ctx.lineTo(-9, -14);
  ctx.lineTo(9, -14);
  ctx.lineTo(19, -10);
  ctx.lineTo(16, 6);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#2c0713";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "#83163a";
  ctx.fillRect(-19, -10, 38, 3);

  ctx.fillStyle = "#f6fbea";
  ctx.font = "900 11px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("5", 0, -2);

  ctx.fillStyle = "#a5d629";
  ctx.strokeStyle = "#2c0713";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(-17, -4, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(17, -4, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#1f050e";
  ctx.beginPath();
  ctx.arc(0, -18, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#2c0713";
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.strokeStyle = "#a0f8f8";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, -18, 7.5, 0.25, Math.PI - 0.25);
  ctx.stroke();

  ctx.restore();
}

function drawStick(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  ctx.strokeStyle = "#638118";
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(0, -2);
  ctx.lineTo(0, -52);
  ctx.stroke();

  ctx.strokeStyle = "#1f050e";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(0, -4);
  ctx.lineTo(0, -14);
  ctx.stroke();

  ctx.fillStyle = "#a5d629";
  ctx.strokeStyle = "#212b08";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-2, -50);
  ctx.lineTo(-2, -56);
  ctx.quadraticCurveTo(8, -60, 22, -56);
  ctx.lineTo(22, -50);
  ctx.quadraticCurveTo(10, -52, -2, -50);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 1;
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.moveTo(2 + i * 4, -55);
    ctx.lineTo(2 + i * 4, -51);
    ctx.stroke();
  }

  ctx.restore();
}

function drawGoalie(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  ctx.save();
  ctx.translate(cx, cy);

  ctx.fillStyle = "#011723";
  ctx.fillRect(-26, -22, 12, 5);
  ctx.fillRect(14, -22, 12, 5);

  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#2c0713";
  ctx.lineWidth = 2;
  ctx.fillRect(-28, 0, 22, 22);
  ctx.strokeRect(-28, 0, 22, 22);
  ctx.fillRect(6, 0, 22, 22);
  ctx.strokeRect(6, 0, 22, 22);
  ctx.fillStyle = "#da2561";
  ctx.fillRect(-22, 2, 4, 18);
  ctx.fillRect(-13, 2, 4, 18);
  ctx.fillRect(12, 2, 4, 18);
  ctx.fillRect(21, 2, 4, 18);

  ctx.fillStyle = "#570f27";
  ctx.beginPath();
  ctx.moveTo(-22, 2);
  ctx.lineTo(-26, -14);
  ctx.lineTo(-12, -18);
  ctx.lineTo(12, -18);
  ctx.lineTo(26, -14);
  ctx.lineTo(22, 2);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#2c0713";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "#a5d629";
  ctx.fillRect(-26, -10, 52, 3);
  ctx.fillStyle = "#f6fbea";
  ctx.font = "900 10px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("1", 0, -5);

  ctx.fillStyle = "#a5d629";
  ctx.strokeStyle = "#2c0713";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.ellipse(-32, -2, 8, 10, -0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#1f050e";
  ctx.beginPath();
  ctx.ellipse(-32, 0, 5, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#83163a";
  ctx.strokeStyle = "#2c0713";
  ctx.lineWidth = 1.5;
  ctx.fillRect(26, -8, 12, 16);
  ctx.strokeRect(26, -8, 12, 16);
  ctx.fillStyle = "#a5d629";
  ctx.fillRect(28, -6, 8, 2);
  ctx.fillRect(28, -2, 8, 2);
  ctx.fillRect(28, 2, 8, 2);

  ctx.strokeStyle = "#638118";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(32, 8);
  ctx.lineTo(34, 22);
  ctx.stroke();
  ctx.fillStyle = "#a5d629";
  ctx.strokeStyle = "#212b08";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(8, 20);
  ctx.lineTo(8, 26);
  ctx.lineTo(36, 26);
  ctx.lineTo(36, 20);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#1f050e";
  ctx.beginPath();
  ctx.arc(0, -26, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#2c0713";
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.strokeStyle = "#a0f8f8";
  ctx.lineWidth = 1.2;
  for (let i = -1; i <= 1; i++) {
    ctx.beginPath();
    ctx.moveTo(-7, -26 + i * 3);
    ctx.lineTo(7, -26 + i * 3);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(0, -33);
  ctx.lineTo(0, -19);
  ctx.stroke();

  ctx.restore();
}

export function MiniHockeyModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const aimRef = useRef(0);
  const puckRef = useRef<Puck>({ x: 0, y: 0, vx: 0, vy: 0, active: false });
  const goalieRef = useRef<{ x: number; history: number[]; shotError: number }>({
    x: W / 2 - GOALIE_W / 2,
    history: [],
    shotError: 0,
  });
  const flashRef = useRef<{ kind: "goal" | "save" | null; until: number }>({
    kind: null,
    until: 0,
  });
  const keysRef = useRef({ left: false, right: false });
  const startTimeRef = useRef(0);
  const elapsedRef = useRef(0);
  const finishedRef = useRef(false);
  const shotStartRef = useRef(0);
  const lastShotMsRef = useRef(0);
  const bestShotMsRef = useRef(0);
  const difficultyRef = useRef<Difficulty>("medium");

  const fireShot = useCallback(() => {
    if (finishedRef.current || puckRef.current.active) return;
    if (startTimeRef.current === 0) return;
    const a = aimRef.current;
    const cfg = DIFFICULTY[difficultyRef.current];
    puckRef.current = {
      x: PLAYER.x,
      y: PLAYER.y - 16,
      vx: Math.sin(a) * SHOT_SPEED,
      vy: -Math.cos(a) * SHOT_SPEED,
      active: true,
    };
    shotStartRef.current = performance.now();
    goalieRef.current.shotError =
      (Math.random() - 0.5) * 2 * cfg.shotError;
    setScore((s) => ({ ...s, shots: s.shots + 1 }));
  }, []);

  const tapRef = useRef({ startX: 0, startY: 0, moved: false });

  const handlePointerAim = useCallback(
    (e: ReactPointerEvent<HTMLCanvasElement>) => {
      if (finishedRef.current) return;
      if (startTimeRef.current === 0) return;
      if (e.pointerType === "mouse" && e.buttons === 0) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const cx = (e.clientX - rect.left) * scaleX;
      const cy = (e.clientY - rect.top) * scaleY;
      const angle = Math.atan2(cx - PLAYER.x, PLAYER.y - 16 - cy);
      aimRef.current = Math.max(-AIM_LIMIT, Math.min(AIM_LIMIT, angle));
    },
    []
  );

  const [score, setScore] = useState({ goals: 0, shots: 0 });
  const [finished, setFinished] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [highScores, setHighScores] = useState<Entry[]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);

  const refreshScores = useCallback(() => {
    setHighScores(loadLocal());
    fetchScores().then(setHighScores).catch(() => {});
  }, []);

  const resetGameState = useCallback(() => {
    aimRef.current = 0;
    puckRef.current = { x: 0, y: 0, vx: 0, vy: 0, active: false };
    goalieRef.current = {
      x: W / 2 - GOALIE_W / 2,
      history: [],
      shotError: 0,
    };
    flashRef.current = { kind: null, until: 0 };
    startTimeRef.current = 0;
    elapsedRef.current = 0;
    finishedRef.current = false;
    shotStartRef.current = 0;
    lastShotMsRef.current = 0;
    bestShotMsRef.current = 0;
    setScore({ goals: 0, shots: 0 });
    setFinished(false);
    setSubmitted(false);
    setNameInput("");
  }, []);

  const startRound = useCallback(
    (diff: Difficulty) => {
      resetGameState();
      difficultyRef.current = diff;
      setDifficulty(diff);
      startTimeRef.current = performance.now();
    },
    [resetGameState]
  );

  const goToPicker = useCallback(() => {
    resetGameState();
    setDifficulty(null);
    refreshScores();
  }, [resetGameState, refreshScores]);

  useEffect(() => {
    if (open) goToPicker();
  }, [open, goToPicker]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const down = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;

      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (finishedRef.current) return;

      if (e.key === "ArrowLeft") {
        keysRef.current.left = true;
        e.preventDefault();
      } else if (e.key === "ArrowRight") {
        keysRef.current.right = true;
        e.preventDefault();
      } else if (e.key === " " || e.code === "Space") {
        fireShot();
        e.preventDefault();
      }
    };
    const up = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") keysRef.current.left = false;
      if (e.key === "ArrowRight") keysRef.current.right = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [open, onClose, fireShot]);

  useEffect(() => {
    if (!open) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;

    const tick = () => {
      let isFinished = finishedRef.current;

      if (
        !isFinished &&
        startTimeRef.current > 0 &&
        performance.now() - startTimeRef.current >= ROUND_TIME_MS
      ) {
        elapsedRef.current = ROUND_TIME_MS / 1000;
        finishedRef.current = true;
        setFinished(true);
        isFinished = true;
      }

      if (!isFinished) {
        if (keysRef.current.left)
          aimRef.current = Math.max(aimRef.current - 0.04, -AIM_LIMIT);
        if (keysRef.current.right)
          aimRef.current = Math.min(aimRef.current + 0.04, AIM_LIMIT);
      }

      const goalie = goalieRef.current;
      const p = puckRef.current;
      const cfg = DIFFICULTY[difficultyRef.current];
      if (!isFinished && startTimeRef.current > 0) {
        const now = performance.now();
        let targetCenter: number;
        if (p.active && p.vy < 0) {
          const t = (p.y - GOALIE_LINE_Y) / -p.vy;
          if (t > 0 && t < cfg.reactFrames) {
            targetCenter =
              p.x +
              p.vx * t +
              goalie.shotError +
              Math.sin(now * 0.011) * cfg.interceptFuzz;
          } else {
            targetCenter = idleTarget(goalie.history, now);
          }
        } else {
          targetCenter = idleTarget(goalie.history, now);
        }
        const targetX = Math.max(
          GOAL.x1 + 6,
          Math.min(GOAL.x2 - 6 - GOALIE_W, targetCenter - GOALIE_W / 2)
        );
        const dx = targetX - goalie.x;
        if (dx > cfg.goalieMaxSpeed) goalie.x += cfg.goalieMaxSpeed;
        else if (dx < -cfg.goalieMaxSpeed) goalie.x -= cfg.goalieMaxSpeed;
        else goalie.x = targetX;
      }

      if (p.active && !isFinished && startTimeRef.current > 0) {
        p.x += p.vx;
        p.y += p.vy;

        const gx = goalie.x;
        const gy = GOAL.y + 14;
        const hitGoalie =
          p.x + PUCK_R > gx &&
          p.x - PUCK_R < gx + GOALIE_W &&
          p.y + PUCK_R > gy &&
          p.y - PUCK_R < gy + GOALIE_H;

        let resolved: "goal" | "miss" | null = null;
        const recordShotX = (x: number) => {
          goalie.history.push(x);
          if (goalie.history.length > GOALIE_HISTORY) goalie.history.shift();
          const ms = performance.now() - shotStartRef.current;
          lastShotMsRef.current = ms;
          if (bestShotMsRef.current === 0 || ms < bestShotMsRef.current) {
            bestShotMsRef.current = ms;
          }
        };
        if (hitGoalie) {
          recordShotX(p.x);
          p.active = false;
          flashRef.current = { kind: "save", until: performance.now() + 380 };
          resolved = "miss";
        } else if (p.y - PUCK_R < GOAL.y) {
          recordShotX(p.x);
          const scored = p.x > GOAL.x1 + 6 && p.x < GOAL.x2 - 6;
          if (scored) {
            flashRef.current = {
              kind: "goal",
              until: performance.now() + 500,
            };
            resolved = "goal";
          } else {
            resolved = "miss";
          }
          p.active = false;
        } else if (p.x < 0 || p.x > W || p.y > H) {
          p.active = false;
          resolved = "miss";
        }

        if (resolved) {
          const last = resolved;
          setScore((prev) => {
            const goals = last === "goal" ? prev.goals + 1 : prev.goals;
            const shots = prev.shots;
            let done = false;
            if (shots >= ROUND_SHOTS) {
              if (shots === ROUND_SHOTS) {
                if (goals < ROUND_SHOTS) done = true;
              } else if (last === "miss") {
                done = true;
              }
            }
            if (done) {
              elapsedRef.current =
                (performance.now() - startTimeRef.current) / 1000;
              finishedRef.current = true;
              setFinished(true);
            }
            return { goals, shots };
          });
        }
      }

      ctx.fillStyle = "#e6f6fe";
      ctx.fillRect(0, 0, W, H);

      ctx.strokeStyle = "rgba(8, 167, 247, 0.25)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, H / 2);
      ctx.lineTo(W, H / 2);
      ctx.stroke();

      ctx.fillStyle = "rgba(8, 167, 247, 0.08)";
      ctx.beginPath();
      ctx.arc(W / 2, H / 2, 60, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#da2561";
      ctx.lineWidth = 4;
      ctx.fillRect(GOAL.x1, GOAL.y - GOAL.depth, GOAL.x2 - GOAL.x1, GOAL.depth);
      ctx.strokeRect(
        GOAL.x1,
        GOAL.y - GOAL.depth,
        GOAL.x2 - GOAL.x1,
        GOAL.depth
      );
      ctx.strokeStyle = "rgba(218, 37, 97, 0.45)";
      ctx.lineWidth = 1;
      for (let x = GOAL.x1; x <= GOAL.x2; x += 10) {
        ctx.beginPath();
        ctx.moveTo(x, GOAL.y - GOAL.depth);
        ctx.lineTo(x, GOAL.y);
        ctx.stroke();
      }
      for (let y = GOAL.y - GOAL.depth; y <= GOAL.y; y += 6) {
        ctx.beginPath();
        ctx.moveTo(GOAL.x1, y);
        ctx.lineTo(GOAL.x2, y);
        ctx.stroke();
      }

      drawGoalie(ctx, goalie.x + GOALIE_W / 2, GOAL.y + 22);

      if (!isFinished) {
        ctx.strokeStyle = "rgba(218, 37, 97, 0.55)";
        ctx.lineWidth = 3;
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.moveTo(PLAYER.x, PLAYER.y - 16);
        ctx.lineTo(
          PLAYER.x + Math.sin(aimRef.current) * 90,
          PLAYER.y - 16 - Math.cos(aimRef.current) * 90
        );
        ctx.stroke();
        ctx.setLineDash([]);
      }

      drawPlayer(ctx, PLAYER.x, PLAYER.y);
      drawStick(ctx, PLAYER.x, PLAYER.y - 6, aimRef.current);

      ctx.fillStyle = "#1f050e";
      const puckX = p.active ? p.x : PLAYER.x;
      const puckY = p.active ? p.y : PLAYER.y - 16;
      ctx.beginPath();
      ctx.arc(puckX, puckY, PUCK_R, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#83163a";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      if (startTimeRef.current === 0) {
        raf = requestAnimationFrame(tick);
        return;
      }

      const now2 = performance.now();
      const liveShotMs = p.active
        ? now2 - shotStartRef.current
        : lastShotMsRef.current;
      const elapsedMs =
        startTimeRef.current === 0 ? 0 : now2 - startTimeRef.current;
      const remainingMs = isFinished
        ? Math.max(0, ROUND_TIME_MS - elapsedRef.current * 1000)
        : Math.max(0, ROUND_TIME_MS - elapsedMs);
      const remSec = remainingMs / 1000;
      const lowTime = !isFinished && remSec <= 10;

      const roundRect = (
        x: number,
        y: number,
        w: number,
        h: number,
        rad: number
      ) => {
        ctx.beginPath();
        ctx.moveTo(x + rad, y);
        ctx.lineTo(x + w - rad, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + rad);
        ctx.lineTo(x + w, y + h - rad);
        ctx.quadraticCurveTo(x + w, y + h, x + w - rad, y + h);
        ctx.lineTo(x + rad, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - rad);
        ctx.lineTo(x, y + rad);
        ctx.quadraticCurveTo(x, y, x + rad, y);
        ctx.closePath();
      };

      ctx.save();
      ctx.fillStyle = "rgba(31, 5, 14, 0.78)";
      ctx.strokeStyle = "#a5d629";
      ctx.lineWidth = 2;
      const leftW = 110;
      const leftH = 56;
      roundRect(10, 10, leftW, leftH, 10);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#a0f8f8";
      ctx.font = "900 9px sans-serif";
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.fillText("SHOT", 18, 16);
      ctx.fillStyle = p.active ? "#a5d629" : "#f6fbea";
      ctx.font = "900 16px sans-serif";
      ctx.fillText(`${(liveShotMs / 1000).toFixed(2)}s`, 18, 27);
      if (bestShotMsRef.current > 0) {
        ctx.fillStyle = "#dbbdd0";
        ctx.font = "900 9px sans-serif";
        ctx.fillText(
          `BEST ${(bestShotMsRef.current / 1000).toFixed(2)}s`,
          18,
          50
        );
      }
      ctx.restore();

      const activeCfg = DIFFICULTY[difficultyRef.current];
      ctx.save();
      const dW = 124;
      const dH = 38;
      const dX = (W - dW) / 2;
      const dY = 10;
      ctx.fillStyle = "rgba(31, 5, 14, 0.82)";
      ctx.strokeStyle = "#a5d629";
      ctx.lineWidth = 2;
      roundRect(dX, dY, dW, dH, 10);
      ctx.fill();
      ctx.stroke();
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillStyle = "#dbbdd0";
      ctx.font = "900 9px sans-serif";
      ctx.fillText("DIFFICULTY", dX + dW / 2, dY + 5);
      ctx.fillStyle = "#a5d629";
      ctx.font = "900 16px sans-serif";
      ctx.fillText(
        `${activeCfg.label.toUpperCase()}  ×${activeCfg.multiplier}`,
        dX + dW / 2,
        dY + 18
      );
      ctx.restore();

      const tlPulse = lowTime
        ? 1 + Math.abs(Math.sin(now2 * 0.012)) * 0.14
        : 1;
      ctx.save();
      const tlW = 150;
      const tlH = 64;
      const tlX = W - tlW - 10;
      const tlY = 10;
      ctx.fillStyle = lowTime
        ? "rgba(174, 30, 78, 0.92)"
        : "rgba(31, 5, 14, 0.85)";
      ctx.strokeStyle = lowTime ? "#fbe9ef" : "#41f1f1";
      ctx.lineWidth = 3;
      roundRect(tlX, tlY, tlW, tlH, 12);
      ctx.fill();
      ctx.stroke();

      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillStyle = lowTime ? "#fbe9ef" : "#a0f8f8";
      ctx.font = "900 10px sans-serif";
      ctx.fillText("TIME LEFT", tlX + tlW / 2, tlY + 6);

      const tlFontSize = Math.round(30 * tlPulse);
      ctx.font = `900 ${tlFontSize}px sans-serif`;
      ctx.fillStyle = lowTime ? "#fbe9ef" : "#a5d629";
      ctx.fillText(
        `${remSec.toFixed(1)}s`,
        tlX + tlW / 2,
        tlY + tlH / 2 - tlFontSize / 2 + 6
      );
      ctx.restore();

      const flash = flashRef.current;
      if (flash.kind && performance.now() < flash.until) {
        ctx.save();
        ctx.globalAlpha = Math.max(
          0,
          Math.min(1, (flash.until - performance.now()) / 400)
        );
        ctx.fillStyle =
          flash.kind === "goal" ? "#a5d629" : "rgba(218, 37, 97, 0.9)";
        ctx.font = "900 64px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.strokeStyle = "#2c0713";
        ctx.lineWidth = 6;
        const label = flash.kind === "goal" ? "GOAL!" : "SAVED!";
        ctx.strokeText(label, W / 2, H / 2);
        ctx.fillText(label, W / 2, H / 2);
        ctx.restore();
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [open]);

  const overtime = score.shots >= ROUND_SHOTS && !finished;
  const remaining = Math.max(0, ROUND_SHOTS - score.shots);

  const myEntry: Entry | null = useMemo(() => {
    if (!finished || !difficulty) return null;
    return {
      name: "",
      goals: score.goals,
      shots: score.shots,
      time: elapsedRef.current,
      date: "",
      difficulty,
    };
  }, [finished, score.goals, score.shots, difficulty]);

  const myRank = useMemo(() => {
    if (!myEntry) return -1;
    return rankFor(highScores, myEntry);
  }, [highScores, myEntry]);

  const qualifies = myRank >= 0 && myRank < LEADERBOARD_SIZE && !submitted;

  const displayBoard = useMemo(() => {
    type Row = Entry & { isMe?: boolean; isPending?: boolean };
    const rows: Row[] = highScores.map((e) => ({ ...e }));
    if (qualifies && myEntry) {
      const pending: Row = {
        name: nameInput.trim().toUpperCase() || "—",
        goals: myEntry.goals,
        shots: myEntry.shots,
        time: myEntry.time,
        date: "",
        difficulty: difficulty ?? undefined,
        isMe: true,
        isPending: true,
      };
      rows.splice(myRank, 0, pending);
    }
    return rows.slice(0, LEADERBOARD_SIZE);
  }, [highScores, qualifies, myEntry, myRank, nameInput, difficulty]);

  const finalMultiplier = difficulty ? DIFFICULTY[difficulty].multiplier : 1;
  const finalScore = score.goals * finalMultiplier;

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!myEntry || submitting) return;
    const cleaned = nameInput.trim().slice(0, MAX_NAME).toUpperCase();
    const finalName = cleaned || "ANON";
    const entry: Entry = {
      ...myEntry,
      name: finalName,
      date: new Date().toISOString(),
    };
    setSubmitting(true);
    setSubmitted(true);
    const next = await submitScore(entry);
    setHighScores(next);
    setSubmitting(false);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("scores-updated"));
    }
  };

  const onNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNameInput(e.target.value.slice(0, MAX_NAME));
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-icy-blue-950/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-3xl border-4 border-magenta-bloom-500 bg-icy-blue-950 p-5 shadow-[0_18px_0_0_var(--color-magenta-bloom-900)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-yellow-green-300">
            Take Your Shot
          </h2>
          <button
            onClick={onClose}
            className="rounded-full border-2 border-yellow-green-400 bg-magenta-bloom-500 px-3 py-1 text-sm font-bold uppercase tracking-widest text-neon-ice-50 hover:bg-magenta-bloom-400"
          >
            Close
          </button>
        </div>

        <div className="relative">
          <canvas
            ref={canvasRef}
            width={W}
            height={H}
            onPointerDown={(e) => {
              e.preventDefault();
              e.currentTarget.setPointerCapture(e.pointerId);
              tapRef.current = {
                startX: e.clientX,
                startY: e.clientY,
                moved: false,
              };
              handlePointerAim(e);
            }}
            onPointerMove={(e) => {
              const dx = e.clientX - tapRef.current.startX;
              const dy = e.clientY - tapRef.current.startY;
              if (dx * dx + dy * dy > 100) tapRef.current.moved = true;
              handlePointerAim(e);
            }}
            onPointerUp={(e) => {
              if (e.currentTarget.hasPointerCapture(e.pointerId)) {
                e.currentTarget.releasePointerCapture(e.pointerId);
              }
              if (!tapRef.current.moved) fireShot();
            }}
            className="block w-full max-w-full touch-none rounded-xl border-4 border-yellow-green-400 bg-icy-blue-50"
          />

          {overtime && (
            <div className="pointer-events-none absolute left-1/2 top-3 -translate-x-1/2 rounded-full border-4 border-magenta-bloom-900 bg-yellow-green-400 px-4 py-1 text-base md:text-lg font-black uppercase tracking-widest text-magenta-bloom-900 shadow-[3px_3px_0_0_var(--color-magenta-bloom-900)]">
              Overtime!
            </div>
          )}

          {!difficulty && !finished && (
            <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-icy-blue-950/90 p-3 md:p-4 backdrop-blur-sm">
              <div className="flex w-full max-w-md flex-col rounded-2xl border-4 border-magenta-bloom-500 bg-icy-blue-900 p-3 md:p-4 shadow-[0_10px_0_0_var(--color-magenta-bloom-900)]">
                <h3 className="text-center text-xl md:text-2xl font-black uppercase tracking-tight text-yellow-green-300">
                  Pick Your Level
                </h3>
                <p className="mt-1 text-center text-[11px] md:text-xs font-bold uppercase tracking-widest text-lilac-300">
                  Harder goalie · bigger score multiplier
                </p>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {DIFFICULTY_ORDER.map((d) => {
                    const cfg = DIFFICULTY[d];
                    const tone =
                      d === "easy"
                        ? "bg-icy-blue-300 text-magenta-bloom-900 border-magenta-bloom-900"
                        : d === "medium"
                        ? "bg-yellow-green-400 text-magenta-bloom-900 border-magenta-bloom-900"
                        : "bg-magenta-bloom-500 text-neon-ice-50 border-yellow-green-400";
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => startRound(d)}
                        className={`flex flex-col items-center justify-center gap-1 rounded-2xl border-4 px-2 py-3 text-center shadow-[4px_4px_0_0_var(--color-magenta-bloom-900)] transition-transform hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0_0_var(--color-magenta-bloom-900)] ${tone}`}
                      >
                        <span className="text-base md:text-lg font-black uppercase tracking-tight leading-none">
                          {cfg.label}
                        </span>
                        <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest opacity-80 leading-tight">
                          {cfg.blurb}
                        </span>
                        <span className="mt-1 rounded-full border-2 border-current px-2 py-0.5 text-[10px] md:text-xs font-black uppercase tracking-widest">
                          ×{cfg.multiplier} Score
                        </span>
                      </button>
                    );
                  })}
                </div>
                <p className="mt-3 text-center text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-lilac-300">
                  20 shots · 60 seconds · weighted leaderboard
                </p>
              </div>
            </div>
          )}

          {finished && (
            <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-icy-blue-950/85 p-4 backdrop-blur-sm">
              <div className="flex max-h-full w-full max-w-md flex-col rounded-2xl border-4 border-yellow-green-400 bg-icy-blue-900 p-4 shadow-[0_10px_0_0_var(--color-magenta-bloom-900)]">
                <h3 className="text-center text-2xl md:text-3xl font-black uppercase tracking-tight text-yellow-green-300">
                  {score.goals === score.shots && score.shots >= ROUND_SHOTS
                    ? "Hat Trick!"
                    : "Final Score"}
                </h3>
                <p className="mt-1 text-center text-neon-ice-100">
                  <span className="text-2xl font-black text-magenta-bloom-300">
                    {score.goals}
                  </span>
                  <span className="text-lilac-300"> goals on </span>
                  <span className="text-2xl font-black text-neon-ice-300">
                    {score.shots}
                  </span>
                  <span className="text-lilac-300"> shots · </span>
                  <span className="text-xl font-black text-yellow-green-300">
                    {elapsedRef.current.toFixed(1)}s
                  </span>
                </p>
                {difficulty && (
                  <p className="mt-1 text-center text-xs font-bold uppercase tracking-widest text-lilac-300">
                    <span className="rounded-full border-2 border-yellow-green-400 bg-magenta-bloom-700 px-2 py-0.5 text-yellow-green-300">
                      {DIFFICULTY[difficulty].label} ×{finalMultiplier}
                    </span>
                    <span className="ml-2">
                      Score{" "}
                      <span className="text-base font-black text-yellow-green-300">
                        {finalScore}
                      </span>
                    </span>
                  </p>
                )}

                <h4 className="mt-3 text-center text-xs font-bold uppercase tracking-widest text-lilac-300">
                  High Scores
                </h4>
                <ol className="mt-1 min-h-0 flex-1 overflow-y-auto rounded-lg border border-magenta-bloom-700 bg-icy-blue-950/60 p-2 text-sm">
                  {displayBoard.length === 0 && (
                    <li className="px-1 py-1 text-center text-lilac-300">
                      No scores yet — you&apos;re first!
                    </li>
                  )}
                  {displayBoard.map((row, i) => {
                    const diff = row.difficulty ?? "medium";
                    const cfg = DIFFICULTY[diff];
                    return (
                      <li
                        key={i}
                        className={`flex items-center justify-between gap-2 rounded px-2 py-1 ${
                          row.isMe
                            ? "bg-yellow-green-400 text-magenta-bloom-900"
                            : "text-neon-ice-100"
                        }`}
                      >
                        <span className="w-6 font-black">{i + 1}.</span>
                        <span className="flex-1 truncate font-bold uppercase">
                          {row.name}
                          {row.isMe && (
                            <span className="ml-2 rounded bg-magenta-bloom-700 px-1.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-yellow-green-300">
                              You
                            </span>
                          )}
                        </span>
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-black uppercase tracking-widest ${
                            row.isMe
                              ? "bg-magenta-bloom-900 text-yellow-green-300"
                              : "bg-magenta-bloom-700 text-yellow-green-300"
                          }`}
                          title={`${cfg.label} (×${cfg.multiplier})`}
                        >
                          {cfg.label.slice(0, 3)}×{cfg.multiplier}
                        </span>
                        <span className="font-black tabular-nums">
                          {row.goals * cfg.multiplier}
                        </span>
                        <span className="w-10 text-right text-xs opacity-80">
                          {row.goals}/{row.shots}
                        </span>
                      </li>
                    );
                  })}
                </ol>

                {qualifies && (
                  <form
                    onSubmit={handleSubmit}
                    className="mt-3 flex items-center gap-2"
                  >
                    <span className="text-xs font-bold uppercase tracking-widest text-yellow-green-300">
                      #{myRank + 1}
                    </span>
                    <input
                      autoFocus
                      value={nameInput}
                      onChange={onNameChange}
                      placeholder="Your name"
                      maxLength={MAX_NAME}
                      className="flex-1 rounded-lg border-2 border-yellow-green-400 bg-icy-blue-950 px-3 py-1 font-bold uppercase tracking-widest text-neon-ice-50 placeholder:text-lilac-400 focus:outline-none focus:ring-2 focus:ring-yellow-green-300"
                    />
                    <button
                      type="submit"
                      disabled={submitting}
                      className="rounded-lg border-2 border-magenta-bloom-900 bg-yellow-green-400 px-3 py-1 font-black uppercase tracking-widest text-magenta-bloom-900 hover:bg-yellow-green-300 disabled:opacity-60"
                    >
                      {submitting ? "..." : "Save"}
                    </button>
                  </form>
                )}

                {!qualifies && finished && (
                  <p className="mt-3 text-center text-xs uppercase tracking-widest text-lilac-300">
                    {submitted
                      ? "Saved to the board!"
                      : "Keep trying — you didn't crack the top 10."}
                  </p>
                )}

                <div className="mt-3 grid grid-cols-[2fr_1fr] gap-2">
                  <button
                    onClick={() => difficulty && startRound(difficulty)}
                    className="rounded-full border-4 border-magenta-bloom-900 bg-magenta-bloom-500 py-2 text-lg font-black uppercase tracking-tight text-neon-ice-50 shadow-[4px_4px_0_0_var(--color-magenta-bloom-900)] hover:bg-magenta-bloom-400 active:translate-y-0.5 active:shadow-[2px_2px_0_0_var(--color-magenta-bloom-900)]"
                  >
                    Play Again
                  </button>
                  <button
                    onClick={goToPicker}
                    className="rounded-full border-4 border-magenta-bloom-900 bg-icy-blue-300 py-2 text-xs md:text-sm font-black uppercase tracking-widest text-magenta-bloom-900 shadow-[4px_4px_0_0_var(--color-magenta-bloom-900)] hover:bg-icy-blue-200 active:translate-y-0.5 active:shadow-[2px_2px_0_0_var(--color-magenta-bloom-900)]"
                  >
                    Change Level
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {!finished && difficulty && (
        <div className="mt-3 grid grid-cols-[1fr_2.2fr_1fr] gap-2 md:gap-3">
          <button
            type="button"
            aria-label="Aim left"
            onPointerDown={(e) => {
              e.preventDefault();
              e.currentTarget.setPointerCapture(e.pointerId);
              keysRef.current.left = true;
            }}
            onPointerUp={(e) => {
              if (e.currentTarget.hasPointerCapture(e.pointerId)) {
                e.currentTarget.releasePointerCapture(e.pointerId);
              }
              keysRef.current.left = false;
            }}
            onPointerLeave={() => {
              keysRef.current.left = false;
            }}
            onPointerCancel={() => {
              keysRef.current.left = false;
            }}
            className="touch-none select-none flex items-center justify-center rounded-2xl border-4 border-magenta-bloom-900 bg-icy-blue-300 py-3 text-2xl md:text-3xl font-black text-magenta-bloom-900 shadow-[4px_4px_0_0_var(--color-magenta-bloom-900)] active:translate-y-0.5 active:translate-x-0.5 active:shadow-[2px_2px_0_0_var(--color-magenta-bloom-900)]"
          >
            ◀
          </button>
          <button
            type="button"
            aria-label="Shoot"
            onPointerDown={(e) => {
              e.preventDefault();
              fireShot();
            }}
            className="touch-none select-none rounded-2xl border-4 border-magenta-bloom-900 bg-magenta-bloom-500 py-3 text-lg md:text-2xl font-black uppercase tracking-widest text-neon-ice-50 shadow-[5px_5px_0_0_var(--color-magenta-bloom-900)] active:translate-y-0.5 active:translate-x-0.5 active:shadow-[2px_2px_0_0_var(--color-magenta-bloom-900)] disabled:opacity-60"
            disabled={finished}
          >
            Shoot!
          </button>
          <button
            type="button"
            aria-label="Aim right"
            onPointerDown={(e) => {
              e.preventDefault();
              e.currentTarget.setPointerCapture(e.pointerId);
              keysRef.current.right = true;
            }}
            onPointerUp={(e) => {
              if (e.currentTarget.hasPointerCapture(e.pointerId)) {
                e.currentTarget.releasePointerCapture(e.pointerId);
              }
              keysRef.current.right = false;
            }}
            onPointerLeave={() => {
              keysRef.current.right = false;
            }}
            onPointerCancel={() => {
              keysRef.current.right = false;
            }}
            className="touch-none select-none flex items-center justify-center rounded-2xl border-4 border-magenta-bloom-900 bg-icy-blue-300 py-3 text-2xl md:text-3xl font-black text-magenta-bloom-900 shadow-[4px_4px_0_0_var(--color-magenta-bloom-900)] active:translate-y-0.5 active:translate-x-0.5 active:shadow-[2px_2px_0_0_var(--color-magenta-bloom-900)]"
          >
            ▶
          </button>
        </div>
        )}

        {!finished && difficulty && (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-neon-ice-100">
          <p className="hidden md:block text-sm">
            <span className="rounded bg-magenta-bloom-700 px-2 py-0.5 font-bold text-yellow-green-300">
              ← →
            </span>{" "}
            aim
            <span className="ml-3 rounded bg-magenta-bloom-700 px-2 py-0.5 font-bold text-yellow-green-300">
              space
            </span>{" "}
            shoot
            <span className="ml-3 rounded bg-magenta-bloom-700 px-2 py-0.5 font-bold text-yellow-green-300">
              esc
            </span>{" "}
            close
          </p>
          <p className="md:hidden text-xs text-lilac-300 uppercase tracking-widest font-bold">
            Tap to shoot · Drag to aim
          </p>
          <p className="font-black uppercase tracking-tight">
            <span className="text-3xl text-neon-ice-300">{score.goals}</span>
            <span className="mx-1 text-lilac-300">/</span>
            <span className="text-2xl text-lilac-300">{score.shots}</span>
            <span className="ml-2 text-sm text-lilac-300">
              {overtime ? "overtime" : `· ${remaining} left`}
            </span>
          </p>
        </div>
        )}
      </div>
    </div>
  );
}
