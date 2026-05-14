import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const KEY = "hockey:leaderboard";
const LEADERBOARD_SIZE = 10;
const MAX_NAME = 12;

type Entry = {
  name: string;
  goals: number;
  shots: number;
  time: number;
  date: string;
};

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

function compare(a: Entry, b: Entry) {
  if (a.goals !== b.goals) return b.goals - a.goals;
  if (a.shots !== b.shots) return a.shots - b.shots;
  return a.time - b.time;
}

function isValidEntry(v: unknown): v is Entry {
  if (!v || typeof v !== "object") return false;
  const e = v as Partial<Entry>;
  return (
    typeof e.name === "string" &&
    typeof e.goals === "number" &&
    typeof e.shots === "number" &&
    typeof e.time === "number" &&
    typeof e.date === "string"
  );
}

async function readBoard(): Promise<Entry[]> {
  const raw = await redis.get<Entry[] | string>(KEY);
  if (!raw) return [];
  const arr = typeof raw === "string" ? JSON.parse(raw) : raw;
  if (!Array.isArray(arr)) return [];
  return arr.filter(isValidEntry);
}

export async function GET() {
  try {
    const board = await readBoard();
    return NextResponse.json({ scores: board });
  } catch (err) {
    console.error("scores GET failed", err);
    return NextResponse.json({ scores: [], error: "read-failed" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<Entry>;

    const goals = Number(body.goals);
    const shots = Number(body.shots);
    const time = Number(body.time);
    if (
      !Number.isFinite(goals) ||
      !Number.isFinite(shots) ||
      !Number.isFinite(time) ||
      goals < 0 ||
      shots < 0 ||
      goals > shots ||
      shots > 500 ||
      time < 0 ||
      time > 3600
    ) {
      return NextResponse.json({ error: "invalid-stats" }, { status: 400 });
    }

    const rawName = typeof body.name === "string" ? body.name : "";
    const name =
      rawName.trim().slice(0, MAX_NAME).toUpperCase().replace(/[^A-Z0-9 _-]/g, "") ||
      "ANON";

    const entry: Entry = {
      name,
      goals,
      shots,
      time,
      date: new Date().toISOString(),
    };

    const board = await readBoard();
    const next = [...board, entry].sort(compare).slice(0, LEADERBOARD_SIZE);
    await redis.set(KEY, JSON.stringify(next));

    return NextResponse.json({ scores: next });
  } catch (err) {
    console.error("scores POST failed", err);
    return NextResponse.json({ error: "write-failed" }, { status: 500 });
  }
}
