// data/tools.ts — Central Tool Registry
// v2: adds problems[], workflow{}, searchIntents{}, i18n{} fields
// These power SEO breadth, smart recommendations, and multilingual support.

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type ToolCategory =
  | "formatter" | "encoder" | "generator" | "tester"
  | "converter" | "japanese" | "text" | "number"
  | "color" | "image" | "network" | "crypto"

export type ToolSubcategory =
  | "json" | "yaml" | "xml" | "csv"
  | "base64" | "url" | "html" | "jwt" | "math"
  | "uuid" | "hash" | "password" | "danmaku2ass"
  | "regex" | "diff" | "lint" | "design" | "data"
  | "timestamp" | "timezone" | "color-space"
  | "markdown" | "unicode" | "word-count"
  | "number-base" | "ip" | "dns" | "counter" | "javascript"

export type ToolStatus = "stable" | "beta" | "new"
export type Locale = "en" | "ja" | "zh"

export interface ToolFaq {
  q: string
  a: string
}

export interface ToolContent {
  intro:    string
  usage:    string
  example:  string
  useCases: string
  faq:      ToolFaq[]
}

export interface ToolWorkflow {
  // slugs of tools commonly used BEFORE this one
  before: string[]
  // slugs of tools commonly used AFTER this one
  after:  string[]
}

export interface ToolSearchIntents {
  // "what is json" — educational queries
  informational: string[]
  // "json formatter online" — tool-finding queries
  navigational:  string[]
  // "format json free" — task-completion queries (highest conversion)
  transactional: string[]
}

export interface ToolI18nOverride {
  name?:        string
  description?: string
  seo?:         { title: string; description: string }
  content?:     Partial<ToolContent>
}

export interface ToolMeta {
  slug:        string       // kebab-case → URL /tools/{slug}
  name:        string
  description: string       // ≤160 chars, used in cards and meta
  component:   string       // PascalCase, maps to components/tools/{component}.tsx
  category:    ToolCategory
  subcategory: ToolSubcategory
  tags:        string[]     // fuse.js search + tag cloud (include alias phrases)
  status:      ToolStatus
  featured?:   boolean
  addedAt:     string       // ISO "YYYY-MM-DD"
  seo: {
    title:       string
    description: string
  }
  content:     ToolContent

  // ── v2 additions ──────────────────────────────────────────────────────────

  // Specific user problems this tool solves — drives H2/H3 SEO breadth
  // Each string becomes a linkable heading on the tool page
  problems: string[]

  // Tool graph — powers "Typical Workflow" section + smart recommendations
  workflow: ToolWorkflow

  // Search intent keywords — used by sitemap priority and internal search
  searchIntents: ToolSearchIntents

  // Future FastAPI endpoint (dormant until a tool needs server-side processing)
  apiEndpoint?: string

  // Per-locale content overrides (UI strings come from lib/i18n/messages/)
  i18n?: Partial<Record<"ja" | "zh", ToolI18nOverride>>
}

// ─────────────────────────────────────────────────────────────────────────────
// Registry
// ─────────────────────────────────────────────────────────────────────────────

export const tools: ToolMeta[] = [
  {
    slug:        "json-formatter",
    name:        "JSON Formatter",
    description: "Beautify, minify, validate and sort JSON instantly in your browser.",
    component:   "JsonFormatter",
    category:    "formatter",
    subcategory: "json",
    tags: [
      "json", "formatter", "beautify", "minify", "validator", "pretty-print",
      "sort-keys", "make json readable", "prettify json", "json lint",
      "format api response", "jsn formater",
    ],
    status:   "stable",
    featured: true,
    addedAt:  "2025-01-01",
    seo: {
      title:       "Free JSON Formatter Online - Beautify, Minify & Validate JSON",
      description: "Paste messy JSON and get it instantly beautified, minified, validated with error highlighting. 100% private — runs in your browser.",
    },
    content: {
      intro:    "JSON Formatter transforms minified or messy JSON into a clean, indented structure with syntax validation. APIs return compressed JSON to save bandwidth — this tool makes it instantly human-readable without leaving your browser.",
      usage:    "Paste your JSON into the left panel. Choose Pretty or Minify mode, optionally sort keys alphabetically, then press Format (or Ctrl+Enter). Copy the result with one click.",
      example:  'Input:  {"id":1,"name":"AIStacker","active":true}\n\nPretty output:\n{\n  "id": 1,\n  "name": "AIStacker",\n  "active": true\n}\n\nMinify output:\n{"id":1,"name":"AIStacker","active":true}',
      useCases: "1. Debugging REST API responses during development.\n2. Formatting config files (package.json, tsconfig.json, appsettings.json).\n3. Validating JSON before submitting to an API.\n4. Minifying JSON payloads to reduce HTTP request size.\n5. Sorting keys alphabetically before committing to version control.",
      faq: [
        { q: "Is my JSON data sent to a server?",        a: "No. All processing runs entirely in your browser using JavaScript. Nothing is transmitted." },
        { q: "Can it handle invalid or broken JSON?",    a: "Yes. A clear parse error with the line number is shown inline so you can fix the problem immediately." },
        { q: "Does it support JSON5 or comments in JSON?", a: "The parser uses the standard JSON.parse() specification. JSON5 and comments are not supported — remove them first." },
        { q: "What is the maximum file size it can handle?", a: "Practically limited by your browser's memory. Files up to 10MB format smoothly in most modern browsers." },
      ],
    },
    problems: [
      "How to format JSON from an API response",
      "How to minify JSON to reduce payload size",
      "How to validate JSON syntax online",
      "How to sort JSON keys alphabetically",
      "How to read minified JSON",
      "How to fix a JSON parse error",
    ],
    workflow: {
      before: ["url-decode", "base64-encode"],
      after:  ["base64-encode", "url-encode"],
    },
    searchIntents: {
      informational: ["what is json", "what is json formatting", "json syntax rules"],
      navigational:  ["json formatter online", "json beautifier", "json prettifier free"],
      transactional: ["format json free", "json formatter no install", "online json validator"],
    },
    i18n: {
      ja: {
        name:        "JSON フォーマッター",
        description: "JSONをブラウザ上で瞬時に整形・圧縮・検証できます。",
        seo: {
          title:       "JSONフォーマッター - 無料オンラインツール | AIStacker",
          description: "貼り付けるだけでJSONを整形・圧縮・バリデーション。完全ブラウザ処理でデータは外部に送信されません。",
        },
      },
      zh: {
        name:        "JSON 格式化工具",
        description: "在浏览器中即时美化、压缩和验证 JSON，完全本地处理。",
        seo: {
          title:       "JSON 格式化工具 - 免费在线 | AIStacker",
          description: "粘贴杂乱的 JSON 即可立即美化、压缩并验证语法。完全在浏览器本地处理，数据不会上传。",
        },
      },
    },
  },

  {
    slug:        "base64-encode",
    name:        "Base64 Encoder / Decoder",
    description: "Encode text or files to Base64, or decode Base64 strings back to plain text.",
    component:   "Base64Encoder",
    category:    "encoder",
    subcategory: "base64",
    tags: [
      "base64", "encoder", "decoder", "encode", "decode",
      "binary to text", "base 64", "base64 decode online",
      "base64 image", "data uri", "atob btoa",
    ],
    status:   "stable",
    featured: true,
    addedAt:  "2025-01-01",
    seo: {
      title:       "Base64 Encoder & Decoder Online - Free, Fast, Private",
      description: "Encode text to Base64 or decode Base64 strings instantly. Supports Unicode, emoji, and binary data. Runs entirely in your browser.",
    },
    content: {
      intro:    "Base64 converts binary data into 64 printable ASCII characters, making it safe to transmit through text-only channels like HTTP headers, JSON, and email. This tool encodes and decodes Base64 instantly in your browser.",
      usage:    "Select Encode or Decode mode, paste your input, and click the action button. For encoding, any UTF-8 text including Unicode characters is accepted. For decoding, provide a valid Base64 string.",
      example:  "Encode:\n  Input:  Hello, World!\n  Output: SGVsbG8sIFdvcmxkIQ==\n\nDecode:\n  Input:  U0VDUkVU\n  Output: SECRET",
      useCases: "1. Decoding JWT token payloads to inspect claims.\n2. Embedding small images as data URIs in HTML or CSS.\n3. Encoding credentials for HTTP Basic Auth headers.\n4. Passing binary data through JSON APIs.\n5. Decoding Base64-encoded environment variables.",
      faq: [
        { q: "Is Base64 the same as encryption?",  a: "No. Base64 is an encoding scheme — it is trivially reversible and provides zero security. Use it for format compatibility, not secrecy." },
        { q: "Does it support Unicode and emoji?",  a: "Yes. The encoder handles full Unicode by using TextEncoder internally before converting to Base64." },
        { q: "Why does my decoded output look garbled?", a: "The original data may not have been text — it might be a binary file (image, PDF). Base64 is not limited to text." },
      ],
    },
    problems: [
      "How to decode a Base64 string online",
      "How to encode text to Base64",
      "How to decode a JWT token payload",
      "How to convert image to Base64 data URI",
      "How to decode Base64 environment variables",
      "What does a Base64 string look like",
    ],
    workflow: {
      before: ["url-decode"],
      after:  ["json-formatter", "url-decode"],
    },
    searchIntents: {
      informational: ["what is base64", "how does base64 encoding work", "base64 vs hex"],
      navigational:  ["base64 decoder online", "base64 encoder free", "online base64 converter"],
      transactional: ["decode base64 string", "encode text base64", "base64 decode free online"],
    },
    i18n: {
      ja: {
        name:        "Base64 エンコーダー / デコーダー",
        description: "テキストをBase64にエンコード、またはBase64文字列をデコードします。",
        seo: {
          title:       "Base64 エンコード・デコード - 無料オンライン | AIStacker",
          description: "テキストをBase64に変換、またはBase64を元のテキストに戻す。Unicode・絵文字対応。完全ブラウザ処理。",
        },
      },
      zh: {
        name:        "Base64 编码 / 解码",
        description: "将文本编码为 Base64 或将 Base64 字符串解码为原文。",
        seo: {
          title:       "Base64 编码解码 - 免费在线工具 | AIStacker",
          description: "在线 Base64 编码和解码，支持 Unicode 和中文。完全在浏览器本地处理，数据不会上传。",
        },
      },
    },
  },

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
        { q: "How random are these UUIDs?",           a: "They use window.crypto.randomUUID() — the browser's CSPRNG, the same source used for TLS and cryptographic key generation." },
        { q: "Is UUID v4 better than UUID v1?",       a: "For most use cases yes — v4 is purely random and doesn't leak machine info or timestamp. Use v1 only when sortable time-ordering is required." },
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
    workflow: {
      before: [],
      after:  ["base64-encode"],
    },
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
    slug:        "regex-tester",
    name:        "Regex Tester",
    description: "Test regular expressions with real-time highlighting, flag toggles, and group capture breakdown.",
    component:   "RegexTester",
    category:    "tester",
    subcategory: "regex",
    tags: [
      "regex", "regular expression", "tester", "matcher", "debugger",
      "javascript regex", "flags", "capture groups", "named groups",
      "regex online", "regexp tester", "regex validator",
    ],
    status:   "stable",
    featured: true,
    addedAt:  "2025-01-01",
    seo: {
      title:       "Regex Tester Online - Real-time Regex Debugger with Group Capture",
      description: "Test JavaScript regular expressions with live match highlighting, g/i/m/s/u flag toggles, capture group breakdown, and match count.",
    },
    content: {
      intro:    "Regex Tester provides a real-time environment to write and debug JavaScript regular expressions. Enter a pattern, toggle flags, type your test string — matches highlight instantly and capture groups are broken down by index and name.",
      usage:    "Enter your pattern in the regex field. Toggle flags (g, i, m, s, u) using the buttons. Type or paste your test string. The Groups panel shows each capture group's value. Match count updates as you type.",
      example:  "Pattern: (\\w+)@([\\w.]+)\nFlags:   gi\nTest:    Contact: hello@aistacker.dev or support@example.com\n\nMatches: 2\nGroup 1: hello, support\nGroup 2: aistacker.dev, example.com",
      useCases: "1. Validating email, phone, and URL formats before writing code.\n2. Extracting structured data from server logs and API responses.\n3. Building find-and-replace patterns for code editors.\n4. Learning and experimenting with JavaScript regex syntax.\n5. Debugging regex that works in one language but not another.",
      faq: [
        { q: "Which regex engine is used?",          a: "The standard JavaScript RegExp engine — patterns behave identically to what you'd use in Node.js, Chrome DevTools, or any JS runtime." },
        { q: "Why is my pattern causing the page to hang?", a: "Some patterns cause catastrophic backtracking (e.g., (a+)+). The tester catches RegExp errors but cannot prevent all infinite loops — if it hangs, refresh the page." },
        { q: "How do I use named capture groups?",   a: "Use (?<name>pattern) syntax. Named groups appear in the Groups panel with their names alongside index-based groups." },
      ],
    },
    problems: [
      "How to test a regex pattern online",
      "How to extract email addresses with regex",
      "How to use capture groups in JavaScript",
      "How to match multiple lines with regex",
      "What does the g flag do in regex",
      "How to use named capture groups",
      "How to count regex matches",
    ],
    workflow: {
      before: [],
      after:  ["url-encode"],
    },
    searchIntents: {
      informational: ["how does regex work", "regex flags explained", "what are capture groups regex"],
      navigational:  ["regex tester online", "regex debugger", "javascript regex tester"],
      transactional: ["test regex online free", "regex validator javascript", "online regex matcher"],
    },
    i18n: {
      ja: {
        name:        "正規表現テスター",
        description: "リアルタイムマッチングでJavaScriptの正規表現をテスト・デバッグ。",
        seo: {
          title:       "正規表現テスター - リアルタイムデバッガー | AIStacker",
          description: "JavaScriptの正規表現をオンラインでテスト。フラグ切替・キャプチャグループ・マッチ数表示に対応。",
        },
      },
      zh: {
        name:        "正则表达式测试器",
        description: "实时测试 JavaScript 正则表达式，支持标志切换和捕获组分解。",
        seo: {
          title:       "正则表达式测试器 - 实时在线调试 | AIStacker",
          description: "在线测试 JavaScript 正则表达式，支持 g/i/m/s/u 标志、捕获组和匹配计数。",
        },
      },
    },
  },

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
        { q: "Does it support milliseconds?",     a: "Yes. The converter detects 10-digit inputs as seconds and 13-digit inputs as milliseconds automatically." },
        { q: "Which timezone is 'Local Time'?",   a: "Local time reflects the timezone of your browser and operating system." },
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
    workflow: {
      before: [],
      after:  ["json-formatter"],
    },
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

  {
    slug:        "url-encode",
    name:        "URL Encoder",
    description: "Percent-encode strings for safe use in URLs and query parameters.",
    component:   "UrlEncoder",
    category:    "encoder",
    subcategory: "url",
    tags: [
      "url", "encoder", "percent-encode", "uri", "query-string",
      "url escape", "url safe", "encodeURIComponent",
      "percent encoding", "url encode spaces", "special characters url",
    ],
    status:   "stable",
    featured: false,
    addedAt:  "2025-01-01",
    seo: {
      title:       "URL Encoder Online - Percent-Encode URI Components Free",
      description: "Percent-encode strings for safe use in URLs, query parameters, and API paths. Handles Unicode, spaces, and special characters.",
    },
    content: {
      intro:    "URL encoding (percent-encoding) replaces characters that are unsafe in URLs with a % sign followed by two hex digits. It is required when embedding user input, special characters, or non-ASCII text in a URL.",
      usage:    "Paste any text into the input and click Encode. The output is safe to use in any URL context. Use URL Decoder to reverse the process.",
      example:  "Input:  hello world? price=€10 & lang=日本語\nOutput: hello%20world%3F%20price%3D%E2%82%AC10%20%26%20lang%3D%E6%97%A5%E6%9C%AC%E8%AA%9E",
      useCases: "1. Building query strings for GET requests with special characters.\n2. Encoding file paths for REST API endpoints.\n3. Preparing form data before manual submission.\n4. Encoding redirect URLs in OAuth flows.",
      faq: [
        { q: "What is the difference between encodeURI and encodeURIComponent?", a: "encodeURI encodes a full URL and preserves characters like / ? = &. encodeURIComponent (what this tool uses) encodes everything except letters, digits, and - _ . ! ~ * ' ( ) — use it for individual parameter values." },
        { q: "Why is space encoded as %20 and not +?",                           a: "%20 is the standard percent-encoding for space in URI components. The + notation is only valid in application/x-www-form-urlencoded (HTML form POST bodies)." },
      ],
    },
    problems: [
      "How to URL encode a string online",
      "How to encode spaces in a URL",
      "How to encode special characters in query parameters",
      "How to percent-encode a URL",
      "How to encode a redirect URL in OAuth",
      "Difference between %20 and + in URLs",
    ],
    workflow: {
      before: ["json-formatter"],
      after:  ["url-decode"],
    },
    searchIntents: {
      informational: ["what is url encoding", "percent encoding explained", "url encode vs escape"],
      navigational:  ["url encoder online", "percent encoder free", "uri encoder tool"],
      transactional: ["url encode string online", "encode url parameters free", "percent encode online"],
    },
    i18n: {
      ja: {
        name:        "URL エンコーダー",
        description: "URL・クエリパラメータに使用するための文字列をパーセントエンコードします。",
        seo: {
          title:       "URL エンコーダー - パーセントエンコーディング | AIStacker",
          description: "URL・APIパスに使えるよう文字列をパーセントエンコード。Unicode・日本語・特殊文字対応。",
        },
      },
      zh: {
        name:        "URL 编码工具",
        description: "将字符串进行百分比编码，安全用于 URL 和查询参数。",
        seo: {
          title:       "URL 编码工具 - 在线百分比编码 | AIStacker",
          description: "将字符串编码为 URL 安全格式，处理中文、空格和特殊字符。完全在浏览器本地处理。",
        },
      },
    },
  },

  {
    slug:        "url-decode",
    name:        "URL Decoder",
    description: "Decode percent-encoded URL strings back to human-readable plain text.",
    component:   "UrlDecoder",
    category:    "encoder",
    subcategory: "url",
    tags: [
      "url", "decoder", "percent-decode", "uri", "query-string",
      "url unescape", "decode url", "decodeURIComponent",
      "percent decoding", "url decode spaces", "decode encoded url",
    ],
    status:   "stable",
    featured: false,
    addedAt:  "2025-01-01",
    seo: {
      title:       "URL Decoder Online - Decode Percent-Encoded URI Components Free",
      description: "Decode percent-encoded URL strings back to readable text instantly. Handles double-encoding, Unicode, and full query strings.",
    },
    content: {
      intro:    "URL decoding reverses percent-encoding, converting sequences like %20 back to spaces and %E6%97%A5 back to 日. It is commonly needed when reading URL parameters from logs, analyzing redirects, or inspecting OAuth flows.",
      usage:    "Paste a percent-encoded URL or query string. Click Decode to see the original text. If the string was double-encoded, click Decode again to strip the second layer.",
      example:  "Input:  hello%20world%3F%20lang%3D%E6%97%A5%E6%9C%AC%E8%AA%9E\nOutput: hello world? lang=日本語\n\nDouble-encoded:\nInput:  hello%2520world\nFirst:  hello%20world\nSecond: hello world",
      useCases: "1. Reading URL parameters from access logs and analytics dashboards.\n2. Debugging encoded redirect chains in OAuth and SSO flows.\n3. Extracting readable data from encoded API webhook payloads.\n4. Reverse-engineering encoded tracking parameters.",
      faq: [
        { q: "What is double-encoding?",          a: "When an already-encoded string gets encoded again — %20 becomes %2520. Click Decode twice to fully decode a double-encoded string." },
        { q: "Can it decode a full URL at once?",  a: "Yes. Paste the entire URL including the domain and query string — only the encoded components will be decoded, not the structural characters (/, ?, &, =)." },
      ],
    },
    problems: [
      "How to decode a URL encoded string",
      "How to read percent-encoded text",
      "How to decode %20 in a URL",
      "How to decode double-encoded URLs",
      "How to read encoded query parameters from logs",
      "How to decode a URL redirect",
    ],
    workflow: {
      before: ["url-encode"],
      after:  ["json-formatter", "base64-encode"],
    },
    searchIntents: {
      informational: ["what is url decoding", "how to read percent encoded url", "%20 meaning in url"],
      navigational:  ["url decoder online", "percent decoder free", "uri decoder tool"],
      transactional: ["decode url online", "url decode free", "percent decode string"],
    },
    i18n: {
      ja: {
        name:        "URL デコーダー",
        description: "パーセントエンコードされたURL文字列を読みやすいテキストにデコードします。",
        seo: {
          title:       "URL デコーダー - パーセントエンコード解除 | AIStacker",
          description: "URLエンコードされた文字列を元のテキストに復元。二重エンコード・日本語対応。",
        },
      },
      zh: {
        name:        "URL 解码工具",
        description: "将百分比编码的 URL 字符串解码为可读文本。",
        seo: {
          title:       "URL 解码工具 - 在线百分比解码 | AIStacker",
          description: "将 URL 编码字符串解码为可读文本，支持中文、双重编码和完整 URL 解析。",
        },
      },
    },
  },

{
  "slug": "jwt-decoder",
  "name": "JWT Decoder",
  "description": "Decode and inspect JWT tokens instantly.",
  "component": "JwtDecoder",
  "category": "crypto",
  "subcategory": "jwt",
  "tags": [
    "jwt",
    "json web token",
    "decoder",
    "inspector",
    "security",
    "authentication",
    "token",
    "base64url",
    "expiry",
    "validation",
    "troubleshooting"
  ],
  "status": "stable",
  "featured": false,
  "addedAt": "2026-03-20",
  "seo": {
    "title": "JWT Decoder - Decode & Inspect JSON Web Tokens",
    "description": "Instantly decode JWT tokens to inspect their header, payload, and expiry status. Copy sections, validate structure, and troubleshoot JWTs with ease."
  },
  "content": {
    "intro": "The JWT Decoder is a simple yet powerful online tool designed to help developers and security professionals quickly understand the contents of a JSON Web Token (JWT). By simply pasting a token, you can instantly see its decoded header and payload, along with crucial expiry information. This tool simplifies debugging and validation of JWTs in various applications.",
    "usage": "Paste your full JWT string into the input field. The tool automatically decodes the header and payload using Base64URL decoding and displays them as formatted JSON. You can copy each decoded section individually, check the token’s expiry status, and validate whether the structure follows the standard three-part JWT format.",
    "example": "Input:\neyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjI1MjQ2MDgwMDB9.someSignatureHere\n\nOutput (Decoded Header):\n{\n  \"alg\": \"HS256\",\n  \"typ\": \"JWT\"\n}\n\nOutput (Decoded Payload):\n{\n  \"sub\": \"1234567890\",\n  \"name\": \"John Doe\",\n  \"iat\": 1516239022,\n  \"exp\": 2524608000\n}\n\nOutput (Expiry Status):\nValid (Expires in X days) — Expires at Dec 31, 2049, 12:00 AM",
    "useCases": "1. Debugging authentication issues by inspecting token contents.\n2. Validating claims and metadata generated by identity providers.\n3. Checking token expiration to understand validity windows.\n4. Analyzing JWT structure during security audits.\n5. Extracting user information (e.g., user ID, roles) from a token.\n6. Learning JWT structure by observing decoded components.",
    "faq": [
      {
        "q": "What is a JWT?",
        "a": "A JWT (JSON Web Token) is a compact, URL-safe means of representing claims between two parties. It consists of a header, a payload, and a signature, separated by dots."
      },
      {
        "q": "Is this tool safe for sensitive JWTs?",
        "a": "Yes. All decoding happens entirely in your browser using client-side JavaScript. Your token is never transmitted to any server. For highly sensitive production tokens, consider using offline tools within your trusted environment."
      },
      {
        "q": "Why do I get an \"Invalid JWT format\" error?",
        "a": "This error appears when the input does not contain exactly three dot-separated parts (header.payload.signature), or when the header/payload sections are not valid Base64URL-encoded strings."
      },
      {
        "q": "Does this tool verify the signature?",
        "a": "No. This tool focuses on decoding and structural inspection only. Signature verification requires the secret or public key and should be performed within your application or security environment."
      }
    ]
  },
  "problems": [
    "How to decode a JWT token",
    "How to inspect JWT header and payload",
    "How to check JWT expiration",
    "How to validate JWT structure",
    "How to troubleshoot authentication issues with JWT",
    "How to understand Base64URL decoding"
  ],
  "workflow": {
    "before": ["base64-decode", "url-decode"],
    "after": ["jwt-verify", "base64-encode"]
  },
  "searchIntents": {
    "informational": [
      "what is jwt",
      "jwt structure explained",
      "how jwt works"
    ],
    "navigational": [
      "jwt decoder online",
      "decode jwt token",
      "jwt inspector"
    ],
    "transactional": [
      "decode jwt free",
      "online jwt decoder",
      "jwt token viewer"
    ]
  },
  "i18n": {
    "ja": {
      "name": "JWT デコーダー",
      "description": "JWTトークンを即座にデコードして内容を確認できます。",
      "seo": {
        "title": "JWTデコーダー - 無料オンラインツール | AIStacker",
        "description": "JWTのヘッダー・ペイロードを瞬時にデコードし、有効期限も確認できます。すべてブラウザ内で処理され、データは外部に送信されません。"
      }
    },
    "zh": {
      "name": "JWT 解码工具",
      "description": "即时解码并查看 JWT Token 的内容，完全本地处理。",
      "seo": {
        "title": "JWT 解码工具 - 免费在线 | AIStacker",
        "description": "粘贴 JWT 即可立即查看解码后的 Header、Payload 和过期状态。所有处理均在浏览器本地完成，数据不会上传。"
      }
    }
  }
},
{
  "slug": "markdown-preview",
  "name": "Markdown Preview",
  "description": "Write Markdown on the left and see the live rendered HTML preview on the right.",
  "component": "MarkdownPreview",
  "category": "formatter",
  "subcategory": "markdown",
  "tags": [
    "markdown",
    "preview",
    "renderer",
    "live preview",
    "markdown editor",
    "html preview",
    "md to html",
    "markdown formatting",
    "markdown cheatsheet",
    "markdown viewer"
  ],
  "status": "stable",
  "featured": false,
  "addedAt": "2026-03-20",
  "seo": {
    "title": "Markdown Preview - Live Markdown to HTML Renderer",
    "description": "Write Markdown on the left and see the live rendered HTML preview on the right. Supports headings, lists, code blocks, tables, and more."
  },
  "content": {
    "intro": "Markdown Preview is a fast, lightweight tool that renders Markdown into clean HTML in real time. As you type Markdown on the left, the right panel instantly updates with the formatted output. This makes it ideal for writing documentation, README files, blog posts, and technical notes.",
    "usage": "Type or paste Markdown into the editor on the left. The preview panel on the right updates automatically as you write. Use Markdown syntax such as headings, lists, code blocks, tables, and inline formatting. You can copy the rendered HTML or continue editing until you're satisfied.",
    "example": "Input (Markdown):\n# Hello World\nThis is **Markdown**.\n\n- Item 1\n- Item 2\n\n```js\nconsole.log(\"Hello Markdown\");\n```\n\nOutput (Rendered HTML):\n<h1>Hello World</h1>\n<p>This is <strong>Markdown</strong>.</p>\n<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n</ul>\n<pre><code class=\"language-js\">console.log(\"Hello Markdown\");\n</code></pre>",
    "useCases": "1. Writing README.md files for GitHub projects.\n2. Drafting documentation or technical notes with instant formatting.\n3. Previewing Markdown before publishing to blogs or CMS platforms.\n4. Learning Markdown syntax through real-time visual feedback.\n5. Converting Markdown into clean HTML for embedding in websites.\n6. Quickly testing Markdown features such as tables, code blocks, and inline formatting.",
    "faq": [
      {
        "q": "What is Markdown?",
        "a": "Markdown is a lightweight markup language that uses plain text formatting to create structured documents. It is widely used for documentation, README files, and technical writing."
      },
      {
        "q": "Does this tool support GitHub Flavored Markdown?",
        "a": "Yes. Most common GitHub Flavored Markdown features such as tables, fenced code blocks, and task lists are supported."
      },
      {
        "q": "Is my Markdown or HTML sent to a server?",
        "a": "No. All rendering happens entirely in your browser. Nothing is uploaded or stored."
      },
      {
        "q": "Can I copy the rendered HTML?",
        "a": "Yes. You can copy the generated HTML output directly from the preview panel."
      }
    ]
  },
  "problems": [
    "How to preview Markdown online",
    "How to convert Markdown to HTML",
    "How to write Markdown with live preview",
    "How to test Markdown formatting",
    "How to render Markdown code blocks",
    "How to check Markdown before publishing"
  ],
  "workflow": {
    "before": ["markdown-lint", "url-decode"],
    "after": ["html-minify", "markdown-export"]
  },
  "searchIntents": {
    "informational": [
      "what is markdown",
      "markdown syntax guide",
      "how markdown works"
    ],
    "navigational": [
      "markdown preview online",
      "markdown live editor",
      "markdown renderer"
    ],
    "transactional": [
      "preview markdown free",
      "markdown to html online",
      "markdown editor no install"
    ]
  },
  "i18n": {
    "ja": {
      "name": "Markdown プレビュー",
      "description": "左側にMarkdownを書き、右側でHTMLとしてライブプレビューできます。",
      "seo": {
        "title": "Markdown プレビュー - 無料オンラインツール | AIStacker",
        "description": "Markdownを入力すると、右側に即座にHTMLとしてレンダリング。README作成やドキュメント作成に最適。すべてブラウザ内で処理されます。"
      }
    },
    "zh": {
      "name": "Markdown 预览工具",
      "description": "在左侧编写 Markdown，并在右侧实时查看渲染后的 HTML。",
      "seo": {
        "title": "Markdown 预览工具 - 免费在线 | AIStacker",
        "description": "输入 Markdown 即可实时预览 HTML 渲染效果。适用于文档、README、博客草稿等，所有处理均在浏览器本地完成。"
      }
    }
  }
},

{
  "slug": "ninja-text-count",
  "name": "Ninja Text Counter",
  "description": "An advanced text counter that allows you to accurately count the number of kanji, hiragana, katakana, and total characters in a piece of text. The interface is modern and optimized for mobile devices.",
  "component": "NinjaTextCount",
  "category": "text",
  "subcategory": "counter",
  "tags": [
    "japanese",
    "text-counter",
    "kanji",
    "hiragana",
    "katakana",
    "character-count",
    "unicode",
    "language-tools",
    "japanese-analysis",
    "text-analyzer"
  ],
  "status": "stable",
  "featured": false,
  "addedAt": "2026-03-21",
  "seo": {
    "title": "Ninja Text Counter - Count Kanji, Hiragana & Katakana Characters Online",
    "description": "Accurately count kanji, hiragana, katakana, and total characters in Japanese text. Modern interface, real-time updates, export options. 100% private — runs in your browser."
  },
  "content": {
    "intro": "The Ninja Text Counter is a specialized tool for linguists, educators, developers, and learners working with Japanese text. It provides precise counts of kanji, hiragana, katakana, and other characters, helping you analyze text composition instantly. Unlike basic counters, it handles mixed-language input, excludes spaces, and accurately identifies Unicode ranges used in Japanese writing.",
    "usage": "Paste or type your Japanese text into the input area. Counts update in real time. Use the export buttons to download results as CSV or JSON. Press Ctrl/Cmd+Enter for quick CSV export. Clear the text anytime using the reset button.",
    "example": "// Input (mixed Japanese/English):\nこんにちは、世界！ Hello, World! 価格は€10です。\n\n// Counts:\nKanji: 4 (世, 界, 価, 格)\nHiragana: 5 (こ, ん, に, ち, は)\nKatakana: 0\nOther: 18 (spaces, punctuation, English, symbols, etc.)\nTotal (non-space): 27",
    "useCases": "1. Analyzing Japanese literature or documents for character distribution.\n2. Validating text for language-learning apps, textbooks, or JLPT study materials.\n3. Debugging multilingual content in web or mobile applications.\n4. Counting characters for social media posts, messaging limits, or UI constraints.\n5. Researching linguistic patterns in Japanese corpora or academic studies.\n6. Ensuring proper script usage in localization and translation workflows.",
    "faq": [
      {
        "q": "Does it support mixed languages?",
        "a": "Yes. It counts only Japanese characters for kanji, hiragana, and katakana. Everything else—including English, numbers, punctuation, and symbols—is grouped under 'Other'."
      },
      {
        "q": "Is my text data secure?",
        "a": "Yes. All processing happens entirely in your browser using JavaScript. No text is ever uploaded or stored."
      },
      {
        "q": "What Unicode ranges does it cover?",
        "a": "Kanji: CJK Unified Ideographs (4E00–9FAF, 3400–4DBF). Hiragana: 3040–309F. Katakana: 30A0–30FF. The tool accurately handles standard Japanese text."
      },
      {
        "q": "Can it count spaces or punctuation?",
        "a": "Spaces are excluded from the total count. Punctuation and symbols are included in the 'Other' category unless they belong to Japanese-specific ranges."
      },
      {
        "q": "Does it support emoji?",
        "a": "Yes. Emoji are counted under the 'Other' category since they fall outside Japanese script ranges."
      }
    ]
  },
  "problems": [
    "How to count kanji characters in text",
    "How to count hiragana and katakana",
    "How to analyze Japanese text composition",
    "How to count characters excluding spaces",
    "How to detect Japanese Unicode ranges",
    "How to analyze multilingual text"
  ],
  "workflow": {
    "before": ["unicode-normalize", "text-clean"],
    "after": ["csv-export", "json-export"]
  },
  "searchIntents": {
    "informational": [
      "how to count kanji",
      "japanese unicode ranges",
      "hiragana vs katakana differences"
    ],
    "navigational": [
      "japanese text counter",
      "kanji counter online",
      "hiragana katakana counter"
    ],
    "transactional": [
      "count japanese characters online",
      "text counter free",
      "kanji hiragana katakana analyzer"
    ]
  },
  "i18n": {
    "ja": {
      "name": "Ninja 文字カウンター",
      "description": "漢字・ひらがな・カタカナ・その他文字を正確にカウントできる日本語専用ツール。モバイル最適化・リアルタイム更新対応。",
      "seo": {
        "title": "Ninja 文字カウンター - 漢字・ひらがな・カタカナを正確にカウント | AIStacker",
        "description": "日本語テキストの漢字・ひらがな・カタカナ・その他文字を瞬時にカウント。完全ブラウザ処理で安全。CSV/JSONエクスポート対応。"
      }
    },
    "zh": {
      "name": "Ninja 日文字符统计工具",
      "description": "精确统计日文中的汉字、平假名、片假名及其他字符。界面现代、移动端友好、实时更新。",
      "seo": {
        "title": "Ninja 日文字符统计工具 - 在线统计汉字/平假名/片假名 | AIStacker",
        "description": "即时统计日文文本中的汉字、平假名、片假名和其他字符。完全本地处理，支持 CSV/JSON 导出。"
      }
    }
  }
},
{
    slug:        "hash-generator",
    name:        "Hash Generator",
    description: "Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from any text — updates live as you type.",
    component:   "HashGenerator",
    category:    "crypto",
    subcategory: "hash",
    tags: [
      "hash", "md5", "sha-256", "sha-512", "sha-1",
      "checksum", "crypto", "digest", "hashing",
      "generate hash online", "md5 hash generator", "sha256 online",
    ],
    status:   "new",
    featured: false,
    addedAt:  "2025-03-20",
    seo: {
      title:       "Hash Generator Online - MD5, SHA-1, SHA-256, SHA-512",
      description: "Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from any text. All four hashes shown simultaneously, live update as you type.",
    },
    content: {
      intro:    "Cryptographic hash functions produce a fixed-length digest from any input. This tool computes MD5, SHA-1, SHA-256, and SHA-512 hashes simultaneously, updating live as you type using the browser's built-in Web Crypto API.",
      usage:    "Type or paste your text in the input field. All four hash values update immediately. Click Copy next to any hash to copy just that value, or Copy All to copy all four.",
      example:  "Input: Hello, World!\n\nMD5:    65a8e27d8879283831b664bd8b7f0ad4\nSHA-1:  0a0a9f2a6772942557ab5355d76af442f8f65e01\nSHA-256:dffd6021bb2bd5b0af676290809ec3a53191dd81c7f70a4b28688a362182986d\nSHA-512:374d794a95cdcfd8b35993185fef9ba368f160d8daf432d08ba9f1ed1e5abe6c...",
      useCases: "1. Verifying file integrity by comparing checksums.\n2. Generating content-addressable identifiers for caching.\n3. Creating test data with known hash values.\n4. Understanding which hashing algorithm a system is using.",
      faq: [
        { q: "Which algorithm should I use?",                  a: "Use SHA-256 or SHA-512 for new applications. MD5 and SHA-1 are cryptographically broken — avoid them for security purposes, though they're still useful for checksums." },
        { q: "Is hashing the same as encryption?",             a: "No. Hashing is one-way — you cannot reverse a hash back to the original input. Encryption is two-way with a key." },
        { q: "Why does the same input always produce the same hash?", a: "Hash functions are deterministic. This is the property that makes them useful for checksums and content addressing." },
      ],
    },
    problems: [
      "How to generate an MD5 hash online",
      "How to generate a SHA-256 hash",
      "How to verify file integrity with a checksum",
      "What is the difference between MD5 and SHA-256",
      "How to hash a string in the browser",
      "How to generate all hash types at once",
    ],
    workflow: { before: [], after: [] },
    searchIntents: {
      informational: ["what is md5 hash", "sha256 vs sha512", "how does hashing work"],
      navigational:  ["md5 hash generator online", "sha256 hash generator", "online hash calculator"],
      transactional: ["generate md5 hash free", "sha256 hash string online", "hash text online"],
    },
    i18n: {
      ja: {
        name:        "ハッシュ生成ツール",
        description: "MD5・SHA-1・SHA-256・SHA-512のハッシュ値をリアルタイムで生成します。",
        seo: {
          title:       "ハッシュ生成ツール - MD5・SHA-256・SHA-512 | AIStacker",
          description: "テキストのMD5・SHA-1・SHA-256・SHA-512ハッシュを同時生成。入力と同時にリアルタイム更新。",
        },
      },
      zh: {
        name:        "哈希生成器",
        description: "实时生成 MD5、SHA-1、SHA-256 和 SHA-512 哈希值，输入即更新。",
        seo: {
          title:       "哈希生成器 - MD5/SHA-256/SHA-512 在线计算 | AIStacker",
          description: "同时生成 MD5、SHA-1、SHA-256 和 SHA-512 哈希值，实时更新。使用浏览器 Web Crypto API，数据不会上传。",
        },
      },
    },
  },
  {
    "slug": "color-converter",
    "name": "Color Converter",
    "description": "Convert colors between HEX, RGB, and HSL formats instantly with live preview and contrast checking.",
    "component": "ColorConverter",
    "category": "generator",
    "subcategory": "design",
    "tags": [
      "color converter", "hex to rgb", "rgb to hsl", "hex to hsl", "color picker",
      "web design tool", "css color", "frontend utility", "color palette",
      "convert hex online", "rgb to hex converter", "hsl color picker"
    ],
    "status": "new",
    "featured": true,
    "addedAt": "2026-03-24",
    "seo": {
      "title": "Color Converter Online - HEX, RGB, HSL Conversion Tool",
      "description": "The ultimate color conversion tool. Instantly convert HEX to RGB and HSL. Includes live color preview, dark/light mode detection, and one-click copy."
    },
    "content": {
      "intro": "Colors on the web are typically represented in three main formats: HEX (hexadecimal), RGB (Red, Green, Blue), and HSL (Hue, Saturation, Lightness). This tool provides a seamless way to switch between these formats while maintaining visual accuracy.",
      "usage": "Enter a hex color code (e.g., #6366f1) in the input field or use the color picker to select a custom shade. The RGB and HSL values will update in real-time. Use the copy button next to each value to use it in your CSS or design software.",
      "example": "Input: #6366f1\n\nRGB: rgb(99, 102, 241)\nHSL: hsl(239°, 84%, 67%)\nPreview: A vibrant indigo shade perfect for primary buttons.",
      "useCases": "1. Converting design specs (Figma/Sketch) into CSS-ready RGB or HSL values.\n2. Checking if a color is 'dark' or 'light' for optimal text contrast.\n3. Experimenting with different shades using the random color generator.\n4. Quick color picking for frontend development and UI prototyping.",
      "faq": [
        { "q": "Does this support 3-digit hex codes?", "a": "Yes. Short hex codes like #F00 are automatically expanded to their full 6-digit equivalent (#FF0000) during conversion." },
        { "q": "What is the difference between RGB and HSL?", "a": "RGB is based on how screens emit light (Red, Green, Blue), while HSL is more intuitive for humans, describing color by its hue, richness (saturation), and brightness (lightness)." },
        { "q": "Is the conversion accurate?", "a": "Absolutely. The tool uses standard mathematical formulas for color space conversion to ensure the values remain consistent across all formats." }
      ]
    },
    "problems": [
      "How to convert hex to rgb in css",
      "How to find hsl value of a color",
      "Convert rgb to hex online",
      "Best way to pick web colors",
      "How to check color contrast",
      "Online color format switcher"
    ],
    "workflow": { "before": ["image-color-picker"], "after": ["css-gradient-generator"] },
    "searchIntents": {
      "informational": ["how hex colors work", "difference between rgb and hsl", "css color formats explained"],
      "navigational": ["color converter online", "hex to rgb tool", "color picker tool"],
      "transactional": ["convert hex to hsl free", "copy rgb values online", "generate random hex color"]
    },
    "i18n": {
      "ja": {
        "name": "カラーコンバーター",
        "description": "HEX、RGB、HSL形式の間で色を即座に変換し、ライブプレビューとコントラスト確認が可能です。",
        "seo": {
          "title": "カラーコンバーター - HEX/RGB/HSL オンライン変換ツール | AIStacker",
          "description": "HEXをRGBやHSLに瞬時に変換。ライブプレビュー、ダーク/ライトモード判定、ワンクリックコピー機能を搭載。"
        }
      },
      "zh": {
        "name": "颜色转换器",
        "description": "在 HEX、RGB 和 HSL 格式之间即时转换颜色，支持实时预览和对比度检测。",
        "seo": {
          "title": "在线颜色转换器 - HEX, RGB, HSL 互转工具 | AIStacker",
          "description": "终极颜色转换工具。支持 HEX 转 RGB 和 HSL，提供实时颜色预览、深浅色检测及一键复制功能。"
        }
      }
    }
  },

  {
  "slug": "js-minifier-terser",
  "name": "JS Minifier",
  "description": "Enterprise-grade professional JavaScript compression tool powered by Terser Engine. Supports ES6+, variable mangling, and dead code elimination for production builds.",
  "component": "JsMinifier",
  "category": "tester",
  "subcategory": "javascript",
  "tags": [
    "terser online", "js minifier production", "javascript obfuscator",
    "es6 minifier", "mangle js online", "minify js terser", "uglify es",
    "remove console logs online", "compress js for vite", "webpack minifier"
  ],
  "status": "stable",
  "featured": true,
  "addedAt": "2026-03-25",
  "seo": {
    "title": "Terser Online - Professional JavaScript Minification & Obfuscation",
    "description": "Compress JavaScript with the industry-standard Terser engine. Supports ES6+, variable mangling, and removal of console logs. 100% secure, browser-side optimization."
  },
  "content": {
    "intro": "Terser is the gold standard for JavaScript minification, used by Vite, Webpack, and Next.js. Unlike simple regex minifiers, Terser parses your code into an Abstract Syntax Tree (AST), enabling advanced optimizations like constant folding and dead code elimination.",
    "usage": "Paste your code, select optimization flags like 'Mangle' to shrink variable names or 'Drop Console' to clean up debugging logs, then click 'Run Optimizer'. The engine will output high-performance, minified code suitable for production environments.",
    "example": "Input:\nconst secret = '123';\nconsole.log(secret);\n\nOutput (Mangle ON, Drop Console ON):\nconst a='123';",
    "useCases": "1. Compressing individual JS assets for small-scale projects.\n2. Obfuscating proprietary logic to prevent easy reverse engineering.\n3. Stripping debugging code (console.logs) before production releases.\n4. Quick testing of how specific Terser configurations affect your bundle size.",
    "faq": [
      { "q": "Is Mangle safe?", "a": "Yes. Mangle safely renames variables to single letters to save space. It avoids renaming global variables unless explicitly configured otherwise." },
      { "q": "Does this support ES6?", "a": "Absolutely. This tool supports modern JavaScript syntax including arrow functions, classes, and async/await." },
      { "q": "Why use Terser over simple compressors?", "a": "Terser performs deep analysis of your logic, removing code that is never reached and optimizing variable scopes, leading to much smaller and faster files." }
    ]
  },
  "problems": [
    "How to minify es6 javascript online",
    "Online terser minifier with mangle",
    "Remove console logs from js for production",
    "How to obfuscate javascript variables safely",
    "Best online tool for production js compression"
  ],
  "workflow": { "before": ["js-formatter", "babel-transpiler"], "after": ["gzip-tester", "subresource-integrity-generator"] },
  "searchIntents": {
    "informational": ["what is terser engine", "how mangle works in js", "dead code elimination explained"],
    "navigational": ["terser online tool", "js minifier pro", "minify js using terser"],
    "transactional": ["compress js for production", "obfuscate javascript online", "shrink js bundle size"]
  },
  "i18n": {
    "ja": {
      "name": "プロフェッショナル JS ミニファイア (Terser)",
      "description": "Terserエンジンを搭載した企業レベルのJS圧縮ツール。ES6+対応、変数難読化、デッドコード削除をブラウザ上で実行。",
      "seo": {
        "title": "Terser オンライン - 高度なJavaScript圧縮と難読化 | AIStacker",
        "description": "ViteやWebpackでも採用されているTerserでJSを最適化。ES6+、変数難読化、console.log削除に対応。"
      }
    },
    "zh": {
      "name": "专业级 JS 压缩器",
      "description": "基于业界标准的 Terser 引擎，支持 ES6+、变量混淆、移除 Console 及无用代码剔除，专为生产环境构建。",
      "seo": {
        "title": "Terser 在线压缩 - 专业 JavaScript 混淆与优化工具 | AIStacker",
        "description": "使用业界首选的 Terser 引擎在线压缩 JS。支持变量混淆、移除调试代码，完全本地处理，安全可靠。"
      }
    }
  }
},
{
  "slug": "danmaku-to-ass-converter",
  "name": "Danmaku(XML) to ASS Converter",
  "description": "High-performance XML to ASS subtitle converter. Transform Bilibili/AcFun danmaku into high-quality, collision-free subtitles for Potplayer, IINA, VLC, and Movist.",
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
      "name": "Danmaku2ASS 変換器",
      "description": "BilibiliなどのXML弾幕を高品質なASS字幕に変換。 PotplayerやIINA、VLCなどで、重なりのないスムーズな弾幕再生を実現します。",
      "seo": {
        "title": "Danmaku2ASS オンライン - XML弾幕を高品質なASS字幕へ変換 | AIStacker",
        "description": "BilibiliのXML弾幕をASS形式に変換。スマートな衝突回避アルゴリズムを搭載し、ブラウザ上で安全かつ高速に処理します。"
      }
    },
    "zh": {
      "name": "弹幕 XML 转 ASS 工具 (Danmaku2ASS)",
      "description": "高性能 XML 弹幕转 ASS 字幕工具。支持 B 站弹幕转换，内置智能防碰撞算法，完美适配  Potplayer、IINA、VLC 及 Movist。",
      "seo": {
        "title": "Danmaku2ASS 在线转换 - B 站 XML 弹幕转 ASS 字幕工具 | AIStacker",
        "description": "在线将 B 站 XML 弹幕转换为 ASS 格式。支持智能防重叠、自定义字号与透明度，纯本地转换，保护隐私。"
      }
    }
  }
},
{
  "slug": "number-base-converter",
  "name": "Multi-Base Number Converter",
  "description": "High-precision number system conversion tool. Instantly convert between Binary, Octal, Decimal, Hexadecimal, Base 32, and Base 36 with BigInt support.",
  "component": "NumberBaseConverter",
  "category": "converter",
  "subcategory": "math",
  "tags": [
    "binary to decimal",
    "hex to binary converter",
    "base converter online",
    "bigint converter",
    "octal to hex",
    "base 36 converter",
    "arbitrary precision conversion",
    "number system translator",
    "programming math tools"
  ],
  "status": "new",
  "featured": false,
  "addedAt": "2026-03-25",
  "seo": {
    "title": "Number Base Converter - Binary, Hex, Decimal & BigInt Support",
    "description": "Convert numbers between any base from 2 to 36. High-precision BigInt support ensures no data loss for large integers. Real-time, secure, and developer-friendly."
  },
  "content": {
    "intro": "The Multi-Base Number Converter is a reactive engine designed for developers and students. Unlike standard calculators that fail at 53-bit integers, this tool utilizes JavaScript BigInt to handle massive numbers across Binary, Octal, Decimal, Hex, and higher bases up to 36.",
    "usage": "Enter a value into any base field. All other fields will synchronize instantly. If an invalid character for a specific base is detected (e.g., 'A' in Decimal), the tool will provide immediate visual feedback.",
    "example": "Input (Hex):\n0xDEADBEEF\n\nOutput (Binary):\n11011110101011011011111011101111",
    "useCases": "1. Debugging memory addresses and flags in low-level programming.\n2. Converting UUIDs or large database IDs into different representations.\n3. Learning and practicing number system conversions for computer science.\n4. Quick hexadecimal to decimal translation for CSS or hardware offsets.",
    "faq": [
      {
        "q": "Why use BigInt for conversion?",
        "a": "Standard JavaScript numbers use 64-bit floats, which lose precision after 15-17 digits. BigInt allows for mathematically perfect conversion of integers of any size."
      },
      {
        "q": "Does it support negative numbers?",
        "a": "The current version focuses on unsigned integer representation (natural numbers). For signed conversion, standard two's complement logic can be applied to the binary output."
      },
      {
        "q": "Is '0x' required for Hexadecimal?",
        "a": "No. The tool automatically detects and strips common prefixes like '0x' or '0b' to ensure a smooth copy-paste experience."
      }
    ]
  },
  "problems": [
    "How to convert large hex to decimal without precision loss",
    "Binary to Hexadecimal converter for developers",
    "Base 36 to Decimal online tool",
    "Large integer number system converter",
    "How to represent decimal as base 32"
  ],
  "workflow": {
    "before": [
      "js-minifier-terser",
      "jwt-decoder"
    ],
    "after": [
      "unit-converter",
      "cron-job-parser"
    ]
  },
  "searchIntents": {
    "informational": [
      "how binary conversion works",
      "what is base 36 used for",
      "bigint vs number precision"
    ],
    "navigational": [
      "base converter tool",
      "binary hex translator",
      "hex to dec calculator"
    ],
    "transactional": [
      "convert binary to decimal online",
      "large number hex converter",
      "synchronous base conversion"
    ]
  },
  "i18n": {
    "ja": {
      "name": "進数変換ツール (Binary/Hex/BigInt対応)",
      "description": "高精度な進数変換エンジン。2進数、8進数、10進数、16進数、Base36間をリアルタイムで相互変換。BigInt採用で桁落ちなし。",
      "seo": {
        "title": "進数変換ツール - 2進数・16進数・10進数を高精度変換 | AIStacker",
        "description": "あらゆる基数（2〜36進数）に対応した変換ツール。BigIntのサポートにより、巨大な数値でも精度を落とさずに変換可能です。"
      }
    },
    "zh": {
      "name": "多进制转换器 (支持大数字 BigInt)",
      "description": "高性能进制转换引擎。支持二进制、八进制、十进制、十六进制及最高 36 进制实时转换，支持大数运算不丢失精度。",
      "seo": {
        "title": "在线进制转换器 - 支持二进制、十六进制及大数 BigInt 转换 | AIStacker",
        "description": "在 2 到 36 进制之间进行实时数值转换。采用 BigInt 技术，确保长数字转换无精度损失。开发者必备的高效率工具。"
      }
    }
  }
},
{
  "slug": "text-diff-checker",
  "name": "Diff Checker",
  "description": "Compare two text documents to find differences instantly. Features precise line, word, and character-level diffing with a GitHub-style unified view.",
  "component": "DiffChecker",
  "category": "formatter",
  "subcategory": "diff",
  "tags": [
    "diff checker", "text compare online", "compare strings", "git diff online",
    "find differences in text", "code compare", "difference tool",
    "line diff", "word diff", "json diff checker"
  ],
  "status": "stable",
  "featured": true,
  "addedAt": "2026-03-27",
  "seo": {
    "title": "Text Diff Checker Online - Compare Code & Text Differences",
    "description": "Instantly compare two text or code files to highlight differences. Supports line-by-line, word, and character level diffing. 100% secure, browser-side processing."
  },
  "content": {
    "intro": "The Diff Checker is a robust utility that compares the 'Original Text' and 'Modified Text' to detect modifications. Using an advanced difference algorithm, it highlights insertions in green and deletions in red, generating a unified diff view identical to what you see in GitHub or VS Code.",
    "usage": "Paste your original text into the left panel and the modified text into the right panel. Choose your preferred comparison granularity (Lines, Words, or Chars), toggle options like 'Ignore Whitespace', and click 'Compare Texts' to see the exact changes.",
    "example": "Original: 'The quick brown fox jumps over the lazy dog.'\nModified: 'The fast brown fox jumps over the lazy cat.'\nResult: The tool will highlight 'quick' and 'dog' as deletions, and 'fast' and 'cat' as additions.",
    "useCases": "1. Comparing two versions of a source code file to track undocumented changes.\n2. Reviewing edits made to an essay, article, or legal document.\n3. Checking JSON files to spot missing keys or altered values.\n4. Verifying configuration file changes before server deployment.",
    "faq": [
      { "q": "Are my files uploaded to your servers?", "a": "No. The entire comparison process is executed locally in your browser via JavaScript. Your sensitive text or code never leaves your device." },
      { "q": "What is the difference between Line, Word, and Char modes?", "a": "Line mode compares text block-by-block (best for code). Word mode isolates changes down to specific words in a sentence (best for prose). Char mode highlights exact character swaps (best for finding subtle typos)." },
      { "q": "Can it handle large files?", "a": "Yes, the JsDiff engine is highly optimized. However, comparing files with tens of thousands of lines in the browser may cause temporary UI freezing." }
    ]
  },
  "problems": [
    "How to compare two text files online",
    "Find differences between two strings",
    "Online git diff viewer",
    "Tool to see what changed in code",
    "Compare json text online"
  ],
  "workflow": { "before": ["json-formatter", "base64-decode"], "after": ["string-manipulator"] },
  "searchIntents": {
    "informational": ["how diff algorithm works", "git diff explained", "what is unified diff"],
    "navigational": ["diff checker online", "text compare tool", "code difference checker"],
    "transactional": ["compare text online free", "find text differences locally", "diff two code snippets"]
  },
  "i18n": {
    "ja": {
      "name": "差分チェッカー (Diff Checker)",
      "description": "2つのテキストの差分を瞬時に検出します。行、単語、文字レベルの正確な比較と、GitHubスタイルの差分表示に対応しています。",
      "seo": {
        "title": "差分チェッカー - テキスト・コード比較ツール | AIStacker",
        "description": "2つのテキストを比較し、追加・削除された箇所をハイライト表示。完全ブラウザ処理で安全にコードや文章の変更点を確認できます。"
      }
    },
    "zh": {
      "name": "文本差异比对 (Diff Checker)",
      "description": "即时比对两段文本或代码，精准找出差异。支持按行、按词、按字符粒度进行比对，并提供类似 GitHub 的差异高亮视图。",
      "seo": {
        "title": "在线差异比对工具 - 文本与代码比对 | AIStacker",
        "description": "在线对比两段文本或代码的不同之处。支持过滤空格与大小写，提供精准的新增与删除高亮。完全本地运算，保护您的数据隐私。"
      }
    }
  }
},
{
  "slug": "yaml-formatter",
  "name": "YAML Formatter & Validator",
  "description": "Strictly format, validate, and beautify your YAML configurations. Instantly detect syntax errors with line-level precision. Essential for Docker and Kubernetes.",
  "component": "YamlFormatter",
  "category": "formatter",
  "subcategory": "data",
  "tags": [
    "yaml formatter", "yaml validator", "check yaml syntax", "yaml to json",
    "format docker compose", "k8s yaml validator", "online yaml tool",
    "yaml prettifier", "fix yaml indentation", "strict yaml parser"
  ],
  "status": "stable",
  "featured": true,
  "addedAt": "2026-03-27",
  "seo": {
    "title": "YAML Formatter & Validator Online - Check Syntax & Beautify",
    "description": "Free online YAML formatter and validator. Fix indentation issues, check syntax errors, and format Docker Compose or Kubernetes configurations securely in your browser."
  },
  "content": {
    "intro": "YAML (YAML Ain't Markup Language) is the standard for configuration files, widely used in Docker, Kubernetes, and CI/CD pipelines. However, its strict reliance on indentation makes it prone to syntax errors. This tool uses the industry-standard `js-yaml` engine to parse, validate, and reformat your code instantly.",
    "usage": "Paste your raw YAML or JSON into the input area. Choose your preferred indentation (2 or 4 spaces) and whether to sort keys alphabetically. Click 'Format & Validate'. If there is a syntax error, the tool will highlight the exact line and column where the parsing failed.",
    "example": "Input:\nserver:\n  port: 8080\nenvironment:   production\n\nOutput (2 Spaces):\nserver:\n  port: 8080\nenvironment: production",
    "useCases": "1. Validating Kubernetes deployment files (.yaml) before applying them to a cluster.\n2. Beautifying messy or minified Docker Compose configurations.\n3. Converting standard JSON API responses into readable YAML formats.\n4. Alphabetizing massive configuration files for easier manual reading.",
    "faq": [
      { "q": "Is my YAML configuration secure?", "a": "Absolutely. Your data is parsed and formatted entirely within your browser's memory using a local JavaScript engine. We do not track or store your input." },
      { "q": "Can I convert JSON to YAML with this?", "a": "Yes. Since JSON is technically a valid subset of YAML, pasting JSON into the input will format it cleanly into YAML." },
      { "q": "Why does my YAML fail validation?", "a": "The most common YAML errors include mixing tabs and spaces for indentation, forgetting spaces after colons, or unescaped special characters in strings. The validator will point you to the exact character causing the issue." }
    ]
  },
  "problems": [
    "How to check if yaml is valid online",
    "Format kubernetes yaml file",
    "Convert json to yaml online",
    "Fix yaml indentation error",
    "Online yaml syntax checker tool"
  ],
  "workflow": { "before": ["json-formatter"], "after": ["base64-encode"] },
  "searchIntents": {
    "informational": ["why does yaml use spaces not tabs", "yaml vs json", "how to write docker compose yaml"],
    "navigational": ["yaml validator", "yaml formatter online", "js-yaml online tool"],
    "transactional": ["validate k8s yaml file", "format yaml 2 spaces", "fix yaml syntax error"]
  },
  "i18n": {
    "ja": {
      "name": "YAML フォーマッター＆バリデーター",
      "description": "YAML設定ファイルのフォーマット、構文チェック、整形を厳密に行います。DockerやKubernetesのエラー検出に最適です。",
      "seo": {
        "title": "YAML フォーマッター＆構文チェックツール | AIStacker",
        "description": "インデントの修正、構文エラーの検証、Docker/K8s設定のフォーマットをブラウザ上で安全に実行します。"
      }
    },
    "zh": {
      "name": "YAML 格式化与验证器",
      "description": "严格格式化、验证并美化您的 YAML 配置文件。精准定位语法错误到具体行与列，Docker 与 K8s 开发者的必备工具。",
      "seo": {
        "title": "YAML 格式化与在线验证工具 - 语法检查 | AIStacker",
        "description": "免费的在线 YAML 格式化工具。修复缩进问题、检查语法错误，安全高效地处理 Docker Compose 和 Kubernetes 配置文件。"
      }
    }
  }
},
{
  "slug": "csv-json-converter",
  "name": "CSV ↔ JSON Converter",
  "description": "Enterprise-grade bidirectional data converter. Instantly transform CSV to JSON, or JSON to CSV using the robust PapaParse engine. Handles large data sets safely in your browser.",
  "component": "CsvJsonConverter",
  "category": "converter",
  "subcategory": "data",
  "tags": [
    "csv to json", "json to csv", "convert csv online", "convert json to excel",
    "csv parser", "json array to csv", "papaparse online", "data converter",
    "excel to json", "format csv file"
  ],
  "status": "stable",
  "featured": true,
  "addedAt": "2026-03-27",
  "seo": {
    "title": "CSV to JSON / JSON to CSV Converter Online - Secure Data Tool",
    "description": "Bidirectional converter to seamlessly transform CSV files into structured JSON or flatten JSON arrays into CSV formats. Completely free, local browser processing."
  },
  "content": {
    "intro": "Converting tabular data (CSV) into structured data (JSON) and vice-versa is a daily task for developers, data analysts, and system administrators. This tool leverages the industry-standard `PapaParse` engine, ensuring reliable parsing even when your CSV contains complex nested quotes, line breaks within cells, or malformed rows.",
    "usage": "Select your desired conversion mode using the toggle button. Paste your data into the input pane on the left. Adjust the configuration (like treating the first row as Headers, or Pretty Printing the JSON output), then click 'Convert'. Your parsed data will instantly appear in the output pane, alongside statistical insights like record and column counts.",
    "example": "CSV Input:\nname,age\nAlice,30\n\nJSON Output:\n[\n  {\n    \"name\": \"Alice\",\n    \"age\": \"30\"\n  }\n]",
    "useCases": "1. Data Migration: Converting database exports (CSV) into JSON payloads for REST API requests.\n2. Reporting: Transforming complex JSON API responses into CSV format to be opened in Excel or Google Sheets.\n3. Configuration: Bridging the gap between legacy systems that output CSV and modern web applications that consume JSON.",
    "faq": [
      { "q": "Is my data uploaded to a server?", "a": "No. The entire parsing and unparsing process runs locally in your browser's memory using JavaScript. Your sensitive corporate or personal data remains completely private." },
      { "q": "Can it handle missing or empty fields?", "a": "Yes. The underlying PapaParse engine is configured to be 'greedy' with empty lines (skipping trailing blanks) but preserves missing cell data accurately based on your headers." },
      { "q": "What happens if my JSON is nested?", "a": "If you convert deeply nested JSON objects into CSV, the tool will attempt to flatten them or stringify nested structures. For best CSV results, provide an array of flat objects." }
    ]
  },
  "problems": [
    "How to convert csv to json object array",
    "Online tool to change json to csv",
    "Convert excel data to json format",
    "Parse complex csv with quotes online",
    "Safely convert json API response to csv"
  ],
  "workflow": { "before": ["json-formatter", "yaml-formatter"], "after": ["url-encoder"] },
  "searchIntents": {
    "informational": ["how to map csv to json", "what is papaparse", "json array vs csv"],
    "navigational": ["csv to json online", "json to csv converter", "papaparse testing tool"],
    "transactional": ["convert csv to json format securely", "export json to excel csv free", "transform database csv to json payload"]
  },
  "i18n": {
    "ja": {
      "name": "CSV ↔ JSON 変換ツール",
      "description": "企業レベルの双方向データコンバーター。堅牢なPapaParseエンジンを使用し、CSVからJSON、またはJSONからCSVへ瞬時に変換します。",
      "seo": {
        "title": "CSV ↔ JSON コンバーター | 安全なブラウザ内データ変換 | AIStacker",
        "description": "CSVファイルとJSON配列を双方向に変換する無料ツール。ExcelデータのAPIペイロード化や、APIレスポンスのCSV化に最適です。"
      }
    },
    "zh": {
      "name": "CSV ↔ JSON 双向转换器",
      "description": "企业级双向数据转换工具。基于强大的 PapaParse 引擎，支持瞬间将 CSV 转为 JSON，或将 JSON 展平为 CSV。",
      "seo": {
        "title": "CSV 转 JSON / JSON 转 CSV 在线转换器 | 纯本地处理 | AIStacker",
        "description": "免费的双向数据转换工具。轻松将 Excel/CSV 导出文件转换为 JSON 接口数据，或将 JSON 数组转为 CSV 表格。完全在浏览器端运行，确保数据隐私。"
      }
    }
  }
},



]

// ─────────────────────────────────────────────────────────────────────────────
// Utility helpers
// ─────────────────────────────────────────────────────────────────────────────

export function getToolBySlug(slug: string): ToolMeta | undefined {
  return tools.find(t => t.slug === slug)
}

export function getToolsByCategory(category: ToolCategory): ToolMeta[] {
  return tools.filter(t => t.category === category)
}

export function getToolsBySubcategory(sub: ToolSubcategory): ToolMeta[] {
  return tools.filter(t => t.subcategory === sub)
}

export function getCategories(): ToolCategory[] {
  return [...new Set(tools.map(t => t.category))].sort() as ToolCategory[]
}

export function getFeaturedTools(): ToolMeta[] {
  return tools.filter(t => t.featured)
}

export function isNewTool(tool: ToolMeta, withinDays = 30): boolean {
  return Date.now() - new Date(tool.addedAt).getTime() < withinDays * 86_400_000
}

/** Score-based related tools: workflow graph > same subcategory > shared tags */
export function getRelatedTools(tool: ToolMeta, limit = 6): ToolMeta[] {
  const workflowSlugs = new Set([...tool.workflow.before, ...tool.workflow.after])
  return tools
    .filter(t => t.slug !== tool.slug)
    .map(t => ({
      tool: t,
      score:
        (workflowSlugs.has(t.slug)         ? 5 : 0) +
        (t.subcategory === tool.subcategory ? 3 : 0) +
        (t.category    === tool.category    ? 2 : 0) +
        t.tags.filter(tag => tool.tags.includes(tag)).length,
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ tool: t }) => t)
}

/** Get localized tool data, falling back to English */
export function getLocalizedTool(tool: ToolMeta, locale: "en" | "ja" | "zh"): ToolMeta {
  if (locale === "en" || !tool.i18n?.[locale]) return tool
  const override = tool.i18n[locale]!
  return {
    ...tool,
    name:        override.name        ?? tool.name,
    description: override.description ?? tool.description,
    seo:         override.seo         ?? tool.seo,
    content:     override.content ? { ...tool.content, ...override.content } : tool.content,
  }
}

export const CATEGORY_LABELS: Record<ToolCategory, string> = {
  formatter:  "Formatter",
  encoder:    "Encoder / Decoder",
  generator:  "Generator",
  tester:     "Tester",
  converter:  "Converter",
  japanese:   "Japanese",
  text:       "Text",
  number:     "Number",
  color:      "Color",
  image:      "Image",
  network:    "Network",
  crypto:     "Crypto",
}

export const CATEGORY_ICON: Record<ToolCategory, string> = {
  formatter:  "Braces",
  encoder:    "Lock",
  generator:  "Sparkles",
  tester:     "FlaskConical",
  converter:  "ArrowLeftRight",
  japanese:   "Languages",
  text:       "Type",
  number:     "Hash",
  color:      "Palette",
  image:      "ImageIcon",
  network:    "Globe",
  crypto:     "ShieldCheck",
}
