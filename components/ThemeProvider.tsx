"use client"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark" | "system"

interface ThemeContextValue {
  theme:     Theme
  resolved:  "light" | "dark"   // what's actually applied right now
  setTheme:  (t: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue>({
  theme:    "system",
  resolved: "light",
  setTheme: () => {},
})

export function useTheme() {
  return useContext(ThemeContext)
}

interface ThemeProviderProps {
  children:     React.ReactNode
  defaultTheme?: Theme
  storageKey?:  string
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey   = "aistacker-theme",
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme)
  const [resolved, setResolved] = useState<"light" | "dark">("light")

  // Read from localStorage on mount (client only)
  useEffect(() => {
    const stored = localStorage.getItem(storageKey) as Theme | null
    if (stored && ["light", "dark", "system"].includes(stored)) {
      setThemeState(stored)
    }
  }, [storageKey])

  // Apply .dark class to <html> and track resolved value
  useEffect(() => {
    const root = document.documentElement

    function applyTheme(t: Theme) {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      const isDark = t === "dark" || (t === "system" && prefersDark)

      root.classList.toggle("dark", isDark)
      setResolved(isDark ? "dark" : "light")
    }

    applyTheme(theme)

    // Re-apply when system preference changes (only relevant for "system" mode)
    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    const handler = () => applyTheme(theme)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [theme])

  function setTheme(t: Theme) {
    setThemeState(t)
    localStorage.setItem(storageKey, t)
  }

  return (
    <ThemeContext.Provider value={{ theme, resolved, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
