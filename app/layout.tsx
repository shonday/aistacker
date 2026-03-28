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
    // --- 1. Theme Logic (Keep as is) ---
    var storedTheme = localStorage.getItem('aistacker-theme');
    if (storedTheme === 'dark' || (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    }

    // --- 2. Smart Language Logic ---
    if (window.location.pathname === '/') {
      // Helper to get cookie
      var getCookie = function(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length === 2) return parts.pop().split(";").shift();
      };

      var userLang = getCookie('aistacker-locale'); // Cookie set by Switcher
      var browserLang = navigator.language.toLowerCase();
      var targetPath = '';

      // Priority 1: User explicitly chose a language (Cookie exists)
      if (userLang) {
        if (userLang === 'zh') targetPath = '/zh';
        else if (userLang === 'ja') targetPath = '/ja';
      } 
      // Priority 2: First time guess (No cookie yet)
      else {
        if (browserLang.startsWith('zh')) targetPath = '/zh';
        else if (browserLang.startsWith('ja')) targetPath = '/ja';
      }

      // Final Check: Only redirect if target is different from current path
      if (targetPath && window.location.pathname !== targetPath) {
        window.location.replace(targetPath);
      }
    }
  } catch (e) {}
})();
`.trim();


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