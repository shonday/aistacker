// scripts/idea.ts — Natural Language → Tool Generator
//
// Usage:
//   npx tsx scripts/idea.ts "A regex tester with flags and group capture"
//   npx tsx scripts/idea.ts --interactive
//   npx tsx scripts/idea.ts --dry-run "A color converter"
//   npx tsx scripts/idea.ts "..." --provider gemini --project-dir .

import { loadEnv } from "./codegen/lib/env.js"
loadEnv()

import { callLLM }               from "./codegen/lib/llm.js"
import { buildIdeaToSpecPrompt } from "./codegen/lib/prompts.js"
import { generateComponent }     from "./codegen/lib/generator.js"
import type { ComponentRequest, Provider } from "./codegen/lib/contract.js"
import * as readline from "readline"

// ── Arg parsing (fixed) ───────────────────────────────────────────────────────
// BUG in previous version: args[args.indexOf("--provider") + 1] when --provider
// is absent gives args[-1+1] = args[0] = the idea string → invalid provider.

const KNOWN_FLAGS = ["--dry-run", "--interactive", "--provider", "--project-dir"]
const VALID_PROVIDERS: Provider[] = ["auto", "ollama", "gemini", "anthropic", "groq"]

function parseArgs(argv: string[]) {
  const result = {
    isDryRun:     false,
    isInteractive: false,
    provider:     "auto" as Provider,
    projectDir:   undefined as string | undefined,
    ideaParts:    [] as string[],
  }

  let i = 0
  while (i < argv.length) {
    const arg = argv[i]
    if (arg === "--dry-run")     { result.isDryRun = true; i++; continue }
    if (arg === "--interactive") { result.isInteractive = true; i++; continue }
    if (arg === "--provider") {
      const val = argv[i + 1]
      if (val && VALID_PROVIDERS.includes(val as Provider)) {
        result.provider = val as Provider
        i += 2
      } else {
        console.warn(`[idea] Unknown provider "${val}", defaulting to auto`)
        i += 2
      }
      continue
    }
    if (arg.startsWith("--provider=")) {
      const val = arg.split("=")[1]
      if (VALID_PROVIDERS.includes(val as Provider)) result.provider = val as Provider
      i++; continue
    }
    if (arg === "--project-dir") {
      result.projectDir = argv[i + 1]
      i += 2; continue
    }
    if (arg.startsWith("--project-dir=")) {
      result.projectDir = arg.split("=")[1]
      i++; continue
    }
    // Anything else is part of the idea
    if (!arg.startsWith("--")) {
      result.ideaParts.push(arg)
    }
    i++
  }

  return result
}

const parsed    = parseArgs(process.argv.slice(2))
const idea      = parsed.ideaParts.join(" ").trim()

// ── Interactive prompt ────────────────────────────────────────────────────────

async function askIdea(): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  return new Promise(resolve => {
    console.log("\n🛠  AIStacker — Idea to Tool\n")
    console.log("Describe your tool in plain language:")
    console.log("  e.g. 'A JWT decoder that shows header, payload, and expiry'\n")
    rl.question("Your idea: ", answer => { rl.close(); resolve(answer.trim()) })
  })
}

async function askConfirm(prompt: string): Promise<boolean> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  return new Promise(resolve => {
    rl.question(`\n${prompt} [Y/n]: `, answer => {
      rl.close()
      resolve(answer.trim().toLowerCase() !== "n")
    })
  })
}

// ── Spec display ──────────────────────────────────────────────────────────────

function printSpec(spec: ComponentRequest): void {
  console.log("\n" + "─".repeat(60))
  console.log("📋  Generated spec\n")
  console.log(`  ID:          ${spec.toolId}`)
  console.log(`  Name:        ${spec.displayName}`)
  console.log(`  Category:    ${spec.category}`)
  console.log(`  Description: ${spec.description}`)
  console.log(`  Tags:        ${spec.tags?.join(", ") ?? "—"}`)
  console.log(`\n  Features (${spec.features.length}):`)
  spec.features.forEach((f, i) => console.log(`    ${i + 1}. ${f}`))
  console.log("─".repeat(60))
}

// ── Idea → Spec ───────────────────────────────────────────────────────────────

async function ideaToSpec(idea: string): Promise<ComponentRequest> {
  console.log(`\n[idea] Provider: ${parsed.provider}`)
  console.log("[idea] Generating spec from idea…")

  const prompt = buildIdeaToSpecPrompt(idea)
  const llmRes = await callLLM(prompt, parsed.provider)

  let json = llmRes.text.trim()

  // Strip markdown fences
  const fenced = json.match(/^```(?:json)?\s*\n?([\s\S]*?)\n?```\s*$/i)
  if (fenced) json = fenced[1].trim()

  // Extract first JSON object if surrounded by text
  if (!json.startsWith("{")) {
    const match = json.match(/\{[\s\S]+\}/)
    if (match) json = match[0]
  }

  let spec: ComponentRequest
  try {
    spec = JSON.parse(json)
  } catch {
    throw new Error(
      `LLM returned invalid JSON.\nFirst 400 chars of response:\n${llmRes.text.slice(0, 400)}`
    )
  }

  // Validate required fields
  if (!spec.toolId || !spec.displayName || !spec.features?.length) {
    throw new Error(`Spec is missing required fields. Got: ${JSON.stringify(spec, null, 2).slice(0, 300)}`)
  }

  console.log(`[idea] Spec ready via ${llmRes.provider}`)
  return spec
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  let finalIdea = idea

  if (!finalIdea || parsed.isInteractive) {
    finalIdea = await askIdea()
  }

  if (!finalIdea) {
    console.error('\nUsage: npx tsx scripts/idea.ts "your tool idea in plain language"')
    console.error("       npx tsx scripts/idea.ts --interactive")
    process.exit(1)
  }

  console.log(`\n[idea] Idea: "${finalIdea}"`)

  // Step 1: idea → spec
  let spec: ComponentRequest
  try {
    spec = await ideaToSpec(finalIdea)
  } catch (err) {
    console.error(`\n❌  Spec generation failed: ${err instanceof Error ? err.message : err}`)
    process.exit(1)
  }

  if (parsed.projectDir) spec.projectDir = parsed.projectDir

  // Step 2: show spec
  printSpec(spec)

  if (parsed.isDryRun) {
    console.log("\n[idea] --dry-run: stopping here, no component generated.")
    console.log("\nEquivalent generate-tool command:")
    console.log(
      `  npx tsx scripts/generate-tool.ts \\\n` +
      `    --id "${spec.toolId}" \\\n` +
      `    --name "${spec.displayName}" \\\n` +
      `    --desc "${spec.description}" \\\n` +
      `    --features "${spec.features.join(",")}"` +
      (parsed.projectDir ? ` \\\n    --project-dir "${parsed.projectDir}"` : "")
    )
    process.exit(0)
  }

  // Step 3: confirm
  const ok = await askConfirm("Generate this tool?")
  if (!ok) { console.log("[idea] Cancelled."); process.exit(0) }

  // Step 4: generate
  console.log("\n[idea] Starting generation…")
  const result = await generateComponent({
    ...spec,
    provider:    parsed.provider,
    maxAttempts: 3,
    outputDir:   "./output",
  })

  if (result.success) {
    console.log(`\n✅  Done in ${(result.elapsedMs / 1000).toFixed(1)}s via ${result.providerUsed}`)
    console.log(`   Component : ${result.componentPath}`)
    console.log(`   Review    : ${result.reviewPath}`)
  } else {
    console.log(`\n❌  Generation failed: ${result.failureReason}`)
    console.log(`   ${result.failureMessage}`)
    if (result.reviewPath) console.log(`   Partial output: ${result.reviewPath}`)
    console.log(`\n   Check output/debug/ for raw LLM responses`)
    process.exit(1)
  }
}

main().catch(err => {
  console.error("\n❌  Unexpected error:", err instanceof Error ? err.message : err)
  process.exit(1)
})
