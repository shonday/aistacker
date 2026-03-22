// data/tools/encoder.ts — Encoder / Decoder category tools
import type { ToolMeta } from "./types"

export const encoderTools: ToolMeta[] = [
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
        { q: "Is Base64 the same as encryption?",       a: "No. Base64 is an encoding scheme — it is trivially reversible and provides zero security. Use it for format compatibility, not secrecy." },
        { q: "Does it support Unicode and emoji?",       a: "Yes. The encoder handles full Unicode by using TextEncoder internally before converting to Base64." },
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
    workflow: { before: ["url-decode"], after: ["json-formatter", "url-decode"] },
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
        { q: "What is the difference between encodeURI and encodeURIComponent?", a: "encodeURI encodes a full URL and preserves characters like / ? = &. encodeURIComponent encodes everything except letters, digits, and - _ . ! ~ * ' ( ) — use it for individual parameter values." },
        { q: "Why is space encoded as %20 and not +?",                           a: "%20 is the standard percent-encoding for space in URI components. The + notation is only valid in application/x-www-form-urlencoded form bodies." },
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
    workflow: { before: ["json-formatter"], after: ["url-decode"] },
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
        { q: "What is double-encoding?",         a: "When an already-encoded string gets encoded again — %20 becomes %2520. Click Decode twice to fully decode a double-encoded string." },
        { q: "Can it decode a full URL at once?", a: "Yes. Paste the entire URL including the domain and query string — only the encoded components will be decoded, not the structural characters (/, ?, &, =)." },
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
    workflow: { before: ["url-encode"], after: ["json-formatter", "base64-encode"] },
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
