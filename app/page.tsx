import Link               from "next/link"
import { ArrowRight }     from "lucide-react"
import {
  getFeaturedTools,
  getCategories,
  getToolsByCategory,
  CATEGORY_LABELS,
}                         from "@/data/tools"
import { getFeaturedGuides } from "@/data/guides"
import { ToolCard }       from "@/components/layout/ToolCard"
import { getMessages }    from "@/lib/i18n"
import { siteConfig }     from "@/lib/config"
import type { Metadata }  from "next"

export const metadata: Metadata = {
  alternates: {
    canonical: siteConfig.url,
    languages: {
      en:          siteConfig.url,
      ja:          `${siteConfig.url}/ja`,
      zh:          `${siteConfig.url}/zh`,
      "x-default": siteConfig.url,
    },
  },
}

export default function HomePage() {
  const t          = getMessages("en")
  const featured   = getFeaturedTools()
  const categories = getCategories()
  const guides     = getFeaturedGuides()

  return (
    <div className="flex flex-col gap-20 pb-24">

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="border-b border-border/50 bg-gradient-to-b from-muted/40 to-background px-6 py-20 text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {t.hero.badge}
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          {t.hero.headline}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
          {t.hero.sub}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 rounded-lg bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-80"
          >
            {t.hero.cta} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ── Featured tools ────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-6xl px-6">
        <h2 className="mb-6 text-lg font-semibold">{t.tools.popular}</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map(tool => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
        <div className="mt-5 text-right">
          <Link
            href="/tools"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {t.tools.allTools} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      {/* ── Category overview ─────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-6xl px-6">
        <h2 className="mb-6 text-lg font-semibold">{t.tools.byCategory}</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map(cat => {
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

      {/* ── Featured guides ───────────────────────────────────────── */}
      {guides.length > 0 && (
        <section className="mx-auto w-full max-w-6xl px-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold">{t.guides.title}</h2>
            <Link
              href="/guides"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              All guides <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {guides.map(guide => (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="group rounded-lg border border-border/60 bg-card p-5 transition-all hover:border-border hover:shadow-sm"
              >
                <p className="font-medium group-hover:text-primary transition-colors">
                  {guide.title}
                </p>
                <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
                  {guide.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
