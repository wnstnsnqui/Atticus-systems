import type { Metadata } from "next";
import { env } from "@/lib/env";
import "./globals.css";

// Stub only: feature 10 (SEO & social cards) fills in the full metadata.
export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: "Atticus",
  description: "Premium software engineering.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
