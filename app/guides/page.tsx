// app/guides/page.tsx — English guides index with category tabs
import Link                  from "next/link"
import { Clock }             from "lucide-react"
import { guides, getGuideCategories } from "@/data/guides"
import { getToolBySlug, CATEGORY_LABELS } from "@/data/tools"
import { getMessages }       from "@/lib/i18n"
import { siteConfig }        from "@/lib/config"
import type { Metadata }     from "next"
import { GuidesGrid }        from "@/components/layout/GuidesGrid"

export const metadata: Metadata = {
  title:       "Developer Guides",
  description: "In-depth guides for common developer tasks — debugging API responses, URL encoding, UUID best practices, and more.",
  alternates: {
    canonical: `${siteConfig.url}/guides`,
    languages: {
      en:          `${siteConfig.url}/guides`,
      ja:          `${siteConfig.url}/ja/guides`,
      zh:          `${siteConfig.url}/zh/guides`,
      "x-default": `${siteConfig.url}/guides`,
    },
  },
}

export default function GuidesPage() {
  const t = getMessages("en")
  return <GuidesGrid guides={guides} messages={t} locale="en" />
}
