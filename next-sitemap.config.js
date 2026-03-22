/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://aistacker.dev",
  generateRobotsTxt: true,
  sitemapSize:  7000,
  changefreq:   "weekly",
  // Default priority — overridden per-path below
  priority:     0.6,
  exclude: [
    "/api/*",
    "/ja/api/*",
    "/zh/api/*",
  ],

  // Per-path priority overrides
  // Tool pages and guides get 0.8; homepage gets 1.0 (set by default in next-sitemap)
  transform: async (config, path) => {
    // Homepage
    if (path === "/") {
      return { loc: path, changefreq: "daily", priority: 1.0, lastmod: new Date().toISOString() }
    }
    // Tool pages — highest non-home priority
    if (path.match(/^\/(?:ja\/|zh\/)?tools\/[^/]+$/)) {
      return { loc: path, changefreq: "monthly", priority: 0.8, lastmod: new Date().toISOString() }
    }
    // Tool index
    if (path.match(/^\/(?:ja\/|zh\/)?tools\/?$/)) {
      return { loc: path, changefreq: "weekly", priority: 0.9, lastmod: new Date().toISOString() }
    }
    // Guide pages
    if (path.match(/^\/(?:ja\/|zh\/)?guides\/[^/]+$/)) {
      return { loc: path, changefreq: "monthly", priority: 0.75, lastmod: new Date().toISOString() }
    }
    // Default
    return { loc: path, changefreq: config.changefreq, priority: config.priority, lastmod: new Date().toISOString() }
  },

  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/" },
    ],
    additionalSitemaps: [],
  },

  // Additional pages next-sitemap might not auto-discover
  additionalPaths: async (config) => {
    const { tools }  = require("./data/tools")
    const { guides } = require("./data/guides")
    const locales    = ["ja", "zh"]
    const extra      = []

    // Add locale-prefixed tool pages
    for (const locale of locales) {
      for (const tool of tools) {
        extra.push(await config.transform(config, `/${locale}/tools/${tool.slug}`))
      }
      for (const guide of guides) {
        extra.push(await config.transform(config, `/${locale}/guides/${guide.slug}`))
      }
    }

    return extra
  },
}
