// app/[locale]/tools/page.tsx — /ja/tools, /zh/tools
import { Suspense }           from "react"
import { notFound }           from "next/navigation"
import { isValidLocale, defaultLocale } from "@/lib/i18n/config"
import { getMessages }        from "@/lib/i18n"
import { tools }              from "@/data/tools"
import { ToolsDirectory }     from "@/components/layout/ToolsDirectory"
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
    title:       t.meta.toolsTitle,
    description: t.meta.toolsDesc,
    alternates: {
      canonical: `${siteConfig.url}/${locale}/tools`,
      languages: {
        en:          `${siteConfig.url}/tools`,
        ja:          `${siteConfig.url}/ja/tools`,
        zh:          `${siteConfig.url}/zh/tools`,
        "x-default": `${siteConfig.url}/tools`,
      },
    },
  }
}

export default async function LocaleToolsPage({ params }: Props) {
  const { locale } = await params
  if (!isValidLocale(locale) || locale === defaultLocale) notFound()

  const t = getMessages(locale)
  return (
    <Suspense>
      <ToolsDirectory tools={tools} messages={t} locale={locale} />
    </Suspense>
  )
}
