/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://aistacker.dev', // 我们的主阵地域名
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