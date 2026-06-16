"use client";

import { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/scroll-choreography";

export function AnimatedDataLine({
  seed = 1,
  label,
}: {
  seed?: number;
  label: string;
}) {
  const pathRef = useRef<SVGPathElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    const wrap = wrapRef.current;
    if (!path || !wrap) return;

    const length = path.getTotalLength();
    gsap.set(path, {
      strokeDasharray: length,
      strokeDashoffset: length,
    });

    const trigger = ScrollTrigger.create({
      trigger: wrap,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 1.6,
          ease: "power2.out",
        });
      },
    });

    return () => trigger.kill();
  }, []);

  const points = Array.from({ length: 24 })
    .map((_, i) => {
      const x = (i / 23) * 280;
      const y =
        50 -
        Math.sin(i * 0.4 + seed) * 16 -
        Math.cos(i * 0.18 + seed * 2) * 10 -
        i * 0.3;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <div ref={wrapRef} className="rounded-xl border border-veyra-line p-5">
      <svg viewBox="0 0 280 60" className="w-full text-veyra-current">
        <line
          x1="0"
          y1="55"
          x2="280"
          y2="55"
          stroke="currentColor"
          strokeOpacity="0.15"
          strokeWidth="0.5"
        />
        <path
          ref={pathRef}
          d={points}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
      </svg>
      <p className="mt-3 font-mono text-xs tracking-wide text-veyra-ash">
        {label}
      </p>
    </div>
  );
}

const METRICS = [
  { label: "Emotional fidelity score, training epochs", seed: 1.2 },
  { label: "Cross-lingual tone retention, eval set", seed: 2.4 },
  { label: "Latency reduction, inference passes", seed: 3.6 },
];

export function ResearchSection() {
  return (
    <section
      id="research"
      className="relative bg-veyra-void px-6 py-32 md:px-12"
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-16 grid gap-10 border-b border-veyra-line pb-16 md:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="eyebrow mb-6">Research</p>
            <h2 className="display-2 text-veyra-paper">
              Built like a research lab. Shipped like a product.
            </h2>
          </div>
          <p className="body-lg self-end">
            Veyra's emotion-preservation models are developed the way
            fundamental AI research is — published architecture notes, open
            evaluation methodology, and a standing commitment to measuring
            what most translation systems never tried to.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {METRICS.map((m) => (
            <AnimatedDataLine key={m.label} {...m} />
          ))}
        </div>
      </div>
    </section>
  );
}
