"use client";

import { useRef, useEffect } from "react";
import { TextReveal } from "@/components/text-reveal";
import { gsap, ScrollTrigger } from "@/lib/scroll-choreography";

/**
 * Sound-wave-to-emotional-signal visualization. Built as an inline SVG
 * line that GSAP morphs across scroll progress — no canvas needed for
 * this lightweight motif, keeping the Three.js budget for the hero,
 * emotion-loss comparison, and demo sections.
 */
function WaveformMotif() {
  const pathRef = useRef<SVGPathElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const path = pathRef.current;
    if (!section || !path) return;

    const flatPath = "M0,40 L800,40";
    const wavePath = Array.from({ length: 17 })
      .map((_, i) => {
        const x = (i / 16) * 800;
        const amp = 22 * Math.sin(i * 0.9) * (0.4 + i / 16);
        return `${i === 0 ? "M" : "L"}${x},${40 + amp}`;
      })
      .join(" ");

    gsap.set(path, { attr: { d: flatPath } });

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top 70%",
      end: "bottom 30%",
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        const interpolated = Array.from({ length: 17 })
          .map((_, i) => {
            const x = (i / 16) * 800;
            const amp = 22 * Math.sin(i * 0.9) * (0.4 + i / 16) * progress;
            return `${i === 0 ? "M" : "L"}${x},${40 + amp}`;
          })
          .join(" ");
        path.setAttribute("d", interpolated);
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <svg
      viewBox="0 0 800 80"
      className="w-full max-w-3xl text-veyra-signal"
      aria-hidden="true"
    >
      <path
        ref={pathRef}
        d="M0,40 L800,40"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function HumanCommunicationSection() {
  return (
    <section
      id="problem"
      className="relative flex min-h-screen flex-col items-center justify-center gap-16 bg-veyra-void px-6 py-32 md:px-12"
    >
      <div className="max-w-3xl text-center">
        <TextReveal as="p" mode="stagger-words" className="eyebrow mb-6">
          The problem
        </TextReveal>
        <TextReveal
          as="h2"
          mode="mask"
          className="display-2 text-veyra-paper"
        >
          {"Humans speak in more\nthan words."}
        </TextReveal>
        <p className="body-lg mx-auto mt-6 max-w-xl">
          A pause, a tremor, a rise at the end of a sentence — meaning lives
          in the texture of a voice, not just its transcript.
        </p>
      </div>

      <WaveformMotif />

      <div className="max-w-2xl text-center">
        <TextReveal
          as="p"
          mode="blur"
          className="display-3 text-veyra-ash"
          start="top 75%"
        >
          Translation has always asked people to choose between being
          understood and being heard.
        </TextReveal>
      </div>
    </section>
  );
}
