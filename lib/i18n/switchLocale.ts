// lib/i18n/switchLocale.ts

/**
 * 根据当前路径，生成目标语言路径
 * 核心原则：URL 决定语言（无 middleware）
 */
export function switchLocale(locale: string, pathname: string): string {
  // 去掉已有 locale 前缀
  const cleanPath = pathname.replace(/^\/(zh|ja)/, "")

  // 默认语言（en）无前缀
  if (locale === "en") {
    return cleanPath || "/"
  }

  return `/${locale}${cleanPath || ""}`
}