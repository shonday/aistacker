// scripts/codegen/lib/env.ts
// Loads .env.local (then .env) before the generator reads any process.env key.
// Pure Node.js — zero runtime dependencies, no dotenv package needed.
// Called once at the top of scripts/generate-tool.ts.

import { existsSync, readFileSync } from "fs"
import { resolve, dirname }         from "path"
import { fileURLToPath }            from "url"

export function loadEnv(): void {
  // Resolve project root: this file lives at scripts/codegen/lib/env.ts
  const __dirname = dirname(fileURLToPath(import.meta.url))
  const root      = resolve(__dirname, "../../..")

  // Priority: .env.local overrides .env
  const candidates = [
    resolve(root, ".env.local"),
    resolve(root, ".env"),
  ]

  for (const file of candidates) {
    if (!existsSync(file)) continue

    const lines = readFileSync(file, "utf-8").split("\n")

    for (const raw of lines) {
      const line = raw.trim()
      if (!line || line.startsWith("#")) continue       // skip blanks and comments

      const eq = line.indexOf("=")
      if (eq === -1) continue

      const key   = line.slice(0, eq).trim()
      const value = line.slice(eq + 1).trim().replace(/^["']|["']$/g, "") // strip surrounding quotes

      // Never overwrite a value already set in the shell environment
      if (key && !(key in process.env)) {
        process.env[key] = value
      }
    }

    console.log(`[env] loaded ${file}`)
    return  // stop after the first file found
  }

  console.warn("[env] no .env.local or .env found — using shell environment only")
}
