"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger immediately to ensure it's available globally
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Syncs ScrollTrigger to Lenis so the two scroll systems agree on scroll position.
 * Called once per app to wire up the scroll listeners.
 */
export function useScrollChoreography() {
  useEffect(() => {
    const lenis = window.__veyraLenis;

    if (lenis) {
      // Update ScrollTrigger when Lenis scrolls
      lenis.on("scroll", ScrollTrigger.update);
      
      // Sync GSAP ticker to Lenis for smooth animations
      gsap.ticker.add((time) => {
        ScrollTrigger.update();
      });
      
      gsap.ticker.lagSmoothing(0);
    }

    return () => {
      // Cleanup: remove Lenis listener
      if (lenis) {
        lenis.off("scroll", ScrollTrigger.update);
      }
    };
  }, []);
}

export { gsap, ScrollTrigger };
