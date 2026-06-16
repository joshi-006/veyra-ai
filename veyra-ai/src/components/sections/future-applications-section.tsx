"use client";

import { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/scroll-choreography";

const APPLICATIONS = [
  {
    title: "Global meetings",
    description:
      "Teams across continents speak naturally, in their own languages, without losing the tone of what's actually being said.",
  },
  {
    title: "Healthcare",
    description:
      "Clinicians and patients communicate with full nuance, where a tremor in someone's voice can matter as much as their words.",
  },
  {
    title: "Education",
    description:
      "Students learn from instructors worldwide, with explanations that carry their original warmth, urgency, or humor intact.",
  },
  {
    title: "Customer support",
    description:
      "Frustration, relief, and gratitude translate as clearly as the request itself, so resolution feels human, not transactional.",
  },
  {
    title: "International business",
    description:
      "Negotiations keep their tone — confidence, caution, warmth — across every language at the table.",
  },
  {
    title: "Accessibility",
    description:
      "Voice becomes a universal interface, carrying emotional context to and from anyone, regardless of language or hearing.",
  },
];

export function FutureApplicationsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const scrollDistance = track.scrollWidth - window.innerWidth;
    if (scrollDistance <= 0) return;

    const tween = gsap.to(track, {
      x: -scrollDistance,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${scrollDistance}`,
        scrub: true,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section
      id="applications"
      ref={sectionRef}
      className="relative h-screen overflow-hidden bg-veyra-void"
    >
      <div className="absolute left-6 top-12 z-10 md:left-12">
        <p className="eyebrow">Future applications</p>
      </div>

      <div
        ref={trackRef}
        className="flex h-full items-center gap-6 px-6 will-change-transform md:px-12"
      >
        {APPLICATIONS.map((app) => (
          <div
            key={app.title}
            className="group flex h-[60vh] w-[78vw] flex-shrink-0 flex-col justify-end rounded-2xl border border-veyra-line bg-veyra-surface p-10 transition-all duration-500 hover:border-veyra-ash md:w-[34vw]"
          >
            <h3 className="font-display text-2xl font-medium text-veyra-paper">
              {app.title}
            </h3>
            <p className="mt-4 max-h-0 overflow-hidden text-sm leading-relaxed text-veyra-ash opacity-0 transition-all duration-500 group-hover:max-h-40 group-hover:opacity-100">
              {app.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
