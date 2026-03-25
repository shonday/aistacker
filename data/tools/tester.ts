// data/tools/tester.ts — Tester category tools
import type { ToolMeta } from "./types"

export const testerTools: ToolMeta[] = [
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
        { q: "Which regex engine is used?",                   a: "The standard JavaScript RegExp engine — patterns behave identically to what you'd use in Node.js, Chrome DevTools, or any JS runtime." },
        { q: "Why is my pattern causing the page to hang?",   a: "Some patterns cause catastrophic backtracking (e.g., (a+)+). The tester catches RegExp errors but cannot prevent all infinite loops — if it hangs, refresh the page." },
        { q: "How do I use named capture groups?",            a: "Use (?<n>pattern) syntax. Named groups appear in the Groups panel with their names alongside index-based groups." },
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
    workflow: { before: [], after: ["url-encode"] },
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
  "slug": "js-minifier-terser",
  "name": "JS Minifier (Terser Engine)",
  "description": "Enterprise-grade professional JavaScript compression tool powered by Terser. Supports ES6+, variable mangling, and dead code elimination for production builds.",
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
      "name": "专业级 JS 压缩器 (Terser 引擎)",
      "description": "基于业界标准的 Terser 引擎，支持 ES6+、变量混淆、移除 Console 及无用代码剔除，专为生产环境构建。",
      "seo": {
        "title": "Terser 在线压缩 - 专业 JavaScript 混淆与优化工具 | AIStacker",
        "description": "使用业界首选的 Terser 引擎在线压缩 JS。支持变量混淆、移除调试代码，完全本地处理，安全可靠。"
      }
    }
  }
},


]
