# AIStacker — HOWTO

Step-by-step recipes for every common task. No background reading required.

---

## Contents

- [Apply this upgrade to your project](#apply-this-upgrade)
- [Add a new tool manually](#add-a-new-tool-manually)
- [Generate a tool from natural language](#generate-a-tool-from-natural-language)
- [Generate a tool from an explicit spec](#generate-a-tool-from-an-explicit-spec)
- [Generate tools in batch](#generate-tools-in-batch)
- [Upgrade an existing tool](#upgrade-an-existing-tool)
- [Add a new guide](#add-a-new-guide)
- [Translate a tool into Japanese or Chinese](#translate-a-tool)
- [Translate a guide](#translate-a-guide)
- [Add a new language](#add-a-new-language)
- [Change site colors](#change-site-colors)
- [Change the default theme (light/dark)](#change-the-default-theme)
- [Add a navigation link](#add-a-navigation-link)
- [Debug a failed generation](#debug-a-failed-generation)

---

## Apply this upgrade

**Prerequisites:** your project is on the version from before this upgrade package.

**Step 1 — Back up**
```bash
git add -A && git commit -m "chore: pre-upgrade snapshot"
```

**Step 2 — Drop in the new files**

Copy everything from this package into your project root, preserving the directory structure. Files that already exist are replaced; new files are added.

**Step 3 — Rename the tool route folder**
```bash
# The route changed from [slug] to [id]
mv app/tools/\[slug\] app/tools/\[id\]
```

**Step 4 — Delete the old [category] route**
```bash
rm -rf app/\[category\]
```

**Step 5 — Add middleware.ts to project root**

The file is included in this package at `middleware.ts`. Place it at the project root (same level as `package.json`). Next.js picks it up automatically.

**Step 6 — Update lib/toolRegistry.ts**

Change all import paths from `@/components/ToolName` to `@/components/tools/ToolName`:
```ts
// Before
"JsonFormatter": dynamic(() => import("@/components/JsonFormatter")),

// After
JsonFormatter: dynamic(() => import("@/components/tools/JsonFormatter")),
```

**Step 7 — Move tool component files**
```bash
# Move each tool component into the tools/ subdirectory
mkdir -p components/tools
mv components/JsonFormatter.tsx   components/tools/JsonFormatter.tsx
mv components/Base64Encoder.tsx   components/tools/Base64Encoder.tsx
mv components/UUIDGenerator.tsx   components/tools/UUIDGenerator.tsx
mv components/RegexTester.tsx     components/tools/RegexTester.tsx
mv components/TimestampConverter.tsx components/tools/TimestampConverter.tsx
mv components/UrlEncoder.tsx      components/tools/UrlEncoder.tsx
mv components/UrlDecoder.tsx      components/tools/UrlDecoder.tsx
```

**Step 8 — Update app/layout.tsx**

Wrap the body contents with `ThemeProvider` and add `suppressHydrationWarning`:

```tsx
import { ThemeProvider } from "@/components/ThemeProvider"
import { SiteHeader }    from "@/components/layout/SiteHeader"
import { SiteFooter }    from "@/components/layout/SiteFooter"

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-background text-foreground`}>
        <ThemeProvider defaultTheme="system" storageKey="aistacker-theme">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  )
}
```

**Step 9 — Add ThemeProvider and ThemeToggle files**

These were delivered in the darkmode fix package. If you don't have them yet:
- `components/ThemeProvider.tsx`
- `components/ThemeToggle.tsx`

**Step 10 — Verify build**
```bash
npm run build
# Expected: no TypeScript errors
# Expected: 40+ static pages generated
```

---

## Add a new tool manually

**1. Create the component** — `components/tools/MyToolName.tsx`

Minimum structure:
```tsx
"use client"
import { useState, useCallback } from "react"

export default function MyToolName() {
  const [input, setInput]   = useState("")
  const [output, setOutput] = useState("")
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = useCallback(async (text: string, id: string) => {
    try { await navigator.clipboard.writeText(text) }
    catch {
      const el = document.createElement("textarea")
      el.value = text; document.body.appendChild(el)
      el.select(); document.execCommand("copy")
      document.body.removeChild(el)
    }
    setCopied(id)
    setTimeout(() => setCopied(null), 1500)
  }, [])

  const process = () => setOutput(input.toUpperCase())

  return (
    <div className="space-y-4">
      <textarea
        className="w-full rounded-lg border border-border bg-background p-3 font-mono text-sm min-h-[120px] focus:outline-none focus:ring-2 focus:ring-ring/30"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => { if ((e.metaKey || e.ctrlKey) && e.key === "Enter") process() }}
        placeholder="Enter input…"
      />
      <div className="flex gap-2">
        <button
          onClick={process}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Process
        </button>
        <button
          onClick={() => copyToClipboard(output, "result")}
          disabled={!output}
          className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-40"
        >
          {copied === "result" ? "Copied ✓" : "Copy"}
        </button>
      </div>
      <div className="min-h-[80px] rounded-lg border border-border bg-muted/40 p-3 font-mono text-sm">
        {output || <span className="text-muted-foreground">Result appears here</span>}
      </div>
    </div>
  )
}
```

**2. Register in `data/tools.ts`** — add inside the `tools` array:

```ts
{
  slug:        "my-tool-name",
  name:        "My Tool Name",
  description: "What it does in one sentence. Max 160 chars.",
  component:   "MyToolName",
  category:    "text",          // see ToolCategory type for all options
  subcategory: "markdown",
  tags:        ["tag1", "tag2", "alias phrase users might search"],
  status:      "new",
  featured:    false,
  addedAt:     "2025-03-21",
  seo: {
    title:       "My Tool Name — Free Online Tool",
    description: "Meta description, 120–160 chars, specific and keyword-rich.",
  },
  content: {
    intro:    "Two sentences about what the tool is and why developers need it.",
    usage:    "Two sentences on how to use it step by step.",
    example:  "Input: hello\nOutput: HELLO",
    useCases: "1. Use case one.\n2. Use case two.\n3. Use case three.",
    faq: [
      { q: "Is my data secure?", a: "Yes, everything runs locally in your browser." },
    ],
  },
  problems: [
    "How to X with this tool",
    "How to Y using this tool",
  ],
  workflow: { before: [], after: [] },
  searchIntents: {
    informational: ["what is X"],
    navigational:  ["X tool online"],
    transactional: ["X free online"],
  },
},
```

**3. Register in `lib/toolRegistry.ts`**:

```ts
MyToolName: dynamic(() => import("@/components/tools/MyToolName")),
```

**4. Done.** Run `npm run dev` and open `http://localhost:3000/tools/my-tool-name`.

---

## Generate a tool from natural language

```bash
npx tsx scripts/idea.ts "A color converter between HEX, RGB, and HSL with a live preview"
```

The LLM produces a complete spec (ID, features, SEO description, tags, problems, workflow). You review and confirm, then the generator runs automatically.

Options:
```bash
--dry-run         Show spec without generating
--provider gemini Force a specific LLM provider
--project-dir .   Auto-copy to project after generation
```

After generation, always check `output/REVIEW.md` and test in the browser before committing.

---

## Generate a tool from an explicit spec

Use this when you already know exactly what features you want:

```bash
npx tsx scripts/generate-tool.ts \
  --id       "jwt-decoder" \
  --name     "JWT Decoder" \
  --desc     "Decode JWT tokens — header, payload, and expiry — in your browser." \
  --features "decode header as JSON,decode payload as JSON,show expiry status with relative time,copy individual sections,warn if token is expired" \
  --category "encoder" \
  --project-dir .
```

If generation fails, check `output/debug/` for raw LLM responses.

---

## Generate tools in batch

Create `scripts/codegen/batch/my-batch.json`:
```json
[
  {
    "toolId":      "color-converter",
    "displayName": "Color Converter",
    "description": "Convert between HEX, RGB, HSL, and HSB with a live color preview.",
    "features":    ["hex input", "rgb input", "hsl output", "live swatch", "copy any format"]
  },
  {
    "toolId":      "hash-generator",
    "displayName": "Hash Generator",
    "description": "Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from any text.",
    "features":    ["md5 hash", "sha-1 hash", "sha-256 hash", "sha-512 hash", "live update", "copy hash"]
  }
]
```

```bash
npx tsx scripts/generate-tool.ts --batch scripts/codegen/batch/my-batch.json --project-dir .
```

Tools are generated sequentially with a 2-second pause between each.

---

## Upgrade an existing tool

The generator refuses to overwrite an existing slug. To upgrade:

**Option A — Regenerate to `./output`, review diff, copy manually:**
```bash
# Generate fresh (no --project-dir so it won't conflict)
npx tsx scripts/generate-tool.ts \
  --id "regex-tester" \
  --name "Regex Tester" \
  --desc "..." \
  --features "pattern input,flag toggles g i m s u,live highlighting,group capture panel,match count,copy pattern"

# Review the diff
diff output/RegexTester.tsx components/tools/RegexTester.tsx

# If satisfied
cp output/RegexTester.tsx components/tools/RegexTester.tsx
```

**Option B — Delete entry and regenerate:**
```bash
# 1. Remove the entry from data/tools.ts
# 2. Remove the line from lib/toolRegistry.ts
# 3. Delete the component file
rm components/tools/RegexTester.tsx

# 4. Now generate normally with --project-dir
npx tsx scripts/generate-tool.ts --id "regex-tester" ... --project-dir .
```

**Option C — Edit directly (for small changes):**
Open the component in your editor and add/modify the specific feature. For changes to 1–2 features, direct editing is faster and safer than regenerating.

---

## Add a new guide

In `data/guides.ts`, add to the `guides` array:

```ts
{
  slug:        "working-with-base64",
  title:       "Working with Base64 in Web Development",
  description: "When to use Base64, how to encode and decode efficiently, and common mistakes.",
  category:    "encoder",           // must be a ToolCategory value
  toolSlugs:   ["base64-encode"],   // tools referenced in this guide
  tags:        ["base64", "encoding", "web", "jwt"],
  readingTime: 5,
  publishedAt: "2025-04-01",
  featured:    false,
  content: {
    intro: "Base64 is used throughout web development...",
    sections: [
      {
        id:      "when-to-use",
        heading: "When to use Base64",
        body:    "Paragraph one.\n\nParagraph two.",
      },
    ],
  },
  // Add i18n translations when ready:
  i18n: {
    ja: {
      title: "ウェブ開発でのBase64活用",
      // ...
    },
  },
},
```

The guide page at `/guides/working-with-base64` is automatically generated. It appears in the Base64 Encoder tool page under "Related guides" and in the guides index under the "Encoder / Decoder" category tab.

---

## Translate a tool

In `data/tools.ts`, add `i18n` to the tool entry:

```ts
{
  slug: "my-tool",
  // ... existing fields ...
  i18n: {
    ja: {
      name:        "日本語のツール名",
      description: "日本語の説明文（160字以内）",
      seo: {
        title:       "SEOタイトル | AIStacker",
        description: "メタディスクリプション（120〜160字）",
      },
      content: {
        intro:    "イントロ文章",
        usage:    "使い方の説明",
        useCases: "1. ユースケース一\n2. ユースケース二",
        faq: [
          { q: "よくある質問", a: "回答" },
        ],
      },
    },
    zh: {
      name:        "中文工具名",
      // ...
    },
  },
},
```

Any field not provided falls back to English automatically. You can translate just `name` and `description` to start, and add `content` later.

---

## Translate a guide

In `data/guides.ts`, add `i18n` to the guide entry:

```ts
{
  slug: "my-guide",
  // ...
  i18n: {
    ja: {
      title:       "日本語タイトル",
      description: "日本語の説明",
      content: {
        intro: "イントロ",
        sections: [
          { id: "section-id", heading: "セクション見出し", body: "本文。\n\n2段落目。" },
          // Only translate sections that are ready — others fall back to English
        ],
      },
    },
  },
},
```

Until `i18n.ja.title` is set, the Japanese guide page shows an amber "not yet translated" notice and displays the English content.

---

## Add a new language

**1. Add to locale config:**
```ts
// lib/i18n/config.ts
export const locales = ["en", "ja", "zh", "ko"] as const

export const localeNames: Record<Locale, string> = {
  en: "English",
  ja: "日本語",
  zh: "中文",
  ko: "한국어",           // ← add
}
```

**2. Create message file:**
```bash
cp lib/i18n/messages/en.ts lib/i18n/messages/ko.ts
# Then translate all values in ko.ts
```

**3. Import in index.ts:**
```ts
import { ko } from "./messages/ko"
const messages = { en, ja, zh, ko } as const
```

**4. Update middleware.ts:**
```ts
function detectPreferredLocale(acceptLanguage: string): string {
  if (acceptLanguage.includes("ko")) return "ko"   // ← add
  if (acceptLanguage.includes("ja")) return "ja"
  // ...
}
```

**5. Add `ko` to `generateStaticParams` in:**
- `app/[locale]/layout.tsx`
- `app/[locale]/tools/[id]/page.tsx`
- `app/[locale]/guides/[slug]/page.tsx`

---

## Change site colors

Edit the CSS variables in `app/globals.css`:

```css
/* Blue primary instead of black */
:root {
  --primary:            oklch(0.55 0.20 260);
  --primary-foreground: oklch(0.985 0 0);
}
.dark {
  --primary:            oklch(0.65 0.18 260);
  --primary-foreground: oklch(0.10 0 0);
}
```

---

## Change the default theme

```tsx
// app/layout.tsx
<ThemeProvider defaultTheme="dark">     // "system" | "light" | "dark"
```

To remove dark mode entirely, delete `<ThemeToggle />` from `SiteHeader.tsx` and remove `<ThemeProvider>` wrapper from `layout.tsx`.

---

## Add a navigation link

```tsx
// components/layout/SiteHeader.tsx
const NAV = [
  { href: `${base}/`,       label: "Home",      exact: true  },
  { href: `${base}/tools`,  label: "All Tools", exact: false },
  { href: `${base}/guides`, label: "Guides",    exact: false },
  { href: `${base}/about`,  label: "About",     exact: false },  // ← new
]
```

The `${base}` prefix automatically handles locale routing.

---

## Debug a failed generation

**1. Check the raw LLM response:**
```bash
cat output/debug/component-attempt-1-raw.txt
```

**2. Check what the static checker found:**
```bash
cat output/debug/component-attempt-1-check.txt
```

**3. Common causes and fixes:**

| Symptom | Cause | Fix |
|---|---|---|
| `All LLM providers failed:` with no details | No API key set | Check `.env.local` has at least one key |
| `use-client: File must start with "use client"` | LLM added markdown fence before directive | Fixed in current version's `generator.ts` |
| `Parse failed. Missing sections: COMPONENT...` | LLM wrapped entire response in ```markdown | Fixed in current version's `parser.ts` |
| `forbidden-import: "marked" not allowed` | LLM tried to import external library | Add the library name to `--features` note: "implement without external libraries" |
| `component-name: named "X" but must be "Y"` | LLM used its own component name | Fixed in current `generator.ts` — forces name |
| `registry_conflict` | Slug already in `data/tools.ts` | Use Option B in [Upgrade an existing tool](#upgrade-an-existing-tool) |

**4. Force a specific provider:**
```bash
npx tsx scripts/generate-tool.ts ... --provider anthropic
```

**5. Increase retry attempts:**
```bash
npx tsx scripts/generate-tool.ts ... --attempts 5
```
