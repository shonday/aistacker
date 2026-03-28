"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Layers } from "lucide-react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/ThemeToggle"

export function SiteHeader() {
  const pathname = usePathname()

  const getLocaleInfo = (path: string) => {
    const seg = path.split("/")[1]
    if (seg === "zh" || seg === "ja") return { base: `/${seg}` }
    return { base: "" }
  }

  const { base } = getLocaleInfo(pathname)

  const NAV = [
    { href: `${base}/`,       label: "Home",   exact: true },
    { href: `${base}/tools`,  label: "Tools",  exact: false },
    { href: `${base}/guides`, label: "Guides", exact: false },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-5 px-6">
        <Link href={`${base}/`} className="flex items-center gap-2 font-semibold">
          <Layers className="h-5 w-5" />
          <span>AIStacker</span>
        </Link>

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
                  active ? "bg-muted font-medium" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
