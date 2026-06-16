"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

/**
 * Registers ScrollTrigger once and ties its refresh loop to Lenis so the
 * two scroll systems agree on scroll position. Each section component calls
 * this before wiring its own triggers.
 */
export function useScrollChoreography() {
  useEffect(() => {
    if (!registered) {
      gsap.registerPlugin(ScrollTrigger);
      registered = true;
    }

    const lenis = window.__veyraLenis;

    if (lenis) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }

    return () => {
      // ScrollTrigger instances are killed by the components that own them;
      // this hook only manages the global ticker/listener wiring.
    };
  }, []);
}

export { gsap, ScrollTrigger };
