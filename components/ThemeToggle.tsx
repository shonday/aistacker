"use client"

import { useTheme } from "@/components/ThemeProvider"
import { Sun, Moon, Monitor } from "lucide-react"

// Cycles: system → light → dark → system
const CYCLE = ["system", "light", "dark"] as const

export function ThemeToggle() {
  const { theme, resolved, setTheme } = useTheme()

  function cycleTheme() {
    const idx  = CYCLE.indexOf(theme as typeof CYCLE[number])
    const next = CYCLE[(idx + 1) % CYCLE.length]
    setTheme(next)
  }

  const Icon =
    theme === "light"  ? Sun     :
    theme === "dark"   ? Moon    :
    resolved === "dark" ? Moon   : Monitor

  const label =
    theme === "system" ? "System theme (click to switch to light)" :
    theme === "light"  ? "Light mode (click to switch to dark)"    :
                         "Dark mode (click to switch to system)"

  return (
    <button
      onClick={cycleTheme}
      aria-label={label}
      title={label}
      className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      <Icon className="h-4 w-4" />
    </button>
  )
}
