// scripts/codegen/lib/generator.ts
//
// KEY CHANGES vs previous version:
//
// 1. TWO-PASS GENERATION
//    Pass 1: LLM generates component only (no metadata).
//            Retries up to maxAttempts if static check fails.
//    Pass 2: Given the passing component, LLM generates metadata separately.
//            Only 1 attempt needed — metadata has no static checks.
//    Result: each LLM call has a single, focused job. Failure rate drops sharply.
//
// 2. RAW OUTPUT SAVED FOR DEBUGGING
//    Every LLM response is written to output/debug/{attempt}-raw.txt.
//    When something fails you can immediately see what the LLM actually returned.
//
// 3. METADATA FAILURES ARE NON-FATAL
//    If metadata generation fails, the component is still written with placeholder
//    metadata. You get a working component + a REVIEW.md with a warning.
//    Previously, a metadata parse failure killed the entire run.
//
// 4. SMARTER RETRY LOGIC
//    On static check failure: send targeted fix prompt (not the full prompt again).
//    On parse failure of component: send full prompt again with stronger emphasis.
//    These were previously conflated.

import fs from "fs"
import path from "path"
import { callLLM }                    from "./llm.js"
import {
  buildComponentPrompt,
  buildMetadataPrompt,
  buildFixPrompt,
  toPascalCase,
}                                     from "./prompts.js"
import { parseLLMOutput, ParsedOutput } from "./parser.js"
import { runStaticChecks }            from "./staticChecker.js"
import { writeOutput, copyToProject } from "./workspace.js"
import { checkSlugConflict }          from "./registry.js"
import type { ComponentRequest, ComponentResult, AttemptDetail } from "./contract.js"

// ── Debug helpers ─────────────────────────────────────────────────────────────

function saveDebug(outputDir: string, label: string, content: string): void {
  try {
    const dir = path.join(outputDir, "debug")
    fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(path.join(dir, `${label}.txt`), content, "utf-8")
  } catch { /* non-fatal */ }
}

// ── Pass 1: generate and validate the component TSX ──────────────────────────

async function generateComponentPass(
  req: ComponentRequest,
  provider: ComponentRequest["provider"],
  maxAttempts: number,
  outputDir: string
): Promise<{
  code: string
  providerUsed: string
  attemptLog: AttemptDetail[]
} | null> {
  const componentName = toPascalCase(req.toolId)
  const attemptLog: AttemptDetail[] = []
  let providerUsed = ""

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    console.log(`\n[gen] Component pass — attempt ${attempt}/${maxAttempts}`)

    try {
      // Build prompt: full on attempt 1, fix prompt on subsequent
      let prompt: string
      if (attempt === 1) {
        prompt = buildComponentPrompt(req)
      } else {
        // We need the previous code from the log to build a fix prompt
        const prevCode = attemptLog[attempt - 2]?.error.startsWith("Static check")
          ? (attemptLog[attempt - 2] as any)._code ?? ""
          : ""
        if (prevCode) {
          const prevCheck = runStaticChecks(prevCode, componentName)
          prompt = buildFixPrompt(req, prevCode, prevCheck)
        } else {
          // Parse failed on previous attempt — resend full prompt with extra emphasis
          prompt = buildComponentPrompt(req) + "\n\nCRITICAL: Output ONLY the raw .tsx file content. Start with the line: \"use client\"\nDo NOT wrap in markdown fences. Do NOT add any explanation."
        }
      }

      const llmRes = await callLLM(prompt, provider)
      providerUsed = llmRes.provider

      // Save raw response for debugging
      saveDebug(outputDir, `component-attempt-${attempt}-raw`, llmRes.text)

      // Extract component from response
      // The component-only prompt returns raw code, not === SECTION === format
      // We need to handle both cases for robustness
      let code = llmRes.text.trim()

      // Strip outer markdown fence if present
      const fenced = code.match(/^```(?:tsx?|typescript|jsx?)?\s*\n([\s\S]*?)\n?```\s*$/i)
      if (fenced) code = fenced[1].trim()

      // Ensure "use client" is present
      if (!code.startsWith('"use client"') && !code.startsWith("'use client'")) {
        // Try to find it anywhere in the first 5 lines
        const firstLines = code.split("\n").slice(0, 5).join("\n")
        if (firstLines.includes("use client")) {
          // Move it to the top
          code = '"use client"\n\n' + code.replace(/['"]use client['"]\s*\n?/, "")
        } else {
          // Add it
          code = '"use client"\n\n' + code
        }
      }

      // Must have a default export
      if (!code.includes("export default function")) {
        const msg = "No export default function found in LLM response"
        console.warn(`[gen] ${msg}`)
        attemptLog.push({ attempt, error: msg, fixApplied: "Resending full prompt", _code: code } as any)
        continue
      }

      // Static check
      const checkResult = runStaticChecks(code, componentName)
      saveDebug(outputDir, `component-attempt-${attempt}-check`, JSON.stringify(checkResult, null, 2))

      if (!checkResult.passed) {
        const errors = checkResult.issues.filter(i => i.severity === "error")
        const msg = `Static check failed: ${errors.map(e => e.rule).join(", ")}`
        console.warn(`[gen] ${msg}`)
        errors.forEach(e => console.warn(`       Line ${e.line ?? "?"}: ${e.message}`))
        attemptLog.push({ attempt, error: msg, fixApplied: "Sending fix prompt", _code: code } as any)
        if (attempt < maxAttempts) continue
        // Last attempt with errors — still return the code, caller decides
        console.warn("[gen] Returning code with warnings (max attempts reached)")
        return { code, providerUsed, attemptLog }
      }

      // Passed
      console.log(`[gen] Component pass ✓ in ${attempt} attempt(s) via ${providerUsed}`)
      return { code, providerUsed, attemptLog }

    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error(`[gen] Component attempt ${attempt} threw: ${msg}`)
      attemptLog.push({ attempt, error: msg, fixApplied: "Retrying" })
    }
  }

  return null
}

// ── Pass 2: generate metadata separately ─────────────────────────────────────

async function generateMetadataPass(
  req: ComponentRequest,
  componentCode: string,
  provider: ComponentRequest["provider"],
  outputDir: string
): Promise<Partial<ParsedOutput>> {
  console.log("\n[gen] Metadata pass…")

  try {
    const prompt = buildMetadataPrompt(req, componentCode)
    const llmRes = await callLLM(prompt, provider)
    saveDebug(outputDir, "metadata-raw", llmRes.text)

    const result = parseLLMOutput(llmRes.text)
    if (result.data) {
      console.log(`[gen] Metadata pass ✓ (missing: ${result.missing.join(", ") || "none"})`)
      return result.data
    }
  } catch (err) {
    console.warn(`[gen] Metadata pass failed: ${err instanceof Error ? err.message : err}`)
  }

  // Fallback metadata
  console.warn("[gen] Using fallback metadata")
  return {
    category: req.category ?? "formatter",
    tags:     req.tags ?? [],
    seoTitle: req.displayName,
    seoDesc:  req.description,
    intro:    req.description,
    usage:    `Use the ${req.displayName} by entering your input and clicking the action button.`,
    example:  "",
    useCases: "",
    faq:      [],
  }
}

// ── Main export ───────────────────────────────────────────────────────────────

export async function generateComponent(req: ComponentRequest): Promise<ComponentResult> {
  const start         = Date.now()
  const maxAttempts   = req.maxAttempts ?? 3
  const outputDir     = req.outputDir   ?? "./output"
  const componentName = toPascalCase(req.toolId)
  const provider      = req.provider    ?? "auto"

  console.log(`\n${"─".repeat(60)}`)
  console.log(`[gen] ${req.displayName} (${componentName})`)
  console.log(`[gen] Features: ${req.features.length} items`)
  console.log(`[gen] Provider: ${provider}`)
  console.log("─".repeat(60))

  // ── Conflict check ──────────────────────────────────────────────────────────
  if (req.projectDir && checkSlugConflict(req.projectDir, req.toolId)) {
    return {
      success: false,
      attemptsUsed: 0,
      elapsedMs: Date.now() - start,
      failureReason: "registry_conflict",
      failureMessage: `Slug "${req.toolId}" already exists in data/tools.ts. Delete the existing entry first.`,
    }
  }

  // ── Pass 1: component ───────────────────────────────────────────────────────
  const compResult = await generateComponentPass(req, provider, maxAttempts, outputDir)

  if (!compResult) {
    return {
      success: false,
      attemptsUsed: maxAttempts,
      elapsedMs: Date.now() - start,
      failureReason: "max_attempts_reached",
      failureMessage: "Component generation failed after all attempts. Check output/debug/ for raw LLM responses.",
    }
  }

  const { code, providerUsed, attemptLog } = compResult

  // ── Pass 2: metadata ────────────────────────────────────────────────────────
  const metadata = await generateMetadataPass(req, code, provider, outputDir)

  // ── Merge and write ─────────────────────────────────────────────────────────
  const parsed: ParsedOutput = {
    component: code,
    category:  metadata.category  ?? req.category  ?? "formatter",
    tags:      metadata.tags      ?? req.tags       ?? [],
    seoTitle:  metadata.seoTitle  ?? req.displayName,
    seoDesc:   metadata.seoDesc   ?? req.description,
    intro:     metadata.intro     ?? req.description,
    usage:     metadata.usage     ?? "",
    example:   metadata.example   ?? "",
    useCases:  metadata.useCases  ?? "",
    faq:       metadata.faq       ?? [],
  }

  const finalCheck = runStaticChecks(code, componentName)
  const ws = writeOutput(req, parsed, finalCheck, outputDir)

  if (req.projectDir) {
    copyToProject(ws.componentPath, componentName, ws.registryEntry, ws.registryLine, req.projectDir)
  }

  const success = finalCheck.passed
  console.log(`\n[gen] ${success ? "✅" : "⚠️ "} Done in ${((Date.now() - start) / 1000).toFixed(1)}s via ${providerUsed}`)
  console.log(`[gen] Component: ${ws.componentPath}`)
  console.log(`[gen] Review:    ${ws.reviewPath}`)

  return {
    success,
    attemptsUsed: attemptLog.length + 1,
    elapsedMs: Date.now() - start,
    componentPath:  ws.componentPath,
    registryEntry:  ws.registryEntry,
    registryLine:   ws.registryLine,
    reviewPath:     ws.reviewPath,
    providerUsed,
    attemptLog,
    ...(success ? {} : {
      failureReason: "static_check_failed",
      failureMessage: finalCheck.issues.filter(i => i.severity === "error").map(e => e.message).join("; "),
    }),
  }
}
