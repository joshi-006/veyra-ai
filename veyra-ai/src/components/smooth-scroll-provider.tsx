"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

/**
 * Wraps the app in a Lenis smooth-scroll instance and syncs it to a single
 * rAF loop shared with GSAP ScrollTrigger (wired in useScrollChoreography).
 * Respects prefers-reduced-motion by skipping smoothing entirely — native
 * scroll takes over and all scroll-linked animations fall back to instant.
 */
export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
    });

    lenisRef.current = lenis;
    window.__veyraLenis = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      window.__veyraLenis = undefined;
    };
  }, []);

  return <>{children}</>;
}

declare global {
  interface Window {
    __veyraLenis?: Lenis;
  }
}
