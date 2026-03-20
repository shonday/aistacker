// scripts/codegen/lib/parser.ts
// Extracts === SECTION === delimited blocks from LLM output.
// Tolerant of leading/trailing whitespace and markdown fences inside sections.

export interface ParsedOutput {
  component:  string
  category:   string
  tags:       string[]
  seoTitle:   string
  seoDesc:    string
  intro:      string
  usage:      string
  example:    string
  useCases:   string
  faq:        { q: string; a: string }[]
}

export interface ParseResult {
  ok: boolean
  data?: ParsedOutput
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

function extractSection(text: string, name: SectionName): string | null {
  const start = `=== ${name} ===`
  const end   = `=== END ${name} ===`
  const si = text.indexOf(start)
  const ei = text.indexOf(end)
  if (si === -1 || ei === -1 || ei < si) return null
  return text.slice(si + start.length, ei).trim()
}

function stripCodeFence(text: string): string {
  // Remove ```tsx, ```typescript, ``` wrappers if LLM adds them
  return text
    .replace(/^```(?:tsx?|typescript|jsx?)?\n?/i, "")
    .replace(/\n?```$/i, "")
    .trim()
}

function parseFaq(raw: string): { q: string; a: string }[] {
  const items: { q: string; a: string }[] = []
  // Split on blank lines between items
  const blocks = raw.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean)
  for (const block of blocks) {
    const qMatch = block.match(/^Q:\s*(.+)/m)
    const aMatch = block.match(/^A:\s*([\s\S]+)/m)
    if (qMatch && aMatch) {
      items.push({ q: qMatch[1].trim(), a: aMatch[1].trim() })
    }
  }
  return items
}

export function parseLLMOutput(raw: string): ParseResult {
  const missing: string[] = []
  const sections: Partial<Record<SectionName, string>> = {}

  for (const name of SECTIONS) {
    const value = extractSection(raw, name)
    if (!value) {
      missing.push(name)
    } else {
      sections[name] = value
    }
  }

  // COMPONENT is mandatory — fail fast if missing
  if (!sections.COMPONENT) {
    return { ok: false, missing }
  }

  const component = stripCodeFence(sections.COMPONENT!)
  if (!component.includes("export default function")) {
    missing.push("COMPONENT:no-default-export")
    return { ok: false, missing }
  }

  const tags = (sections.TAGS ?? "")
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean)

  return {
    ok: missing.length === 0,
    missing,
    data: {
      component:  component,
      category:   (sections.CATEGORY ?? "formatter").toLowerCase().trim(),
      tags,
      seoTitle:   sections.SEO_TITLE   ?? "",
      seoDesc:    sections.SEO_DESC    ?? "",
      intro:      sections.INTRO       ?? "",
      usage:      sections.USAGE       ?? "",
      example:    sections.EXAMPLE     ?? "",
      useCases:   sections.USE_CASES   ?? "",
      faq:        parseFaq(sections.FAQ ?? ""),
    },
  }
}
