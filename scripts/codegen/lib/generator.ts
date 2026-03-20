// scripts/codegen/lib/generator.ts
// Core generation loop: prompt → parse → check → retry on failure → write output.

import { callLLM }           from "./llm.js"
import { buildGenerationPrompt, buildFixPrompt, toPascalCase } from "./prompts.js"
import { parseLLMOutput }    from "./parser.js"
import { runStaticChecks }   from "./staticChecker.js"
import { writeOutput, copyToProject } from "./workspace.js"
import { checkSlugConflict } from "./registry.js"
import type { ComponentRequest, ComponentResult, AttemptDetail } from "./contract.js"

export async function generateComponent(req: ComponentRequest): Promise<ComponentResult> {
  const start         = Date.now()
  const maxAttempts   = req.maxAttempts ?? 3
  const outputDir     = req.outputDir   ?? "./output"
  const componentName = toPascalCase(req.toolId)
  const provider      = req.provider    ?? "auto"
  const attemptLog: AttemptDetail[] = []

  console.log(`\n[gen] Starting: ${req.displayName} (${componentName})`)
  console.log(`[gen] Features: ${req.features.join(", ")}`)

  // ── Conflict check ──────────────────────────────────────────────────────────
  if (req.projectDir && checkSlugConflict(req.projectDir, req.toolId)) {
    return {
      success: false,
      attemptsUsed: 0,
      elapsedMs: Date.now() - start,
      failureReason: "registry_conflict",
      failureMessage: `Slug "${req.toolId}" already exists in data/tools.ts`,
    }
  }

  let lastCode    = ""
  let lastProvider = ""

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    console.log(`\n[gen] Attempt ${attempt}/${maxAttempts}`)

    try {
      // ── Build prompt ──────────────────────────────────────────────────────
      let prompt: string
      if (attempt === 1) {
        prompt = buildGenerationPrompt(req)
      } else {
        // On retry, send the previous code + specific issues
        const prevCheck = runStaticChecks(lastCode, componentName)
        prompt = buildFixPrompt(req, lastCode, prevCheck)
      }

      // ── Call LLM ─────────────────────────────────────────────────────────
      const llmRes = await callLLM(prompt, provider)
      lastProvider = llmRes.provider

      // ── Parse output ──────────────────────────────────────────────────────
      const parseResult = parseLLMOutput(llmRes.text)

      if (!parseResult.ok || !parseResult.data) {
        const msg = `Parse failed. Missing sections: ${parseResult.missing.join(", ")}`
        console.warn(`[gen] ${msg}`)
        attemptLog.push({ attempt, error: msg, fixApplied: "Re-prompting with full prompt" })

        // On last attempt — still try to continue with partial data if component exists
        if (attempt === maxAttempts && !parseResult.data?.component) {
          return {
            success: false,
            attemptsUsed: attempt,
            elapsedMs: Date.now() - start,
            failureReason: "max_attempts_reached",
            failureMessage: msg,
            attemptLog,
            providerUsed: lastProvider,
          }
        }
        if (!parseResult.data?.component) continue
      }

      const parsed = parseResult.data!
      lastCode = parsed.component

      // ── Static check ──────────────────────────────────────────────────────
      const checkResult = runStaticChecks(parsed.component, componentName)

      if (!checkResult.passed) {
        const errors = checkResult.issues.filter((i) => i.severity === "error")
        const msg    = errors.map((e) => `${e.rule}: ${e.message}`).join("; ")
        console.warn(`[gen] Static check failed (${errors.length} errors): ${msg}`)
        attemptLog.push({ attempt, error: msg, fixApplied: "Sending fix prompt with issue list" })

        if (attempt < maxAttempts) continue

        // Last attempt — write what we have with warnings in REVIEW.md
        console.warn("[gen] Max attempts reached with errors. Writing partial output.")
        const ws = writeOutput(req, parsed, checkResult, outputDir)
        return {
          success: false,
          attemptsUsed: attempt,
          elapsedMs: Date.now() - start,
          failureReason: "static_check_failed",
          failureMessage: msg,
          componentPath:  ws.componentPath,
          registryEntry:  ws.registryEntry,
          registryLine:   ws.registryLine,
          reviewPath:     ws.reviewPath,
          attemptLog,
          providerUsed:   lastProvider,
        }
      }

      // ── Success ───────────────────────────────────────────────────────────
      const ws = writeOutput(req, parsed, checkResult, outputDir)

      if (req.projectDir) {
        copyToProject(
          ws.componentPath,
          componentName,
          ws.registryEntry,
          ws.registryLine,
          req.projectDir
        )
      }

      console.log(`[gen] ✅ Success in ${attempt} attempt(s) via ${lastProvider}`)
      console.log(`[gen] Component: ${ws.componentPath}`)
      console.log(`[gen] Review:    ${ws.reviewPath}`)

      return {
        success: true,
        attemptsUsed: attempt,
        elapsedMs: Date.now() - start,
        componentPath:  ws.componentPath,
        registryEntry:  ws.registryEntry,
        registryLine:   ws.registryLine,
        reviewPath:     ws.reviewPath,
        providerUsed:   lastProvider,
        attemptLog,
      }

    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error(`[gen] Attempt ${attempt} threw: ${msg}`)
      attemptLog.push({ attempt, error: msg, fixApplied: "Retrying" })

      if (attempt === maxAttempts) {
        return {
          success: false,
          attemptsUsed: attempt,
          elapsedMs: Date.now() - start,
          failureReason: msg.includes("provider") ? "llm_unavailable" : "internal_error",
          failureMessage: msg,
          attemptLog,
          providerUsed: lastProvider,
        }
      }
    }
  }

  // Should never reach here
  return {
    success: false,
    attemptsUsed: maxAttempts,
    elapsedMs: Date.now() - start,
    failureReason: "max_attempts_reached",
    failureMessage: "Exhausted all attempts",
    attemptLog,
  }
}
