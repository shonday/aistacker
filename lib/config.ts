export const siteConfig = {
  // 优先读取环境变量，否则使用当前 Cloudflare 临时分配的域名
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://aistacker.isekai.workers.dev",
  name: "AIStacker",
  description: "A collection of high-performance, privacy-focused developer tools.",
};