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
  | "base64" | "url" | "html" | "jwt"
  | "uuid" | "hash" | "password"
  | "regex" | "diff" | "lint"
  | "timestamp" | "timezone" | "color-space"
  | "markdown" | "unicode" | "word-count"
  | "number-base" | "ip" | "dns"

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
