// lib/config.ts — Global site configuration
export const siteConfig = {
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://aistacker.dev",
  name: "AIStacker",
  description:
    "Lightweight, open-source, browser-based developer tools. JSON formatter, Base64 encoder, UUID generator, Regex tester, and 200+ more — all run locally.",
}
