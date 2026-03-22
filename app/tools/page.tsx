import { Suspense }       from "react"
import { tools }          from "@/data/tools"
import { ToolsDirectory } from "@/components/layout/ToolsDirectory"
import { getMessages }    from "@/lib/i18n"
import { siteConfig }     from "@/lib/config"
import type { Metadata }  from "next"

export const metadata: Metadata = {
  title:       "All Tools",
  description: "Browse 200+ free developer tools — JSON formatter, Base64 encoder, UUID generator, Regex tester, and much more. All run locally in your browser.",
  alternates: {
    canonical: `${siteConfig.url}/tools`,
    languages: {
      en:          `${siteConfig.url}/tools`,
      ja:          `${siteConfig.url}/ja/tools`,
      zh:          `${siteConfig.url}/zh/tools`,
      "x-default": `${siteConfig.url}/tools`,
    },
  },
}

export default function ToolsPage() {
  const t = getMessages("en")
  return (
    <Suspense>
      <ToolsDirectory tools={tools} messages={t} locale="en" />
    </Suspense>
  )
}
