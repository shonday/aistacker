import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider }  from "@/components/ThemeProvider"
import { SiteHeader }     from "@/components/layout/SiteHeader"
import { SiteFooter }     from "@/components/layout/SiteFooter"
import { siteConfig }     from "@/lib/config"

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })

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
  alternates: { canonical: siteConfig.url },
}

// ── FOUC Prevention Script ────────────────────────────────────────────────────
// This runs synchronously before any CSS or React hydration, so the correct
// theme class is on <html> from the very first paint. Without this, the page
// renders white for ~100ms before ThemeProvider hydrates.
//
// It reads localStorage and applies class="dark" if:
//   - user explicitly set "dark"
//   - user set "system" (or nothing) AND OS prefers dark
//
// dangerouslySetInnerHTML is intentional here — this must be a raw inline script.
const themeScript = `
(function() {
  try {
    var stored = localStorage.getItem('aistacker-theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var isDark = stored === 'dark' || (!stored && prefersDark) || (stored === 'system' && prefersDark);
    if (isDark) document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`.trim()

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning prevents React's mismatch warning when
    // ThemeProvider toggles the `dark` class on <html> after hydration.
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Must be the FIRST thing in <head> — before any stylesheet */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
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
