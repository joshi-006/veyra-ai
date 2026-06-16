"use client";

import { useRef, useEffect, createElement } from "react";
import type { ElementType } from "react";
import { gsap } from "@/lib/scroll-choreography";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type RevealMode = "mask" | "blur" | "stagger-chars" | "stagger-words";

interface TextRevealProps {
  children: string;
  mode?: RevealMode;
  as?: ElementType;
  className?: string;
  start?: string;
  delay?: number;
}

/**
 * Splits text and animates it in on scroll using the requested reveal
 * style. All three styles described in the brief (blur reveal, character
 * stagger, mask animation) are implemented here so sections can mix them
 * deliberately rather than reusing one effect everywhere.
 */
export function TextReveal({
  children,
  mode = "mask",
  as = "div",
  className = "",
  start = "top 80%",
  delay = 0,
}: TextRevealProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) {
      root.querySelectorAll<HTMLElement>("[data-reveal-unit]").forEach((el) => {
        el.style.opacity = "1";
      });
      return;
    }

    let targets: HTMLElement[] = [];
    let tween: gsap.core.Tween | undefined;
    let trigger: ScrollTrigger | undefined;

    if (mode === "mask") {
      const lines = root.querySelectorAll<HTMLElement>("[data-reveal-line]");
      targets = Array.from(lines);
      gsap.set(targets, { yPercent: 110 });
      tween = gsap.to(targets, {
        yPercent: 0,
        duration: 1.1,
        ease: "power4.out",
        stagger: 0.08,
        delay,
        paused: true,
      });
    } else if (mode === "blur") {
      targets = [root];
      gsap.set(root, { opacity: 0, filter: "blur(14px)", y: 16 });
      tween = gsap.to(root, {
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        duration: 1.2,
        ease: "power3.out",
        delay,
        paused: true,
      });
    } else {
      const units = root.querySelectorAll<HTMLElement>("[data-reveal-unit]");
      targets = Array.from(units);
      gsap.set(targets, { opacity: 0, y: 14, filter: "blur(6px)" });
      tween = gsap.to(targets, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.6,
        ease: "power3.out",
        stagger: mode === "stagger-chars" ? 0.015 : 0.04,
        delay,
        paused: true,
      });
    }

    trigger = ScrollTrigger.create({
      trigger: root,
      start,
      onEnter: () => tween?.play(),
      once: true,
    });

    return () => {
      trigger?.kill();
      tween?.kill();
    };
  }, [mode, start, delay]);

  const renderContent = () => {
    if (mode === "mask") {
      const lines = children.split("\n");
      return lines.map((line, i) => (
        <span key={i} className="mask-line block">
          <span data-reveal-line className="block">
            {line}
          </span>
        </span>
      ));
    }
    if (mode === "blur") {
      return children;
    }
    const units =
      mode === "stagger-chars" ? children.split("") : children.split(" ");
    return units.map((unit, i) => (
      <span key={i} data-reveal-unit className="inline-block">
        {unit}
        {mode === "stagger-words" && i < units.length - 1 ? "\u00A0" : ""}
      </span>
    ));
  };

  return createElement(
    as,
    { ref: rootRef, className },
    renderContent()
  );
}
