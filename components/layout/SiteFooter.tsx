"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import Script from "next/script"
import { Layers, Globe, ChevronUp } from "lucide-react"
import { localeNames, type Locale } from "@/lib/i18n/config"
import { switchLocale } from "@/lib/i18n/switchLocale"
import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

export function SiteFooter() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const seg = pathname.split("/")[1]
  const currentLocale: Locale = (seg === "zh" || seg === "ja") ? seg : "en"
  const base = currentLocale === "en" ? "" : `/${currentLocale}`

  // 点击外部关闭下拉框
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // 核心逻辑：设置 Cookie 并物理跳转
  const handleSwitch = (targetLocale: string) => {
    // 1. 设置 Cookie (有效时间 1年)
    document.cookie = `aistacker-locale=${targetLocale}; path=/; max-age=${60 * 60 * 24 * 365}`;
    
    // 2. 获取新路径并物理跳转
    const newPath = switchLocale(targetLocale, pathname)
    window.location.href = newPath
  }

  return (
    <footer className="border-t border-border/50 bg-muted/20 py-8 text-sm text-muted-foreground">
      <Script id="baidu-analytics" strategy="afterInteractive">
        {`
          var _hmt = _hmt || [];
          (function() {
            var hm = document.createElement("script");
            hm.src = "https://hm.baidu.com/hm.js?bbd60ee60b7d9dfc7717708ff18db107";
            var s = document.getElementsByTagName("script")[0]; 
            s.parentNode.insertBefore(hm, s);
          })();
        `}
      </Script>

      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          
          {/* Logo & Copyright */}
          <div className="flex flex-col items-center gap-2 sm:items-start">
            <Link href={`${base}/`} className="flex items-center gap-2 font-medium text-foreground">
              <Layers className="h-4 w-4" />
              <span>AIStacker</span>
            </Link>
            <p className="text-xs opacity-70">
              © {new Date().getFullYear()} AIStacker.dev
            </p>
          </div>

          {/* Center Info */}
          <p className="hidden max-w-[350px] text-center text-xs leading-relaxed sm:block">
            All tools run locally in your browser. No data leaves your device.
          </p>

          {/* Right Side: Links & Lang Switcher */}
          <div className="flex items-center gap-6">
            <nav className="flex gap-4 text-xs">
              <Link href={`${base}/tools`}  className="hover:text-foreground transition-colors">Tools</Link>
              <Link href={`${base}/guides`} className="hover:text-foreground transition-colors">Guides</Link>
            </nav>

            {/* Language Switcher Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 rounded-md border border-border/50 bg-background/50 px-3 py-1.5 text-xs font-medium hover:bg-background transition-all"
              >
                <Globe className="h-3.5 w-3.5 opacity-70" />
                <span className="uppercase">{currentLocale}</span>
                <ChevronUp className={cn("h-3 w-3 opacity-50 transition-transform", isOpen && "rotate-180")} />
              </button>

              {isOpen && (
                <div className="absolute bottom-full right-0 mb-2 w-32 origin-bottom-right rounded-md border border-border bg-popover p-1 shadow-xl animate-in fade-in slide-in-from-bottom-2">
                  {(Object.keys(localeNames) as Locale[]).map((l) => (
                    <button
                      key={l}
                      onClick={() => handleSwitch(l)}
                      className={cn(
                        "flex w-full items-center justify-between rounded px-2 py-1.5 text-xs transition-colors",
                        currentLocale === l 
                          ? "bg-accent text-accent-foreground" 
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      {localeNames[l]}
                      <span className="text-[10px] opacity-40 uppercase">{l}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
