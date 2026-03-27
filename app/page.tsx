"use client" // 必须放在第一行

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

// 注意：确保这些 data 函数不依赖 Node.js 原生 API (如 fs)，否则在客户端会报错
// 如果它们只是纯 JS 对象，则完全没问题
import {
  getFeaturedTools,
  getCategories,
  getToolsByCategory,
  CATEGORY_LABELS,
} from "@/data/tools"
import { getFeaturedGuides } from "@/data/guides"
import { ToolCard } from "@/components/layout/ToolCard"
import { getMessages } from "@/lib/i18n"

export default function HomePage() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // 1. 获取浏览器语言
    const lang = navigator.language.toLowerCase()

    // 2. 执行跳转逻辑
    // 使用 window.location.replace 而不是 router.push，
    // 这样用户点击“后退”时不会跳回这个重定向页，体验更好。
    if (lang.startsWith("zh")) {
      window.location.replace("/zh")
      return
    }
    if (lang.startsWith("ja")) {
      window.location.replace("/ja")
      return
    }

    // 3. 如果是英文用户（或其他语言），停止加载状态，渲染 EN 内容
    setReady(true)
  }, [])

  // 4. 数据获取（在客户端执行，逻辑与你原版一致）
  const t = getMessages("en")
  const featured = getFeaturedTools()
  const categories = getCategories()
  const guides = getFeaturedGuides()

  // 关键：在检测完成前返回 null 或骨架屏，防止“中文用户看到 0.1s 英文首页”的闪烁
  if (!ready) {
    return (
      <div className="fixed inset-0 bg-background" /> // 干净的白屏或加载动画
    )
  }

  return (
    <div className="flex flex-col gap-20 pb-24">
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="border-b border-border/50 bg-gradient-to-b from-muted/40 to-background px-6 py-20 text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {t.hero.badge}
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          {t.hero.headline}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
          {t.hero.sub}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 rounded-lg bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-80"
          >
            {t.hero.cta} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ── Featured tools ────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-6xl px-6">
        <h2 className="mb-6 text-lg font-semibold">{t.tools.popular}</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map(tool => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
        <div className="mt-5 text-right">
          <Link
            href="/tools"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {t.tools.allTools} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      {/* ── Category overview ─────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-6xl px-6">
        <h2 className="mb-6 text-lg font-semibold">{t.tools.byCategory}</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map(cat => {
            const count = getToolsByCategory(cat).length
            return (
              <Link
                key={cat}
                href={`/tools?category=${cat}`}
                className="flex items-center justify-between rounded-lg border border-border/60 bg-card px-4 py-3 text-sm transition-colors hover:border-border hover:bg-muted/50"
              >
                <span className="font-medium">{CATEGORY_LABELS[cat]}</span>
                <span className="text-xs text-muted-foreground">{count}</span>
              </Link>
            )
          })}
        </div>
      </section>

      {/* ── Featured guides ───────────────────────────────────────── */}
      {guides.length > 0 && (
        <section className="mx-auto w-full max-w-6xl px-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold">{t.guides.title}</h2>
            <Link
              href="/guides"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              All guides <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {guides.map(guide => (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="group rounded-lg border border-border/60 bg-card p-5 transition-all hover:border-border hover:shadow-sm"
              >
                <p className="font-medium group-hover:text-primary transition-colors">
                  {guide.title}
                </p>
                <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
                  {guide.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}