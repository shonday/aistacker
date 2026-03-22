"use client"

import Link               from "next/link"
import { usePathname }    from "next/navigation"
import { Layers }         from "lucide-react"
import { cn }             from "@/lib/utils"
import { ThemeToggle }    from "@/components/ThemeToggle"
import { localeNames, type Locale } from "@/lib/i18n/config"
import { LOCALE_COOKIE }  from "@/middleware"

// ── Locale detection ─────────────────────────────────────────────────────────

function useLocaleAndBase(): { locale: Locale; base: string } {
  const pathname = usePathname()
  const seg      = pathname.split("/")[1]
  if (seg === "ja" || seg === "zh") {
    return { locale: seg, base: `/${seg}` }
  }
  return { locale: "en", base: "" }
}

// ── Locale switcher ───────────────────────────────────────────────────────────

function switchLocale(next: Locale, currentLocale: Locale, pathname: string): string {
  const currentPrefix = currentLocale === "en" ? "" : `/${currentLocale}`
  const nextPrefix    = next          === "en" ? "" : `/${next}`
  const rest          = pathname.startsWith(currentPrefix)
    ? pathname.slice(currentPrefix.length)
    : "/"
  return `${nextPrefix}${rest || "/"}`
}

// Writes the locale cookie so middleware respects the user's explicit choice.
// This is the key fix: without the cookie, middleware re-detects from
// Accept-Language on every request and overrides the user's EN selection.
function setLocaleCookie(locale: Locale): void {
  // Max-age = 1 year; SameSite=Lax is safe for navigation
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; SameSite=Lax`
}

// ── Component ─────────────────────────────────────────────────────────────────

export function SiteHeader() {
  const pathname          = usePathname()
  const { locale, base } = useLocaleAndBase()

  const NAV = [
    { href: `${base}/`,       label: "Home",      exact: true  },
    { href: `${base}/tools`,  label: "Tools", exact: false },
    { href: `${base}/guides`, label: "Guides",    exact: false },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-5 px-6">

        {/* Logo */}
        <Link href={`${base}/`} className="flex items-center gap-2 font-semibold tracking-tight shrink-0">
          <Layers className="h-5 w-5" />
          <span>AIStacker</span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-1">
          {NAV.map(({ href, label, exact }) => {
            const active = exact
              ? pathname === href
              : pathname.startsWith(href) && href !== `${base}/`
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm transition-colors",
                  active
                    ? "bg-muted font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Right: language switcher + theme */}
        <div className="ml-auto flex items-center gap-1">

          {/* Language switcher — sets cookie before navigating */}
          <div className="flex items-center rounded-md border border-border/60 bg-muted/40 p-0.5">
            {(Object.keys(localeNames) as Locale[]).map(l => (
              <Link
                key={l}
                href={switchLocale(l, locale, pathname)}
                onClick={() => setLocaleCookie(l)}
                className={cn(
                  "rounded px-2 py-0.5 text-xs font-medium transition-colors",
                  locale === l
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
                aria-label={`Switch to ${localeNames[l]}`}
                aria-current={locale === l ? "true" : undefined}
              >
                {l.toUpperCase()}
              </Link>
            ))}
          </div>

          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
