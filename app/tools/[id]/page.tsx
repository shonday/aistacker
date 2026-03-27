import { notFound } from "next/navigation"
import type { Metadata } from "next"

import {
  tools,
  getToolBySlug,
  getRelatedTools,
} from "@/data/tools"

import { toolRegistry } from "@/lib/toolRegistry"
import { siteConfig } from "@/lib/config"
import { getMessages } from "@/lib/i18n"

import ToolLayout from "@/components/layout/ToolLayout"

interface Props {
  params: { id: string }   // ✅ 修复：不是 Promise
}

// ── Static generation ───────────────────────────────────────────
export async function generateStaticParams() {
  return tools.map(t => ({ id: t.slug }))
}

// ── SEO metadata（统一由 Next 管理）────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
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
      url: `${siteConfig.url}${path}`,
    },

    // ✅ 关键：只保留这一套 hreflang（删除你原来的函数）
    alternates: {
      canonical: `${siteConfig.url}${path}`,
      languages: {
        en: `${siteConfig.url}${path}`,
        ja: `${siteConfig.url}/ja${path}`,
        zh: `${siteConfig.url}/zh${path}`,
      },
    },
  }
}

// ── Page ───────────────────────────────────────────────────────
export default async function ToolPage({ params }: Props) {
  const { id } = await params
  const tool = getToolBySlug(id)

  if (!tool) {
    notFound()
  }

  const Component = toolRegistry[tool.component]
  const related = getRelatedTools(tool)

  // ✅ 默认语言固定 en（无 middleware 后的唯一来源）
  const t = getMessages("en")

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
      url: `${siteConfig.url}${path}`,
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
        locale="en"   // ✅ 显式传入（很关键）
      />
    </>
  )
}