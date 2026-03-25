// data/tools/generator.ts — Generator category tools
import type { ToolMeta } from "./types"

export const generatorTools: ToolMeta[] = [
  {
    slug:        "uuid-generator",
    name:        "UUID Generator",
    description: "Generate cryptographically secure UUID v4 identifiers in bulk.",
    component:   "UUIDGenerator",
    category:    "generator",
    subcategory: "uuid",
    tags: [
      "uuid", "guid", "generator", "random", "unique-id", "v4",
      "crypto", "uuid v4", "generate guid", "random id generator",
      "universally unique identifier", "primary key generator",
    ],
    status:   "stable",
    featured: true,
    addedAt:  "2025-01-01",
    seo: {
      title:       "UUID Generator Online - Bulk UUID v4, Cryptographically Secure",
      description: "Generate single or bulk UUID v4 identifiers using the browser's CSPRNG. Copy all with one click. Runs locally, no data sent.",
    },
    content: {
      intro:    "UUID v4 generates 128-bit identifiers using cryptographically secure random numbers, giving a collision probability of 1 in 5.3×10³⁶ per pair. This tool generates single or bulk UUIDs instantly using your browser's built-in crypto API.",
      usage:    "Click Generate for a single UUID, or set a quantity (up to 100) and click Bulk Generate. Copy individual UUIDs or all at once. The Recent History panel keeps your last 10 generated IDs.",
      example:  "Single:  f47ac10b-58cc-4372-a567-0e02b2c3d479\n\nBulk (3):\n  3d721da8-8e4b-4f1a-b2e9-c1d3f5a7e291\n  9b2c4e6f-1a3b-5c7d-8e9f-0a1b2c3d4e5f\n  1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
      useCases: "1. Generating primary keys for SQL and NoSQL database records.\n2. Creating idempotency keys for API requests to prevent duplicate processing.\n3. Unique filenames for user-uploaded assets in object storage.\n4. Session IDs and correlation IDs for distributed system tracing.\n5. Generating test fixtures with unique identifiers.",
      faq: [
        { q: "How random are these UUIDs?",            a: "They use window.crypto.randomUUID() — the browser's CSPRNG, the same source used for TLS and cryptographic key generation." },
        { q: "Is UUID v4 better than UUID v1?",        a: "For most use cases yes — v4 is purely random and doesn't leak machine info or timestamp. Use v1 only when sortable time-ordering is required." },
        { q: "Can two generated UUIDs ever be equal?", a: "Theoretically yes, but the probability is about 1 in 10³⁶. In practice, you will never encounter a collision." },
      ],
    },
    problems: [
      "How to generate a UUID online",
      "How to create a GUID for a database primary key",
      "How to generate multiple UUIDs at once",
      "How to create a random unique ID",
      "Difference between UUID v1 and UUID v4",
    ],
    workflow: { before: [], after: ["base64-encode"] },
    searchIntents: {
      informational: ["what is a uuid", "uuid v4 format", "uuid vs guid difference"],
      navigational:  ["uuid generator online", "guid generator free", "random uuid"],
      transactional: ["generate uuid v4", "create guid online", "bulk uuid generator"],
    },
    i18n: {
      ja: {
        name:        "UUID ジェネレーター",
        description: "暗号学的に安全なUUID v4を一括生成します。",
        seo: {
          title:       "UUID ジェネレーター - 無料オンライン | AIStacker",
          description: "UUID v4をブラウザのCryptoAPIで生成。一括生成・一括コピー対応。データの送信なし。",
        },
      },
      zh: {
        name:        "UUID 生成器",
        description: "批量生成加密安全的 UUID v4 标识符。",
        seo: {
          title:       "UUID 生成器 - 免费在线批量生成 | AIStacker",
          description: "使用浏览器加密 API 生成 UUID v4，支持批量生成和一键复制。完全本地处理。",
        },
      },
    },
  },
  {
    "slug": "danmaku-to-ass-converter",
    "name": "Danmaku2ASS Converter (Bilibili XML)",
    "description": "High-performance XML to ASS subtitle converter. Transform Bilibili/AcFun danmaku into high-quality, collision-free subtitles for IINA, VLC, and Movist.",
    "component": "Danmaku2ASS",
    "category": "converter",
    "subcategory": "danmaku2ass",
    "tags": [
      "danmaku2ass online", "xml to ass converter", "bilibili danmaku download",
      "convert xml subtitles to ass", "danmaku for iina", "bilibili to ass converter",
      "collision-free danmaku", "danmaku to vlc", "local danmaku parser", "ass subtitle generator"
    ],
    "status": "new",
    "featured": true,
    "addedAt": "2026-03-25",
    "seo": {
      "title": "Danmaku2ASS Online - Convert Bilibili XML to High-Quality Subtitles",
      "description": "Convert Bilibili XML danmaku to ASS subtitles with smart collision avoidance. 100% browser-side processing, secure, and supports custom font sizes and opacity."
    },
    "content": {
      "intro": "Danmaku2ASS is an essential tool for anime fans and video enthusiasts. It converts the proprietary XML danmaku format used by Bilibili into the universal ASS (Advanced Substation Alpha) format, allowing you to enjoy 'scrolling comments' in professional local players like IINA, VLC, or MPV.",
      "usage": "Simply paste your XML content or upload the .xml file. Adjust settings such as 'Font Size' or 'Duration' to match your video resolution, then click 'Convert'. The tool uses a specialized track-based algorithm to ensure danmaku don't overlap, creating a clean viewing experience.",
      "example": "Input (XML):\n<d p=\"12.5,1,25,16777215,... \">Hello World</d>\n\nOutput (ASS):\nDialogue: 0,00:00:12.50,00:00:20.50,Default,,{\\move(1920,50,-500,50)}Hello World",
      "useCases": "1. Watching downloaded Bilibili videos on macOS with native players like IINA.\n2. Converting large danmaku files (50k+ entries) without server-side lag.\n3. Customizing danmaku transparency and size for better readability on 4K displays.\n4. Archiving live stream comments into permanent, searchable subtitle files.",
      "faq": [
        { "q": "Why use ASS instead of XML?", "a": "Most professional local players cannot render XML directly. ASS is a powerful subtitle format that supports the precise positioning and motion needed for scrolling danmaku." },
        { "q": "How does collision avoidance work?", "a": "The tool assigns each danmaku to a specific 'track' (vertical lane). It calculates the speed and length of each string to ensure new comments don't catch up to or overlap with previous ones." },
        { "q": "Is my data safe?", "a": "Yes. This tool runs entirely in your browser using TypeScript. Your XML files are never uploaded to any server." }
      ]
    },
    "problems": [
      "How to watch bilibili danmaku in IINA",
      "Online xml to ass converter for mac",
      "Bilibili danmaku overlapping fix",
      "Convert dandanplay xml to ass subtitles",
      "Best tool for local danmaku playback"
    ],
    "workflow": { "before": ["bilibili-video-downloader", "xml-formatter"], "after": ["iina-player", "video-subtitle-merger"] },
    "searchIntents": {
      "informational": ["how danmaku2ass works", "what is ass subtitle format", "bilibili xml structure explained"],
      "navigational": ["danmaku2ass online tool", "bilibili to ass converter free", "danmaku generator"],
      "transactional": ["convert xml to ass for vlc", "download ass danmaku", "minify xml danmaku files"]
    },
    "i18n": {
      "ja": {
        "name": "Danmaku2ASS 変換器 (Bilibili XML対応)",
        "description": "BilibiliなどのXML弾幕を高品質なASS字幕に変換。IINAやVLCで、重なりのないスムーズな弾幕再生を実現します。",
        "seo": {
          "title": "Danmaku2ASS オンライン - XML弾幕を高品質なASS字幕へ変換 | AIStacker",
          "description": "BilibiliのXML弾幕をASS形式に変換。スマートな衝突回避アルゴリズムを搭載し、ブラウザ上で安全かつ高速に処理します。"
        }
      },
      "zh": {
        "name": "弹幕 XML 转 ASS 工具 (Danmaku2ASS)",
        "description": "高性能 XML 弹幕转 ASS 字幕工具。支持 B 站弹幕转换，内置智能防碰撞算法，完美适配 IINA、VLC 及 Movist。",
        "seo": {
          "title": "Danmaku2ASS 在线转换 - B 站 XML 弹幕转 ASS 字幕工具 | AIStacker",
          "description": "在线将 B 站 XML 弹幕转换为 ASS 格式。支持智能防重叠、自定义字号与透明度，纯本地转换，保护隐私。"
        }
      }
    }
  },


  
]
