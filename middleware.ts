// middleware.ts — Locale routing (v2)
//
// Priority order (highest → lowest):
//   1. Cookie "aistacker-locale" — user's explicit choice via language switcher
//   2. Accept-Language header   — browser/OS preference
//   3. Default (en)
//
// Key fixes vs v1:
//   - Cookie takes absolute priority → clicking EN in switcher persists across requests
//   - detectPreferredLocale() now finds the HIGHEST-q supported locale, not the
//     first non-English one. This fixes zh redirect when en is q=0.9, zh is q=0.8.
//   - English is the default locale: served at / with no prefix, never redirected.

import { NextResponse }              from "next/server"
import type { NextRequest }          from "next/server"
import { locales, defaultLocale, isValidLocale } from "@/lib/i18n/config"

export const LOCALE_COOKIE = "aistacker-locale"

// ── Paths to never redirect ──────────────────────────────────────────────────
const BYPASS_PREFIXES = ["/_next", "/api", "/favicon", "/robots", "/sitemap"]
const BYPASS_SUFFIXES = [".svg", ".png", ".jpg", ".ico", ".xml", ".txt", ".json", ".mjs", ".webp"]

function shouldBypass(pathname: string): boolean {
  return (
    BYPASS_PREFIXES.some(p => pathname.startsWith(p)) ||
    BYPASS_SUFFIXES.some(s => pathname.endsWith(s))
  )
}

// ── Main middleware ───────────────────────────────────────────────────────────

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (shouldBypass(pathname)) return NextResponse.next()

  // If URL already carries a valid non-default locale prefix, serve as-is.
  // Also handles the case where the URL IS the locale root (e.g. /ja or /zh).
  const firstSegment = pathname.split("/")[1]
  if (isValidLocale(firstSegment) && firstSegment !== defaultLocale) {
    return NextResponse.next()
  }

  // ── 1. Cookie — explicit user choice, always wins ─────────────────────────
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value
  if (cookieLocale && isValidLocale(cookieLocale)) {
    if (cookieLocale === defaultLocale) {
      // User chose EN explicitly — never redirect regardless of Accept-Language
      return NextResponse.next()
    }
    // User chose a non-default locale — redirect to prefixed URL if not already there
    if (!pathname.startsWith(`/${cookieLocale}`)) {
      const url = request.nextUrl.clone()
      url.pathname = `/${cookieLocale}${pathname}`
      return NextResponse.redirect(url, 307)
    }
    return NextResponse.next()
  }

  // ── 2. Accept-Language — browser/OS preference ────────────────────────────
  const acceptLang = request.headers.get("accept-language") ?? ""
  const preferred  = detectPreferredLocale(acceptLang)

  if (preferred === defaultLocale) {
    return NextResponse.next()
  }

  // Redirect to locale-prefixed URL
  const url = request.nextUrl.clone()
  url.pathname = `/${preferred}${pathname}`
  return NextResponse.redirect(url, 307)
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico).*)"],
}

// ── Locale detection from Accept-Language ─────────────────────────────────────
//
// CORRECT algorithm: find the supported locale with the HIGHEST q value.
// This means if Accept-Language is "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
// the result is "en" (q=1.0), not "zh" (q=0.8).
//
// Previous version iterated and returned the first non-English supported locale,
// which would return "zh" even when English was the most preferred language.

export function detectPreferredLocale(acceptLanguage: string): typeof locales[number] {
  if (!acceptLanguage) return defaultLocale

  // Parse: "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7"
  const parsed = acceptLanguage
    .split(",")
    .map(part => {
      const trimmed = part.trim()
      const qMatch  = trimmed.match(/;q=([\d.]+)/)
      const q       = qMatch ? parseFloat(qMatch[1]) : 1.0
      const lang    = trimmed.split(";")[0].trim().toLowerCase()
      const base    = lang.split("-")[0]   // "zh-CN" → "zh", "en-US" → "en"
      return { lang, base, q }
    })
    .sort((a, b) => b.q - a.q)  // highest q first

  // Find the supported locale with the highest q value
  for (const { base } of parsed) {
    if (isValidLocale(base)) {
      return base  // returns "en" if en has higher q than zh
    }
  }

  return defaultLocale
}
