import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider }  from "@/components/ThemeProvider"
import { SiteHeader }     from "@/components/layout/SiteHeader"
import { SiteFooter }     from "@/components/layout/SiteFooter"
import { siteConfig }     from "@/lib/config"

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })

// 1. 更新 Metadata：添加多语言 alternate 链接
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default:  `${siteConfig.name} | Free Developer & AI Tools`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ["developer tools", "json formatter", "base64 encoder", "uuid generator", "regex tester", "free online tools"],
  authors: [{ name: siteConfig.name }],
  openGraph: { type: "website", siteName: siteConfig.name, locale: "en_US" },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  alternates: { 
    canonical: siteConfig.url,
    // 关键：告诉爬虫这里有三个版本的入口
    languages: {
      en: siteConfig.url,
      ja: `${siteConfig.url}/ja`,
      zh: `${siteConfig.url}/zh`,
      "x-default": siteConfig.url,
    },
  },
}

// 2. 增强型初始化脚本：主题控制 + 极速重定向
const initScript = `
(function() {
  try {
    // --- 主题控制逻辑 ---
    var stored = localStorage.getItem('aistacker-theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var isDark = stored === 'dark' || (!stored && prefersDark) || (stored === 'system' && prefersDark);
    if (isDark) document.documentElement.classList.add('dark');

    // --- 极速重定向逻辑 (针对 0 Middleware 方案优化) ---
    // 只在根路径执行，避免干扰其他页面
    if (window.location.pathname === '/') {
      var lang = navigator.language.toLowerCase();
      if (lang.startsWith('zh')) {
        window.location.replace('/zh');
      } else if (lang.startsWith('ja')) {
        window.location.replace('/ja');
      }
    }
  } catch (e) {}
})();
`.trim()

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* 这一段脚本是 0 Functions 请求架构下的“灵魂” */}
        <script dangerouslySetInnerHTML={{ __html: initScript }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-background text-foreground`}>
        <ThemeProvider defaultTheme="system" storageKey="aistacker-theme">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  )
}