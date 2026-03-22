// data/tools/new-wave1.ts — Wave 1 new tools (Phase 4)
// Add to data/tools/index.ts imports and merge into tools array.
import type { ToolMeta } from "./types"

export const wave1Tools: ToolMeta[] = [
  {
    slug:        "jwt-decoder",
    name:        "JWT Decoder",
    description: "Decode and inspect JWT tokens — header, payload, expiry, and claims — in your browser.",
    component:   "JwtDecoder",
    category:    "encoder",
    subcategory: "jwt",
    tags: [
      "jwt", "json web token", "decoder", "token", "auth",
      "bearer token", "payload", "claims", "expiry",
      "decode jwt online", "inspect jwt", "jwt inspector",
    ],
    status:   "new",
    featured: true,
    addedAt:  "2025-03-20",
    seo: {
      title:       "JWT Decoder Online - Inspect Token Header, Payload & Expiry",
      description: "Decode JWT tokens instantly — view header algorithm, payload claims, expiry status, and signature. 100% client-side, no data sent.",
    },
    content: {
      intro:    "JWT (JSON Web Token) is a compact, URL-safe format for transmitting claims between parties. It consists of three Base64URL-encoded parts: header, payload, and signature. This tool decodes and displays each part in readable JSON.",
      usage:    "Paste your JWT token into the input field. The header, payload, and signature sections are decoded and displayed instantly. The expiry status shows whether the token is currently valid or expired.",
      example:  "Token:   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyXzEyMyJ9.xxx\n\nHeader:  { \"alg\": \"HS256\", \"typ\": \"JWT\" }\nPayload: { \"sub\": \"user_123\", \"exp\": 1704067200 }\nExpiry:  Expired 3 months ago",
      useCases: "1. Debugging authentication issues in API development.\n2. Inspecting access tokens received from OAuth providers.\n3. Checking token expiry without running code.\n4. Verifying the claims inside a token before implementing auth logic.",
      faq: [
        { q: "Can this verify the JWT signature?",    a: "No. Signature verification requires the secret key, which should never be shared with a browser tool. This tool decodes only — it cannot verify authenticity." },
        { q: "Is my token sent to a server?",         a: "No. All decoding happens locally in your browser. Your token never leaves your device." },
        { q: "What is the exp claim?",                a: "exp is the Unix timestamp (seconds since epoch) after which the token is no longer valid. The tool shows the human-readable date and how long ago it expired." },
      ],
    },
    problems: [
      "How to decode a JWT token without code",
      "How to check JWT token expiry",
      "How to see claims inside a JWT token",
      "What is inside a bearer token",
      "How to read a JWT payload",
      "How to debug authentication tokens",
    ],
    workflow: { before: ["base64-encode"], after: ["json-formatter"] },
    searchIntents: {
      informational: ["what is a jwt token", "how does jwt work", "jwt structure explained"],
      navigational:  ["jwt decoder online", "jwt inspector", "decode jwt token"],
      transactional: ["decode jwt free", "inspect jwt token online", "read jwt payload"],
    },
    i18n: {
      ja: {
        name:        "JWT デコーダー",
        description: "JWTトークンのヘッダー・ペイロード・有効期限をブラウザ上でデコードして確認できます。",
        seo: {
          title:       "JWT デコーダー - トークン内容をオンライン確認 | AIStacker",
          description: "JWTトークンをデコードしてヘッダー・ペイロード・有効期限を確認。完全ブラウザ処理でデータは送信されません。",
        },
      },
      zh: {
        name:        "JWT 解码器",
        description: "在浏览器中解码 JWT 令牌，查看 header、payload、过期时间和声明。",
        seo: {
          title:       "JWT 解码器 - 在线查看令牌内容 | AIStacker",
          description: "在线解码 JWT 令牌，查看 header 算法、payload 声明和过期状态。完全本地处理，数据不会上传。",
        },
      },
    },
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
]
