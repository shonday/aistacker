"use client"

import { useMemo, useCallback }  from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Fuse                       from "fuse.js"
import {
  CATEGORY_LABELS,
  getCategories,
  type ToolMeta,
}                                 from "@/data/tools"
import type { Messages }          from "@/lib/i18n"
import { ToolCard }               from "./ToolCard"
import { cn }                     from "@/lib/utils"
import { Search, X }              from "lucide-react"

interface Props {
  tools:    ToolMeta[]
  messages: Messages
  locale:   string          // "en" | "ja" | "zh"
}

export function ToolsDirectory({ tools, messages: t, locale }: Props) {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const query        = searchParams.get("q") ?? ""
  const category     = searchParams.get("category") ?? ""

  const basePath = locale === "en" ? "/tools" : `/${locale}/tools`

  // Fuse instance — rebuilt only when tools array changes
  const fuse = useMemo(
    () =>
      new Fuse(tools, {
        keys: [
          { name: "name",        weight: 3 },
          { name: "tags",        weight: 2 },
          { name: "description", weight: 1 },
        ],
        threshold:          0.35,
        minMatchCharLength: 2,
      }),
    [tools]
  )

  const filtered = useMemo(() => {
    let result = query ? fuse.search(query).map(r => r.item) : tools
    if (category) result = result.filter(t => t.category === category)
    return result
  }, [query, category, fuse, tools])

  const setParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) params.set(key, value)
      else params.delete(key)
      router.replace(`${basePath}?${params.toString()}`, { scroll: false })
    },
    [router, searchParams, basePath]
  )

  const categories = getCategories()

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <input
          type="search"
          defaultValue={query}
          onChange={e => setParam("q", e.target.value)}
          placeholder={t.tools.searchPlaceholder}
          aria-label={t.tools.searchPlaceholder}
          className="w-full rounded-lg border border-border bg-card py-2.5 pl-10 pr-10 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
        />
        {query && (
          <button
            onClick={() => setParam("q", "")}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Category tabs */}
      <div className="mb-8 flex flex-wrap gap-2">
        <button
          onClick={() => setParam("category", "")}
          className={cn(
            "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
            !category
              ? "border-foreground bg-foreground text-background"
              : "border-border bg-card text-muted-foreground hover:border-foreground/50 hover:text-foreground"
          )}
        >
          {t.tools.allTools} <span className="ml-1 opacity-60">{tools.length}</span>
        </button>
        {categories.map(cat => {
          const count  = tools.filter(t => t.category === cat).length
          const active = category === cat
          return (
            <button
              key={cat}
              onClick={() => setParam("category", active ? "" : cat)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                active
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-card text-muted-foreground hover:border-foreground/50 hover:text-foreground"
              )}
            >
              {CATEGORY_LABELS[cat]} <span className="ml-1 opacity-60">{count}</span>
            </button>
          )
        })}
      </div>

      {/* Results summary */}
      <p className="mb-4 text-sm text-muted-foreground">
        {filtered.length === tools.length
          ? `${tools.length} ${t.tools.tools}`
          : `${filtered.length} ${t.tools.ofTools} ${tools.length} ${t.tools.tools}`}
        {query && (
          <span> {t.tools.matchingQuery} <strong className="text-foreground">"{query}"</strong></span>
        )}
      </p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map(tool => (
            <ToolCard key={tool.slug} tool={tool} locale={locale} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 py-24 text-center text-muted-foreground">
          <p className="text-lg font-medium">{t.tools.noResults}</p>
          <p className="text-sm">{t.tools.noResultsSub}</p>
          <button
            onClick={() => { setParam("q", ""); setParam("category", "") }}
            className="mt-2 text-sm underline hover:text-foreground"
          >
            {t.tools.clearFilters}
          </button>
        </div>
      )}
    </div>
  )
}
