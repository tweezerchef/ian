import { HeroSkater } from "@/components/HeroSkater";
import { KnowTheRules } from "@/components/KnowTheRules";
import { LeadingStats } from "@/components/LeadingStats";
import { Legends } from "@/components/Legends";
import { RulesList } from "@/components/RulesList";
import { TeamPicker } from "@/components/TeamPicker";

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

      <section className="relative z-10 mx-auto max-w-6xl px-6 pt-6 pb-2 md:pt-8">
        <span className="inline-flex items-center gap-2 rounded-full border-2 border-yellow-green-400 bg-yellow-green-400/10 px-3 py-0.5 text-xs font-bold uppercase tracking-widest text-yellow-green-300">
          <span className="h-2 w-2 rounded-full bg-yellow-green-400 animate-pulse" />
          Puck Drop 2026
        </span>

        <h1 className="font-black uppercase leading-[0.85] tracking-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
          <span className="text-neon-ice-50">Ice </span>
          <span className="text-magenta-bloom-400 [text-shadow:0_4px_0_var(--color-magenta-bloom-900)]">
            Breakers
          </span>
        </h1>

        <p className="mt-1.5 max-w-xl text-sm md:text-base text-neon-ice-100/80">
          Fast skates. Loud sticks. Bigger fun.
          <br />
          Welcome to the rink.
        </p>

        <div className="relative h-32 md:h-40 lg:h-44">
          <HeroSkater />
        </div>
      </section>

      <KnowTheRules />
      <RulesList />
      <Legends />
      <LeadingStats />
      <TeamPicker />
    </main>
  );
}
