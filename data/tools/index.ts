// data/tools/index.ts — updated with Wave 1 tools
// ★ Public API — import from "@/data/tools" still works unchanged.
//
// File layout:
//   data/tools/
//     index.ts          ← this file (re-exports everything)
//     types.ts          ← all TypeScript types and interfaces
//     formatter.ts      ← JSON Formatter, (future) YAML, XML tools
//     encoder.ts        ← Base64, URL Encode, URL Decode, (future) JWT, HTML encoder
//     generator.ts      ← UUID, (future) Password, Lorem Ipsum, QR Code
//     tester.ts         ← Regex, (future) Diff, Lint
//     converter.ts      ← Timestamp, (future) Number Base, Color, CSV↔JSON
//     [category].ts     ← add a new file per category as tools scale
//
// Adding a new tool:
//   1. Open the relevant category file (or create data/tools/{category}.ts)
//   2. Add the ToolMeta entry to the exported array
//   3. Re-run build — index.ts auto-merges all arrays
//
// This keeps each category file under ~100 lines regardless of total tool count.
export * from "./types"

import { formatterTools }  from "./formatter"
import { encoderTools }    from "./encoder"
import { generatorTools }  from "./generator"
import { testerTools }     from "./tester"
import { converterTools }  from "./converter"
import { wave1Tools }      from "./new-wave1"
import type { ToolMeta, ToolCategory, ToolSubcategory } from "./types"

export const tools: ToolMeta[] = [
  ...formatterTools,
  ...encoderTools,
  ...generatorTools,
  ...testerTools,
  ...converterTools,
  ...wave1Tools,
]

// ── Utility helpers ───────────────────────────────────────────────────────────

export function getToolBySlug(slug: string): ToolMeta | undefined {
  return tools.find(t => t.slug === slug)
}

export function getToolsByCategory(category: ToolCategory): ToolMeta[] {
  return tools.filter(t => t.category === category)
}

export function getToolsBySubcategory(sub: ToolSubcategory): ToolMeta[] {
  return tools.filter(t => t.subcategory === sub)
}

export function getCategories(): ToolCategory[] {
  return [...new Set(tools.map(t => t.category))].sort() as ToolCategory[]
}

export function getFeaturedTools(): ToolMeta[] {
  return tools.filter(t => t.featured)
}

export function isNewTool(tool: ToolMeta, withinDays = 30): boolean {
  return Date.now() - new Date(tool.addedAt).getTime() < withinDays * 86_400_000
}

export function getRelatedTools(tool: ToolMeta, limit = 6): ToolMeta[] {
  const workflowSlugs = new Set([...tool.workflow.before, ...tool.workflow.after])
  return tools
    .filter(t => t.slug !== tool.slug)
    .map(t => ({
      tool: t,
      score:
        (workflowSlugs.has(t.slug)          ? 5 : 0) +
        (t.subcategory === tool.subcategory  ? 3 : 0) +
        (t.category    === tool.category     ? 2 : 0) +
        t.tags.filter(tag => tool.tags.includes(tag)).length,
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ tool: t }) => t)
}

export function getLocalizedTool(tool: ToolMeta, locale: "en" | "ja" | "zh"): ToolMeta {
  if (locale === "en" || !tool.i18n?.[locale]) return tool
  const override = tool.i18n[locale]!
  return {
    ...tool,
    name:        override.name        ?? tool.name,
    description: override.description ?? tool.description,
    seo:         override.seo         ?? tool.seo,
    content:     override.content ? { ...tool.content, ...override.content } : tool.content,
  }
}

// Labels and icons (used by UI components)
export const CATEGORY_LABELS: Record<ToolCategory, string> = {
  formatter:  "Formatter",
  encoder:    "Encoder / Decoder",
  generator:  "Generator",
  tester:     "Tester",
  converter:  "Converter",
  japanese:   "Japanese",
  text:       "Text",
  number:     "Number",
  color:      "Color",
  image:      "Image",
  network:    "Network",
  crypto:     "Crypto",
}

export const CATEGORY_ICON: Record<ToolCategory, string> = {
  formatter:  "Braces",
  encoder:    "Lock",
  generator:  "Sparkles",
  tester:     "FlaskConical",
  converter:  "ArrowLeftRight",
  japanese:   "Languages",
  text:       "Type",
  number:     "Hash",
  color:      "Palette",
  image:      "ImageIcon",
  network:    "Globe",
  crypto:     "ShieldCheck",
}
