"use client";

import { TextReveal } from "@/components/text-reveal";

export function CallToActionSection() {
  return (
    <section className="relative flex min-h-[80vh] flex-col items-center justify-center gap-10 bg-veyra-void px-6 py-32 text-center md:px-12">
      <TextReveal
        as="h2"
        mode="mask"
        className="display-1 max-w-4xl text-veyra-paper"
      >
        {"Speak as yourself.\nIn every language."}
      </TextReveal>

      <p className="body-lg max-w-md">
        Veyra is in early access for teams building the next generation of
        human communication.
      </p>

      <a
        href="mailto:access@veyra.ai"
        className="group inline-flex items-center gap-2 rounded-full bg-veyra-paper px-8 py-4 text-sm font-medium text-veyra-void transition-all duration-500 hover:bg-veyra-signal"
      >
        Request access
        <span className="transition-transform duration-500 group-hover:translate-x-1">
          →
        </span>
      </a>

      <div className="mt-16 flex w-full max-w-4xl flex-col items-center gap-6 border-t border-veyra-line pt-10 text-xs text-veyra-ash md:flex-row md:justify-between">
        <span>© 2026 Veyra AI Technologies</span>
        <div className="flex gap-6">
          <a href="#" className="hover:text-veyra-paper transition-colors">
            Privacy
          </a>
          <a href="#" className="hover:text-veyra-paper transition-colors">
            Research
          </a>
          <a href="#" className="hover:text-veyra-paper transition-colors">
            Contact
          </a>
        </div>
      </div>
    </section>
  );
}
