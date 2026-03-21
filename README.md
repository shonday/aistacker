# AIStacker

Lightweight, open-source, browser-based developer tools. JSON formatter, Base64 encoder, UUID generator, Regex tester, and growing — all run locally in your browser.

**Live:** https://aistacker.dev  
**Stack:** Next.js 16 · React 19 · Tailwind CSS v4 · shadcn/ui (radix-nova) · Cloudflare Pages

---

## Table of contents

- [Getting started](#getting-started)
- [Project structure](#project-structure)
- [UI customization](#ui-customization)
  - [Header](#header)
  - [Footer](#footer)
  - [Dark mode](#dark-mode)
  - [Colors and theme](#colors-and-theme)
  - [Typography](#typography)
- [Adding a tool manually](#adding-a-tool-manually)
- [Tool generator](#tool-generator)
  - [Setup](#setup)
  - [From natural language (recommended)](#from-natural-language-recommended)
  - [From explicit spec](#from-explicit-spec)
  - [Batch generation](#batch-generation)
- [Deployment](#deployment)

---

## Getting started

```bash
# Install dependencies
npm install

# Copy env template and fill in at least one LLM key (for the generator)
cp .env.example .env.local

# Start dev server
npm run dev
# → http://localhost:3000
```

---

## Project structure

```
app/
  layout.tsx              Root layout — ThemeProvider, SiteHeader, SiteFooter
  page.tsx                Homepage — featured tools + category grid
  globals.css             Tailwind + shadcn CSS variables, dark mode vars
  tools/
    page.tsx              /tools — full directory with search and category filter
    [id]/
      page.tsx            /tools/{id} — individual tool page with SEO + schema

components/
  ThemeProvider.tsx       Dark/light/system theme context (no external deps)
  ThemeToggle.tsx         Sun/Moon/Monitor toggle button used in the header
  layout/
    SiteHeader.tsx        Sticky top nav with logo, nav links, theme toggle
    SiteFooter.tsx        Bottom bar with tagline and copyright
    ToolCard.tsx          Card used on homepage and /tools grid
    ToolLayout.tsx        Wrapper for individual tool pages (header, SEO, related)
    ToolsDirectory.tsx    /tools client component — fuse.js search + category tabs
  tools/                  One .tsx file per tool (generated or handwritten)
    JsonFormatter.tsx
    ...

data/
  tools.ts                ★ Central registry — the only file to edit when adding tools

lib/
  config.ts               Site name, URL, description
  utils.ts                cn() helper
  search.ts               fuse.js wrapper
  api.ts                  Future FastAPI bridge (dormant)
  toolRegistry.ts         Dynamic imports for every tool component

scripts/
  idea.ts                 Natural language → spec → generate
  generate-tool.ts        Explicit spec → generate
  codegen/lib/            Generator internals (llm, parser, prompts, checker…)
```

---

## UI customization

### Header

**File:** `components/layout/SiteHeader.tsx`

```tsx
// Change the logo text
<span>AIStacker</span>          // ← edit this

// Add/remove nav links
const NAV = [
  { href: "/",      label: "Home"      },
  { href: "/tools", label: "All Tools" },
  { href: "/blog",  label: "Blog"      },  // ← add more here
]

// The ThemeToggle sits in the right slot — remove it if you don't want it
<div className="ml-auto flex items-center gap-2">
  <ThemeToggle />
  {/* Add GitHub star button, auth button, etc. here */}
</div>
```

The header is `sticky top-0 z-50` with a frosted glass effect (`backdrop-blur-sm bg-background/90`). To make it solid instead:

```tsx
// Replace
className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/90 backdrop-blur-sm"
// With
className="sticky top-0 z-50 w-full border-b border-border bg-background"
```

---

### Footer

**File:** `components/layout/SiteFooter.tsx`

```tsx
export function SiteFooter() {
  return (
    <footer className="border-t border-border/50 bg-muted/20 py-8 text-sm text-muted-foreground">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 sm:flex-row sm:justify-between">
        
        {/* Left: logo */}
        <Link href="/" className="flex items-center gap-2 font-medium text-foreground">
          <Layers className="h-4 w-4" />
          <span>AIStacker</span>
        </Link>

        {/* Center: tagline — edit or remove */}
        <p>All tools run locally in your browser. No data leaves your device.</p>

        {/* Right: copyright */}
        <p>© {new Date().getFullYear()} AIStacker.dev</p>
      </div>
    </footer>
  )
}
```

To add social links to the footer:

```tsx
<div className="flex items-center gap-4">
  <a href="https://github.com/yourrepo" className="hover:text-foreground transition-colors">GitHub</a>
  <a href="/about" className="hover:text-foreground transition-colors">About</a>
</div>
```

---

### Dark mode

Dark mode is handled by `components/ThemeProvider.tsx`. It works by toggling a `dark` class on the `<html>` element, which Tailwind CSS v4 and shadcn/ui pick up via the `@custom-variant dark (&:is(.dark *))` rule already in `globals.css`.

**Three modes:** `system` (follows OS), `light`, `dark`. Clicking the toggle in the header cycles through them. The user's preference is saved to `localStorage` under the key `aistacker-theme`.

**Changing the default theme:**

```tsx
// app/layout.tsx
<ThemeProvider defaultTheme="dark">   // "system" | "light" | "dark"
```

**Removing dark mode entirely:** Delete `<ThemeToggle />` from `SiteHeader.tsx` and remove `<ThemeProvider>` from `layout.tsx` (just keep `{children}` directly). The site will always use light mode.

**Changing the toggle storage key** (useful if you have multiple projects sharing a domain):

```tsx
<ThemeProvider storageKey="my-app-theme">
```

**Writing dark-mode-aware component styles:**

Always use shadcn semantic tokens — they automatically switch between light and dark values. Never hardcode palette colors.

```tsx
// ✓ Correct — works in both modes
className="bg-background text-foreground border-border"
className="bg-muted text-muted-foreground"
className="bg-card text-card-foreground"
className="bg-primary text-primary-foreground"

// ✗ Wrong — breaks in dark mode
className="bg-white text-gray-900"
className="bg-slate-100 text-slate-700"
```

---

### Colors and theme

**File:** `app/globals.css`

The `:root` block sets light mode colors; the `.dark` block sets dark mode colors. All values use OKLCH color space for perceptual consistency.

```css
:root {
  --background: oklch(1 0 0);           /* white */
  --foreground: oklch(0.145 0 0);       /* near-black */
  --primary: oklch(0.205 0 0);          /* action color */
  --primary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.97 0 0);             /* subtle backgrounds */
  --muted-foreground: oklch(0.556 0 0); /* secondary text */
  --border: oklch(0.922 0 0);
  --radius: 0.625rem;                   /* border-radius base */
}
```

To give the site a blue primary color instead of black:

```css
:root {
  --primary: oklch(0.55 0.2 260);           /* blue */
  --primary-foreground: oklch(0.985 0 0);   /* white text on blue */
}
.dark {
  --primary: oklch(0.65 0.18 260);          /* lighter blue for dark */
  --primary-foreground: oklch(0.1 0 0);
}
```

---

### Typography

The project uses [Geist Sans](https://vercel.com/font) and Geist Mono (via `next/font/google`). To change fonts, edit `app/layout.tsx`:

```tsx
import { Inter, JetBrains_Mono } from "next/font/google"

const inter = Inter({ variable: "--font-geist-sans", subsets: ["latin"] })
const jetbrainsMono = JetBrains_Mono({ variable: "--font-geist-mono", subsets: ["latin"], weight: ["400", "500"] })
```

Then update the body class in the same file to use the new variables.

---

## Adding a tool manually

1. **Create the component** at `components/tools/YourToolName.tsx`

```tsx
"use client"

import { useState } from "react"

export default function YourToolName() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")

  const process = () => setOutput(input.toUpperCase()) // your logic here

  return (
    <div className="space-y-4">
      <textarea
        className="w-full rounded-lg border border-border bg-background p-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring/30 min-h-[120px]"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Enter input…"
      />
      <button
        onClick={process}
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
      >
        Process
      </button>
      <div className="rounded-lg border border-border bg-muted/40 p-3 font-mono text-sm min-h-[80px]">
        {output || <span className="text-muted-foreground">Result appears here</span>}
      </div>
    </div>
  )
}
```

2. **Register in `data/tools.ts`** (inside the `tools` array):

```ts
{
  slug:        "your-tool-name",
  name:        "Your Tool Name",
  description: "What it does in one sentence.",
  component:   "YourToolName",
  category:    "text",
  tags:        ["tag1", "tag2", "tag3"],
  status:      "new",
  featured:    false,
  addedAt:     "2025-03-21",
  seo: {
    title:       "Your Tool Name — Free Online Tool",
    description: "Longer SEO description, 120–160 chars.",
  },
  content: {
    intro:    "Two sentences about what the tool is.",
    usage:    "How to use it.",
    example:  "Input: hello\nOutput: HELLO",
    useCases: "1. Use case one.\n2. Use case two.",
    faq: [
      { q: "Is my data secure?", a: "Yes, everything runs locally." },
    ],
  },
},
```

3. **Register in `lib/toolRegistry.ts`**:

```ts
YourToolName: dynamic(() => import("@/components/tools/YourToolName")),
```

That's it. The page at `/tools/your-tool-name` is automatically generated with full SEO.

---

## Tool generator

The generator uses an LLM to write the component, SEO copy, and registry entries for you.

### Setup

```bash
cp .env.example .env.local
# Edit .env.local — add at least one key:
GEMINI_API_KEY=your-key-here     # recommended: free tier, fast
# or
ANTHROPIC_API_KEY=your-key
# or
GROQ_API_KEY=your-key
```

### From natural language (recommended)

```bash
npx tsx scripts/idea.ts "A color converter between HEX, RGB, and HSL"

# Options:
npx tsx scripts/idea.ts "..." --dry-run          # show spec, don't generate
npx tsx scripts/idea.ts --interactive            # guided Q&A
npx tsx scripts/idea.ts "..." --provider gemini  # force a provider
npx tsx scripts/idea.ts "..." --project-dir .    # auto-copy to project
```

The LLM translates your idea into a precise spec (tool ID, features list, SEO description, tags), shows it to you for confirmation, then runs the generator.

### From explicit spec

```bash
npx tsx scripts/generate-tool.ts \
  --id       "color-converter" \
  --name     "Color Converter" \
  --desc     "Convert between HEX, RGB, HSL, and HSB with a live preview." \
  --features "hex input,rgb input,hsl output,live color swatch,copy any format" \
  --project-dir .
```

Without `--project-dir`, files go to `./output/` for review. With it, the component is copied to `components/tools/` and both registry files are updated automatically.

### Batch generation

Create `scripts/codegen/batch/my-batch.json`:

```json
[
  {
    "toolId":      "jwt-decoder",
    "displayName": "JWT Decoder",
    "description": "Decode JWT tokens — header, payload, expiry — in your browser.",
    "features": [
      "decode header as formatted JSON",
      "decode payload as formatted JSON",
      "show expiry time and whether token is expired",
      "copy individual sections",
      "warn if signature cannot be verified client-side"
    ]
  }
]
```

```bash
npx tsx scripts/generate-tool.ts --batch scripts/codegen/batch/my-batch.json --project-dir .
```

### After generation

Always open `output/REVIEW.md` and:
1. Start `npm run dev` and open `http://localhost:3000/tools/{id}`
2. Test every feature in the checklist
3. Check dark mode (`ThemeToggle` in the header)
4. Verify mobile layout at 375px width
5. Fix any `[WARN]` items in the static check results

---

## Deployment

The project deploys to Cloudflare Pages via OpenNext.

```bash
# Preview locally with Cloudflare Workers runtime
npm run preview

# Deploy to production
npm run deploy
```

**Production environment variables** are set in the Cloudflare Pages dashboard under Settings → Environment Variables. You do not need `.env` files in production — only `NEXT_PUBLIC_SITE_URL` is required.

```
NEXT_PUBLIC_SITE_URL=https://aistacker.dev
```
