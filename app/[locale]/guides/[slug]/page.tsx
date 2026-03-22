// app/[locale]/guides/[slug]/page.tsx — /ja/guides/*, /zh/guides/*
import { notFound }         from "next/navigation"
import Link                 from "next/link"
import { Clock, Info }      from "lucide-react"
import { guides, getGuideBySlug, getLocalizedGuide, isGuideTranslated } from "@/data/guides"
import { getToolBySlug }    from "@/data/tools"
import { siteConfig }       from "@/lib/config"
import { isValidLocale, defaultLocale, localeNames } from "@/lib/i18n/config"
import { getMessages }      from "@/lib/i18n"
import { ToolCard }         from "@/components/layout/ToolCard"
import type { Metadata }    from "next"

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateStaticParams() {
  const nonDefault = ["ja", "zh"] as const
  return nonDefault.flatMap(locale =>
    guides.map(g => ({ locale, slug: g.slug }))
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isValidLocale(locale)) return {}

  const base  = getGuideBySlug(slug)
  if (!base) return { title: "Guide Not Found" }
  const guide = getLocalizedGuide(base, locale as "en" | "ja" | "zh")

  return {
    title:       guide.title,
    description: guide.description,
    alternates: {
      canonical: `${siteConfig.url}/${locale}/guides/${slug}`,
      languages: {
        en:          `${siteConfig.url}/guides/${slug}`,
        ja:          `${siteConfig.url}/ja/guides/${slug}`,
        zh:          `${siteConfig.url}/zh/guides/${slug}`,
        "x-default": `${siteConfig.url}/guides/${slug}`,
      },
    },
  }
}

export default async function LocaleGuidePage({ params }: Props) {
  const { locale, slug } = await params
  if (!isValidLocale(locale) || locale === defaultLocale) notFound()

  const base = getGuideBySlug(slug)
  if (!base) notFound()

  const guide      = getLocalizedGuide(base, locale as "en" | "ja" | "zh")
  const translated = isGuideTranslated(base, locale as "en" | "ja" | "zh")
  const t          = getMessages(locale)
  const guideTools = guide.toolSlugs.map(s => getToolBySlug(s)).filter(Boolean)
  const basePath   = `/${locale}`

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12">

      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href={basePath} className="hover:text-foreground transition-colors">
          {t.nav.home}
        </Link>
        <span>/</span>
        <Link href={`${basePath}/guides`} className="hover:text-foreground transition-colors">
          {t.guides.title}
        </Link>
        <span>/</span>
        <span className="text-foreground truncate">{guide.title}</span>
      </nav>

      {/* Untranslated notice — shown when no locale override exists */}
      {!translated && (
        <div className="mb-8 flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            This guide is not yet available in {localeNames[locale as keyof typeof localeNames]}.
            The content below is shown in English.{" "}
            <Link href={`/guides/${slug}`} className="underline hover:no-underline">
              Read in English →
            </Link>
          </p>
        </div>
      )}

      {/* Header */}
      <header className="mb-10">
        <div className="mb-3 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="rounded-full border border-border/60 bg-muted px-2.5 py-0.5 capitalize">
            {guide.category}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {guide.readingTime} min
          </span>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">{guide.title}</h1>
        <p className="mt-3 text-muted-foreground">{guide.description}</p>
      </header>

      {/* Tool pills */}
      {guideTools.length > 0 && (
        <div className="mb-10 rounded-xl border border-border/40 bg-muted/20 p-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t.guides.relatedTools}
          </p>
          <div className="flex flex-wrap gap-2">
            {guideTools.map(tool => tool && (
              <Link
                key={tool.slug}
                href={`${basePath}/tools/${tool.slug}`}
                className="rounded-md border border-border/60 bg-card px-3 py-1.5 text-sm font-medium transition-colors hover:border-border hover:bg-muted"
              >
                {tool.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Article */}
      <article className="prose prose-neutral max-w-none dark:prose-invert
        prose-headings:font-semibold prose-h2:mt-10 prose-h2:text-xl
        prose-h2:border-b prose-h2:border-border/50 prose-h2:pb-2
        prose-p:text-muted-foreground prose-p:leading-relaxed
        prose-code:rounded prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5
        prose-code:text-sm prose-code:text-foreground
        prose-code:before:content-none prose-code:after:content-none">
        <p>{guide.content.intro}</p>
        {guide.content.sections.map(section => (
          <div key={section.id}>
            <h2 id={section.id}>{section.heading}</h2>
            {section.body.split("\n\n").map((para, i) => <p key={i}>{para}</p>)}
          </div>
        ))}
      </article>

      {/* Tool cards */}
      {guideTools.length > 0 && (
        <div className="mt-16 border-t border-border/50 pt-12">
          <h2 className="mb-6 text-lg font-semibold">{t.tool.tryAlso}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {guideTools.map(tool => tool && (
              <ToolCard key={tool.slug} tool={tool} locale={locale} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
