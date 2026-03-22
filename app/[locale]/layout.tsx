// app/[locale]/layout.tsx
// Serves /ja/* and /zh/* routes.
// Validates the locale segment and sets the correct lang attribute on <html>.
// English (default) is served at the root — NOT under /en/.

import { notFound }       from "next/navigation"
import { isValidLocale, locales, defaultLocale } from "@/lib/i18n/config"
import { getMessages }    from "@/lib/i18n"
import { siteConfig }     from "@/lib/config"
import type { Metadata }  from "next"

interface Props {
  children:    React.ReactNode
  params:      Promise<{ locale: string }>
}

export async function generateStaticParams() {
  // Only generate routes for non-default locales (en has no prefix)
  return locales
    .filter(l => l !== defaultLocale)
    .map(locale => ({ locale }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isValidLocale(locale) || locale === defaultLocale) return {}

  const t = getMessages(locale)
  return {
    title: {
      default:  t.meta.homeTitle,
      template: `%s ${t.meta.titleSuffix}`,
    },
    description:  t.meta.homeDesc,
    alternates: {
      canonical:  `${siteConfig.url}/${locale}`,
      languages: {
        en:          siteConfig.url,
        ja:          `${siteConfig.url}/ja`,
        zh:          `${siteConfig.url}/zh`,
        "x-default": siteConfig.url,
      },
    },
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  // Reject invalid or default locale in this segment
  // (default locale = root layout, no /en/ prefix)
  if (!isValidLocale(locale) || locale === defaultLocale) {
    notFound()
  }

  return (
    // Override html lang for this subtree
    // Next.js merges this with the root <html> tag
    <div lang={locale}>
      {children}
    </div>
  )
}
