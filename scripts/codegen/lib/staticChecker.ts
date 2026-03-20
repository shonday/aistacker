// scripts/codegen/lib/staticChecker.ts
// Validates generated component code before writing to project.
// KEY FIX: "use client" check now handles BOM, CRLF, trailing spaces,
//          and single vs double quotes — all of which caused false failures.

export type IssueSeverity = "error" | "warn"

export interface CheckIssue {
  rule:     string
  severity: IssueSeverity
  message:  string
  line?:    number
}

export interface StaticCheckResult {
  passed: boolean
  issues: CheckIssue[]
}

// ── use client ────────────────────────────────────────────────────────────────

function checkUseClientDirective(code: string): CheckIssue[] {
  // Normalize: strip BOM, normalize line endings, trim leading whitespace
  const normalized = code
    .replace(/^\uFEFF/, "")           // BOM
    .replace(/\r\n/g, "\n")           // CRLF → LF
    .replace(/\r/g, "\n")             // CR → LF
    .trimStart()

  const firstLine = normalized.split("\n")[0].trim()

  // Accept both quote styles
  if (firstLine === '"use client"' || firstLine === "'use client'") {
    return []
  }

  return [{
    rule: "use-client",
    severity: "error",
    message: `File must start with "use client". First line found: ${JSON.stringify(firstLine.slice(0, 40))}`,
    line: 1,
  }]
}

// ── Component name ────────────────────────────────────────────────────────────

function checkComponentName(code: string, expectedName: string): CheckIssue[] {
  const match = code.match(/export\s+default\s+function\s+(\w+)/)
  if (!match) {
    return [{ rule: "component-name", severity: "error", message: "No export default function found." }]
  }
  if (match[1] !== expectedName) {
    return [{
      rule: "component-name",
      severity: "error",
      message: `Component named "${match[1]}" but must be "${expectedName}".`,
    }]
  }
  return []
}

// ── Hardcoded colors ──────────────────────────────────────────────────────────

function checkHardcodedColors(code: string): CheckIssue[] {
  const issues: CheckIssue[] = []
  const lines = code.split("\n")
  const palette = /\b(text|bg|border|ring|from|to|via|stroke|fill|shadow|outline|accent|divide)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}\b/

  lines.forEach((line, i) => {
    if (palette.test(line) && !line.trim().startsWith("//") && !line.trim().startsWith("*")) {
      issues.push({
        rule: "hardcoded-color",
        severity: "warn",
        message: "Hardcoded Tailwind palette color. Use semantic tokens (text-muted-foreground, bg-muted, etc.).",
        line: i + 1,
      })
    }
  })
  return issues
}

// ── shadcn imports ────────────────────────────────────────────────────────────

function checkShadcnImports(code: string): CheckIssue[] {
  const issues: CheckIssue[] = []
  const lines = code.split("\n")
  const badImport = /from\s+["'](@radix-ui\/react-(?!icons)|radix-ui)["']/

  lines.forEach((line, i) => {
    if (badImport.test(line)) {
      issues.push({
        rule: "shadcn-import",
        severity: "error",
        message: "Import shadcn/radix components via @/components/ui/*, not directly from radix-ui.",
        line: i + 1,
      })
    }
  })
  return issues
}

// ── alert() ───────────────────────────────────────────────────────────────────

function checkAlertUsage(code: string): CheckIssue[] {
  const issues: CheckIssue[] = []
  const lines = code.split("\n")

  lines.forEach((line, i) => {
    const trimmed = line.trim()
    if (/\balert\s*\(/.test(line) && !trimmed.startsWith("//") && !trimmed.startsWith("*")) {
      issues.push({
        rule: "no-alert",
        severity: "error",
        message: "alert() is not allowed. Use inline copied state (setCopied pattern).",
        line: i + 1,
      })
    }
  })
  return issues
}

// ── Accessibility ─────────────────────────────────────────────────────────────

function checkAccessibility(code: string): CheckIssue[] {
  const issues: CheckIssue[] = []
  const lines = code.split("\n")

  lines.forEach((line, i) => {
    const trimmed = line.trim()
    // inputs without id or aria-label
    if (/<input\b/.test(line) && !line.includes("id=") && !line.includes("aria-label") && !trimmed.startsWith("//")) {
      issues.push({
        rule: "a11y-input-label",
        severity: "warn",
        message: "<input> has no id or aria-label.",
        line: i + 1,
      })
    }
  })
  return issues
}

// ── External library imports ──────────────────────────────────────────────────

function checkForbiddenImports(code: string): CheckIssue[] {
  const issues: CheckIssue[] = []
  const lines = code.split("\n")
  // Libraries that are NOT in package.json and would cause build failures
  const forbidden = /from\s+["'](marked|prismjs|highlight\.js|react-markdown|@uiw\/react-codemirror|codemirror|monaco-editor|ace-builds)["']/

  lines.forEach((line, i) => {
    if (forbidden.test(line)) {
      const pkg = line.match(/from\s+["']([^"']+)["']/)?.[1]
      issues.push({
        rule: "forbidden-import",
        severity: "error",
        message: `Import of "${pkg}" not allowed — not in package.json. Implement inline or use a different approach.`,
        line: i + 1,
      })
    }
  })
  return issues
}

// ── Public API ────────────────────────────────────────────────────────────────

export function runStaticChecks(code: string, expectedComponentName: string): StaticCheckResult {
  const issues: CheckIssue[] = [
    ...checkUseClientDirective(code),
    ...checkComponentName(code, expectedComponentName),
    ...checkForbiddenImports(code),   // check this before shadcn — more specific
    ...checkShadcnImports(code),
    ...checkAlertUsage(code),
    ...checkHardcodedColors(code),
    ...checkAccessibility(code),
  ]

  return {
    passed: !issues.some(i => i.severity === "error"),
    issues,
  }
}
