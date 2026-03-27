"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Layers } from "lucide-react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/ThemeToggle"
import { localeNames, type Locale } from "@/lib/i18n/config"
import { switchLocale } from "@/lib/i18n/switchLocale" // 导入你定义的工具函数

export function SiteHeader() {
  const pathname = usePathname()

  // 根据当前路径识别语言环境，用于导航激活态判断
  const getLocaleInfo = (path: string) => {
    const seg = path.split("/")[1]
    if (seg === "zh" || seg === "ja") return { locale: seg as Locale, base: `/${seg}` }
    return { locale: "en" as Locale, base: "" }
  }

  const { locale, base } = getLocaleInfo(pathname)

  // 核心切换逻辑：执行你要求的“彻底重定向”
  const handleSwitch = (targetLocale: string) => {
    const newPath = switchLocale(targetLocale, pathname)
    // 使用 window.location.href 确保物理级跳转，不依赖任何内存状态
    window.location.href = newPath
  }

  const NAV = [
    { href: `${base}/`,       label: "Home",   exact: true },
    { href: `${base}/tools`,  label: "Tools",  exact: false },
    { href: `${base}/guides`, label: "Guides", exact: false },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-5 px-6">
        
        {/* Logo */}
        <Link href={`${base}/`} className="flex items-center gap-2 font-semibold">
          <Layers className="h-5 w-5" />
          <span>AIStacker</span>
        </Link>

        {/* 导航菜单：普通 Link 即可 */}
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

        {/* 语言切换器：严格执行你的 handleSwitch 逻辑 */}
        <div className="ml-auto flex items-center gap-1">
          <div className="flex items-center rounded-md border border-border/60 bg-muted/40 p-0.5">
            {(Object.keys(localeNames) as Locale[]).map((l) => (
              <button
                key={l}
                onClick={() => handleSwitch(l)}
                className={cn(
                  "rounded px-2 py-0.5 text-xs font-medium transition-colors uppercase",
                  locale === l
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {l}
              </button>
            ))}
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}