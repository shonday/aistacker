#!/usr/bin/env node
// scripts/generate-tool.ts — AIStacker Component Generator CLI
//
// Single tool:
//   npx tsx scripts/generate-tool.ts \
//     --id "japanese-word-count" \
//     --name "Japanese Word Counter" \
//     --desc "Count hiragana, katakana, kanji and total characters instantly." \
//     --features "hiragana count,katakana count,kanji count,total chars,copy result" \
//     --project-dir /path/to/aistacker
//
// Batch from JSON manifest:
//   npx tsx scripts/generate-tool.ts --batch scripts/codegen/batch/wave1.json
//
// Options:
//   --id          Tool slug (kebab-case, becomes URL)
//   --name        Display name
//   --desc        SEO description (max 160 chars)
//   --features    Comma-separated required features
//   --category    Category (optional, auto-detected by LLM)
//   --tags        Comma-separated tags (optional, auto-generated)
//   --provider    auto|ollama|gemini|anthropic|groq (default: auto)
//   --attempts    Max retry attempts (default: 3)
//   --output      Output directory (default: ./output)
//   --project-dir If set, auto-copies to project and updates registries
//   --batch       Path to JSON file with array of ComponentRequest objects

import { generateComponent } from "./codegen/lib/generator.js"
import type { ComponentRequest, Provider } from "./codegen/lib/contract.js"
import fs from "fs"

// ── Arg parsing ───────────────────────────────────────────────────────────────

function getArg(name: string): string | undefined {
  const idx = process.argv.indexOf(`--${name}`)
  return idx !== -1 ? process.argv[idx + 1] : undefined
}

function getFlag(name: string): boolean {
  return process.argv.includes(`--${name}`)
}

// ── Single tool ───────────────────────────────────────────────────────────────

async function runSingle(): Promise<void> {
  const id          = getArg("id")
  const name        = getArg("name")
  const desc        = getArg("desc")
  const featuresRaw = getArg("features")

  if (!id || !name || !desc || !featuresRaw) {
    console.error("Usage: npx tsx scripts/generate-tool.ts --id <slug> --name <name> --desc <description> --features <f1,f2,...>")
    console.error("       npx tsx scripts/generate-tool.ts --batch <path/to/batch.json>")
    process.exit(1)
  }

  const req: ComponentRequest = {
    toolId:      id,
    displayName: name,
    description: desc,
    features:    featuresRaw.split(",").map((f) => f.trim()).filter(Boolean),
    category:    getArg("category"),
    tags:        getArg("tags")?.split(",").map((t) => t.trim()).filter(Boolean),
    maxAttempts: Number(getArg("attempts") ?? 3),
    provider:    (getArg("provider") ?? "auto") as Provider,
    outputDir:   getArg("output") ?? "./output",
    projectDir:  getArg("project-dir"),
  }

  const result = await generateComponent(req)
  printResult(result)
  process.exit(result.success ? 0 : 1)
}

// ── Batch mode ────────────────────────────────────────────────────────────────

async function runBatch(batchFile: string): Promise<void> {
  if (!fs.existsSync(batchFile)) {
    console.error(`Batch file not found: ${batchFile}`)
    process.exit(1)
  }

  const requests: ComponentRequest[] = JSON.parse(fs.readFileSync(batchFile, "utf-8"))
  console.log(`\n[batch] ${requests.length} tools to generate\n`)

  let passed = 0
  let failed = 0

  for (const [i, req] of requests.entries()) {
    console.log(`\n[batch] ── Tool ${i + 1}/${requests.length}: ${req.displayName} ──`)
    const result = await generateComponent({
      maxAttempts: 3,
      provider: "auto",
      outputDir: "./output",
      ...req,
    })

    if (result.success) passed++
    else failed++

    printResult(result)

    // Brief pause between requests to avoid rate limits
    if (i < requests.length - 1) {
      await new Promise((r) => setTimeout(r, 2000))
    }
  }

  console.log(`\n[batch] Done. ${passed} succeeded, ${failed} failed.`)
  process.exit(failed > 0 ? 1 : 0)
}

// ── Output formatter ──────────────────────────────────────────────────────────

function printResult(result: import("./codegen/lib/contract.js").ComponentResult): void {
  const elapsed = (result.elapsedMs / 1000).toFixed(1)
  if (result.success) {
    console.log(`\n✅ Generated in ${elapsed}s via ${result.providerUsed}`)
    console.log(`   Component: ${result.componentPath}`)
    console.log(`   Review:    ${result.reviewPath}`)
  } else {
    console.log(`\n❌ Failed after ${result.attemptsUsed} attempt(s) in ${elapsed}s`)
    console.log(`   Reason:  ${result.failureReason}`)
    console.log(`   Message: ${result.failureMessage}`)
    if (result.reviewPath) {
      console.log(`   Partial output: ${result.reviewPath}`)
    }
    if (result.attemptLog?.length) {
      console.log("   Attempt log:")
      result.attemptLog.forEach((a) =>
        console.log(`     [${a.attempt}] ${a.error}`)
      )
    }
  }
}

// ── Entry ─────────────────────────────────────────────────────────────────────

const batchFile = getArg("batch")
if (batchFile) {
  runBatch(batchFile).catch(console.error)
} else {
  runSingle().catch(console.error)
}
