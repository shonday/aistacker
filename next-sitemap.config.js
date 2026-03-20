/** @type {import('next-sitemap').IConfig} */
module.exports = {
// 注意：这里如果在纯 Node 环境下拿不到 NEXT_PUBLIC_ 前缀变量，
  // 可以直接写死临时域名，等上线时通过 CI/CD 环境变量注入
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://aistacker.isekai.workers.dev',
  generateRobotsTxt: true, // 这一步直接把任务 2（Robots.txt）也完成了
  sitemapSize: 7000,
  changefreq: 'daily',
  priority: 0.7,
  exclude: [], 
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    additionalSitemaps: [
      'https://aistacker.dev/sitemap.xml',
    ],
  },
}