# Japanese Word Counter — Review Checklist

## Steps
1. `npm run dev` → open http://localhost:3000/tools/japanese-word-count
2. Verify all 7 features work:
   1. count hiragana characters
   2. count katakana characters
   3. count kanji characters
   4. count total characters (including spaces)
   5. count total characters (excluding spaces)
   6. live update as user types
   7. copy summary to clipboard
3. Test with empty input → no crash, clear error state
4. Test copy button → clipboard receives correct value
5. Toggle dark mode → no broken colors
6. Resize to mobile (375px) → layout intact

## Static check result
Errors: 0
Warnings: 0

None.

## data/tools.ts entry (append inside the tools array)
```typescript
  {
    slug: "japanese-word-count",
    name: "Japanese Word Counter",
    description: "Count hiragana, katakana, kanji, and total characters in Japanese text instantly.",
    component: "JapaneseWordCount",
    category: "japanese" as ToolCategory,
    tags: [],
    status: "new",
    featured: false,
    addedAt: "2026-03-20",
    seo: {
      title: "Japanese Word Counter",
      description: "Count hiragana, katakana, kanji, and total characters in Japanese text instantly.",
    },
    content: {
      intro: "Count hiragana, katakana, kanji, and total characters in Japanese text instantly.",
      usage: "Use the Japanese Word Counter by entering your input and clicking the action button.",
      example: "",
      useCases: "",
      faq: [

      ],
    },
  },
```

## lib/toolRegistry.ts line (add inside the toolRegistry object)
```typescript
  JapaneseWordCount   : dynamic(() => import("@/components/tools/JapaneseWordCount")),
```
