# Color Converter — Review Checklist

## Steps
1. `npm run dev` → open http://localhost:3000/tools/color-converter
2. Verify all 3 features work:
   1. show error message inline when input is invalid color code
   2. copy feedback to clipboard after conversion
   3. real-time validation of color format
3. Test with empty input → no crash, clear error state
4. Test copy button → clipboard receives correct value
5. Toggle dark mode → no broken colors
6. Resize to mobile (375px) → layout intact

## Static check result
Errors: 0
Warnings: 14

- [WARN] hardcoded-color (line 50): Hardcoded Tailwind palette color. Use semantic tokens (text-muted-foreground, bg-muted, etc.).
- [WARN] hardcoded-color (line 53): Hardcoded Tailwind palette color. Use semantic tokens (text-muted-foreground, bg-muted, etc.).
- [WARN] hardcoded-color (line 54): Hardcoded Tailwind palette color. Use semantic tokens (text-muted-foreground, bg-muted, etc.).
- [WARN] hardcoded-color (line 60): Hardcoded Tailwind palette color. Use semantic tokens (text-muted-foreground, bg-muted, etc.).
- [WARN] hardcoded-color (line 68): Hardcoded Tailwind palette color. Use semantic tokens (text-muted-foreground, bg-muted, etc.).
- [WARN] hardcoded-color (line 74): Hardcoded Tailwind palette color. Use semantic tokens (text-muted-foreground, bg-muted, etc.).
- [WARN] hardcoded-color (line 79): Hardcoded Tailwind palette color. Use semantic tokens (text-muted-foreground, bg-muted, etc.).
- [WARN] hardcoded-color (line 85): Hardcoded Tailwind palette color. Use semantic tokens (text-muted-foreground, bg-muted, etc.).
- [WARN] hardcoded-color (line 90): Hardcoded Tailwind palette color. Use semantic tokens (text-muted-foreground, bg-muted, etc.).
- [WARN] hardcoded-color (line 96): Hardcoded Tailwind palette color. Use semantic tokens (text-muted-foreground, bg-muted, etc.).
- [WARN] a11y-input-label (line 46): <input> has no id or aria-label.
- [WARN] a11y-input-label (line 69): <input> has no id or aria-label.
- [WARN] a11y-input-label (line 80): <input> has no id or aria-label.
- [WARN] a11y-input-label (line 91): <input> has no id or aria-label.

## data/tools.ts entry (append inside the tools array)
```typescript
  {
    slug: "color-converter",
    name: "Color Converter",
    description: "A web-based tool that converts between HEX, RGB, and HSL color formats, providing real-time error and feedback.",
    component: "ColorConverter",
    category: "converter" as ToolCategory,
    tags: ["hex", "rgb", "hsl"],
    status: "new",
    featured: false,
    addedAt: "2026-03-24",
    seo: {
      title: "Color Converter",
      description: "A web-based tool that converts between HEX, RGB, and HSL color formats, providing real-time error and feedback.",
    },
    content: {
      intro: "A web-based tool that converts between HEX, RGB, and HSL color formats, providing real-time error and feedback.",
      usage: "Use the Color Converter by entering your input and clicking the action button.",
      example: "",
      useCases: "",
      faq: [

      ],
    },
  },
```

## lib/toolRegistry.ts line (add inside the toolRegistry object)
```typescript
  ColorConverter      : dynamic(() => import("@/components/tools/ColorConverter")),
```
