// data/tools/formatter.ts — Formatter category tools
import type { ToolMeta } from "./types"

export const formatterTools: ToolMeta[] = [
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
        { q: "Is my JSON data sent to a server?",          a: "No. All processing runs entirely in your browser using JavaScript. Nothing is transmitted." },
        { q: "Can it handle invalid or broken JSON?",      a: "Yes. A clear parse error with the line number is shown inline so you can fix the problem immediately." },
        { q: "Does it support JSON5 or comments in JSON?", a: "The parser uses the standard JSON.parse() specification. JSON5 and comments are not supported — remove them first." },
        { q: "What is the maximum file size?",             a: "Practically limited by your browser's memory. Files up to 10MB format smoothly in most modern browsers." },
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
]
