// scripts/codegen/lib/prompts.ts — updated 20260322
//
// KEY CHANGES vs previous version:
//
// 1. TWO-PASS STRATEGY
//    Pass 1: Generate ONLY the component TSX. No metadata sections.
//            This eliminates the "use-client missing" failure — the LLM
//            only has to do one job per response.
//    Pass 2: Given the completed component, generate all metadata sections.
//            Much more reliable because the LLM isn't juggling both tasks.
//
// 2. EXPLICIT "use client" PLACEMENT
//    Previous prompt said it was required but never showed WHERE.
//    New prompt shows the exact first two lines with a concrete example.
//
// 3. QUALITY FLOOR
//    The prompt now shows a reference-quality component excerpt so the LLM
//    calibrates to "production tool" not "tutorial skeleton".
//    Features like keyboard shortcuts, error boundaries, loading states,
//    and copy feedback are specified as non-optional defaults.
//
// 4. METADATA-ONLY FIX PROMPT
//    When metadata is missing, sends a targeted prompt for metadata only,
//    not a full regeneration. Saves tokens and retries.
//
// 5. PROBLEMS + WORKFLOW FIELDS — added
//    buildIdeaToSpecPrompt now outputs problems[], workflow{}, searchIntents{}
//    so generated tools are SEO-ready from the start.

import type { ComponentRequest } from "./contract.js"
import type { StaticCheckResult } from "./staticChecker.js"

// ── Pass 1: component only ────────────────────────────────────────────────────

export function buildComponentPrompt(req: ComponentRequest): string {
  const componentName = toPascalCase(req.toolId)
  const featureList   = req.features.map((f, i) => `${i + 1}. ${f}`).join("\n")

  return `You are a senior React/Next.js engineer. Generate a single production-quality tool component.

## Spec
Component name: ${componentName}
Tool name:      ${req.displayName}
Description:    ${req.description}
Category:       ${req.category ?? "auto-detect"}

## Required features — implement ALL of them, no exceptions
${featureList}

## Non-negotiable quality standards
Every tool must have:
- Keyboard shortcut: Ctrl/Cmd+Enter triggers the primary action
- Copy button: shows "Copied ✓" inline for 1500ms then resets (never alert())
- Error state: invalid input shows a clear inline error message, never crashes
- Empty state: graceful placeholder when fields are empty
- Loading state: if processing takes time, show a spinner or disabled button

## Technology
- React 19 ("use client" directive is MANDATORY — first line of file)
- Tailwind CSS v4 with semantic tokens ONLY
- lucide-react for icons
- No external libraries (no marked, no prism, no highlight.js, no react-markdown)
- If you need markdown rendering: implement a minimal renderer using regex/DOM
- If you need syntax highlighting: use a <pre> with className="language-xxx"

## Tailwind — semantic tokens only
WRONG: text-gray-500   → RIGHT: text-muted-foreground
WRONG: bg-gray-100     → RIGHT: bg-muted
WRONG: bg-white        → RIGHT: bg-background
WRONG: text-slate-900  → RIGHT: text-foreground
WRONG: border-gray-200 → RIGHT: border-border
WRONG: bg-blue-500 text-white → RIGHT: bg-primary text-primary-foreground
WRONG: text-red-500    → RIGHT: text-destructive

## Imports — shadcn must use @/components/ui
WRONG: import { Button } from "radix-ui"
RIGHT: import { Button } from "@/components/ui/button"

## Exact file structure — follow this precisely
\`\`\`
"use client"
                                     ← blank line after directive
import { useState, useCallback, ... } from "react"
import { ... } from "lucide-react"
import { ... } from "@/components/ui/..."
                                     ← blank line
export default function ${componentName}() {
  ...
}
\`\`\`

## Copy-to-clipboard — always use this exact pattern
\`\`\`tsx
const [copied, setCopied] = useState<string | null>(null)

const copyToClipboard = useCallback(async (text: string, id: string) => {
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    const el = document.createElement("textarea")
    el.value = text
    document.body.appendChild(el)
    el.select()
    document.execCommand("copy")
    document.body.removeChild(el)
  }
  setCopied(id)
  setTimeout(() => setCopied(null), 1500)
}, [])
\`\`\`
Copy button JSX: \`<button onClick={() => copyToClipboard(text, "result")}>{copied === "result" ? "Copied ✓" : "Copy"}</button>\`

## Output format — CRITICAL
Output ONLY the raw .tsx file content. No explanation, no prose, no markdown fence.
Start the response with exactly this string (including the quotes): "use client"

The response must end with the closing brace of the component. Nothing else.`
}

// ── Pass 2: metadata only (given completed component) ────────────────────────

export function buildMetadataPrompt(req: ComponentRequest, componentCode: string): string {
  return `Given this completed React component for the tool "${req.displayName}", generate the metadata sections below.

## Component (for context — do NOT regenerate it)
\`\`\`tsx
${componentCode.slice(0, 800)}${componentCode.length > 800 ? "\n... (truncated)" : ""}
\`\`\`

## Output — use EXACTLY these delimiters, one section at a time

=== CATEGORY ===
${req.category ?? "(one word from: formatter encoder generator tester converter japanese text number color image network crypto)"}
=== END CATEGORY ===

=== TAGS ===
(5–8 comma-separated lowercase tags relevant to this tool)
=== END TAGS ===

=== SEO_TITLE ===
(page title, max 60 chars, specific and keyword-rich, no brand name)
=== END SEO_TITLE ===

=== SEO_DESC ===
(meta description 120–155 chars, what the tool does and its key benefits)
=== END SEO_DESC ===

=== INTRO ===
(2 sentences: what the tool is and why developers need it)
=== END INTRO ===

=== USAGE ===
(2 sentences: how to use the tool step by step)
=== END USAGE ===

=== EXAMPLE ===
(concrete input/output example as plain text, use actual values not placeholders)
=== END EXAMPLE ===

=== USE_CASES ===
1. (specific use case)
2. (specific use case)
3. (specific use case)
4. (specific use case)
=== END USE_CASES ===

=== FAQ ===
Q: (common question)
A: (direct answer)

Q: (common question)
A: (direct answer)
=== END FAQ ===

=== PROBLEMS ===
(6 specific user problems this tool solves, one per line, formatted as "How to X" questions)
=== END PROBLEMS ===

=== WORKFLOW_BEFORE ===
(comma-separated slugs of tools typically used BEFORE this one, or empty)
=== END WORKFLOW_BEFORE ===

=== WORKFLOW_AFTER ===
(comma-separated slugs of tools typically used AFTER this one, or empty)
=== END WORKFLOW_AFTER ===

Output ONLY the sections above. No prose before or after.`
}

// ── Fix prompt for static check errors ───────────────────────────────────────

export function buildFixPrompt(
  req: ComponentRequest,
  previousCode: string,
  checkResult: StaticCheckResult
): string {
  const componentName = toPascalCase(req.toolId)
  const errors = checkResult.issues
    .filter(i => i.severity === "error")
    .map(i => `  - Line ${i.line ?? "?"}: [${i.rule}] ${i.message}`)
    .join("\n")

  const warns = checkResult.issues
    .filter(i => i.severity === "warn")
    .map(i => `  - Line ${i.line ?? "?"}: [${i.rule}] ${i.message}`)
    .join("\n")

  return `Fix the following issues in this React component. Return the COMPLETE corrected file.

## Errors (MUST fix — these block deployment)
${errors || "  none"}

## Warnings (SHOULD fix)
${warns || "  none"}

## Previous code
\`\`\`tsx
${previousCode}
\`\`\`

## Fix rules
- FIRST LINE must be exactly: "use client"
- Component must be: export default function ${componentName}()
- Tailwind: replace ALL hardcoded palette classes (text-gray-*, bg-slate-*, etc.) with semantic tokens
- Imports: shadcn components must come from "@/components/ui/componentname"
- No alert() anywhere — use setCopied state pattern
- Every <input> needs id= and a matching <label htmlFor=>

Return ONLY the corrected .tsx file content. Start with "use client". No explanation.`
}

// ── Meta-prompt: natural language → ComponentRequest ─────────────────────────
// Used by the --idea flag. Converts vague user input into a precise spec.

export function buildIdeaToSpecPrompt(idea: string): string {
  return `You are helping prepare a precise spec for a browser-based developer tool generator.

The generator needs a ComponentRequest with these fields:
- toolId: kebab-case URL slug, unique, descriptive
- displayName: title-cased human name
- description: one sentence, max 160 chars, SEO-optimized, specific (mention key formats/features)
- category: exactly one of: formatter encoder generator tester converter japanese text number color image network crypto
- tags: 6-10 lowercase tags including 2-3 alias phrases users might search
- features: 6-10 SPECIFIC UI behaviors (not vague goals)
- problems: 6 "How to X" questions this tool answers (for SEO)
- workflowBefore: array of tool slugs typically used before this tool
- workflowAfter: array of tool slugs typically used after this tool
- searchIntents: { informational: string[], navigational: string[], transactional: string[] }

Known tool slugs for workflow fields:
json-formatter, base64-encode, url-encode, url-decode, uuid-generator,
regex-tester, timestamp-converter

Rules for features:
- Each feature = one concrete UI behavior (what element, what trigger, what result)
- Must include: an error state feature, a copy feedback feature, at least one live/reactive feature
- Must NOT include vague items like "good UX", "clean design", "easy to use"
- Format: "verb + object + qualifier" — e.g. "show error message inline when input is invalid JSON"

User's idea:
"""
${idea}
"""

Research this tool category. Think about:
1. What do the top 3 tools in this category (e.g. jsonlint.com, json.cn) offer?
2. What features do users complain are missing from existing tools?
3. What would make this tool genuinely better than alternatives?

Output ONLY valid JSON matching this TypeScript interface — no prose, no markdown fences:
{
  "toolId": string,
  "displayName": string,
  "description": string,
  "category": string,
  "tags": string[],
  "features": string[],
  "problems": string[],
  "workflowBefore": string[],
  "workflowAfter": string[],
  "searchIntents": {
    "informational": string[],
    "navigational": string[],
    "transactional": string[]
  }
}`
}

// ── Helper ────────────────────────────────────────────────────────────────────

export function toPascalCase(kebab: string): string {
  return kebab
    .split("-")
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .join("")
}
