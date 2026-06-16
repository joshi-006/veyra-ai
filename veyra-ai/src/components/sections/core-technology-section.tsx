"use client";

import { useRef, useState } from "react";

interface BentoCardProps {
  title: string;
  description: string;
  className?: string;
}

export function BentoCard({ title, description, className = "" }: BentoCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [glow, setGlow] = useState({ x: 50, y: 50, opacity: 0 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setGlow({ x, y, opacity: 1 });

    const tiltX = ((e.clientY - rect.top) / rect.height - 0.5) * -4;
    const tiltY = ((e.clientX - rect.left) / rect.width - 0.5) * 4;
    setTilt({ x: tiltX, y: tiltY });
  }

  function handleMouseLeave() {
    setGlow((g) => ({ ...g, opacity: 0 }));
    setTilt({ x: 0, y: 0 });
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1)",
      }}
      className={`group relative overflow-hidden rounded-2xl border border-veyra-line bg-veyra-surface p-8 ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: glow.opacity,
          background: `radial-gradient(280px circle at ${glow.x}% ${glow.y}%, rgba(232,217,192,0.08), transparent 70%)`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300"
        style={{
          opacity: glow.opacity,
          background: `radial-gradient(220px circle at ${glow.x}% ${glow.y}%, rgba(232,217,192,0.25), transparent 70%)`,
          mask: "linear-gradient(black, black) content-box, linear-gradient(black, black)",
          WebkitMaskComposite: "xor",
          padding: "1px",
        }}
      />
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
