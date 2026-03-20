// scripts/idea.ts — Natural Language → Tool Generator
//
// Usage:
//   npx tsx scripts/idea.ts "I want a JWT decoder that shows header, payload, expiry"
//   npx tsx scripts/idea.ts --interactive    (guided Q&A)
//   npx tsx scripts/idea.ts --dry-run "..."  (show generated spec only, don't generate)
//
// What it does:
//   1. Sends your natural language idea to an LLM (idea-to-spec pass)
//   2. The LLM researches the tool category and produces a precise ComponentRequest
//   3. Shows you the generated spec for confirmation
//   4. Calls generate-tool with the spec

import { loadEnv }             from "./codegen/lib/env.js"
loadEnv()

import { callLLM }             from "./codegen/lib/llm.js"
import { buildIdeaToSpecPrompt } from "./codegen/lib/prompts.js"
import { generateComponent }   from "./codegen/lib/generator.js"
import type { ComponentRequest, Provider } from "./codegen/lib/contract.js"
import * as readline           from "readline"

// ── Arg parsing ───────────────────────────────────────────────────────────────

const args       = process.argv.slice(2)
const isDryRun   = args.includes("--dry-run")
const isInteractive = args.includes("--interactive")
const providerArg = args.find(a => a.startsWith("--provider="))?.split("=")[1]
  ?? (args[args.indexOf("--provider") + 1] ?? "auto")
const projectDir = args.find(a => a.startsWith("--project-dir="))?.split("=")[1]
  ?? (args.indexOf("--project-dir") !== -1 ? args[args.indexOf("--project-dir") + 1] : undefined)

// The idea is everything that's not a flag
const idea = args.filter(a => !a.startsWith("--")).join(" ").trim()

// ── Interactive mode ──────────────────────────────────────────────────────────

async function getIdeaInteractively(): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  return new Promise(resolve => {
    console.log("\n🛠  AIStacker Tool Idea → Generator\n")
    console.log("Describe your tool idea in plain language.")
    console.log("Example: 'A regex tester with flags, match count, and group capture'\n")
    rl.question("Your idea: ", answer => {
      rl.close()
      resolve(answer.trim())
    })
  })
}

// ── Spec confirmation ─────────────────────────────────────────────────────────

function printSpec(spec: ComponentRequest): void {
  console.log("\n" + "─".repeat(60))
  console.log("📋  Generated spec\n")
  console.log(`  ID:          ${spec.toolId}`)
  console.log(`  Name:        ${spec.displayName}`)
  console.log(`  Description: ${spec.description}`)
  console.log(`  Category:    ${spec.category}`)
  console.log(`  Tags:        ${spec.tags?.join(", ")}`)
  console.log(`\n  Features (${spec.features.length}):`)
  spec.features.forEach((f, i) => console.log(`    ${i + 1}. ${f}`))
  console.log("─".repeat(60))
}

async function confirm(prompt: string): Promise<boolean> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  return new Promise(resolve => {
    rl.question(`\n${prompt} [Y/n]: `, answer => {
      rl.close()
      resolve(answer.trim().toLowerCase() !== "n")
    })
  })
}

// ── Idea → Spec via LLM ───────────────────────────────────────────────────────

async function ideaToSpec(idea: string, provider: Provider): Promise<ComponentRequest> {
  console.log("\n[idea] Sending to LLM for spec generation…")
  const prompt  = buildIdeaToSpecPrompt(idea)
  const llmRes  = await callLLM(prompt, provider)

  // Strip markdown fences if present
  let json = llmRes.text.trim()
  const fenced = json.match(/^```(?:json)?\s*\n?([\s\S]*?)\n?```\s*$/i)
  if (fenced) json = fenced[1].trim()

  try {
    const spec = JSON.parse(json) as ComponentRequest
    console.log(`[idea] Spec generated via ${llmRes.provider}`)
    return spec
  } catch {
    // Try to extract JSON object even if there's surrounding text
    const jsonMatch = json.match(/\{[\s\S]+\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as ComponentRequest
    }
    throw new Error(`LLM returned invalid JSON for spec.\nRaw response:\n${llmRes.text.slice(0, 500)}`)
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  let finalIdea = idea

  if (!finalIdea || isInteractive) {
    finalIdea = await getIdeaInteractively()
  }

  if (!finalIdea) {
    console.error("Usage: npx tsx scripts/idea.ts \"your tool idea\"")
    console.error("       npx tsx scripts/idea.ts --interactive")
    process.exit(1)
  }

  console.log(`\n[idea] Idea: "${finalIdea}"`)

  // ── Step 1: idea → spec ─────────────────────────────────────────────────────
  let spec: ComponentRequest
  try {
    spec = await ideaToSpec(finalIdea, providerArg as Provider)
  } catch (err) {
    console.error(`\n❌  Spec generation failed: ${err instanceof Error ? err.message : err}`)
    process.exit(1)
  }

  // Add CLI overrides
  if (projectDir) spec.projectDir = projectDir

  // ── Step 2: show spec ───────────────────────────────────────────────────────
  printSpec(spec)

  if (isDryRun) {
    console.log("\n[idea] Dry run — stopping here. No component generated.")
    console.log("\nTo generate this tool, run:")
    console.log(`  npx tsx scripts/idea.ts "${finalIdea}" ${projectDir ? `--project-dir ${projectDir}` : ""}`)
    process.exit(0)
  }

  // ── Step 3: confirm ─────────────────────────────────────────────────────────
  const ok = await confirm("Generate this tool?")
  if (!ok) {
    console.log("[idea] Aborted.")
    process.exit(0)
  }

  // ── Step 4: generate ────────────────────────────────────────────────────────
  console.log("\n[idea] Handing off to generator…")
  const result = await generateComponent({
    ...spec,
    provider: providerArg as Provider,
    maxAttempts: 3,
    outputDir: "./output",
  })

  if (result.success) {
    console.log(`\n✅  Done in ${(result.elapsedMs / 1000).toFixed(1)}s`)
    console.log(`   Component : ${result.componentPath}`)
    console.log(`   Review    : ${result.reviewPath}`)
  } else {
    console.log(`\n❌  Generation failed: ${result.failureReason}`)
    console.log(`   ${result.failureMessage}`)
    if (result.reviewPath) console.log(`   Partial output: ${result.reviewPath}`)
    process.exit(1)
  }
}

main().catch(err => {
  console.error("\n❌  Unexpected error:", err)
  process.exit(1)
})
