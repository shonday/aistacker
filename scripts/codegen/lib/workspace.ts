// scripts/codegen/lib/workspace.ts
// File I/O helper — writes component, REVIEW.md, and copies to project.

import fs from "fs"
import path from "path"
import type { ComponentRequest } from "./contract.js"
import type { ParsedOutput } from "./parser.js"
import type { StaticCheckResult } from "./staticChecker.js"
import { toPascalCase } from "./prompts.js"
import { buildToolsEntry, buildRegistryLine } from "./registry.js"

export interface WorkspaceResult {
  componentPath:  string
  reviewPath:     string
  registryEntry:  string
  registryLine:   string
}

export function writeOutput(
  req: ComponentRequest,
  parsed: ParsedOutput,
  checkResult: StaticCheckResult,
  outputDir: string
): WorkspaceResult {
  fs.mkdirSync(outputDir, { recursive: true })

  const componentName = toPascalCase(req.toolId)
  const componentFile = path.join(outputDir, `${componentName}.tsx`)
  const reviewFile    = path.join(outputDir, "REVIEW.md")

  // 1. Write component
  fs.writeFileSync(componentFile, parsed.component, "utf-8")

  // 2. Build registry snippets
  const registryEntry = buildToolsEntry(req, parsed)
  const registryLine  = buildRegistryLine(req)

  // 3. Write REVIEW.md
  const warnCount  = checkResult.issues.filter((i) => i.severity === "warn").length
  const issueLines = checkResult.issues.length > 0
    ? checkResult.issues.map((i) => `- [${i.severity.toUpperCase()}] ${i.rule} (line ${i.line ?? "?"}): ${i.message}`).join("\n")
    : "None."

  const review = `# ${req.displayName} — Review Checklist

## Steps
1. \`npm run dev\` → open http://localhost:3000/tools/${req.toolId}
2. Verify all ${req.features.length} features work:
${req.features.map((f, i) => `   ${i + 1}. ${f}`).join("\n")}
3. Test with empty input → no crash, clear error state
4. Test copy button → clipboard receives correct value
5. Toggle dark mode → no broken colors
6. Resize to mobile (375px) → layout intact

## Static check result
Errors: ${checkResult.issues.filter((i) => i.severity === "error").length}
Warnings: ${warnCount}

${issueLines}

## data/tools.ts entry (append inside the tools array)
\`\`\`typescript
${registryEntry}
\`\`\`

## lib/toolRegistry.ts line (add inside the toolRegistry object)
\`\`\`typescript
${registryLine}
\`\`\`
`

  fs.writeFileSync(reviewFile, review, "utf-8")

  return { componentPath: componentFile, reviewPath: reviewFile, registryEntry, registryLine }
}

export function copyToProject(
  componentFile: string,
  componentName: string,
  registryEntry: string,
  registryLine: string,
  projectDir: string
): void {
  // Copy component
  const destDir  = path.join(projectDir, "components", "tools")
  fs.mkdirSync(destDir, { recursive: true })
  const destFile = path.join(destDir, `${componentName}.tsx`)
  fs.copyFileSync(componentFile, destFile)
  console.log(`[workspace] copied component → ${destFile}`)

  // Append to data/tools.ts
  const { appendToToolsTs, appendToToolRegistry } = require("./registry.js")
  appendToToolsTs(projectDir, registryEntry)
  console.log(`[workspace] appended entry to data/tools.ts`)

  appendToToolRegistry(projectDir, registryLine)
  console.log(`[workspace] appended line to lib/toolRegistry.ts`)
}
