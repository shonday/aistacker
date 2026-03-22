// lib/i18n/index.ts
import { en }  from "./messages/en"
import { ja }  from "./messages/ja"
import { zh }  from "./messages/zh"
import type { Locale } from "./config"
export type { Messages } from "./messages/en"

const messages = { en, ja, zh } as const

export function getMessages(locale: Locale) {
  return messages[locale] ?? messages.en
}

// hreflang alternates for <head> — tells Google which page is the canonical
// for each language, which is the #1 factor for multilingual SEO.
export function getHreflangAlternates(path: string, siteUrl: string) {
  return [
    { hreflang: "en",    href: `${siteUrl}${path}` },
    { hreflang: "ja",    href: `${siteUrl}/ja${path}` },
    { hreflang: "zh",    href: `${siteUrl}/zh${path}` },
    { hreflang: "x-default", href: `${siteUrl}${path}` },
  ]
}
