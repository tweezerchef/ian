@AGENTS.md
@DESIGN.md

# Project: Hockey Site

A visually striking hockey website built as a 5th-grade school project. Design ambition is high; the stack is deliberately small.

Visual and motion direction lives in `DESIGN.md` (imported above).

## Stack (keep minimal)
- Next.js 16 App Router + React 19 + TypeScript — already installed.
- Tailwind CSS v4 for styling.
- `motion` (formerly Framer Motion) for animation.
- `lucide-react` for icons.
- No database, CMS, or auth in v1. Content lives in typed TS files under `src/content/`.
- Deploy target: Vercel.

Do not add libraries beyond this list without an explicit reason.

## Repo layout
- `src/app/` — App Router routes and layouts.
- `src/components/` — reusable UI primitives.
- `src/content/` — typed content (teams, players, schedule, results).
- `public/` — images, logos, video clips.

## v1 scope
- Landing page: hero, featured matchup, headline stats.
- Team page: roster grid with rich hover/transition states.
- Player detail: bio, photo, stat callouts.
- Schedule / results: chronological list with score detail.

## Out of scope for v1
- Auth, accounts, comments.
- Live data feeds or third-party stat APIs.
- Server-side persistence; everything ships as static content.
