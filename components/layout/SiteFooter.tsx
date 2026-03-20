import Link from "next/link"
import { Layers } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="border-t border-border/50 bg-muted/20 py-8 text-sm text-muted-foreground">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 sm:flex-row sm:justify-between">
        <Link href="/" className="flex items-center gap-2 font-medium text-foreground">
          <Layers className="h-4 w-4" />
          <span>AIStacker</span>
        </Link>
        <p className="text-center">All tools run locally in your browser. No data leaves your device.</p>
        <p>© {new Date().getFullYear()} AIStacker.dev</p>
      </div>
    </footer>
  )
}
