// middleware.ts — locale routing
// Detects browser language from Accept-Language header and redirects
// non-English users to the appropriate locale-prefixed URL.
// English is the default — served at the root with no prefix.

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { locales, defaultLocale, isValidLocale } from "@/lib/i18n/config"

// Paths that should never be locale-redirected
const BYPASS = [
  "/_next",
  "/api",
  "/favicon",
  "/robots",
  "/sitemap",
  "/_headers",
  ".svg",
  ".png",
  ".jpg",
  ".ico",
  ".xml",
  ".txt",
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip static assets and API routes
  if (BYPASS.some(p => pathname.startsWith(p) || pathname.endsWith(p))) {
    return NextResponse.next()
  }

  // If the URL already has a locale prefix, let it through
  const firstSegment = pathname.split("/")[1]
  if (isValidLocale(firstSegment)) {
    return NextResponse.next()
  }

  // Detect preferred locale from Accept-Language header
  const acceptLang = request.headers.get("accept-language") ?? ""
  const preferred  = detectPreferredLocale(acceptLang)

  // English is default — no redirect needed
  if (preferred === defaultLocale) {
    return NextResponse.next()
  }

  // Redirect to locale-prefixed URL
  const url = request.nextUrl.clone()
  url.pathname = `/${preferred}${pathname}`
  return NextResponse.redirect(url, 307) // 307 = temporary, preserves method
}

export const config = {
  matcher: [
    // Match all paths except Next.js internals and static files
    "/((?!_next/static|_next/image|favicon\\.ico).*)",
  ],
}

function detectPreferredLocale(acceptLanguage: string): typeof locales[number] {
  if (!acceptLanguage) return defaultLocale

  // Parse Accept-Language header — "ja-JP,ja;q=0.9,en;q=0.8"
  const parts = acceptLanguage
    .split(",")
    .map(part => {
      const [lang, q] = part.trim().split(";q=")
      return { lang: lang.trim().toLowerCase(), q: parseFloat(q ?? "1") }
    })
    .sort((a, b) => b.q - a.q)

  for (const { lang } of parts) {
    // Match "ja", "ja-JP", "zh", "zh-CN", "zh-TW", etc.
    const base = lang.split("-")[0]
    if (isValidLocale(base) && base !== defaultLocale) {
      return base
    }
  }

  return defaultLocale
}
