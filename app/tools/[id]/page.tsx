import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { tools, getToolBySlug, getRelatedTools } from "@/data/tools"
import { toolRegistry } from "@/lib/toolRegistry"
import { siteConfig } from "@/lib/config"
import ToolLayout from "@/components/layout/ToolLayout"

interface Props {
  params: Promise<{ id: string }>
}

// ── Static generation ──────────────────────────────────────────────────────────
// At build time, Next.js generates a static HTML file for every tool.
// Adding a tool to data/tools.ts is the only step required — no manual routing.
export async function generateStaticParams() {
  return tools.map((t) => ({ id: t.slug }))
}

// ── Per-page SEO metadata ──────────────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const tool = getToolBySlug(id)
  if (!tool) return { title: "Tool Not Found" }

  return {
    title: tool.seo.title,
    description: tool.seo.description,
    keywords: tool.tags,
    openGraph: {
      title: tool.seo.title,
      description: tool.seo.description,
      type: "website",
      url: `${siteConfig.url}/tools/${tool.slug}`,
    },
    alternates: {
      canonical: `${siteConfig.url}/tools/${tool.slug}`,
    },
  }
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default async function ToolPage({ params }: Props) {
  const { id } = await params
  const tool = getToolBySlug(id)
  if (!tool) notFound()

  const Component = toolRegistry[tool.component]
  const related   = getRelatedTools(tool)

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: tool.name,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: tool.name,
      url: `${siteConfig.url}/tools/${tool.slug}`,
      applicationCategory: "DeveloperApplication",
      browserRequirements: "Requires JavaScript",
    },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ToolLayout
        tool={tool}
        toolComponent={Component ? <Component /> : null}
        relatedTools={related.map((t) => ({ name: t.name, path: `/tools/${t.slug}` }))}
      />
    </>
  )
}
