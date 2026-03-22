// app/[locale]/tools/[id]/page.tsx — /ja/tools/json-formatter, etc.
import { notFound }           from "next/navigation"
import type { Metadata }      from "next"
import {
  tools,
  getToolBySlug,
  getRelatedTools,
  getLocalizedTool,
}                             from "@/data/tools"
import { toolRegistry }       from "@/lib/toolRegistry"
import { siteConfig }         from "@/lib/config"
import { isValidLocale, defaultLocale } from "@/lib/i18n/config"
import { getMessages, getHreflangAlternates } from "@/lib/i18n"
import ToolLayout             from "@/components/layout/ToolLayout"

interface Props {
  params: Promise<{ locale: string; id: string }>
}

export async function generateStaticParams() {
  const nonDefault = ["ja", "zh"] as const
  return nonDefault.flatMap(locale =>
    tools.map(t => ({ locale, id: t.slug }))
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params
  if (!isValidLocale(locale)) return {}

  const baseTool = getToolBySlug(id)
  if (!baseTool) return { title: "Tool Not Found" }

  const tool     = getLocalizedTool(baseTool, locale)
  const hreflang = getHreflangAlternates(`/tools/${tool.slug}`, siteConfig.url)

  return {
    title:       tool.seo.title,
    description: tool.seo.description,
    keywords:    tool.tags,
    openGraph: {
      title:       tool.seo.title,
      description: tool.seo.description,
      type:        "website",
      url:         `${siteConfig.url}/${locale}/tools/${tool.slug}`,
    },
    alternates: {
      canonical: `${siteConfig.url}/${locale}/tools/${tool.slug}`,
      languages: Object.fromEntries(hreflang.map(h => [h.hreflang, h.href])),
    },
  }
}

export default async function LocaleToolPage({ params }: Props) {
  const { locale, id } = await params
  if (!isValidLocale(locale) || locale === defaultLocale) notFound()

  const baseTool = getToolBySlug(id)
  if (!baseTool) notFound()

  const tool      = getLocalizedTool(baseTool, locale)
  const Component = toolRegistry[tool.component]
  const related   = getRelatedTools(tool).map(rt => getLocalizedTool(rt, locale))
  const t         = getMessages(locale)

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type":    "SoftwareApplication",
      name:       tool.name,
      description: tool.description,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      url: `${siteConfig.url}/${locale}/tools/${tool.slug}`,
    },
    tool.content.faq.length > 0 && {
      "@context": "https://schema.org",
      "@type":    "FAQPage",
      mainEntity: tool.content.faq.map(f => ({
        "@type":        "Question",
        name:           f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ].filter(Boolean)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ToolLayout
        tool={tool}
        messages={t}
        toolComponent={Component ? <Component /> : null}
        relatedTools={related}
        locale={locale}
      />
    </>
  )
}
