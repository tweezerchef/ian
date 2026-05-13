"use client";

import { motion } from "motion/react";
import { HockeyPlayer } from "./HockeyPlayer";

export function HeroSkater() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute inset-x-0 bottom-6 h-px bg-gradient-to-r from-transparent via-neon-ice-400/70 to-transparent" />
      <div className="absolute inset-x-0 bottom-2 h-10 bg-gradient-to-b from-neon-ice-400/10 to-transparent blur-md" />

      <motion.div
        className="absolute bottom-2 left-0 w-64 md:w-80"
        initial={{ x: "-25vw" }}
        animate={{
          x: ["-25vw", "115vw"],
          y: [0, -6, 0, -8, 0],
          rotate: [-2, -1, -2, -3, -2],
        }}
        transition={{
          x: { duration: 5.5, repeat: Infinity, ease: "linear" },
          y: {
            duration: 0.55,
            repeat: Infinity,
            ease: "easeInOut",
          },
          rotate: {
            duration: 0.55,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      >
        <HockeyPlayer className="w-full h-auto drop-shadow-[0_8px_0_var(--color-magenta-bloom-900)]" />
      </motion.div>
    </div>
  );
}
