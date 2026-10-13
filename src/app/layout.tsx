import type { Metadata } from "next";
import { MotionProvider } from "@/components/ui/motion-provider";
import { noscriptRevealStyle } from "@/components/ui/reveal-motion";
import { env } from "@/lib/env";
import { fontVariables } from "./fonts";
import "./globals.css";

// Stub only: feature 10 (SEO & social cards) fills in the full metadata.
export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: "Atticus",
  description: "Premium software engineering.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={fontVariables}>
      <head>
        <noscript>
          <style>{noscriptRevealStyle}</style>
        </noscript>
      </head>
      <body>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
