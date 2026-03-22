// app/guides/[slug]/page.tsx — English guide article
import { notFound }           from "next/navigation"
import Link                   from "next/link"
import { Clock }              from "lucide-react"
import {
  guides,
  getGuideBySlug,
  getGuidesForCategory,
}                             from "@/data/guides"
import { getToolBySlug, CATEGORY_LABELS } from "@/data/tools"
import { siteConfig }         from "@/lib/config"
import { getMessages }        from "@/lib/i18n"
import { ToolCard }           from "@/components/layout/ToolCard"
import type { Metadata }      from "next"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return guides.map(g => ({ slug: g.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const guide    = getGuideBySlug(slug)
  if (!guide) return { title: "Guide Not Found" }
  return {
    title:       guide.title,
    description: guide.description,
    openGraph: {
      title:       guide.title,
      description: guide.description,
      type:        "article",
      url:         `${siteConfig.url}/guides/${guide.slug}`,
      publishedTime: guide.publishedAt,
    },
    alternates: {
      canonical: `${siteConfig.url}/guides/${guide.slug}`,
      languages: {
        en:          `${siteConfig.url}/guides/${guide.slug}`,
        ja:          `${siteConfig.url}/ja/guides/${guide.slug}`,
        zh:          `${siteConfig.url}/zh/guides/${guide.slug}`,
        "x-default": `${siteConfig.url}/guides/${guide.slug}`,
      },
    },
  }
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params
  const guide    = getGuideBySlug(slug)
  if (!guide) notFound()

  const t          = getMessages("en")
  const guideTools = guide.toolSlugs.map(s => getToolBySlug(s)).filter(Boolean)

  // Related guides from the same category (excluding current)
  const relatedGuides = getGuidesForCategory(guide.category)
    .filter(g => g.slug !== guide.slug)
    .slice(0, 3)

  const articleSchema = {
    "@context": "https://schema.org",
    "@type":    "HowTo",
    name:       guide.title,
    description: guide.description,
    totalTime:  `PT${guide.readingTime}M`,
    step:       guide.content.sections.map(s => ({
      "@type": "HowToStep",
      name:    s.heading,
      text:    s.body.split("\n\n")[0],
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <div className="mx-auto w-full max-w-3xl px-4 py-12">

        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <Link href="/guides" className="hover:text-foreground transition-colors">{t.guides.title}</Link>
          <span>/</span>
          <span className="text-foreground truncate">{guide.title}</span>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <div className="mb-3 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="rounded-full border border-border/60 bg-muted px-2.5 py-0.5">
              {CATEGORY_LABELS[guide.category]}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {guide.readingTime} min read
            </span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">{guide.title}</h1>
          <p className="mt-3 text-muted-foreground">{guide.description}</p>
        </header>

        {/* Tools used */}
        {guideTools.length > 0 && (
          <div className="mb-10 rounded-xl border border-border/40 bg-muted/20 p-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t.guides.relatedTools}
            </p>
            <div className="flex flex-wrap gap-2">
              {guideTools.map(tool => tool && (
                <Link
                  key={tool.slug}
                  href={`/tools/${tool.slug}`}
                  className="rounded-md border border-border/60 bg-card px-3 py-1.5 text-sm font-medium transition-colors hover:border-border hover:bg-muted"
                >
                  {tool.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Article body */}
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
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          </div>
        )}

        {/* Related guides from same category */}
        {relatedGuides.length > 0 && (
          <div className="mt-12 border-t border-border/50 pt-10">
            <h2 className="mb-4 text-base font-semibold">
              More {CATEGORY_LABELS[guide.category]} guides
            </h2>
            <div className="space-y-2">
              {relatedGuides.map(rg => (
                <Link
                  key={rg.slug}
                  href={`/guides/${rg.slug}`}
                  className="group flex items-center justify-between rounded-lg border border-border/50 bg-card px-4 py-3 text-sm transition-colors hover:border-border hover:bg-muted/50"
                >
                  <span className="font-medium group-hover:text-primary transition-colors">
                    {rg.title}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {rg.readingTime} min
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
