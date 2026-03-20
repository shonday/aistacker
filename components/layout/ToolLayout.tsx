import { ReactNode } from "react"
import Link from "next/link"
import { isNewTool, CATEGORY_LABELS, type ToolMeta } from "@/data/tools"

interface ToolLayoutProps {
  tool: ToolMeta
  toolComponent: ReactNode
  relatedTools: { name: string; path: string }[]
}

export default function ToolLayout({ tool, toolComponent, relatedTools }: ToolLayoutProps) {
  const isNew = isNewTool(tool)

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12">

      {/* ── Tool header ───────────────────────────────────────── */}
      <header className="mb-8">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-border/60 bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
            {CATEGORY_LABELS[tool.category]}
          </span>
          {isNew && (
            <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              New
            </span>
          )}
          {tool.status === "beta" && (
            <span className="rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400">
              Beta
            </span>
          )}
        </div>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{tool.name}</h1>
        <p className="mt-2 text-base text-muted-foreground">{tool.description}</p>
        {/* Tag cloud */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {tool.tags.slice(0, 8).map((tag) => (
            <Link
              key={tag}
              href={`/tools?q=${tag}`}
              className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
            >
              #{tag}
            </Link>
          ))}
        </div>
      </header>

      {/* ── Tool component ────────────────────────────────────── */}
      <section className="mb-16 rounded-xl border border-border/60 bg-card p-5 shadow-sm sm:p-8">
        {toolComponent ?? (
          <div className="flex min-h-[200px] items-center justify-center text-muted-foreground">
            Component coming soon.
          </div>
        )}
      </section>

      {/* ── Long-form SEO article ─────────────────────────────── */}
      <article className="prose prose-neutral max-w-none dark:prose-invert
        prose-headings:font-semibold prose-headings:tracking-tight
        prose-h2:mt-10 prose-h2:text-2xl prose-h2:border-b prose-h2:border-border/50 prose-h2:pb-3
        prose-p:text-muted-foreground prose-p:leading-relaxed
        prose-li:text-muted-foreground
        prose-code:rounded prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:text-foreground prose-code:before:content-none prose-code:after:content-none">

        <h2 id="what-is">What is {tool.name}?</h2>
        {tool.content.intro.split("\n").map((line, i) => <p key={i}>{line}</p>)}

        <h2 id="how-to">How to use {tool.name}</h2>
        {tool.content.usage.split("\n").map((line, i) => <p key={i}>{line}</p>)}

        <h2 id="example">Example</h2>
        <div className="not-prose my-6">
          <pre className="overflow-x-auto rounded-lg bg-muted/60 p-5 font-mono text-sm leading-relaxed text-foreground ring-1 ring-border/40">
            <code>{tool.content.example}</code>
          </pre>
        </div>

        <h2 id="use-cases">Common use cases</h2>
        {tool.content.useCases.split("\n").map((line, i) => <p key={i}>{line}</p>)}

        {tool.content.faq.length > 0 && (
          <>
            <h2 id="faq">Frequently asked questions</h2>
            <div className="not-prose mt-4 space-y-3">
              {tool.content.faq.map((item, idx) => (
                <details
                  key={idx}
                  className="group rounded-lg border border-border/60 bg-card overflow-hidden"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 font-medium text-foreground">
                    {item.q}
                    <span className="ml-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180">
                      ▾
                    </span>
                  </summary>
                  <div className="border-t border-border/40 bg-muted/30 px-5 py-4 text-sm text-muted-foreground">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </>
        )}
      </article>

      {/* ── Related tools ─────────────────────────────────────── */}
      {relatedTools.length > 0 && (
        <footer className="mt-16 border-t border-border/50 pt-12">
          <h2 className="mb-6 text-lg font-semibold">Explore other free tools</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
            {relatedTools.map((t) => (
              <Link
                key={t.name}
                href={t.path}
                className="rounded-lg border border-border/60 bg-card p-4 text-sm font-medium transition-all hover:border-border hover:bg-muted/50 hover:shadow-sm"
              >
                {t.name}
              </Link>
            ))}
          </div>
        </footer>
      )}
    </div>
  )
}
