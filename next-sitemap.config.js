// next-sitemap.config.js
//
// FIX: next-sitemap runs postbuild in CJS mode and cannot require() TypeScript files.
// Solution: scripts/build-sitemap-data.mjs runs BEFORE next-sitemap and writes
// public/sitemap-data.json with the slug lists. This file reads pure JSON.

const { readFileSync } = require("fs")
const { resolve }      = require("path")

// Read the pre-generated slug data (produced by scripts/build-sitemap-data.mjs)
let sitemapData = { toolSlugs: [], guideSlugs: [] }
try {
  const raw = readFileSync(resolve(__dirname, "public/sitemap-data.json"), "utf-8")
  sitemapData = JSON.parse(raw)
} catch {
  console.warn("[next-sitemap] Warning: public/sitemap-data.json not found. Run scripts/build-sitemap-data.mjs first.")
}

const { toolSlugs, guideSlugs } = sitemapData
const NON_DEFAULT_LOCALES = ["ja", "zh"]

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl:           process.env.NEXT_PUBLIC_SITE_URL || "https://aistacker.dev",
  generateRobotsTxt: true,
  sitemapSize:       7000,
  changefreq:        "weekly",
  priority:          0.6,
  exclude:           ["/api/*", "/ja/api/*", "/zh/api/*"],

  transform: async (config, path) => {
    if (path === "/")
      return { loc: path, changefreq: "daily", priority: 1.0, lastmod: new Date().toISOString() }
    if (path.match(/^\/(?:ja\/|zh\/)?tools\/?$/))
      return { loc: path, changefreq: "weekly", priority: 0.9, lastmod: new Date().toISOString() }
    if (path.match(/^\/(?:ja\/|zh\/)?tools\/[^/]+$/))
      return { loc: path, changefreq: "monthly", priority: 0.8, lastmod: new Date().toISOString() }
    if (path.match(/^\/(?:ja\/|zh\/)?guides\/?$/))
      return { loc: path, changefreq: "weekly", priority: 0.85, lastmod: new Date().toISOString() }
    if (path.match(/^\/(?:ja\/|zh\/)?guides\/[^/]+$/))
      return { loc: path, changefreq: "monthly", priority: 0.75, lastmod: new Date().toISOString() }
    return { loc: path, changefreq: config.changefreq, priority: config.priority, lastmod: new Date().toISOString() }
  },

  additionalPaths: async (config) => {
    const extra = []
    for (const locale of NON_DEFAULT_LOCALES) {
      extra.push(await config.transform(config, `/${locale}`))
      extra.push(await config.transform(config, `/${locale}/tools`))
      extra.push(await config.transform(config, `/${locale}/guides`))
      for (const slug of toolSlugs) {
        extra.push(await config.transform(config, `/${locale}/tools/${slug}`))
      }
      for (const slug of guideSlugs) {
        extra.push(await config.transform(config, `/${locale}/guides/${slug}`))
      }
    }
    return extra
  },

  robotsTxtOptions: {
    policies: [{ userAgent: "*", allow: "/" }],
  },
}
