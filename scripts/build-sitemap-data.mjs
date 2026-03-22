// scripts/build-sitemap-data.mjs
// Reads data/tools.ts and data/guides.ts and writes public/sitemap-data.json.
// Must run BEFORE next-sitemap (handled by package.json postbuild order).
//
// Usage: called automatically via package.json postbuild script.
// Add to package.json scripts:
//   "postbuild": "node scripts/build-sitemap-data.mjs && next-sitemap"

import { readFileSync, writeFileSync } from "fs"
import { resolve, dirname }           from "path"
import { fileURLToPath }              from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root      = resolve(__dirname, "..")

// ── Extract slugs from TypeScript source using regex ──────────────────────
// We deliberately avoid ts-node/tsx here to keep this dependency-free.
// The slug format is stable and simple enough for a targeted regex.

function extractSlugs(filePath, fieldName = "slug") {
  const src = readFileSync(filePath, "utf-8")
  const pattern = new RegExp(`${fieldName}:\\s*["']([a-z0-9-]+)["']`, "g")
  const slugs = []
  let match
  while ((match = pattern.exec(src)) !== null) {
    slugs.push(match[1])
  }
  return slugs
}

const toolSlugs  = extractSlugs(resolve(root, "data/tools.ts"),  "slug")
const guideSlugs = extractSlugs(resolve(root, "data/guides.ts"), "slug")

const output = JSON.stringify({ toolSlugs, guideSlugs }, null, 2)
writeFileSync(resolve(root, "public/sitemap-data.json"), output, "utf-8")

console.log(`[build-sitemap-data] ${toolSlugs.length} tools, ${guideSlugs.length} guides → public/sitemap-data.json`)
