"use client"

import Link            from "next/link"
import { Layers }      from "lucide-react"
import { usePathname } from "next/navigation"

export function SiteFooter() {
  const pathname = usePathname()
  const seg      = pathname.split("/")[1]
  const base     = (seg === "ja" || seg === "zh") ? `/${seg}` : ""

  return (
    <footer className="border-t border-border/50 bg-muted/20 py-8 text-sm text-muted-foreground">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 sm:flex-row sm:justify-between">
        <Link href={`${base}/`} className="flex items-center gap-2 font-medium text-foreground">
          <Layers className="h-4 w-4" />
          <span>AIStacker</span>
        </Link>
        <p className="text-center text-xs">
          All tools run locally in your browser. No data leaves your device.
        </p>
        <div className="flex items-center gap-4 text-xs">
          <Link href={`${base}/tools`}  className="hover:text-foreground transition-colors">Tools</Link>
          <Link href={`${base}/guides`} className="hover:text-foreground transition-colors">Guides</Link>
          <span>© {new Date().getFullYear()} AIStacker.dev</span>
        </div>
      </div>
    </footer>
  )
}
