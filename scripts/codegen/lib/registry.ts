// scripts/codegen/lib/registry.ts
// Reads and appends the two registry files.
// Called by the generator after a successful static check.

import fs from "fs"
import path from "path"
import type { ParsedOutput } from "./parser.js"
import type { ComponentRequest } from "./contract.js"
import { toPascalCase } from "./prompts.js"

// ── data/tools.ts entry ───────────────────────────────────────────────────────

export function buildToolsEntry(req: ComponentRequest, parsed: ParsedOutput): string {
  const componentName = toPascalCase(req.toolId)
  const today = new Date().toISOString().split("T")[0]
  const faqLines = parsed.faq
    .map((f) => `        { q: ${JSON.stringify(f.q)}, a: ${JSON.stringify(f.a)} },`)
    .join("\n")
  const tagList = parsed.tags.map((t) => JSON.stringify(t)).join(", ")

  return `  {
    slug: ${JSON.stringify(req.toolId)},
    name: ${JSON.stringify(req.displayName)},
    description: ${JSON.stringify(req.description)},
    component: ${JSON.stringify(componentName)},
    category: ${JSON.stringify(parsed.category)} as ToolCategory,
    tags: [${tagList}],
    status: "new",
    featured: false,
    addedAt: "${today}",
    seo: {
      title: ${JSON.stringify(parsed.seoTitle)},
      description: ${JSON.stringify(parsed.seoDesc)},
    },
    content: {
      intro: ${JSON.stringify(parsed.intro)},
      usage: ${JSON.stringify(parsed.usage)},
      example: ${JSON.stringify(parsed.example)},
      useCases: ${JSON.stringify(parsed.useCases)},
      faq: [
${faqLines}
      ],
    },
  },`
}

// ── lib/toolRegistry.ts line ──────────────────────────────────────────────────

export function buildRegistryLine(req: ComponentRequest): string {
  const componentName = toPascalCase(req.toolId)
  return `  ${componentName.padEnd(20)}: dynamic(() => import("@/components/tools/${componentName}")),`
}

// ── Append to project files ───────────────────────────────────────────────────

export function appendToToolsTs(projectDir: string, entry: string): void {
  const filePath = path.join(projectDir, "data", "tools.ts")
  const content  = fs.readFileSync(filePath, "utf-8")

  // Insert before the closing bracket of the tools array
  const marker = "]"
  const lastBracket = content.lastIndexOf("\n]")
  if (lastBracket === -1) {
    throw new Error("Could not find the closing ] of the tools array in data/tools.ts")
  }

  const updated = content.slice(0, lastBracket) + "\n" + entry + "\n" + content.slice(lastBracket)
  fs.writeFileSync(filePath, updated, "utf-8")
}

export function appendToToolRegistry(projectDir: string, line: string): void {
  const filePath = path.join(projectDir, "lib", "toolRegistry.ts")
  const content  = fs.readFileSync(filePath, "utf-8")

  // Insert before the closing } of the toolRegistry object
  const lastBrace = content.lastIndexOf("\n}")
  if (lastBrace === -1) {
    throw new Error("Could not find closing } in lib/toolRegistry.ts")
  }

  const updated = content.slice(0, lastBrace) + "\n" + line + "\n" + content.slice(lastBrace)
  fs.writeFileSync(filePath, updated, "utf-8")
}

// ── Conflict check ────────────────────────────────────────────────────────────

export function checkSlugConflict(projectDir: string, slug: string): boolean {
  const filePath = path.join(projectDir, "data", "tools.ts")
  if (!fs.existsSync(filePath)) return false
  const content = fs.readFileSync(filePath, "utf-8")
  return content.includes(`slug: "${slug}"`) || content.includes(`slug: '${slug}'`)
}
