// app/[locale]/page.tsx — localized homepage (/ja, /zh)
import { notFound }           from "next/navigation"
import Link                   from "next/link"
import { ArrowRight }         from "lucide-react"
import { isValidLocale, defaultLocale } from "@/lib/i18n/config"
import { getMessages }        from "@/lib/i18n"
import {
  getFeaturedTools,
  getCategories,
  getToolsByCategory,
  CATEGORY_LABELS,
  getLocalizedTool,
}                             from "@/data/tools"
import { ToolCard }           from "@/components/layout/ToolCard"
import { siteConfig }         from "@/lib/config"
import type { Metadata }      from "next"

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isValidLocale(locale)) return {}
  const t = getMessages(locale)
  return {
    title:       t.meta.homeTitle,
    description: t.meta.homeDesc,
    alternates: {
      canonical: `${siteConfig.url}/${locale}`,
      languages: {
        en:          siteConfig.url,
        ja:          `${siteConfig.url}/ja`,
        zh:          `${siteConfig.url}/zh`,
        "x-default": siteConfig.url,
      },
    },
  }
}

export default async function LocaleHomePage({ params }: Props) {
  const { locale } = await params
  if (!isValidLocale(locale) || locale === defaultLocale) notFound()

  const t          = getMessages(locale)
  const featured   = getFeaturedTools().map(tool => getLocalizedTool(tool, locale))
  const categories = getCategories()

  return (
    <div className="flex flex-col gap-20 pb-24">

      {/* Hero */}
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
            href={`/${locale}/tools`}
            className="inline-flex items-center gap-2 rounded-lg bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-80"
          >
            {t.hero.cta} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Featured tools */}
      <section className="mx-auto w-full max-w-6xl px-6">
        <h2 className="mb-6 text-lg font-semibold">{t.tools.popular}</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map(tool => (
            <ToolCard key={tool.slug} tool={tool} locale={locale} />
          ))}
        </div>
      </section>

      {/* Category overview */}
      <section className="mx-auto w-full max-w-6xl px-6">
        <h2 className="mb-6 text-lg font-semibold">{t.tools.byCategory}</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map(cat => {
            const count = getToolsByCategory(cat).length
            return (
              <Link
                key={cat}
                href={`/${locale}/tools?category=${cat}`}
                className="flex items-center justify-between rounded-lg border border-border/60 bg-card px-4 py-3 text-sm transition-colors hover:border-border hover:bg-muted/50"
              >
                <span className="font-medium">{CATEGORY_LABELS[cat]}</span>
                <span className="text-xs text-muted-foreground">{count}</span>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
