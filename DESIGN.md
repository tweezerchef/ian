# Design

The hockey site's visual and motion guidelines. CLAUDE.md imports this file so every Claude conversation has it in context.

## Audience
- 5th graders (~10–11 years old). Visuals and copy should be fun, energetic, and easy to read — not corporate or adult-editorial.

## Design intent
- High-energy and **poppy**: saturated colors, chunky type, playful shapes, big imagery.
- Lots of motion: entrance animations, hover effects, scroll-triggered reveals, micro-interactions on every interactive element.
- Sound-effect-style visual flourishes (zooms, bounces, slams) when it fits — hockey is loud and fast; the site should feel like it.
- Avoid generic template/AI aesthetics and avoid anything that reads as a boring stats page.
- Stats and data should still be clear and legible, but framed in playful cards / callouts rather than dense tables.

## Color palette
Defined as CSS variables on `:root` in `src/app/globals.css`. Reference as `var(--color-magenta-bloom-500)` etc. — do not introduce new hex values without a reason.

| Family | Role |
| --- | --- |
| **magenta-bloom** | Primary accent / hero / CTAs. Loud, energetic pink. |
| **yellow-green** | Secondary accent for highlights, badges, "pop" moments. |
| **neon-ice** | Glow / hover / focus rings; pairs with icy-blue for an "ice" feel. |
| **icy-blue** | Supporting cool tone for backgrounds, ice-surface gradients. |
| **lilac** | Muted supporting tone for softer backgrounds and text-on-light. |

Usage guidance:
- Lean into bold combinations: magenta + yellow-green, neon-ice on dark magenta.
- `50`/`100` shades for backgrounds.
- `400`–`600` for primary fills and accents.
- `800`–`950` for text on light backgrounds and rich/dark backgrounds.

## Motion principles
- Default to `motion` (Framer Motion). Avoid hand-rolled CSS keyframes unless trivial.
- Use spring physics over linear easing — bouncy, slightly overshooting feels right for the audience.
- Every interactive element gets a hover/press state (scale, tilt, color shift, or glow).
- Page transitions and scroll reveals are expected, not optional.
- Respect `prefers-reduced-motion` — fall back to instant or fade-only transitions.

## Typography
- Big, chunky display type for headlines (think sports jersey numerals, condensed sans).
- Highly legible body type — generous size (16–18px floor) and line-height for younger readers.
- TBD on exact font choices; pick from Google Fonts for simplicity when needed.

## Component vibe checklist
Before shipping a component, it should hit at least a few of these:
- A saturated color from the palette doing real work (not just an outline).
- An entrance animation or scroll reveal.
- A hover/press micro-interaction.
- Chunky or oversized type somewhere.
- A playful shape, sticker, or icon flourish.
