"use client";

import { useRef, useEffect } from "react";
import { HeroArrival } from "@/components/sections/hero-arrival";
import { HumanCommunicationSection } from "@/components/sections/human-communication-section";
import { EmotionLossSection } from "@/components/sections/emotion-loss-section";
import { CoreTechnologySection } from "@/components/sections/core-technology-section";
import { InteractiveDemoSection } from "@/components/sections/interactive-demo-section";
import { ResearchSection } from "@/components/sections/research-section";
import { FutureApplicationsSection } from "@/components/sections/future-applications-section";
import { CallToActionSection } from "@/components/sections/call-to-action-section";
import { useScrollChoreography } from "@/lib/scroll-choreography";

export default function HomePage() {
  useScrollChoreography();

  // Shared ref (not state) so the hero's R3F scene reads scroll progress
  // every frame without triggering React re-renders.
  const scrollProgress = useRef(0);

  useEffect(() => {
    function handleScroll() {
      const heroHeight = window.innerHeight;
      const progress = Math.min(1, Math.max(0, window.scrollY / heroHeight));
      scrollProgress.current = progress;
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="relative w-full">
      <HeroArrival scrollProgress={scrollProgress} />
      <HumanCommunicationSection />
      <EmotionLossSection />
      <CoreTechnologySection />
      <InteractiveDemoSection />
      <ResearchSection />
      <FutureApplicationsSection />
      <CallToActionSection />
    </main>
  );
}
