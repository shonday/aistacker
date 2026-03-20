// lib/toolRegistry.ts
// Dynamic imports for every tool component.
// Code-split: each tool's JS is only loaded when its page is visited.
//
// When the generator adds a new tool, it appends one line here automatically.
// Path convention: components/tools/{ComponentName}.tsx

import dynamic from "next/dynamic"

export const toolRegistry: Record<string, React.ComponentType> = {
  JsonFormatter:      dynamic(() => import("@/components/tools/JsonFormatter")),
  Base64Encoder:      dynamic(() => import("@/components/tools/Base64Encoder")),
  UUIDGenerator:      dynamic(() => import("@/components/tools/UUIDGenerator")),
  RegexTester:        dynamic(() => import("@/components/tools/RegexTester")),
  TimestampConverter: dynamic(() => import("@/components/tools/TimestampConverter")),
  UrlEncoder:         dynamic(() => import("@/components/tools/UrlEncoder")),
  UrlDecoder:         dynamic(() => import("@/components/tools/UrlDecoder")),
}
