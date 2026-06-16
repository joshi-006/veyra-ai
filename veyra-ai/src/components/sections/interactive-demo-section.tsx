"use client";

import { useState } from "react";

const LANGUAGES = ["English", "Japanese", "Spanish", "Arabic", "Mandarin"];
const EMOTIONS = [
  { id: "calm", label: "Calm" },
  { id: "joy", label: "Joy" },
  { id: "urgency", label: "Urgency" },
  { id: "sincerity", label: "Sincerity" },
];

function PillSelect({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`rounded-full px-4 py-2 text-sm transition-all duration-300 ${
            value === opt
              ? "bg-veyra-paper text-veyra-void"
              : "border border-veyra-line text-veyra-ash hover:border-veyra-ash"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

export function InteractiveDemoSection() {
  const [langA, setLangA] = useState("English");
  const [langB, setLangB] = useState("Japanese");
  const [emotion, setEmotion] = useState("sincerity");
  const [transformed, setTransformed] = useState(false);

  return (
    <section
      id="demo"
      className="relative flex min-h-screen flex-col items-center justify-center gap-12 bg-veyra-void px-6 py-32 md:px-12"
    >
      <div className="max-w-2xl text-center">
        <p className="eyebrow mb-6">Interactive demonstration</p>
        <h2 className="display-2 text-veyra-paper">
          Choose the languages. Choose the emotion. Watch it carry through.
        </h2>
      </div>

      <div className="relative h-[340px] w-full max-w-3xl overflow-hidden rounded-2xl border border-veyra-line bg-veyra-surface">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(8,9,11,1) 0%, rgba(15,18,20,1) 100%), radial-gradient(circle at 20% 30%, rgba(255,255,255,0.06), transparent 20%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.04), transparent 15%), radial-gradient(circle at 50% 70%, rgba(255,255,255,0.03), transparent 12%)",
          }}
        />
        <div className="absolute inset-0 opacity-70">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 25% 25%, rgba(255,255,255,0.02), transparent 20%), radial-gradient(circle at 75% 50%, rgba(255,255,255,0.02), transparent 16%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
              backgroundSize: "120px 120px",
            }}
          />
        </div>
        <div className="relative flex h-full flex-col items-center justify-center px-8 text-center text-veyra-paper">
          <p className="mb-3 text-sm uppercase tracking-[0.35em] text-veyra-ash">
            Translation preview
          </p>
          <p className="max-w-xl text-lg leading-relaxed">
            {transformed
              ? "Output rendered with tone and intent preserved — subtle, stable, and readable."
              : "Select languages and emotion, then translate to see the signal flow without distracting glow."}
          </p>
        </div>
      </div>

      <div className="grid w-full max-w-3xl gap-8 md:grid-cols-3">
        <div>
          <p className="eyebrow mb-3">Language A</p>
          <PillSelect options={LANGUAGES} value={langA} onChange={setLangA} />
        </div>
        <div>
          <p className="eyebrow mb-3">Language B</p>
          <PillSelect options={LANGUAGES} value={langB} onChange={setLangB} />
        </div>
        <div>
          <p className="eyebrow mb-3">Emotion</p>
          <PillSelect
            options={EMOTIONS.map((e) => e.label)}
            value={EMOTIONS.find((e) => e.id === emotion)?.label ?? ""}
            onChange={(label) => {
              const match = EMOTIONS.find((e) => e.label === label);
              if (match) setEmotion(match.id);
            }}
          />
        </div>
      </div>

      <button
        onClick={() => setTransformed((t) => !t)}
        className="eyebrow rounded-full border border-veyra-paper/40 px-6 py-3 text-veyra-paper transition-all duration-300 hover:border-veyra-paper hover:bg-veyra-paper hover:text-veyra-void"
      >
        {transformed ? "Reset signal" : `Translate ${langA} → ${langB}`}
      </button>
    </section>
  );
}
