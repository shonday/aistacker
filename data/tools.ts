// ─────────────────────────────────────────────────────────────────────────────
// data/tools.ts  —  Central Tool Registry
//
// ONLY file you touch when adding a new tool:
//   1. Add an entry here
//   2. Drop the .tsx in components/tools/
//   Done. Routing, SEO, sitemap, search, related-tools are all automatic.
// ─────────────────────────────────────────────────────────────────────────────

export type ToolCategory =
  | "formatter"
  | "encoder"
  | "generator"
  | "tester"
  | "converter"
  | "japanese"
  | "text"
  | "number"
  | "color"
  | "image"
  | "network"
  | "crypto"

export type ToolStatus = "stable" | "beta" | "new"

export interface ToolFaq {
  q: string
  a: string
}

export interface ToolContent {
  intro: string
  usage: string
  example: string
  useCases: string
  faq: ToolFaq[]
}

export interface ToolMeta {
  slug: string          // kebab-case → URL: /tools/{slug}
  name: string          // Display name
  description: string   // Short description for cards + meta (≤160 chars)
  component: string     // PascalCase filename in components/tools/ (no .tsx)
  category: ToolCategory
  tags: string[]        // Drives fuse.js search + tag cloud
  status: ToolStatus
  featured?: boolean    // Shown on homepage hero grid
  addedAt: string       // ISO "YYYY-MM-DD" — drives "New" badge (30 days)
  content: ToolContent  // Long-form SEO copy rendered below the tool
  seo: {
    title: string       // Full <title> tag
    description: string // <meta description>
  }
  // Future FastAPI hook: set this when a tool needs server-side processing.
  // The frontend calls lib/api.ts → POST ${NEXT_PUBLIC_API_BASE}{apiEndpoint}
  apiEndpoint?: string  // e.g. "/api/tools/pdf-compress"
}

export const tools: ToolMeta[] = [
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    description: "Beautify, minify, validate and sort JSON instantly in your browser.",
    component: "JsonFormatter",
    category: "formatter",
    tags: ["json", "formatter", "beautify", "minify", "validator", "pretty-print", "sort-keys"],
    status: "stable",
    featured: true,
    addedAt: "2025-01-01",
    seo: {
      title: "Free JSON Formatter Online - Beautify & Prettify JSON",
      description: "Fastest online JSON formatter with syntax validation, minify and key-sorting. 100% private — all processing happens in your browser.",
    },
    content: {
      intro: "JSON Formatter is an essential utility for developers, data analysts, and system administrators who work with JavaScript Object Notation. APIs often return minified JSON to save bandwidth, making it nearly impossible to read or debug. This tool transforms dense strings into a human-readable, hierarchical structure with proper indentation and syntax highlighting.",
      usage: "Paste your raw, minified, or messy JSON into the left panel. Choose Pretty or Minify mode, optionally enable key sorting, then click Format JSON (or press ⌘/Ctrl+Enter). The validated output appears on the right, ready to copy.",
      example: '// Input:\n{"id":1,"name":"AIStacker"}\n\n// Pretty output:\n{\n  "id": 1,\n  "name": "AIStacker"\n}',
      useCases: "1. Debugging REST API responses.\n2. Formatting config files (package.json, tsconfig.json).\n3. Validating JSON syntax before committing.\n4. Minifying JSON to reduce payload size.\n5. Sorting keys alphabetically for diff readability.",
      faq: [
        { q: "Is my JSON data secure?", a: "Yes. All processing happens entirely in your browser using JavaScript. No data is ever sent to a server." },
        { q: "Can it handle invalid JSON?", a: "Yes — a clear parse error message is shown inline so you can pinpoint the problem immediately." },
        { q: "Does it support JSON5 or JavaScript objects?", a: "The parser uses the standard JSON.parse(), so JSON5 and unquoted keys are not supported. Convert to standard JSON first." },
      ],
    },
  },
  {
    slug: "base64-encode",
    name: "Base64 Encoder / Decoder",
    description: "Encode text or files to Base64, or decode Base64 strings back to plain text.",
    component: "Base64Encoder",
    category: "encoder",
    tags: ["base64", "encoder", "decoder", "binary", "encoding", "decode", "encode"],
    status: "stable",
    featured: true,
    addedAt: "2025-01-01",
    seo: {
      title: "Base64 Encode & Decode Online - Secure & Fast",
      description: "Convert strings to Base64 format or decode them back. Supports Unicode, handles files, runs entirely in your browser.",
    },
    content: {
      intro: "Base64 encoding converts binary data into an ASCII string using 64 printable characters. It is widely used when binary data needs to be stored and transferred over media designed for text — such as embedding images in CSS, passing tokens in HTTP headers, or encoding email attachments.",
      usage: "Select Encode or Decode mode, paste your input, and click the action button. For encoding, any UTF-8 text is accepted. For decoding, provide a valid Base64 string.",
      example: "// Plain text → Base64\nHello, World!  →  SGVsbG8sIFdvcmxkIQ==\n\n// Base64 → Plain text\nU0VDUkVU  →  SECRET",
      useCases: "1. Encoding binary data for JSON APIs.\n2. Embedding small images as data URIs in CSS/HTML.\n3. Passing credentials in HTTP Basic Auth headers.\n4. Decoding JWT token payloads for inspection.",
      faq: [
        { q: "Is Base64 the same as encryption?", a: "No. Base64 is an encoding scheme, not encryption. It is trivially reversible and provides no security — use it for format compatibility, not secrecy." },
        { q: "Does it support Unicode / emoji?", a: "Yes. The encoder properly handles full Unicode including CJK characters and emoji by using TextEncoder internally." },
      ],
    },
  },
  {
    slug: "uuid-generator",
    name: "UUID Generator",
    description: "Generate cryptographically secure UUID v4 identifiers in bulk.",
    component: "UUIDGenerator",
    category: "generator",
    tags: ["uuid", "guid", "generator", "random", "unique-id", "v4", "crypto"],
    status: "stable",
    featured: true,
    addedAt: "2025-01-01",
    seo: {
      title: "Online UUID Generator - Create Random V4 UUIDs in Bulk",
      description: "Generate cryptographically secure v4 UUIDs (GUIDs) instantly. Bulk generation, copy all, history — runs entirely in your browser.",
    },
    content: {
      intro: "A Universally Unique Identifier (UUID) is a 128-bit label standardised as RFC 4122. Version 4 UUIDs are randomly generated using a cryptographically secure random number generator, giving them an astronomically low collision probability — roughly 1 in 5.3×10³⁶ per pair.",
      usage: "Click Generate to produce a single UUID, or set a count and use Bulk Generate to create up to 100 at once. Each UUID is shown in standard hyphenated format and can be copied individually or all at once.",
      example: "Single: 550e8400-e29b-41d4-a716-446655440000\nBulk (3):\n  f47ac10b-58cc-4372-a567-0e02b2c3d479\n  6ba7b810-9dad-11d1-80b4-00c04fd430c8\n  6ba7b811-9dad-11d1-80b4-00c04fd430c8",
      useCases: "1. Primary keys in SQL and NoSQL databases.\n2. Unique session and transaction identifiers.\n3. Idempotency keys for API requests.\n4. Filenames for uploaded assets.",
      faq: [
        { q: "How random are these UUIDs?", a: "They use window.crypto.randomUUID(), which is the browser's cryptographically secure pseudorandom number generator (CSPRNG) — the same source used for TLS." },
        { q: "Are generated UUIDs stored anywhere?", a: "No. Generation happens entirely client-side. Nothing is transmitted or logged." },
      ],
    },
  },
  {
    slug: "regex-tester",
    name: "Regex Tester",
    description: "Test regular expressions with real-time match highlighting and group capture breakdown.",
    component: "RegexTester",
    category: "tester",
    tags: ["regex", "regular-expression", "tester", "match", "pattern", "javascript", "flags", "groups"],
    status: "stable",
    featured: true,
    addedAt: "2025-01-01",
    seo: {
      title: "Online Regex Tester - Real-time Regular Expression Debugger",
      description: "Write and test regular expressions with instant match highlighting, flag toggles, group capture breakdown. Uses the JavaScript RegExp engine.",
    },
    content: {
      intro: "Regular expressions are patterns used to match character combinations in strings. This tester provides a real-time environment to write, validate, and debug patterns — with live match highlighting, flag toggles (g, i, m, s, u), and a capture group breakdown panel.",
      usage: "Enter your pattern in the regex field. Toggle flags using the buttons (g for global, i for case-insensitive, m for multiline). Type or paste your test string — matches are highlighted instantly. The Groups panel shows each captured group by index and name.",
      example: "Pattern: (\\w+)@(\\w+\\.\\w+)\nFlags: gi\nTest: Contact us at hello@aistacker.dev or support@example.com\nMatches: hello@aistacker.dev, support@example.com\nGroup 1: hello, support\nGroup 2: aistacker.dev, example.com",
      useCases: "1. Validating email addresses, phone numbers, URLs.\n2. Extracting data from log files and API responses.\n3. Writing find-and-replace patterns for code editors.\n4. Learning and experimenting with JavaScript regex syntax.",
      faq: [
        { q: "Which regex engine is used?", a: "The standard JavaScript RegExp engine, so patterns behave identically to what you'd use in Node.js or the browser." },
        { q: "Why is my pattern crashing?", a: "Some patterns like (a+)+ can cause catastrophic backtracking. The tester catches RegExp errors gracefully and shows the error inline." },
      ],
    },
  },
  {
    slug: "timestamp-converter",
    name: "Timestamp Converter",
    description: "Convert between Unix timestamps and human-readable dates across any timezone.",
    component: "TimestampConverter",
    category: "converter",
    tags: ["timestamp", "unix", "date", "converter", "epoch", "timezone", "utc", "iso8601"],
    status: "stable",
    featured: false,
    addedAt: "2025-01-01",
    seo: {
      title: "Unix Timestamp Converter - Epoch Time to Human-Readable Date",
      description: "Convert Unix epoch timestamps to UTC, local time, and ISO 8601. Supports seconds and milliseconds. Runs locally in your browser.",
    },
    content: {
      intro: "Unix time counts the number of seconds elapsed since the Unix epoch (January 1, 1970 00:00:00 UTC). It is the standard time representation in operating systems, databases, and APIs. This converter handles both second-precision and millisecond-precision timestamps automatically.",
      usage: "Paste a Unix timestamp (seconds or milliseconds) to see the equivalent UTC, local, and ISO 8601 representations. Or use the date picker to convert a human-readable date back to a Unix timestamp.",
      example: "Input (seconds):      1672531200\nUTC:   Sun, 01 Jan 2023 00:00:00 GMT\nLocal: Sun Jan 01 2023 09:00:00 GMT+0900\nISO:   2023-01-01T00:00:00.000Z\n\nInput (milliseconds): 1672531200000  → same result",
      useCases: "1. Debugging database timestamp columns.\n2. Reading timestamps from server logs and API responses.\n3. Calculating time deltas between events.\n4. Verifying cron job and scheduler configurations.",
      faq: [
        { q: "Does it support milliseconds?", a: "Yes. The converter automatically detects whether the input is in seconds (10 digits) or milliseconds (13 digits) and adjusts accordingly." },
        { q: "Which timezone is 'Local'?", a: "Local time reflects the timezone configured in your browser / operating system." },
      ],
    },
  },
  {
    slug: "url-encode",
    name: "URL Encoder",
    description: "Percent-encode strings for safe use in URLs and query parameters.",
    component: "UrlEncoder",
    category: "encoder",
    tags: ["url", "encoder", "percent-encode", "uri", "query-string", "uri-component"],
    status: "stable",
    featured: false,
    addedAt: "2025-01-01",
    seo: {
      title: "URL Encoder Online - Percent-Encoding Tool for URI Components",
      description: "Safely encode URL components with percent-encoding. Handles spaces, special characters, and Unicode. Runs in your browser.",
    },
    content: {
      intro: "URL encoding (percent-encoding) replaces unsafe ASCII characters with a '%' followed by two hexadecimal digits representing the byte value. It is required when passing text as a URL query parameter or path segment to ensure the URL remains valid across all HTTP clients.",
      usage: "Paste your plain text into the input area and click Encode. The output is a percent-encoded string safe to embed in a URL. Use the URL Decoder tool to reverse the process.",
      example: "Input:  hello world? price=€10 & category=日本語\nOutput: hello%20world%3F%20price%3D%E2%82%AC10%20%26%20category%3D%E6%97%A5%E6%9C%AC%E8%AA%9E",
      useCases: "1. Building query strings for GET requests.\n2. Passing special characters in API endpoint paths.\n3. Encoding form data before submission.\n4. Constructing shareable URLs with embedded parameters.",
      faq: [
        { q: "What's the difference between encodeURI and encodeURIComponent?", a: "This tool uses encodeURIComponent, which encodes everything except A–Z a–z 0–9 - _ . ! ~ * ' ( ). Use it for individual parameter values, not full URLs." },
      ],
    },
  },
  {
    slug: "url-decode",
    name: "URL Decoder",
    description: "Decode percent-encoded URL strings back to human-readable plain text.",
    component: "UrlDecoder",
    category: "encoder",
    tags: ["url", "decoder", "percent-decode", "uri", "query-string", "uri-component"],
    status: "stable",
    featured: false,
    addedAt: "2025-01-01",
    seo: {
      title: "URL Decoder Online - Decode URI Components Instantly",
      description: "Decode percent-encoded URL strings back to human-readable text. Handles double-encoding and Unicode. Runs in your browser.",
    },
    content: {
      intro: "URL decoding is the reverse of percent-encoding: it converts sequences like %20 back to spaces, %3F back to ?, and multi-byte sequences back to Unicode characters. It is commonly needed when reading URL parameters from logs, debugging API requests, or inspecting redirect chains.",
      usage: "Paste a percent-encoded URL or query string into the input. Click Decode to see the original text. If the string was double-encoded, click Decode again.",
      example: "Input:  hello%20world%3F%20category%3D%E6%97%A5%E6%9C%AC%E8%AA%9E\nOutput: hello world? category=日本語",
      useCases: "1. Reading URL parameters from browser address bar logs.\n2. Debugging encoded API endpoints and webhooks.\n3. Extracting readable data from analytics query strings.\n4. Reversing double-encoded parameters from proxies.",
      faq: [
        { q: "Can it decode multiple times?", a: "Yes. If a string was double-encoded (e.g., %2520 instead of %20), decode once to get %20, then decode again to get a space." },
      ],
    },
  },
]

// ─── Utility helpers ──────────────────────────────────────────────────────────

export function getToolBySlug(slug: string): ToolMeta | undefined {
  return tools.find((t) => t.slug === slug)
}

export function getToolsByCategory(category: ToolCategory): ToolMeta[] {
  return tools.filter((t) => t.category === category)
}

export function getCategories(): ToolCategory[] {
  return [...new Set(tools.map((t) => t.category))].sort() as ToolCategory[]
}

export function getFeaturedTools(): ToolMeta[] {
  return tools.filter((t) => t.featured)
}

export function isNewTool(tool: ToolMeta, withinDays = 30): boolean {
  const added = new Date(tool.addedAt).getTime()
  return Date.now() - added < withinDays * 24 * 60 * 60 * 1000
}

/** Score-based related tools: same category > shared tags */
export function getRelatedTools(tool: ToolMeta, limit = 4): ToolMeta[] {
  return tools
    .filter((t) => t.slug !== tool.slug)
    .map((t) => ({
      tool: t,
      score:
        (t.category === tool.category ? 3 : 0) +
        t.tags.filter((tag) => tool.tags.includes(tag)).length,
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ tool: t }) => t)
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

// Maps category → lucide-react icon name (used in CategoryBadge)
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
