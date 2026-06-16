"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { TextReveal } from "@/components/text-reveal";

export function HeroArrival({
  scrollProgress,
}: {
  scrollProgress: { current: number };
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={containerRef}
      className="relative h-[100vh] w-full overflow-hidden bg-veyra-void"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #040507 0%, #08090B 100%)",
        }}
      />

      <div className="pointer-events-none absolute inset-0 hero-grid-pattern" />

      <div className="relative z-10 flex h-full flex-col">
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="flex items-center justify-between px-6 py-6 md:px-12"
        >
          <span className="font-display text-sm font-medium tracking-tightest text-veyra-paper">
            Veyra
          </span>
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#technology" className="eyebrow text-veyra-ash hover:text-veyra-paper transition-colors duration-300">
              Technology
            </a>
            <a href="#research" className="eyebrow text-veyra-ash hover:text-veyra-paper transition-colors duration-300">
              Research
            </a>
            <a href="#applications" className="eyebrow text-veyra-ash hover:text-veyra-paper transition-colors duration-300">
              Applications
            </a>
          </nav>
          <a
            href="#demo"
            className="eyebrow rounded-full border border-veyra-line px-4 py-2 text-veyra-paper transition-colors duration-300 hover:border-veyra-paper"
          >
            Request access
          </a>
        </motion.header>

        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <TextReveal
            as="h1"
            mode="stagger-chars"
            start="top 95%"
            className="display-1 max-w-5xl text-veyra-paper"
          >
            {"Every language speaks.\nEvery emotion remains."}
          </TextReveal>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.9 }}
            className="body-lg mt-7 max-w-xl"
          >
            Real-time AI voice translation that preserves meaning, tone, and
            human emotion.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 1.15 }}
            className="mt-10"
          >
            <a
              href="#problem"
              className="group inline-flex items-center gap-2 rounded-full border border-veyra-paper/30 px-6 py-3 text-sm text-veyra-paper transition-all duration-500 hover:border-veyra-paper hover:bg-veyra-paper hover:text-veyra-void"
            >
              Explore technology
              <span className="transition-transform duration-500 group-hover:translate-x-1">
                →
              </span>
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.6 }}
          className="flex justify-center pb-10"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="eyebrow">Scroll</span>
            <span className="h-8 w-px animate-pulse bg-veyra-ash/50" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
