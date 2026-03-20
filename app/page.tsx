import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { getFeaturedTools, getCategories, getToolsByCategory, CATEGORY_LABELS } from "@/data/tools"
import { ToolCard } from "@/components/layout/ToolCard"

export default function HomePage() {
  const featured   = getFeaturedTools()
  const categories = getCategories()

  return (
    <div className="flex flex-col gap-20 pb-24">

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="border-b border-border/50 bg-gradient-to-b from-muted/40 to-background px-6 py-20 text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Free · Open Source · Runs Locally
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          The Ultimate Developer Stack
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
          Lightweight, browser-based tools for developers. No signup, no upload,
          no tracking — everything runs in your browser.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 rounded-lg bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-80"
          >
            Browse all tools <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ── Featured tools ────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-6xl px-6">
        <h2 className="mb-6 text-lg font-semibold">Popular tools</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>

      {/* ── Category overview ─────────────────────────────────── */}
      <section className="mx-auto w-full max-w-6xl px-6">
        <h2 className="mb-6 text-lg font-semibold">Browse by category</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((cat) => {
            const count = getToolsByCategory(cat).length
            return (
              <Link
                key={cat}
                href={`/tools?category=${cat}`}
                className="flex items-center justify-between rounded-lg border border-border/60 bg-card px-4 py-3 text-sm transition-colors hover:border-border hover:bg-muted/50"
              >
                <span className="font-medium">{CATEGORY_LABELS[cat]}</span>
                <span className="text-xs text-muted-foreground">{count}</span>
              </Link>
            )
          })}
        </div>
      </section>

    </div>
  )
}
