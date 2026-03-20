// scripts/codegen/lib/prompts.ts
// All LLM prompts for the TSX component generator.
// Every known failure mode has a WRONG/RIGHT pair to pre-empt it.

import type { ComponentRequest } from "./contract.js"
import type { StaticCheckResult } from "./staticChecker.js"

// ── Main generation prompt ────────────────────────────────────────────────────

export function buildGenerationPrompt(req: ComponentRequest): string {
  const componentName = toPascalCase(req.toolId)
  const featureList   = req.features.map((f, i) => `${i + 1}. ${f}`).join("\n")

  return `You are an expert Next.js / React developer. Generate a production-quality tool component.

## Component spec
- Tool ID:    ${req.toolId}
- Name:       ${req.displayName}
- Component:  ${componentName}
- Description: ${req.description}
- Category:   ${req.category ?? "auto-detect"}

## Required features (you MUST implement ALL of them)
${featureList}

## Technology constraints
- React 19 with hooks ("use client" directive required)
- Tailwind CSS v4 — use semantic tokens ONLY (see rules below)
- shadcn/ui components imported from "@/components/ui/*"
- lucide-react for icons
- NO external libraries beyond what is listed above

## Tailwind rules
WRONG: className="text-gray-500"
RIGHT: className="text-muted-foreground"

WRONG: className="bg-gray-100 dark:bg-gray-800"
RIGHT: className="bg-muted"

WRONG: className="border-gray-200"
RIGHT: className="border-border"

WRONG: className="text-slate-900"
RIGHT: className="text-foreground"

WRONG: className="bg-white"
RIGHT: className="bg-background"

WRONG: className="bg-blue-500 text-white"
RIGHT: className="bg-primary text-primary-foreground"

## Import rules
WRONG: import { Button } from "react"
RIGHT: import { Button } from "@/components/ui/button"

WRONG: import { useState } from "react"  // only if you also need other hooks
RIGHT: import { useState, useCallback, useMemo } from "react"

## State rules
WRONG: let result = ""
RIGHT: const [result, setResult] = useState("")

## Copy to clipboard — always use this exact pattern
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    // Fallback for HTTP contexts
    const el = document.createElement("textarea")
    el.value = text
    document.body.appendChild(el)
    el.select()
    document.execCommand("copy")
    document.body.removeChild(el)
  }
}

## UX rules
WRONG: alert("Copied!")
RIGHT: use a useState boolean to show an inline "Copied ✓" state for 1.5 s

WRONG: <button onClick={handleProcess}>Go</button>  // no aria-label when icon-only
RIGHT: <button onClick={handleProcess} aria-label="Process input">Go</button>

WRONG: <input id="inp" />  // label not connected
RIGHT: <label htmlFor="inp">Input</label><input id="inp" />

## Component file rules
WRONG: export default function MyCustomName() {   // name differs from spec
RIGHT: export default function ${componentName}() {  // EXACTLY this name

## Output format
Respond with EXACTLY this structure — no prose before or after:

=== COMPONENT ===
(the complete .tsx file content, starting with "use client")
=== END COMPONENT ===

=== CATEGORY ===
(single word from: formatter encoder generator tester converter japanese text number color image network crypto)
=== END CATEGORY ===

=== TAGS ===
(comma-separated lowercase tags, 5–10 items, no spaces around commas)
=== END TAGS ===

=== SEO_TITLE ===
(title tag text, max 60 chars, no site name suffix)
=== END SEO_TITLE ===

=== SEO_DESC ===
(meta description, 120–160 chars)
=== END SEO_DESC ===

=== INTRO ===
(2–3 sentence intro paragraph for the SEO article)
=== END INTRO ===

=== USAGE ===
(2–3 sentence usage instructions)
=== END USAGE ===

=== EXAMPLE ===
(plain text example showing input → output, use \\n for newlines, no markdown)
=== END EXAMPLE ===

=== USE_CASES ===
(4–6 numbered use cases, one per line, format: "1. Use case text.")
=== END USE_CASES ===

=== FAQ ===
(2–3 FAQ items in format: Q: question\\nA: answer — separated by blank lines)
=== END FAQ ===
`
}

// ── Fix prompt (called on retry) ─────────────────────────────────────────────

export function buildFixPrompt(
  req: ComponentRequest,
  previousCode: string,
  checkResult: StaticCheckResult
): string {
  const issues = checkResult.issues.map((i) => `- [${i.severity}] ${i.rule}: ${i.message} (line ${i.line ?? "?"})`).join("\n")

  return `The component you generated has the following issues. Fix ALL of them and return the FULL corrected file.

## Issues to fix
${issues}

## Previous code
\`\`\`tsx
${previousCode}
\`\`\`

## Requirements reminder
- Component must be named: ${toPascalCase(req.toolId)}
- All Tailwind classes must use semantic tokens (text-muted-foreground, bg-muted, etc.)
- All imports must use @/components/ui/* for shadcn
- No alert() calls — use inline copied state
- All inputs must have associated labels (htmlFor / aria-label)

Return ONLY the corrected .tsx file content starting with "use client". No explanation.`
}

// ── Helpers ───────────────────────────────────────────────────────────────────

export function toPascalCase(kebab: string): string {
  return kebab
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("")
}
