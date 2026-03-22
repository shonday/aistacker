// data/tools/converter.ts — Converter category tools
import type { ToolMeta } from "./types"

export const converterTools: ToolMeta[] = [
  {
    slug:        "timestamp-converter",
    name:        "Timestamp Converter",
    description: "Convert between Unix timestamps and human-readable dates across any timezone.",
    component:   "TimestampConverter",
    category:    "converter",
    subcategory: "timestamp",
    tags: [
      "timestamp", "unix", "epoch", "date", "converter",
      "utc", "timezone", "iso8601", "unix time",
      "epoch converter", "milliseconds to date", "date to unix",
    ],
    status:   "stable",
    featured: false,
    addedAt:  "2025-01-01",
    seo: {
      title:       "Unix Timestamp Converter - Epoch to Date, Milliseconds Supported",
      description: "Convert Unix timestamps (seconds or milliseconds) to UTC, local time, and ISO 8601. Supports all timezones. Runs in your browser.",
    },
    content: {
      intro:    "Unix timestamps count seconds elapsed since January 1, 1970 00:00:00 UTC. They are the standard time representation in databases, APIs, and server logs. This converter handles both second-precision and millisecond-precision timestamps automatically.",
      usage:    "Paste a Unix timestamp to see UTC, local time, and ISO 8601 equivalents. The converter auto-detects seconds (10 digits) vs milliseconds (13 digits). Use the date picker to convert a human-readable date back to a timestamp.",
      example:  "Seconds:      1704067200\n→ UTC:         Mon, 01 Jan 2024 00:00:00 GMT\n→ ISO 8601:    2024-01-01T00:00:00.000Z\n→ Local:       Mon Jan 01 2024 09:00:00 GMT+0900\n\nMilliseconds: 1704067200000  → same result",
      useCases: "1. Reading timestamps from server logs and database records.\n2. Debugging API responses that return epoch timestamps.\n3. Calculating time differences between events.\n4. Verifying cron job and scheduler configurations.\n5. Converting timestamps in distributed system traces.",
      faq: [
        { q: "Does it support milliseconds?",       a: "Yes. The converter detects 10-digit inputs as seconds and 13-digit inputs as milliseconds automatically." },
        { q: "Which timezone is 'Local Time'?",     a: "Local time reflects the timezone of your browser and operating system." },
        { q: "What is the maximum Unix timestamp?", a: "The 32-bit max is 2,147,483,647 (January 19, 2038 — the Y2K38 problem). 64-bit systems extend this far beyond the practical future." },
      ],
    },
    problems: [
      "How to convert Unix timestamp to date",
      "How to convert milliseconds to human readable date",
      "What is epoch time",
      "How to get current Unix timestamp",
      "How to convert ISO 8601 to Unix timestamp",
      "How to read timestamps from API responses",
    ],
    workflow: { before: [], after: ["json-formatter"] },
    searchIntents: {
      informational: ["what is unix timestamp", "what is epoch time", "unix time explained"],
      navigational:  ["timestamp converter online", "epoch converter", "unix time converter"],
      transactional: ["convert timestamp to date", "epoch to date online", "milliseconds to date converter"],
    },
    i18n: {
      ja: {
        name:        "タイムスタンプ変換ツール",
        description: "Unixタイムスタンプと日付を相互変換。ミリ秒・タイムゾーン対応。",
        seo: {
          title:       "Unixタイムスタンプ変換 - エポック秒を日付に | AIStacker",
          description: "Unixタイムスタンプ（秒・ミリ秒）をUTC・ローカル時刻・ISO 8601に変換。全タイムゾーン対応。",
        },
      },
      zh: {
        name:        "时间戳转换工具",
        description: "Unix 时间戳与可读日期互转，支持毫秒和时区。",
        seo: {
          title:       "Unix 时间戳转换 - 在线日期转换工具 | AIStacker",
          description: "将 Unix 时间戳（秒或毫秒）转换为 UTC、本地时间和 ISO 8601 格式，支持所有时区。",
        },
      },
    },
  },
]
