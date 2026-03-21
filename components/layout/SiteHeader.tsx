"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Layers } from "lucide-react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/ThemeToggle"

const NAV = [
  { href: "/",      label: "Home"      },
  { href: "/tools", label: "All Tools" },
]

export function SiteHeader() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <Layers className="h-5 w-5" />
          <span>AIStacker</span>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-1">
          {NAV.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm transition-colors",
                pathname === href
                  ? "bg-muted font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right slot */}
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
