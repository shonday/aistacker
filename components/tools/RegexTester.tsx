"use client"

import { useState, useMemo, useCallback } from "react"
import { Copy, Check, RefreshCw } from "lucide-react"

type Flag = "g" | "i" | "m" | "s" | "u"

const FLAG_DESCRIPTIONS: Record<Flag, string> = {
  g: "Global — find all matches",
  i: "Ignore case",
  m: "Multiline — ^ and $ match line boundaries",
  s: "Dotall — . matches newline",
  u: "Unicode — full Unicode support",
}

interface MatchGroup {
  index:  number
  name?:  string
  value:  string
}

interface RegexMatch {
  fullMatch:  string
  start:      number
  end:        number
  groups:     MatchGroup[]
}

function parseMatches(pattern: string, flags: string, text: string): RegexMatch[] {
  if (!pattern || !text) return []
  try {
    // Force global to find all matches; we'll strip it for display if user didn't set it
    const flagStr = flags.includes("g") ? flags : flags + "g"
    const regex   = new RegExp(pattern, flagStr)
    const results: RegexMatch[] = []
    let match: RegExpExecArray | null

    // Guard against infinite loops on zero-length matches
    let lastIndex = -1
    while ((match = regex.exec(text)) !== null) {
      if (match.index === lastIndex) { regex.lastIndex++; continue }
      lastIndex = match.index

      const groups: MatchGroup[] = []
      // Named groups
      if (match.groups) {
        for (const [name, value] of Object.entries(match.groups)) {
          groups.push({ index: -1, name, value: value ?? "" })
        }
      }
      // Indexed groups (skip index 0 = full match)
      for (let i = 1; i < match.length; i++) {
        const alreadyNamed = groups.some(g => g.value === match![i] && g.name)
        if (!alreadyNamed) {
          groups.push({ index: i, value: match[i] ?? "" })
        }
      }

      results.push({
        fullMatch: match[0],
        start:     match.index,
        end:       match.index + match[0].length,
        groups,
      })

      if (!flags.includes("g")) break
    }
    return results
  } catch {
    return []
  }
}

function buildHighlightedHTML(text: string, matches: RegexMatch[]): string {
  if (!matches.length) return escapeHtml(text)
  let result = ""
  let cursor = 0
  for (const m of matches) {
    result += escapeHtml(text.slice(cursor, m.start))
    result += `<mark class="bg-amber-200 dark:bg-amber-700/60 text-foreground rounded-sm px-0.5">${escapeHtml(m.fullMatch)}</mark>`
    cursor = m.end
  }
  result += escapeHtml(text.slice(cursor))
  return result
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

export default function RegexTester() {
  const [pattern, setPattern] = useState("(\\w+)@([\\w.]+)")
  const [flags, setFlags]     = useState<Set<Flag>>(new Set(["g"]))
  const [text, setText]       = useState("Contact us at hello@aistacker.dev or support@example.com")
  const [mode, setMode]       = useState<"match" | "replace">("match")
  const [replacement, setReplacement] = useState("[REDACTED]")
  const [copied, setCopied]   = useState<string | null>(null)
  const [error, setError]     = useState<string | null>(null)

  const flagString = [...flags].join("")

  const matches = useMemo(() => {
    if (!pattern) { setError(null); return [] }
    try {
      setError(null)
      return parseMatches(pattern, flagString, text)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid pattern")
      return []
    }
  }, [pattern, flagString, text])

  const highlighted = useMemo(() => buildHighlightedHTML(text, matches), [text, matches])

  const replaced = useMemo(() => {
    if (!pattern || mode !== "replace") return ""
    try {
      const regex = new RegExp(pattern, flagString)
      return text.replace(regex, replacement)
    } catch {
      return ""
    }
  }, [pattern, flagString, text, replacement, mode])

  const copy = useCallback(async (content: string, id: string) => {
    try { await navigator.clipboard.writeText(content) }
    catch {
      const el = document.createElement("textarea")
      el.value = content; document.body.appendChild(el)
      el.select(); document.execCommand("copy"); document.body.removeChild(el)
    }
    setCopied(id)
    setTimeout(() => setCopied(null), 1500)
  }, [])

  function toggleFlag(f: Flag) {
    setFlags(prev => {
      const next = new Set(prev)
      next.has(f) ? next.delete(f) : next.add(f)
      return next
    })
  }

  return (
    <div className="space-y-5">

      {/* ── Pattern input ───────────────────────────────────── */}
      <div className="flex items-stretch gap-0 rounded-lg border border-border overflow-hidden">
        <span className="flex items-center bg-muted px-3 font-mono text-lg text-muted-foreground select-none">/</span>
        <input
          type="text"
          value={pattern}
          onChange={e => setPattern(e.target.value)}
          placeholder="(\\w+)@([\\w.]+)"
          spellCheck={false}
          className="flex-1 bg-background px-3 py-2.5 font-mono text-sm focus:outline-none"
          aria-label="Regular expression pattern"
        />
        <span className="flex items-center bg-muted px-2 font-mono text-lg text-muted-foreground select-none">/</span>
        <div className="flex items-center bg-muted px-2 gap-1">
          {(["g","i","m","s","u"] as Flag[]).map(f => (
            <button
              key={f}
              onClick={() => toggleFlag(f)}
              title={FLAG_DESCRIPTIONS[f]}
              className={`rounded px-1.5 py-0.5 font-mono text-xs font-medium transition-colors ${
                flags.has(f)
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {error}
        </p>
      )}

      {/* ── Stats bar ───────────────────────────────────────── */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className={matches.length ? "text-emerald-600 dark:text-emerald-400 font-medium" : ""}>
          {matches.length} {matches.length === 1 ? "match" : "matches"}
        </span>
        <div className="flex gap-2 ml-auto">
          {(["match","replace"] as const).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded px-2 py-0.5 capitalize transition-colors ${
                mode === m ? "bg-muted font-medium text-foreground" : "hover:text-foreground"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main panels ─────────────────────────────────────── */}
      <div className="grid gap-4 md:grid-cols-2">

        {/* Test string */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground" htmlFor="regex-test-string">
            Test string
          </label>
          <textarea
            id="regex-test-string"
            value={text}
            onChange={e => setText(e.target.value)}
            rows={8}
            spellCheck={false}
            className="w-full resize-y rounded-lg border border-border bg-background p-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring/20"
          />
        </div>

        {/* Result panel */}
        <div className="flex flex-col gap-1.5">
          {mode === "match" ? (
            <>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Matches highlighted</span>
                <button
                  onClick={() => copy(text.slice(0), "highlighted")}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  {copied === "highlighted" ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                  Copy text
                </button>
              </div>
              <div
                className="h-[200px] overflow-auto resize-y rounded-lg border border-border bg-muted/30 p-3 font-mono text-sm whitespace-pre-wrap break-words leading-relaxed"
                dangerouslySetInnerHTML={{ __html: highlighted || '<span class="text-muted-foreground">No text entered</span>' }}
              />
            </>
          ) : (
            <>
              <label className="text-xs font-medium text-muted-foreground" htmlFor="replace-pattern">
                Replacement (use $1, $2 for groups)
              </label>
              <input
                id="replace-pattern"
                value={replacement}
                onChange={e => setReplacement(e.target.value)}
                className="rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring/20"
                placeholder="$1 [REDACTED]"
              />
              <div className="relative mt-1 flex-1">
                <div className="h-[160px] overflow-auto rounded-lg border border-border bg-muted/30 p-3 font-mono text-sm whitespace-pre-wrap break-words">
                  {replaced || <span className="text-muted-foreground">Result appears here</span>}
                </div>
                {replaced && (
                  <button
                    onClick={() => copy(replaced, "replaced")}
                    className="absolute bottom-2 right-2 flex items-center gap-1 rounded border border-border bg-background px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    {copied === "replaced" ? <><Check className="h-3 w-3 text-emerald-500" /> Copied</> : <><Copy className="h-3 w-3" /> Copy</>}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Capture groups breakdown ─────────────────────────── */}
      {matches.length > 0 && matches.some(m => m.groups.length > 0) && (
        <div className="rounded-lg border border-border/60 bg-muted/20 p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Capture groups
          </p>
          <div className="space-y-3">
            {matches.slice(0, 5).map((m, mi) => (
              <div key={mi} className="flex flex-wrap items-start gap-2">
                <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
                  Match {mi + 1}: <strong className="text-foreground">{m.fullMatch}</strong>
                </span>
                {m.groups.map((g, gi) => (
                  <span key={gi} className="rounded bg-amber-500/10 px-1.5 py-0.5 font-mono text-xs">
                    {g.name ? `${g.name}:` : `$${g.index}:`}{" "}
                    <strong>{g.value || <em className="text-muted-foreground">empty</em>}</strong>
                  </span>
                ))}
              </div>
            ))}
            {matches.length > 5 && (
              <p className="text-xs text-muted-foreground">…and {matches.length - 5} more matches</p>
            )}
          </div>
        </div>
      )}

      {/* ── Copy pattern ─────────────────────────────────────── */}
      {pattern && (
        <div className="flex items-center justify-between rounded-lg border border-border/40 bg-muted/20 px-3 py-2">
          <code className="font-mono text-xs text-muted-foreground">/{pattern}/{flagString}</code>
          <button
            onClick={() => copy(`/${pattern}/${flagString}`, "pattern")}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            {copied === "pattern" ? <><Check className="h-3 w-3 text-emerald-500" /> Copied</> : <><Copy className="h-3 w-3" /> Copy pattern</>}
          </button>
        </div>
      )}
    </div>
  )
}
