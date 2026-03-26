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




]
