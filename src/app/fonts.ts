import { GeistMono } from "geist/font/mono";
import localFont from "next/font/local";

// Self hosted so the build never touches the network and the CSP stays
// 'self' only. Licence: ./fonts/Satoshi-LICENSE.txt (ITF Free Font License).
export const satoshi = localFont({
  src: "./fonts/Satoshi-Variable.woff2",
  variable: "--font-satoshi",
  weight: "300 900",
  display: "swap",
  adjustFontFallback: "Arial",
});

export const geistMono = GeistMono;

export const fontVariables = `${satoshi.variable} ${geistMono.variable}`;
