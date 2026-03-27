// app/[locale]/tools/[id]/page.tsx — /ja/tools/json-formatter, etc.
import { notFound } from "next/navigation"
import type { Metadata } from "next"

import {
  tools,
  getToolBySlug,
  getRelatedTools,
  getLocalizedTool,
} from "@/data/tools"

import { toolRegistry } from "@/lib/toolRegistry"
import { siteConfig } from "@/lib/config"
import { getMessages } from "@/lib/i18n"
import { isValidLocale } from "@/lib/i18n/config"

import ToolLayout from "@/components/layout/ToolLayout"

interface Props {
  params: { locale: string; id: string }
}

// ── Static generation ───────────────────────────────────────────
export async function generateStaticParams() {
  const locales = ["ja", "zh"]
  return locales.flatMap(locale =>
    tools.map(t => ({ locale, id: t.slug }))
  )
}

// ── SEO metadata ────────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params

  if (!isValidLocale(locale) || locale === "en") {
    return { title: "Invalid locale" }
  }

  const tool = getToolBySlug(id)
  if (!tool) {
    return { title: "Tool Not Found" }
  }

  const path = `/tools/${tool.slug}`

  return {
    title: tool.seo.title,
    description: tool.seo.description,
    keywords: tool.tags,

    openGraph: {
      title: tool.seo.title,
      description: tool.seo.description,
      type: "website",
      url: `${siteConfig.url}/${locale}${path}`,
    },

    alternates: {
      canonical: `${siteConfig.url}/${locale}${path}`,
      languages: {
        en: `${siteConfig.url}${path}`,
        ja: `${siteConfig.url}/ja${path}`,
        zh: `${siteConfig.url}/zh${path}`,
      },
    },
  }
}

// ── Page ───────────────────────────────────────────────────────
export default async function LocaleToolPage({ params }: Props) {
  const { locale, id } = await params

  if (!isValidLocale(locale) || locale === "en") {
    notFound()
  }

   const baseTool = getToolBySlug(id)
  if (!baseTool) notFound()

  const tool      = getLocalizedTool(baseTool, locale)
  const Component = toolRegistry[tool.component]
  const related = getRelatedTools(tool)
  const t = getMessages(locale)

  const path = `/tools/${tool.slug}`

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: tool.name,
      description: tool.description,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      url: `${siteConfig.url}/${locale}${path}`,
    },

    tool.content.faq.length > 0 && {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: tool.content.faq.map(f => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: f.a,
        },
      })),
    },
  ].filter(Boolean)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
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