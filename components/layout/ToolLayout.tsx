import Link               from "next/link"
import { ArrowRight }     from "lucide-react"
import type { ToolMeta }  from "@/data/tools"
import type { Messages }  from "@/lib/i18n"
import {
  CATEGORY_LABELS,
  isNewTool,
  getToolBySlug,
}                         from "@/data/tools"

interface ToolLayoutProps {
  tool:           ToolMeta
  messages:       Messages
  toolComponent:  React.ReactNode
  relatedTools:   ToolMeta[]
  locale?:        string      // "en" | "ja" | "zh" — default "en"
}

export default function ToolLayout({
  tool,
  messages: t,
  toolComponent,
  relatedTools,
  locale = "en",
}: ToolLayoutProps) {
  const isNew  = isNewTool(tool)
  const base   = locale === "en" ? "" : `/${locale}`

  const workflowBefore = tool.workflow.before
    .map(s => getToolBySlug(s)).filter(Boolean) as ToolMeta[]
  const workflowAfter  = tool.workflow.after
    .map(s => getToolBySlug(s)).filter(Boolean) as ToolMeta[]

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12">

      {/* ── Header ───────────────────────────────────────────────── */}
      <header className="mb-8">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-border/60 bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
            {CATEGORY_LABELS[tool.category]}
          </span>
          {isNew && (
            <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              {t.tools.new}
            </span>
          )}
          {tool.status === "beta" && (
            <span className="rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400">
              {t.tools.beta}
            </span>
          )}
        </div>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{tool.name}</h1>
        <p className="mt-2 text-base text-muted-foreground">{tool.description}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {tool.tags.slice(0, 8).map(tag => (
            <Link
              key={tag}
              href={`${base}/tools?q=${encodeURIComponent(tag)}`}
              className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground hover:bg-muted/70 hover:text-foreground transition-colors"
            >
              #{tag}
            </Link>
          ))}
        </div>
      </header>

      {/* ── Tool component ────── rounded-sm border border-border/60─────p-5  xl:p-8 max-sm:p-1─────────────────────────────── */}
      <section className="mb-12 bg-card ">
        {toolComponent ?? (
          <div className="flex min-h-[200px] items-center justify-center text-muted-foreground">
            Component coming soon.
          </div>
        )}
      </section>

      {/* ── Problems section ──────────────────────────────────────── */}
      {/* Each problem is a real H3 + answer paragraph, not just a label.
          This makes them featured-snippet candidates rather than keyword stuffing. */}
      {tool.problems.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-6 text-xl font-semibold">{t.tool.problems}</h2>
          <div className="space-y-6">
            {tool.problems.map(problem => (
              <div
                key={problem}
                id={problem.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
                className="rounded-lg border border-border/40 bg-muted/20 p-4"
              >
                <h3 className="mb-2 font-medium text-foreground">{problem}</h3>
                <p className="text-sm text-muted-foreground">
                  {getProblemAnswer(problem, tool)}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Workflow graph ────────────────────────────────────────── */}
      {(workflowBefore.length > 0 || workflowAfter.length > 0) && (
        <section className="mb-12 rounded-xl border border-border/40 bg-muted/20 p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {t.tool.workflow}
          </h2>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            {workflowBefore.map(t2 => (
              <Link
                key={t2.slug}
                href={`${base}/tools/${t2.slug}`}
                className="rounded-md border border-border/60 bg-card px-3 py-1.5 font-medium transition-colors hover:border-border hover:bg-muted"
              >
                {t2.name}
              </Link>
            ))}
            {workflowBefore.length > 0 && (
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="rounded-md border border-primary/40 bg-primary/10 px-3 py-1.5 font-semibold text-primary">
              {tool.name}
            </span>
            {workflowAfter.length > 0 && (
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            )}
            {workflowAfter.map(t2 => (
              <Link
                key={t2.slug}
                href={`${base}/tools/${t2.slug}`}
                className="rounded-md border border-border/60 bg-card px-3 py-1.5 font-medium transition-colors hover:border-border hover:bg-muted"
              >
                {t2.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── SEO article ───────────────────────────────────────────── */}
      <article className="prose prose-neutral max-w-none dark:prose-invert
        prose-headings:font-semibold prose-headings:tracking-tight
        prose-h2:mt-10 prose-h2:text-2xl prose-h2:border-b prose-h2:border-border/50 prose-h2:pb-3
        prose-p:text-muted-foreground prose-p:leading-relaxed
        prose-li:text-muted-foreground
        prose-code:rounded prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5
        prose-code:text-sm prose-code:text-foreground
        prose-code:before:content-none prose-code:after:content-none">

        <h2 id="what-is">{t.article.whatIs} {tool.name}?</h2>
        {tool.content.intro.split("\n").map((line, i) => <p key={i}>{line}</p>)}

        <h2 id="how-to">{t.article.howTo} {tool.name}</h2>
        {tool.content.usage.split("\n").map((line, i) => <p key={i}>{line}</p>)}

        <h2 id="example">{t.article.example}</h2>
        <div className="not-prose my-6">
          <pre className="overflow-x-auto rounded-lg bg-muted/60 p-5 font-mono text-sm leading-relaxed text-foreground ring-1 ring-border/40">
            <code>{tool.content.example}</code>
          </pre>
        </div>

        <h2 id="use-cases">{t.article.useCases}</h2>
        {tool.content.useCases.split("\n").map((line, i) => <p key={i}>{line}</p>)}

        {tool.content.faq.length > 0 && (
          <>
            <h2 id="faq">{t.article.faq}</h2>
            <div className="not-prose mt-4 space-y-3">
              {tool.content.faq.map((item, idx) => (
                <details
                  key={idx}
                  className="group rounded-lg border border-border/60 bg-card overflow-hidden"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 font-medium text-foreground">
                    {item.q}
                    <span className="ml-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180">▾</span>
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

      {/* ── Related tools ─────────────────────────────────────────── */}
      {relatedTools.length > 0 && (
        <footer className="mt-16 border-t border-border/50 pt-12">
          <h2 className="mb-6 text-lg font-semibold">{t.tool.tryAlso}</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            {relatedTools.map(rt => (
              <Link
                key={rt.slug}
                href={`${base}/tools/${rt.slug}`}
                className="group flex items-center justify-between rounded-lg border border-border/60 bg-card p-4 text-sm font-medium transition-all hover:border-border hover:bg-muted/50 hover:shadow-sm"
              >
                <span>{rt.name}</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5 group-hover:text-muted-foreground" />
              </Link>
            ))}
          </div>
        </footer>
      )}
    </div>
  )
}

// ── Problem answer generator ──────────────────────────────────────────────────
// Each "How to X" problem gets a short, direct answer derived from the tool's
// existing content. This turns keyword labels into genuine micro-answers that
// can rank for featured snippets.
function getProblemAnswer(problem: string, tool: ToolMeta): string {
  // Try to find a relevant sentence from the tool's existing content
  const searchIn = [
    tool.content.intro,
    tool.content.usage,
    tool.content.useCases,
    ...tool.content.faq.map(f => f.a),
  ].join(" ")

  // Extract the most relevant sentence (contains the most problem keywords)
  const problemWords = problem.toLowerCase().replace(/^how to\s+/i, "").split(/\s+/)
  const sentences    = searchIn.match(/[^.!?]+[.!?]+/g) ?? []

  let bestSentence  = ""
  let bestScore     = 0
  for (const sentence of sentences) {
    const lower = sentence.toLowerCase()
    const score = problemWords.filter(w => w.length > 3 && lower.includes(w)).length
    if (score > bestScore) { bestScore = score; bestSentence = sentence.trim() }
  }

  return bestSentence || `Use ${tool.name} to ${problem.replace(/^how to\s+/i, "").toLowerCase()}.`
}
