// data/guides.ts — Developer Guides Registry
//
// Changes vs previous version:
//   1. category is now ToolCategory (same enum as tools — drives cross-linking)
//   2. i18n field follows the same pattern as ToolMeta
//   3. getLocalizedGuide() helper mirrors getLocalizedTool()
//   4. getGuidesForCategory() enables automatic guide injection on tool pages
//   5. Partial translation is acceptable — missing fields fall back to English

import type { ToolCategory } from "@/data/tools"

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface GuideSection {
  id:      string    // anchor href — must be stable, never change after publish
  heading: string
  body:    string    // plain text, paragraphs separated by \n\n
}

export interface GuideContent {
  intro:    string
  sections: GuideSection[]
}

export interface GuideI18nOverride {
  title?:       string
  description?: string
  content?: {
    intro?:    string
    // Partial sections: only override the sections that are translated.
    // Matched by id — sections not listed here inherit the English version.
    sections?: Array<{ id: string; heading?: string; body?: string }>
  }
}

export interface Guide {
  slug:        string
  title:       string
  description: string        // ≤160 chars, meta description
  category:    ToolCategory  // binds to tool category — drives cross-linking
  toolSlugs:   string[]      // tools used/referenced in this guide
  tags:        string[]      // for search and discovery
  readingTime: number        // minutes
  publishedAt: string        // ISO date
  featured?:   boolean
  content:     GuideContent
  i18n?:       Partial<Record<"ja" | "zh", GuideI18nOverride>>
}

// ─────────────────────────────────────────────────────────────────────────────
// Registry
// ─────────────────────────────────────────────────────────────────────────────

export const guides: Guide[] = [
  {
    slug:        "debugging-api-responses",
    title:       "How to Debug REST API Responses",
    description: "A practical guide to reading, validating, and decoding API responses — JSON formatting, Base64 decoding, URL decoding, and timestamp conversion.",
    category:    "formatter",
    toolSlugs:   ["json-formatter", "base64-encode", "url-decode", "timestamp-converter"],
    tags:        ["api", "rest", "debugging", "json", "base64", "url", "timestamp"],
    readingTime: 6,
    publishedAt: "2025-01-15",
    featured:    true,
    content: {
      intro: "REST APIs return data in formats that are often compressed, encoded, or timestamped in ways that are difficult to read directly. This guide walks through the most common scenarios you'll encounter and which tools to use for each.",
      sections: [
        {
          id:      "minified-json",
          heading: "Reading minified JSON responses",
          body:    "API responses are frequently minified to reduce payload size. A response like {\"id\":1,\"status\":\"active\",\"data\":{\"items\":[1,2,3]}} is valid JSON but impossible to scan visually.\n\nPaste the response into JSON Formatter and press Format (Ctrl+Enter). The tool validates the JSON and renders it with proper indentation. If the JSON is invalid, a parse error is shown with the offending line number.",
        },
        {
          id:      "base64-fields",
          heading: "Decoding Base64-encoded fields",
          body:    "Some APIs embed binary data or tokens as Base64 strings inside JSON: {\"thumbnail\": \"iVBORw0KGgoAAAANSUh...\"}.\n\nCopy the field value and paste it into Base64 Decoder. Readable text output means you've found the original content. Binary-looking output means the field contains a binary file (image, PDF) — that's normal and expected.",
        },
        {
          id:      "encoded-params",
          heading: "Decoding URL-encoded query strings",
          body:    "Webhook URLs and redirect parameters frequently appear as: ?redirect=https%3A%2F%2Fexample.com%2Fpath%3Fid%3D123\n\nURL Decoder converts this to https://example.com/path?id=123 instantly. If the redirect contains an access token, it may be double-encoded — click Decode twice.",
        },
        {
          id:      "timestamps",
          heading: "Reading timestamp fields",
          body:    "APIs use Unix timestamps in both seconds (1704067200) and milliseconds (1704067200000). Timestamp Converter auto-detects which format is used and shows UTC, local time, and ISO 8601 equivalents.\n\nFor log analysis, convert the first and last timestamp in a segment to understand the time range you're examining.",
        },
      ],
    },
    i18n: {
      ja: {
        title:       "REST APIレスポンスのデバッグ方法",
        description: "APIレスポンスを読み解く実践ガイド — JSON整形・Base64デコード・URLデコード・タイムスタンプ変換。",
        content: {
          intro: "REST APIは帯域節約のためにデータを圧縮・エンコードして返します。このガイドでは、開発中によく遭遇するシナリオと、それぞれに使うべきツールを解説します。",
          sections: [
            {
              id:      "minified-json",
              heading: "圧縮されたJSONレスポンスを読む",
              body:    "APIレスポンスは帯域節約のためにしばしば圧縮されています。{\"id\":1,\"status\":\"active\"} のようなレスポンスは有効なJSONですが、目で追うのは困難です。\n\nJSON FormatterにペーストしてFormatボタン（Ctrl+Enter）を押すと、適切なインデントで整形されます。JSONが無効な場合は、問題のある行番号とともにエラーが表示されます。",
            },
            {
              id:      "base64-fields",
              heading: "Base64エンコードされたフィールドのデコード",
              body:    "APIによっては、バイナリデータやトークンをBase64文字列としてJSONに埋め込むことがあります: {\"thumbnail\": \"iVBORw0KGgoAAAANSUh...\"}。\n\nフィールドの値をコピーしてBase64 Decoderに貼り付けます。読めるテキストが出力されれば元のコンテンツです。バイナリのような出力であれば、画像やPDFなどのバイナリファイルです。",
            },
            {
              id:      "encoded-params",
              heading: "URLエンコードされたクエリ文字列のデコード",
              body:    "WebhookのURLやリダイレクトパラメータは、?redirect=https%3A%2F%2Fexample.com%2Fpath のように表示されることがよくあります。\n\nURL Decoderを使えば https://example.com/path のように即座に変換できます。二重エンコードされている場合は「デコード」を2回クリックしてください。",
            },
            {
              id:      "timestamps",
              heading: "タイムスタンプフィールドを読む",
              body:    "APIは秒単位（1704067200）またはミリ秒単位（1704067200000）のUnixタイムスタンプを使用します。Timestamp ConverterはどちらのフォーマットかをUTC・ローカル時刻・ISO 8601形式で表示します。\n\nログ解析では、セグメントの最初と最後のタイムスタンプを変換して、対象の時間範囲を把握しましょう。",
            },
          ],
        },
      },
      zh: {
        title:       "如何调试 REST API 响应",
        description: "解读 API 响应的实践指南 — JSON 格式化、Base64 解码、URL 解码和时间戳转换。",
        content: {
          intro: "REST API 通常以压缩、编码或带时间戳的格式返回数据，直接阅读十分困难。本指南介绍开发中最常见的场景以及对应使用的工具。",
          sections: [
            {
              id:      "minified-json",
              heading: "读取压缩的 JSON 响应",
              body:    "API 响应通常经过压缩以节省带宽。像 {\"id\":1,\"status\":\"active\"} 这样的响应是有效的 JSON，但很难直接阅读。\n\n将响应粘贴到 JSON Formatter 并按 Format（Ctrl+Enter）。工具会验证 JSON 并以适当的缩进格式化。如果 JSON 无效，会显示出错的行号。",
            },
            {
              id:      "base64-fields",
              heading: "解码 Base64 编码的字段",
              body:    "有些 API 将二进制数据或令牌以 Base64 字符串的形式嵌入 JSON：{\"thumbnail\": \"iVBORw0KGgoAAAANSUh...\"}。\n\n复制字段值并粘贴到 Base64 Decoder。如果输出是可读文本，说明找到了原始内容；如果是乱码，说明该字段是二进制文件（图片、PDF）。",
            },
            {
              id:      "encoded-params",
              heading: "解码 URL 编码的查询字符串",
              body:    "Webhook URL 和重定向参数通常显示为：?redirect=https%3A%2F%2Fexample.com%2Fpath%3Fid%3D123。\n\nURL Decoder 可以立即将其转换为 https://example.com/path?id=123。如果参数被双重编码，需要点击解码两次。",
            },
            {
              id:      "timestamps",
              heading: "读取时间戳字段",
              body:    "API 使用秒级（1704067200）或毫秒级（1704067200000）Unix 时间戳。Timestamp Converter 会自动检测格式，并显示 UTC、本地时间和 ISO 8601 三种格式。\n\n分析日志时，将片段的第一个和最后一个时间戳转换，以了解所分析的时间范围。",
            },
          ],
        },
      },
    },
  },

  {
    slug:        "url-encoding-explained",
    title:       "URL Encoding Explained: When and Why to Percent-Encode",
    description: "Why certain characters must be encoded in URLs, the difference between encodeURI and encodeURIComponent, and when double-encoding happens.",
    category:    "encoder",
    toolSlugs:   ["url-encode", "url-decode"],
    tags:        ["url", "encoding", "percent-encode", "web", "http"],
    readingTime: 5,
    publishedAt: "2025-01-20",
    featured:    false,
    content: {
      intro: "URL encoding converts characters that are unsafe in URLs into a % sign followed by their hex representation. Understanding when and how to encode is essential for building reliable APIs and handling user input correctly.",
      sections: [
        {
          id:      "why-encode",
          heading: "Why URL encoding is necessary",
          body:    "URLs can only contain a limited set of ASCII characters. Characters like spaces, ?, #, and non-ASCII text (Japanese, Chinese, Arabic) would break URL parsing if included literally.\n\nPercent-encoding replaces each unsafe byte with %XX where XX is its hexadecimal value. A space becomes %20, a question mark becomes %3F, and the Japanese character 日 becomes %E6%97%A5 (its UTF-8 byte sequence).",
        },
        {
          id:      "encode-vs-component",
          heading: "encodeURI vs encodeURIComponent",
          body:    "encodeURI encodes a full URL and deliberately preserves structural characters: / ? = & # :. Use it when you have a complete URL that just needs unsafe characters escaped.\n\nencodeURIComponent encodes everything except letters, digits, and - _ . ! ~ * ' ( ). Use it for individual parameter values — this is what URL Encoder on this site uses.",
        },
        {
          id:      "double-encoding",
          heading: "Double-encoding and how to avoid it",
          body:    "Double-encoding happens when an already-encoded string gets encoded again. %20 becomes %2520 because % itself gets encoded as %25.\n\nThe most common cause is passing a full URL (which already contains % characters) through encodeURIComponent. Always encode only the parameter values, never the full URL.",
        },
      ],
    },
    i18n: {
      ja: {
        title:       "URLエンコーディング解説：パーセントエンコードが必要な理由",
        description: "URLで特定の文字をエンコードしなければならない理由、encodeURIとencodeURIComponentの違い、二重エンコードが起きるケース。",
        content: {
          intro: "URLエンコーディングは、URLで使用できない文字を「%」に続く16進数に変換します。いつ・どのようにエンコードするかを理解することは、信頼性の高いAPIを構築するために不可欠です。",
          sections: [
            {
              id:      "why-encode",
              heading: "URLエンコードが必要な理由",
              body:    "URLに含められる文字は限られたASCII文字のみです。スペース・?・#・日本語などの非ASCII文字をそのまま含めるとURLのパースが壊れます。\n\nパーセントエンコーディングは、安全でないバイトを%XXに置換します。スペースは%20、?は%3F、「日」という漢字はUTF-8のバイト列で%E6%97%A5になります。",
            },
            {
              id:      "encode-vs-component",
              heading: "encodeURIとencodeURIComponentの違い",
              body:    "encodeURIはURL全体をエンコードし、/・?・=・&・#・:などの構造的な文字を意図的に保持します。すでに完成したURLをエスケープする際に使います。\n\nencodeURIComponentは英数字と- _ . ! ~ * ' ( )以外のすべてをエンコードします。クエリパラメータの個々の値をエンコードする際に使います（このサイトのURL Encoderはこちらを使用）。",
            },
            {
              id:      "double-encoding",
              heading: "二重エンコードとその回避方法",
              body:    "二重エンコードは、すでにエンコードされた文字列がさらにエンコードされた場合に発生します。%20が%2520になります（%自体が%25にエンコードされるため）。\n\n最もよくある原因は、すでに%文字を含むURL全体をencodeURIComponentに渡すことです。URLのパラメータ値のみをエンコードし、URL全体をエンコードしないようにしましょう。",
            },
          ],
        },
      },
      zh: {
        title:       "URL 编码详解：什么时候以及为什么需要百分比编码",
        description: "为什么 URL 中某些字符必须编码、encodeURI 与 encodeURIComponent 的区别，以及双重编码发生的场景。",
        content: {
          intro: "URL 编码将 URL 中不安全的字符转换为 % 加两位十六进制数的形式。了解何时以及如何编码，对于构建可靠的 API 和正确处理用户输入至关重要。",
          sections: [
            {
              id:      "why-encode",
              heading: "为什么需要 URL 编码",
              body:    "URL 只能包含有限的 ASCII 字符。空格、?、# 以及中文等非 ASCII 字符如果直接出现在 URL 中，会导致解析错误。\n\n百分比编码将不安全的字节替换为 %XX（XX 是十六进制值）。空格变为 %20，问号变为 %3F，汉字「日」的 UTF-8 编码变为 %E6%97%A5。",
            },
            {
              id:      "encode-vs-component",
              heading: "encodeURI 与 encodeURIComponent 的区别",
              body:    "encodeURI 对完整 URL 进行编码，会保留 /、?、=、&、# 等结构性字符。用于对已有 URL 进行转义时使用。\n\nencodeURIComponent 对除字母、数字和 - _ . ! ~ * ' ( ) 以外的所有字符进行编码。用于编码单个参数值（本站 URL Encoder 使用此方法）。",
            },
            {
              id:      "double-encoding",
              heading: "双重编码及如何避免",
              body:    "双重编码是指已经编码的字符串再次被编码。%20 会变成 %2520（因为 % 本身被编码为 %25）。\n\n最常见的原因是将包含 % 字符的完整 URL 传入 encodeURIComponent。请只对参数值进行编码，而不要对完整 URL 编码。",
            },
          ],
        },
      },
    },
  },

  {
    slug:        "uuid-guide",
    title:       "UUID v4 in Practice: Generation, Storage, and Common Pitfalls",
    description: "How UUID v4 works, when to use it over other ID strategies, storage considerations, and common mistakes with database primary keys.",
    category:    "generator",
    toolSlugs:   ["uuid-generator"],
    tags:        ["uuid", "guid", "database", "primary-key", "distributed-systems"],
    readingTime: 7,
    publishedAt: "2025-02-01",
    featured:    false,
    content: {
      intro: "UUID v4 generates 128-bit identifiers from cryptographically secure random numbers. Their near-zero collision probability and independence from any central authority make them the default choice for distributed systems — but there are tradeoffs worth understanding.",
      sections: [
        {
          id:      "format",
          heading: "UUID format and structure",
          body:    "A UUID is formatted as 8-4-4-4-12 hexadecimal characters: f47ac10b-58cc-4372-a567-0e02b2c3d479.\n\nFor v4, the third group always starts with 4 (version indicator) and the fourth group starts with 8, 9, a, or b (variant indicator). All remaining bits are cryptographically random.",
        },
        {
          id:      "storage",
          heading: "Storing UUIDs in databases",
          body:    "VARCHAR(36) is portable but wastes 11 bytes vs BINARY(16). PostgreSQL has a native UUID type (16 bytes). MySQL has no UUID type — use BINARY(16) with UNHEX(REPLACE(uuid,'-','')).\n\nUUID v4 is random, meaning inserts into a B-tree clustered index cause random page writes. At high insert rates this creates index fragmentation. UUID v7 (time-ordered, RFC 9562) solves this — consider it for write-heavy tables.",
        },
        {
          id:      "alternatives",
          heading: "When not to use UUID v4",
          body:    "UUIDs are 36 characters — hard to type, debug, and include in support tickets. If human readability matters, consider shorter alternatives: nanoid (~21 chars), CUID2 (~24 chars), or a compound key like {date}-{random-6}.\n\nFor databases with high insert rates, UUID v7 or ULID preserves uniqueness while maintaining monotonic ordering for B-tree efficiency.",
        },
      ],
    },
    i18n: {
      ja: {
        title:       "UUID v4の実践：生成・保存・よくある落とし穴",
        description: "UUID v4の仕組み、他のID戦略との使い分け、データベース保存時の注意点、主キーとして使う際のよくある失敗。",
        content: {
          intro: "UUID v4は暗号学的に安全な乱数から128ビットの識別子を生成します。衝突確率が極めて低く、中央管理不要な点から分散システムで広く使われます。ただし、いくつかのトレードオフがあります。",
          sections: [
            {
              id:      "format",
              heading: "UUIDのフォーマットと構造",
              body:    "UUIDは8-4-4-4-12の16進数でフォーマットされます: f47ac10b-58cc-4372-a567-0e02b2c3d479。\n\nv4では3番目のグループが常に「4」（バージョン）で始まり、4番目のグループは「8・9・a・b」のいずれかで始まります（バリアント識別子）。残りのビットはすべて暗号学的な乱数です。",
            },
            {
              id:      "storage",
              heading: "データベースへのUUID保存",
              body:    "VARCHAR(36)は汎用性が高いですが、BINARY(16)より11バイト多く消費します。PostgreSQLはネイティブのUUID型（16バイト）を持ちます。MySQLにはUUID型がないためBINARY(16)とUNHEX(REPLACE(uuid,'-',''))を使います。\n\nUUID v4はランダムなため、クラスタードインデックスへのINSERTでランダムなページ書き込みが発生します。挿入頻度が高いテーブルではインデックス断片化が問題になります。時刻順序付きのUUID v7（RFC 9562）の採用を検討してください。",
            },
            {
              id:      "alternatives",
              heading: "UUID v4を使わないケース",
              body:    "UUIDは36文字と長く、入力・デバッグ・サポート対応で扱いにくいです。可読性が重要な場合は、nanoid（約21文字）・CUID2（約24文字）・{日付}-{乱数6桁}のような複合キーを検討してください。\n\n挿入頻度の高いデータベースには、B-treeの効率を維持しながら一意性を保つUUID v7またはULIDが適しています。",
            },
          ],
        },
      },
      zh: {
        title:       "UUID v4 实践指南：生成、存储与常见陷阱",
        description: "UUID v4 的工作原理、与其他 ID 策略的对比、数据库存储注意事项，以及用作主键时的常见错误。",
        content: {
          intro: "UUID v4 使用加密安全的随机数生成 128 位标识符。极低的碰撞概率和无需中心化授权的特性，使其成为分布式系统的默认选择——但其中也有一些值得了解的权衡。",
          sections: [
            {
              id:      "format",
              heading: "UUID 格式与结构",
              body:    "UUID 格式为 8-4-4-4-12 的十六进制字符：f47ac10b-58cc-4372-a567-0e02b2c3d479。\n\nv4 中，第三组始终以 4 开头（版本标识），第四组以 8、9、a 或 b 开头（变体标识）。其余所有位均为加密随机数。",
            },
            {
              id:      "storage",
              heading: "在数据库中存储 UUID",
              body:    "VARCHAR(36) 可移植性好，但比 BINARY(16) 多占 11 字节。PostgreSQL 有原生 UUID 类型（16 字节）。MySQL 没有 UUID 类型，可使用 BINARY(16) 配合 UNHEX(REPLACE(uuid,'-',''))。\n\nUUID v4 是随机的，插入聚簇索引时会造成随机页写入，高写入频率下会产生索引碎片。考虑使用时间有序的 UUID v7（RFC 9562）来解决这个问题。",
            },
            {
              id:      "alternatives",
              heading: "何时不使用 UUID v4",
              body:    "UUID 有 36 个字符，不易输入、调试和在工单中引用。如果可读性重要，可考虑：nanoid（约 21 字符）、CUID2（约 24 字符），或 {日期}-{6位随机数} 这样的组合键。\n\n对于高写入频率的数据库，UUID v7 或 ULID 在保持唯一性的同时维护了单调有序性，对 B-tree 更友好。",
            },
          ],
        },
      },
    },
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

export function getGuideBySlug(slug: string): Guide | undefined {
  return guides.find(g => g.slug === slug)
}

export function getGuidesForTool(toolSlug: string): Guide[] {
  return guides.filter(g => g.toolSlugs.includes(toolSlug))
}

export function getGuidesForCategory(category: ToolCategory): Guide[] {
  return guides.filter(g => g.category === category)
}

export function getFeaturedGuides(): Guide[] {
  return guides.filter(g => g.featured)
}

export function getGuideCategories(): ToolCategory[] {
  return [...new Set(guides.map(g => g.category))] as ToolCategory[]
}

/**
 * Returns a guide with locale-specific content merged over the English base.
 * Missing translations fall back to English silently — the UI layer adds
 * an "untranslated" notice when content.intro is still English.
 */
export function getLocalizedGuide(guide: Guide, locale: "en" | "ja" | "zh"): Guide {
  if (locale === "en" || !guide.i18n?.[locale]) return guide

  const override = guide.i18n[locale]!
  const baseSections = guide.content.sections

  // Merge sections: take override section if it exists, else keep English
  const mergedSections = baseSections.map(baseSection => {
    const overrideSection = override.content?.sections?.find(s => s.id === baseSection.id)
    if (!overrideSection) return baseSection
    return {
      id:      baseSection.id,
      heading: overrideSection.heading ?? baseSection.heading,
      body:    overrideSection.body    ?? baseSection.body,
    }
  })

  return {
    ...guide,
    title:       override.title       ?? guide.title,
    description: override.description ?? guide.description,
    content: {
      intro:    override.content?.intro ?? guide.content.intro,
      sections: mergedSections,
    },
  }
}

/**
 * Returns true when a guide has NO i18n override for the given locale.
 * Used to show an "untranslated" notice on the guide page.
 */
export function isGuideTranslated(guide: Guide, locale: "en" | "ja" | "zh"): boolean {
  if (locale === "en") return true
  return Boolean(guide.i18n?.[locale]?.title)
}
