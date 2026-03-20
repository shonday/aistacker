"use client"

import { useMemo, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Fuse from "fuse.js"
import { CATEGORY_LABELS, getCategories, type ToolMeta } from "@/data/tools"
import { ToolCard } from "./ToolCard"
import { cn } from "@/lib/utils"
import { Search, X } from "lucide-react"

interface Props {
  tools: ToolMeta[]
}

export function ToolsDirectory({ tools }: Props) {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const query        = searchParams.get("q") ?? ""
  const category     = searchParams.get("category") ?? ""

  // Fuse instance — memoised so it doesn't rebuild on every keystroke
  const fuse = useMemo(
    () =>
      new Fuse(tools, {
        keys: [
          { name: "name",        weight: 3 },
          { name: "tags",        weight: 2 },
          { name: "description", weight: 1 },
        ],
        threshold: 0.35,
        minMatchCharLength: 2,
      }),
    [tools]
  )

  // Filter pipeline: search → category
  const filtered = useMemo(() => {
    let result = query ? fuse.search(query).map((r) => r.item) : tools
    if (category) result = result.filter((t) => t.category === category)
    return result
  }, [query, category, fuse, tools])

  const setParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) params.set(key, value)
      else params.delete(key)
      router.replace(`/tools?${params.toString()}`, { scroll: false })
    },
    [router, searchParams]
  )

  const categories  = getCategories()
  const totalShown  = filtered.length
  const totalTools  = tools.length

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">

      {/* ── Search bar ────────────────────────────────────────── */}
      <div className="relative mb-6">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          defaultValue={query}
          onChange={(e) => setParam("q", e.target.value)}
          placeholder="Search tools…"
          className="w-full rounded-lg border border-border bg-card py-2.5 pl-10 pr-10 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
          aria-label="Search tools"
        />
        {query && (
          <button
            onClick={() => setParam("q", "")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* ── Category tabs ─────────────────────────────────────── */}
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
          All <span className="ml-1 opacity-60">{totalTools}</span>
        </button>
        {categories.map((cat) => {
          const count = tools.filter((t) => t.category === cat).length
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

      {/* ── Results count ─────────────────────────────────────── */}
      <p className="mb-4 text-sm text-muted-foreground">
        {totalShown === totalTools
          ? `${totalTools} tools`
          : `${totalShown} of ${totalTools} tools`}
        {query && <span> matching <strong className="text-foreground">"{query}"</strong></span>}
      </p>

      {/* ── Tool grid ─────────────────────────────────────────── */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 py-20 text-center text-muted-foreground">
          <p className="text-lg font-medium">No tools found</p>
          <p className="text-sm">Try a different search term or category</p>
          <button
            onClick={() => { setParam("q", ""); setParam("category", "") }}
            className="mt-2 text-sm underline hover:text-foreground"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  )
}
