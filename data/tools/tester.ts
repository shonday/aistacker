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
]
