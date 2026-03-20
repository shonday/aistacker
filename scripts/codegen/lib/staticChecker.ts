// scripts/codegen/lib/staticChecker.ts
// Catches the most common LLM code mistakes before they reach the project.
// No external dependencies — pure regex + string analysis.

export type IssueSeverity = "error" | "warn"

export interface CheckIssue {
  rule:     string
  severity: IssueSeverity
  message:  string
  line?:    number
}

export interface StaticCheckResult {
  passed: boolean   // true only if no errors (warnings are allowed)
  issues: CheckIssue[]
}

// ── Individual checks ─────────────────────────────────────────────────────────

function checkComponentName(code: string, expectedName: string): CheckIssue[] {
  const match = code.match(/export\s+default\s+function\s+(\w+)/)
  if (!match) {
    return [{ rule: "component-name", severity: "error", message: "No default export function found." }]
  }
  if (match[1] !== expectedName) {
    return [{
      rule: "component-name",
      severity: "error",
      message: `Component is named "${match[1]}" but must be "${expectedName}".`,
    }]
  }
  return []
}

function checkHardcodedColors(code: string): CheckIssue[] {
  const issues: CheckIssue[] = []
  const lines = code.split("\n")
  // Patterns that indicate hardcoded Tailwind palette classes
  const badPatterns = [
    /\b(text|bg|border|ring|from|to|via)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}\b/,
  ]
  lines.forEach((line, i) => {
    for (const pattern of badPatterns) {
      if (pattern.test(line)) {
        issues.push({
          rule: "hardcoded-color",
          severity: "warn",
          message: `Hardcoded Tailwind color found. Use semantic tokens (text-muted-foreground, bg-muted, etc.).`,
          line: i + 1,
        })
        break // one warning per line is enough
      }
    }
  })
  return issues
}

function checkShadcnImports(code: string): CheckIssue[] {
  const issues: CheckIssue[] = []
  // Detect shadcn component imports that don't use @/components/ui
  const badImport = /from\s+["'](radix-ui|@radix-ui\/react-(?!icons)|react-select|cmdk)["']/
  const lines = code.split("\n")
  lines.forEach((line, i) => {
    if (badImport.test(line)) {
      issues.push({
        rule: "shadcn-import",
        severity: "error",
        message: `Import Radix/shadcn components via @/components/ui/*, not directly.`,
        line: i + 1,
      })
    }
  })
  return issues
}

function checkAlertUsage(code: string): CheckIssue[] {
  const issues: CheckIssue[] = []
  const lines = code.split("\n")
  lines.forEach((line, i) => {
    if (/\balert\s*\(/.test(line) && !line.trim().startsWith("//")) {
      issues.push({
        rule: "no-alert",
        severity: "error",
        message: `alert() is not allowed. Use an inline copied-state boolean (see prompt rules).`,
        line: i + 1,
      })
    }
  })
  return issues
}

function checkAccessibility(code: string): CheckIssue[] {
  const issues: CheckIssue[] = []
  const lines = code.split("\n")

  lines.forEach((line, i) => {
    // Icon-only buttons without aria-label
    if (/<button[^>]*>/.test(line) && !line.includes("aria-label") && !line.includes("aria-labelledby")) {
      // Only warn if button contains an icon import pattern (uppercase component = likely icon)
      if (/<[A-Z]\w+\s*(className|size)/.test(line) || /Icon/.test(line)) {
        issues.push({
          rule: "a11y-button-label",
          severity: "warn",
          message: `Icon-only button may need aria-label.`,
          line: i + 1,
        })
      }
    }
    // input without id when a label with htmlFor exists nearby
    if (/<input\b/.test(line) && !line.includes("id=") && !line.includes("aria-label")) {
      issues.push({
        rule: "a11y-input-label",
        severity: "warn",
        message: `<input> has no id or aria-label — screen readers cannot identify it.`,
        line: i + 1,
      })
    }
  })

  return issues
}

function checkHooksUsage(code: string): CheckIssue[] {
  const issues: CheckIssue[] = []
  const lines = code.split("\n")

  lines.forEach((line, i) => {
    // useEffect with empty deps array referencing outer variables
    if (/useEffect\s*\(\s*\(\s*\)\s*=>/.test(line) && /\[\s*\]/.test(line)) {
      issues.push({
        rule: "hooks-effect-deps",
        severity: "warn",
        message: `useEffect with [] — make sure no closure variables are missing from the deps array.`,
        line: i + 1,
      })
    }
  })

  return issues
}

function checkUseClientDirective(code: string): CheckIssue[] {
  const firstLine = code.split("\n")[0].trim()
  if (firstLine !== '"use client"' && firstLine !== "'use client'") {
    return [{
      rule: "use-client",
      severity: "error",
      message: `File must start with "use client" directive (interactive tool component).`,
      line: 1,
    }]
  }
  return []
}

// ── Public API ────────────────────────────────────────────────────────────────

export function runStaticChecks(
  code: string,
  expectedComponentName: string
): StaticCheckResult {
  const issues: CheckIssue[] = [
    ...checkUseClientDirective(code),
    ...checkComponentName(code, expectedComponentName),
    ...checkHardcodedColors(code),
    ...checkShadcnImports(code),
    ...checkAlertUsage(code),
    ...checkAccessibility(code),
    ...checkHooksUsage(code),
  ]

  const hasErrors = issues.some((i) => i.severity === "error")

  return {
    passed: !hasErrors,
    issues,
  }
}
