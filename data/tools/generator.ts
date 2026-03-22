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
]
