// lib/i18n/config.ts
export const locales      = ["en", "ja", "zh"] as const
export type  Locale       = typeof locales[number]
export const defaultLocale: Locale = "en"

export const localeNames: Record<Locale, string> = {
  en: "English",
  ja: "日本語",
  zh: "中文",
}

export const localePaths: Record<Locale, string> = {
  en: "",       // /tools/json-formatter
  ja: "/ja",    // /ja/tools/json-formatter
  zh: "/zh",    // /zh/tools/json-formatter
}

export function isValidLocale(s: string): s is Locale {
  return (locales as readonly string[]).includes(s)
}
