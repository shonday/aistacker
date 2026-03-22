// app/[locale]/guides/page.tsx — /ja/guides, /zh/guides
import { notFound }          from "next/navigation"
import { isValidLocale, defaultLocale } from "@/lib/i18n/config"
import { getMessages }       from "@/lib/i18n"
import { guides }            from "@/data/guides"
import { GuidesGrid }        from "@/components/layout/GuidesGrid"
import { siteConfig }        from "@/lib/config"
import type { Metadata }     from "next"

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateStaticParams() {
  return [{ locale: "ja" }, { locale: "zh" }]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isValidLocale(locale)) return {}
  const t = getMessages(locale)
  return {
    title:       t.guides.title,
    description: t.guides.sub,
    alternates: {
      canonical: `${siteConfig.url}/${locale}/guides`,
      languages: {
        en:          `${siteConfig.url}/guides`,
        ja:          `${siteConfig.url}/ja/guides`,
        zh:          `${siteConfig.url}/zh/guides`,
        "x-default": `${siteConfig.url}/guides`,
      },
    },
  }
}

export default async function LocaleGuidesPage({ params }: Props) {
  const { locale } = await params
  if (!isValidLocale(locale) || locale === defaultLocale) notFound()
  const t = getMessages(locale)
  return <GuidesGrid guides={guides} messages={t} locale={locale} />
}
