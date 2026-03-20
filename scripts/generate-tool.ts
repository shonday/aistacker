#!/usr/bin/env node
// scripts/generate-tool.ts — AIStacker Component Generator CLI
//
// Modes:
//   Single:      npx tsx scripts/generate-tool.ts --id "jwt-decoder" --name "..." --desc "..." --features "..."
//   Batch:       npx tsx scripts/generate-tool.ts --batch scripts/codegen/batch/wave1.json
//   From idea:   npx tsx scripts/idea.ts "I want a JWT decoder"   ← recommended

import { loadEnv } from "./codegen/lib/env.js"
loadEnv()

import { generateComponent } from "./codegen/lib/generator.js"
import type { ComponentRequest, ComponentResult, Provider } from "./codegen/lib/contract.js"
import fs from "fs"

function getArg(name: string): string | undefined {
  const idx = process.argv.indexOf(`--${name}`)
  return idx !== -1 ? process.argv[idx + 1] : undefined
}

// ── Single ────────────────────────────────────────────────────────────────────

async function runSingle(): Promise<void> {
  const id          = getArg("id")
  const name        = getArg("name")
  const desc        = getArg("desc")
  const featuresRaw = getArg("features")

  if (!id || !name || !desc || !featuresRaw) {
    console.error(`
Usage:
  npx tsx scripts/generate-tool.ts --id <slug> --name <n> --desc <desc> --features <f1,f2,...>
  npx tsx scripts/generate-tool.ts --batch <path/to/batch.json>
  npx tsx scripts/idea.ts "plain language idea"          ← easiest

Flags:
  --provider   auto|ollama|gemini|anthropic|groq  (default: auto)
  --attempts   max retries per pass                (default: 3)
  --output     output directory                    (default: ./output)
  --project-dir auto-copy to project when set
`)
    process.exit(1)
  }

  const req: ComponentRequest = {
    toolId:      id,
    displayName: name,
    description: desc,
    features:    featuresRaw.split(",").map(f => f.trim()).filter(Boolean),
    category:    getArg("category"),
    tags:        getArg("tags")?.split(",").map(t => t.trim()).filter(Boolean),
    maxAttempts: Number(getArg("attempts") ?? 3),
    provider:    (getArg("provider") ?? "auto") as Provider,
    outputDir:   getArg("output") ?? "./output",
    projectDir:  getArg("project-dir"),
  }

  const result = await generateComponent(req)
  printResult(result)
  process.exit(result.success ? 0 : 1)
}

// ── Batch ─────────────────────────────────────────────────────────────────────

async function runBatch(batchFile: string): Promise<void> {
  if (!fs.existsSync(batchFile)) {
    console.error(`Batch file not found: ${batchFile}`)
    process.exit(1)
  }

  const requests: ComponentRequest[] = JSON.parse(fs.readFileSync(batchFile, "utf-8"))
  console.log(`\n[batch] ${requests.length} tools queued`)

  let passed = 0, failed = 0

  for (const [i, req] of requests.entries()) {
    console.log(`\n${"═".repeat(60)}`)
    console.log(`[batch] Tool ${i + 1}/${requests.length}`)
    const result = await generateComponent({
      maxAttempts: 3,
      provider: "auto",
      outputDir: "./output",
      ...req,
    })
    result.success ? passed++ : failed++
    printResult(result)
    if (i < requests.length - 1) await new Promise(r => setTimeout(r, 2000))
  }

  console.log(`\n${"═".repeat(60)}`)
  console.log(`[batch] ${passed} succeeded, ${failed} failed`)
  process.exit(failed > 0 ? 1 : 0)
}

// ── Printer ───────────────────────────────────────────────────────────────────

function printResult(result: ComponentResult): void {
  const s = (result.elapsedMs / 1000).toFixed(1)
  if (result.success) {
    console.log(`\n✅  Generated in ${s}s via ${result.providerUsed}`)
    console.log(`    Component : ${result.componentPath}`)
    console.log(`    Review    : ${result.reviewPath}`)
  } else {
    console.log(`\n❌  Failed after ${result.attemptsUsed} attempt(s) in ${s}s`)
    console.log(`    Reason  : ${result.failureReason}`)
    console.log(`    Message : ${result.failureMessage}`)
    if (result.reviewPath) console.log(`    Partial : ${result.reviewPath}`)
    if (result.attemptLog?.length) {
      result.attemptLog.forEach(a => console.log(`    [${a.attempt}] ${a.error}`))
    }
    console.log(`\n    💡 Check output/debug/ for raw LLM responses`)
  }
}

// ── Entry ─────────────────────────────────────────────────────────────────────

const batchFile = getArg("batch")
if (batchFile) runBatch(batchFile).catch(console.error)
else           runSingle().catch(console.error)
