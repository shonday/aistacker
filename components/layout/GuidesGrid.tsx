"use client"

import Link                 from "next/link"
import { useState }         from "react"
import { Clock }            from "lucide-react"
import type { Guide }       from "@/data/guides"
import { getGuideCategories, getLocalizedGuide } from "@/data/guides"
import { CATEGORY_LABELS, type ToolCategory } from "@/data/tools"
import type { Messages }    from "@/lib/i18n"
import { cn }               from "@/lib/utils"

interface Props {
  guides:   Guide[]
  messages: Messages
  locale:   string
}

export function GuidesGrid({ guides, messages: t, locale }: Props) {
  const base            = locale === "en" ? "" : `/${locale}`
  const categories      = getGuideCategories()
  const [active, setActive] = useState<ToolCategory | "all">("all")

  const localizedGuides = guides.map(g => getLocalizedGuide(g, locale as "en" | "ja" | "zh"))

  const filtered = active === "all"
    ? localizedGuides
    : localizedGuides.filter(g => g.category === active)

  const featured = filtered.filter(g => g.featured)
  const rest     = filtered.filter(g => !g.featured)

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-12">

      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">{t.guides.title}</h1>
        <p className="mt-2 text-muted-foreground">{t.guides.sub}</p>
      </header>

      {/* Category tabs */}
      <div className="mb-8 flex flex-wrap gap-2">
        <button
          onClick={() => setActive("all")}
          className={cn(
            "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
            active === "all"
              ? "border-foreground bg-foreground text-background"
              : "border-border bg-card text-muted-foreground hover:border-foreground/50 hover:text-foreground"
          )}
        >
          All <span className="ml-1 opacity-60">{localizedGuides.length}</span>
        </button>
        {categories.map(cat => {
          const count = localizedGuides.filter(g => g.category === cat).length
          return (
            <button
              key={cat}
              onClick={() => setActive(active === cat ? "all" : cat)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                active === cat
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-card text-muted-foreground hover:border-foreground/50 hover:text-foreground"
              )}
            >
              {CATEGORY_LABELS[cat]} <span className="ml-1 opacity-60">{count}</span>
            </button>
          )
        })}
      </div>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="mb-10">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Featured
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {featured.map(guide => (
              <GuideCard key={guide.slug} guide={guide} base={base} t={t} />
            ))}
          </div>
        </section>
      )}

      {/* Rest */}
      {rest.length > 0 && (
        <section>
          {featured.length > 0 && (
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              All guides
            </p>
          )}
          <div className="divide-y divide-border/50">
            {rest.map(guide => (
              <Link
                key={guide.slug}
                href={`${base}/guides/${guide.slug}`}
                className="group flex items-start justify-between gap-4 py-4"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium group-hover:text-primary transition-colors">
                    {guide.title}
                  </p>
                  <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                    {guide.description}
                  </p>
                </div>
                <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {guide.readingTime} min
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {filtered.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-24 text-center text-muted-foreground">
          <p className="text-lg font-medium">No guides yet in this category</p>
        </div>
      )}
    </div>
  )
}

// ── Card subcomponent ─────────────────────────────────────────────────────────

function GuideCard({ guide, base, t }: { guide: Guide; base: string; t: Messages }) {
  return (
    <Link
      href={`${base}/guides/${guide.slug}`}
      className="group flex flex-col gap-3 rounded-xl border border-border/60 bg-card p-5 transition-all hover:border-border hover:shadow-sm"
    >
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="rounded-full border border-border/60 bg-muted px-2 py-0.5 capitalize">
          {CATEGORY_LABELS[guide.category as ToolCategory] ?? guide.category}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {guide.readingTime} min
        </span>
      </div>
      <h3 className="font-semibold leading-snug group-hover:text-primary transition-colors">
        {guide.title}
      </h3>
      <p className="line-clamp-2 text-sm text-muted-foreground">
        {guide.description}
      </p>
    </Link>
  )
}
