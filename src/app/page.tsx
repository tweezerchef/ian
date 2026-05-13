import { HeroSkater } from "@/components/HeroSkater";
import { KnowTheRules } from "@/components/KnowTheRules";

export default function Home() {
  return (
    <main className="relative overflow-hidden bg-gradient-to-b from-icy-blue-950 via-icy-blue-900 to-magenta-bloom-950">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "radial-gradient(var(--color-neon-ice-200) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <section className="relative z-10 mx-auto max-w-6xl px-6 pt-16 pb-8 md:pt-20">
        <span className="inline-flex items-center gap-2 rounded-full border-2 border-yellow-green-400 bg-yellow-green-400/10 px-4 py-1 text-sm font-bold uppercase tracking-widest text-yellow-green-300">
          <span className="h-2 w-2 rounded-full bg-yellow-green-400 animate-pulse" />
          Puck Drop 2026
        </span>

        <h1 className="mt-5 whitespace-nowrap font-black uppercase leading-[0.85] tracking-tight text-5xl md:text-7xl lg:text-8xl">
          <span className="text-neon-ice-50">Ice </span>
          <span className="text-magenta-bloom-400 [text-shadow:0_6px_0_var(--color-magenta-bloom-900)]">
            Breakers
          </span>
        </h1>

        <p className="mt-4 max-w-xl text-lg md:text-xl text-neon-ice-100/80">
          Fast skates. Loud sticks. Bigger fun.
          <br />
          Welcome to the rink.
        </p>

        <div className="relative mt-2 h-52 md:h-60">
          <HeroSkater />
        </div>
      </section>

      <KnowTheRules />
    </main>
  );
}
