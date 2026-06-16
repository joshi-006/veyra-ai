import type { Metadata } from "next";
import "@/styles/globals.css";
import { SmoothScrollProvider } from "@/components/smooth-scroll-provider";

export const metadata: Metadata = {
  title: "Veyra — Every language speaks. Every emotion remains.",
  description:
    "Veyra is real-time AI voice translation that preserves meaning, tone, and human emotion across every language.",
  metadataBase: new URL("https://veyra.ai"),
  openGraph: {
    title: "Veyra — Every language speaks. Every emotion remains.",
    description:
      "Real-time AI voice translation that preserves meaning, tone, and human emotion.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-veyra-void text-veyra-paper antialiased">
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
