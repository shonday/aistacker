// scripts/codegen/lib/llm.ts
// Multi-provider LLM abstraction with auto-fallback.
// Priority: Ollama (local) → Gemini → Anthropic → Groq
//
// Environment variables (set in .env.local or shell):
//   OLLAMA_BASE_URL=http://localhost:11434   (default)
//   OLLAMA_MODEL=qwen2.5-coder:7b
//   GEMINI_API_KEY=
//   GEMINI_MODEL=gemini-2.5-flash
//   ANTHROPIC_API_KEY=
//   ANTHROPIC_MODEL=claude-3-5-haiku-20241022
//   GROQ_API_KEY=
//   GROQ_MODEL=llama-3.3-70b-versatile

import type { Provider } from "./contract.js"

export interface LLMResponse {
  text: string
  provider: string
}

// ── Ollama ───────────────────────────────────────────────────────────────────

async function callOllama(prompt: string): Promise<string> {
  const base  = process.env.OLLAMA_BASE_URL ?? "http://localhost:11434"
  const model = process.env.OLLAMA_MODEL    ?? "qwen2.5-coder:7b"

  const res = await fetch(`${base}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model, prompt, stream: false }),
    signal: AbortSignal.timeout(120_000),
  })

  if (!res.ok) throw new Error(`Ollama HTTP ${res.status}`)
  const data = await res.json() as { response: string }
  return data.response
}

// ── Gemini ───────────────────────────────────────────────────────────────────

async function callGemini(prompt: string): Promise<string> {
  const key   = process.env.GEMINI_API_KEY
  const model = process.env.GEMINI_MODEL ?? "gemini-2.5-flash"
  if (!key) throw new Error("GEMINI_API_KEY not set")

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    signal: AbortSignal.timeout(120_000),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Gemini HTTP ${res.status}: ${body.slice(0, 200)}`)
  }
  const data = await res.json() as { candidates: { content: { parts: { text: string }[] } }[] }
  return data.candidates[0].content.parts[0].text
}

// ── Anthropic ────────────────────────────────────────────────────────────────

async function callAnthropic(prompt: string): Promise<string> {
  const key   = process.env.ANTHROPIC_API_KEY
  const model = process.env.ANTHROPIC_MODEL ?? "claude-3-5-haiku-20241022"
  if (!key) throw new Error("ANTHROPIC_API_KEY not set")

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    }),
    signal: AbortSignal.timeout(120_000),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Anthropic HTTP ${res.status}: ${body.slice(0, 200)}`)
  }
  const data = await res.json() as { content: { type: string; text: string }[] }
  return data.content.filter((b) => b.type === "text").map((b) => b.text).join("")
}

// ── Groq ─────────────────────────────────────────────────────────────────────

async function callGroq(prompt: string): Promise<string> {
  const key   = process.env.GROQ_API_KEY
  const model = process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile"
  if (!key) throw new Error("GROQ_API_KEY not set")

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 4096,
    }),
    signal: AbortSignal.timeout(60_000),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Groq HTTP ${res.status}: ${body.slice(0, 200)}`)
  }
  const data = await res.json() as { choices: { message: { content: string } }[] }
  return data.choices[0].message.content
}

// ── Public API ───────────────────────────────────────────────────────────────

const PROVIDER_ORDER: { name: Provider; fn: (p: string) => Promise<string> }[] = [
  { name: "ollama",    fn: callOllama    },
  { name: "gemini",    fn: callGemini    },
  { name: "anthropic", fn: callAnthropic },
  { name: "groq",      fn: callGroq      },
]

export async function callLLM(
  prompt: string,
  provider: Provider = "auto"
): Promise<LLMResponse> {
  const candidates =
    provider === "auto"
      ? PROVIDER_ORDER
      : PROVIDER_ORDER.filter((p) => p.name === provider)

  const errors: string[] = []

  for (const { name, fn } of candidates) {
    try {
      console.log(`[llm] trying ${name}…`)
      const text = await fn(prompt)
      console.log(`[llm] success via ${name}`)
      return { text, provider: name }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      console.warn(`[llm] ${name} failed: ${msg}`)
      errors.push(`${name}: ${msg}`)
    }
  }

  throw new Error(`All LLM providers failed:\n${errors.join("\n")}`)
}
