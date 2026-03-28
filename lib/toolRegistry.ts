// lib/toolRegistry.ts
// Dynamic imports for every tool component.
// Code-split: each tool's JS is only loaded when its page is visited.
//
// When the generator adds a new tool, it appends one line here automatically.
// Path convention: components/tools/{ComponentName}.tsx

import ImageCompressor from "@/components/tools/ImageCompressor"
import dynamic from "next/dynamic"

export const toolRegistry: Record<string, React.ComponentType> = {
  JsonFormatter:        dynamic(() => import("@/components/tools/JsonFormatter")),
  Base64Encoder:        dynamic(() => import("@/components/tools/Base64Encoder")),
  UUIDGenerator:        dynamic(() => import("@/components/tools/UUIDGenerator")),
  RegexTester:          dynamic(() => import("@/components/tools/RegexTester")),
  TimestampConverter:   dynamic(() => import("@/components/tools/TimestampConverter")),
  UrlEncoder:           dynamic(() => import("@/components/tools/UrlEncoder")),
  UrlDecoder:           dynamic(() => import("@/components/tools/UrlDecoder")),
  // JwtDecoder:         dynamic(() => import("@/components/tools/JwtDecoder")),
  MarkdownPreview:      dynamic(() => import("@/components/tools/MarkdownPreview")),
  NinjaTextCount:       dynamic(() => import("@/components/tools/NinjaTextCount")),

  // Wave 1 — Phase 4
  JwtDecoder:           dynamic(() => import("@/components/tools/JwtDecoder")),
  HashGenerator:        dynamic(() => import("@/components/tools/HashGenerator")),
  ColorConverter:       dynamic(() => import("@/components/tools/ColorConverter")),
  JsMinifier:           dynamic(() => import("@/components/tools/JsMinifier")),
  Danmaku2ASS:          dynamic(() => import("@/components/tools/Danmaku2ASS")),
  NumberBaseConverter:  dynamic(() => import("@/components/tools/NumberBaseConverter")),
  DiffChecker:          dynamic(() => import("@/components/tools/DiffChecker")),
  YamlFormatter:        dynamic(() => import("@/components/tools/YamlFormatter")),
  CsvJsonConverter:     dynamic(() => import("@/components/tools/CsvJsonConverter")),
  ImageCompressor:      dynamic(() => import("@/components/tools/ImageCompressor")),
  ImageCompressorAll:   dynamic(() => import("@/components/tools/ImageCompressorAll")),




}
  