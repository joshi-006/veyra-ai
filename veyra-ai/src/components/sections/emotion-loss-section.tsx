"use client";

import { useState, useRef, useEffect } from "react";
import { gsap } from "@/lib/scroll-choreography";

interface WaveformCanvasProps {
  vibrant: boolean;
}

/**
 * Canvas-based waveform rather than Three.js here — this comparison is a
 * 2D signal motif, not a 3D scene, so a lighter canvas draw keeps the
 * section GPU-cheap while still being fully animated and interactive.
 */
function WaveformCanvas({ vibrant }: WaveformCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const stateRef = useRef({ t: 0, vibrant });

  useEffect(() => {
    stateRef.current.vibrant = vibrant;
  }, [vibrant]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const canvasEl = canvas;
    const context = ctx;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    const resize = () => {
      const rect = canvasEl.getBoundingClientRect();
      canvasEl.width = rect.width * dpr;
      canvasEl.height = rect.height * dpr;
      context.scale(dpr, dpr);
    };
    resize();

    function draw() {
      const rect = canvasEl.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      context.clearRect(0, 0, w, h);

      stateRef.current.t += 0.018;
      const { t, vibrant: isVibrant } = stateRef.current;

      const bars = 64;
      const barWidth = w / bars;

      for (let i = 0; i < bars; i++) {
        const x = i * barWidth;
        const noise = Math.sin(i * 0.5 + t * 2) * Math.cos(i * 0.18 - t);
        const envelope = Math.sin((i / bars) * Math.PI);
        let amp = Math.abs(noise) * envelope;

        let color: string;
        if (isVibrant) {
          amp *= 0.85;
          const hue = 28 + i * 0.6;
          color = `hsla(${hue}, 45%, ${55 + amp * 20}%, ${0.55 + amp * 0.4})`;
        } else {
          amp *= 0.32 + 0.1 * Math.sin(t * 3 + i);
          color = `hsla(0, 0%, ${30 + amp * 15}%, ${0.3 + amp * 0.25})`;
        }

        const barHeight = Math.max(2, amp * h * 0.8);
        context.fillStyle = color;
        const radius = Math.min(2, barWidth * 0.3);
        context.beginPath();
        context.roundRect(
          x + barWidth * 0.15,
          h / 2 - barHeight / 2,
          barWidth * 0.7,
          barHeight,
          radius
        );
        context.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    }

    draw();

    const handleResize = () => resize();
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="h-full w-full" />;
}

export function EmotionLossSection() {
  const [activeTab, setActiveTab] = useState<"traditional" | "veyra">(
    "traditional"
  );
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;
    gsap.fromTo(
      cardRef.current,
      { opacity: 0.6 },
      { opacity: 1, duration: 0.5, ease: "power2.out" }
    );
  }, [activeTab]);

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center gap-12 bg-veyra-void px-6 py-32 md:px-12">
      <div className="max-w-2xl text-center">
        <p className="eyebrow mb-6">What gets lost</p>
        <h2 className="display-2 text-veyra-paper">
          Translation often keeps the words.
          <br />
          It rarely keeps the person.
        </h2>
      </div>

      <div className="w-full max-w-2xl">
        <div className="mb-6 flex justify-center gap-2">
          <button
            onClick={() => setActiveTab("traditional")}
            className={`eyebrow rounded-full px-5 py-2.5 transition-all duration-300 ${
              activeTab === "traditional"
                ? "bg-veyra-paper text-veyra-void"
                : "border border-veyra-line text-veyra-ash hover:border-veyra-ash"
            }`}
          >
            Traditional translation
          </button>
          <button
            onClick={() => setActiveTab("veyra")}
            className={`eyebrow rounded-full px-5 py-2.5 transition-all duration-300 ${
              activeTab === "veyra"
                ? "bg-veyra-signal text-veyra-void"
                : "border border-veyra-line text-veyra-ash hover:border-veyra-ash"
            }`}
          >
            Veyra
          </button>
        </div>

        <div
          ref={cardRef}
          className="overflow-hidden rounded-2xl border border-veyra-line bg-veyra-surface"
        >
          <div className="h-[220px] w-full px-4">
            <WaveformCanvas vibrant={activeTab === "veyra"} />
          </div>
          <div className="flex items-center justify-between border-t border-veyra-line px-6 py-4">
            <span className="text-sm text-veyra-ash">
              {activeTab === "traditional"
                ? "Tone flattened. Intent guessed. Emotion discarded."
                : "Tone preserved. Intent intact. Emotion carried through."}
            </span>
            <span
              className={`h-2 w-2 rounded-full ${
                activeTab === "traditional" ? "bg-veyra-ash" : "bg-veyra-signal"
              }`}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
