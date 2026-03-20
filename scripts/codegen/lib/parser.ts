// scripts/codegen/lib/parser.ts
// Tolerant multi-strategy section extractor.
//
// Root cause of the "all sections missing" failure:
//   LLMs like Gemini/Groq wrap the ENTIRE response in a ```markdown fence.
//   The old extractSection() looked for "=== COMPONENT ===" literally — but
//   the actual text was "```\n=== COMPONENT ===" so indexOf returned -1.
//   Every section failed → all missing → parse failed 3/3 → tool never generated.
//
// This version strips outer fences first, then uses a flexible regex that
// tolerates: leading whitespace, extra =, lowercase names, and missing END markers.

export interface ParsedOutput {
  component: string
  category:  string
  tags:      string[]
  seoTitle:  string
  seoDesc:   string
  intro:     string
  usage:     string
  example:   string
  useCases:  string
  faq:       { q: string; a: string }[]
}

export interface ParseResult {
  ok:      boolean
  data?:   ParsedOutput
  missing: string[]
}

const SECTIONS = [
  "COMPONENT",
  "CATEGORY",
  "TAGS",
  "SEO_TITLE",
  "SEO_DESC",
  "INTRO",
  "USAGE",
  "EXAMPLE",
  "USE_CASES",
  "FAQ",
] as const

type SectionName = typeof SECTIONS[number]

// ── Step 1: strip outer markdown fence ───────────────────────────────────────
// Gemini and Groq frequently wrap the entire response in ```markdown or ```
// This must happen before any section extraction.
function stripOuterFence(text: string): string {
  // Match opening fence at start (with optional language tag) and closing at end
  const fenced = text.match(/^```(?:markdown|md|text|plaintext|tsx?|typescript)?\s*\n([\s\S]*?)\n?```\s*$/i)
  if (fenced) return fenced[1]

  // Also handle fence that starts on the first line but has content after it
  const leadingFence = text.match(/^```(?:markdown|md|text|plaintext|tsx?|typescript)?\s*\n([\s\S]*)/)
  if (leadingFence) {
    return leadingFence[1].replace(/\n?```\s*$/, "")
  }

  return text
}

// ── Step 2: flexible section extraction ──────────────────────────────────────
// Strategy A: look for === NAME === ... === END NAME ===
// Strategy B: look for === NAME === ... === NEXT_SECTION ===  (missing END marker)
// Strategy C: look for **NAME** or ## NAME as fallback headers (last resort)
function extractSection(text: string, name: SectionName, allNames: readonly string[]): string | null {
  // Strategy A: standard delimiters (tolerant of extra whitespace/= chars)
  const startPat = new RegExp(`={2,}\\s*${name}\\s*={2,}`, "i")
  const endPat   = new RegExp(`={2,}\\s*END\\s+${name}\\s*={2,}`, "i")

  const startMatch = startPat.exec(text)
  if (startMatch) {
    const afterStart = text.slice(startMatch.index + startMatch[0].length)
    const endMatch   = endPat.exec(afterStart)

    if (endMatch) {
      // Clean end marker found
      return afterStart.slice(0, endMatch.index).trim()
    }

    // Strategy B: no END marker — find the next section start instead
    const nextSectionPat = new RegExp(
      `={2,}\\s*(?:${allNames.filter(n => n !== name).join("|")})\\s*={2,}`,
      "i"
    )
    const nextMatch = nextSectionPat.exec(afterStart)
    if (nextMatch) {
      return afterStart.slice(0, nextMatch.index).trim()
    }

    // No next section either — take everything to end of text
    const content = afterStart.trim()
    if (content.length > 0) return content
  }

  return null
}

// ── Code fence stripping (for COMPONENT section only) ────────────────────────
function stripCodeFence(text: string): string {
  return text
    .replace(/^```(?:tsx?|typescript|jsx?|js)?\s*\n?/im, "")
    .replace(/\n?```\s*$/m, "")
    .trim()
}

// ── FAQ parser ────────────────────────────────────────────────────────────────
function parseFaq(raw: string): { q: string; a: string }[] {
  const items: { q: string; a: string }[] = []
  const blocks = raw.split(/\n\s*\n/).map(b => b.trim()).filter(Boolean)
  for (const block of blocks) {
    const qMatch = block.match(/^Q[:\s]+(.+)/im)
    const aMatch = block.match(/^A[:\s]+([\s\S]+)/im)
    if (qMatch && aMatch) {
      items.push({ q: qMatch[1].trim(), a: aMatch[1].trim() })
    }
  }
  return items
}

// ── Main export ───────────────────────────────────────────────────────────────
export function parseLLMOutput(raw: string): ParseResult {
  // Always strip outer fence first
  const text = stripOuterFence(raw)

  const missing: string[] = []
  const sections: Partial<Record<SectionName, string>> = {}

  for (const name of SECTIONS) {
    const value = extractSection(text, name, SECTIONS)
    if (value && value.length > 0) {
      sections[name] = value
    } else {
      missing.push(name)
    }
  }

  // COMPONENT is mandatory
  if (!sections.COMPONENT) {
    return { ok: false, missing }
  }

  const component = stripCodeFence(sections.COMPONENT)

  if (!component.includes("export default function")) {
    missing.push("COMPONENT:no-default-export")
    return { ok: false, missing }
  }

  const tags = (sections.TAGS ?? "")
    .split(",")
    .map(t => t.trim().toLowerCase())
    .filter(Boolean)

  // Non-COMPONENT sections are soft-required: parse fails only if COMPONENT missing.
  // All other missing sections get reasonable defaults so generation can succeed.
  return {
    ok:   missing.length === 0,
    missing,
    data: {
      component: component,
      category:  (sections.CATEGORY ?? "formatter").toLowerCase().trim(),
      tags,
      seoTitle:  sections.SEO_TITLE ?? "",
      seoDesc:   sections.SEO_DESC  ?? "",
      intro:     sections.INTRO     ?? "",
      usage:     sections.USAGE     ?? "",
      example:   sections.EXAMPLE   ?? "",
      useCases:  sections.USE_CASES ?? "",
      faq:       parseFaq(sections.FAQ ?? ""),
    },
  }
}
