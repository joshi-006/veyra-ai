"use client";

import { useRef, useState } from "react";

interface BentoCardProps {
  title: string;
  description: string;
  className?: string;
}

export function BentoCard({ title, description, className = "" }: BentoCardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-veyra-line bg-veyra-surface p-8 ${className}`}
    >
      <h3 className="font-display text-xl font-medium text-veyra-paper">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-veyra-ash">
        {description}
      </p>
    </div>
  );
}

const CARDS = [
  {
    title: "Emotion intelligence engine",
    description:
      "Reads tone, pace, and inflection as signal, not noise — modeling the emotional shape of speech alongside its words.",
    className: "md:col-span-2",
  },
  {
    title: "Context awareness layer",
    description:
      "Tracks conversational history and intent so translations stay coherent across a full exchange, not just a single line.",
  },
  {
    title: "Multilingual voice processing",
    description:
      "Native-grade fluency across languages, built from voice data rather than text-first models retrofitted for speech.",
  },
  {
    title: "Real-time translation core",
    description:
      "Sub-second latency from spoken input to translated, emotionally matched output — fast enough to feel like conversation.",
    className: "md:col-span-2",
  },
  {
    title: "Human tone preservation",
    description:
      "Reconstructs the speaker's tone in the target language, rather than defaulting to a flat, neutral voice.",
  },
  {
    title: "Adaptive learning system",
    description:
      "Improves with every exchange, learning the cadence of individual speakers and the texture of new languages.",
  },
];

export function CoreTechnologySection() {
  return (
    <section
      id="technology"
      className="relative bg-veyra-void px-6 py-32 md:px-12"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 max-w-2xl">
          <p className="eyebrow mb-6">Core technology</p>
          <h2 className="display-2 text-veyra-paper">
            Six systems. One conversation.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {CARDS.map((card) => (
            <BentoCard key={card.title} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
}
