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
  
  // 验证语言有效性
  if (!isValidLocale(locale) || locale === defaultLocale) notFound()

  const t = getMessages(locale)

  // ✅ 核心逻辑：数据多语言化映射
  const localizedTools = tools.map(tool => {
    // 获取当前语言的翻译包 (例如 tool.i18n.zh)
    const translation = tool.i18n?.[locale as keyof typeof tool.i18n]

    // 如果没有对应的翻译，直接返回原工具（兜底用英文）
    if (!translation) return tool

    // 将翻译字段覆盖到顶层，保证 ToolsDirectory 拿到的 name/description 是正确的
    return {
      ...tool,
      name: translation.name || tool.name,
      description: translation.description || tool.description,
      // 如果 SEO 信息也需要透传给子组件
      seo: {
        ...tool.seo,
        ...(translation.seo || {})
      }
    }
  })

  return (
    <Suspense>
      {/* 传递处理后的 localizedTools 而不是原始的 tools */}
      <ToolsDirectory tools={localizedTools} messages={t} locale={locale} />
    </Suspense>
  )
}