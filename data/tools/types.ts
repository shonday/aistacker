// data/tools/types.ts — All TypeScript types for the tool registry

export type ToolCategory =
  | "formatter" | "encoder" | "generator" | "tester"
  | "converter" | "japanese" | "text" | "number"
  | "color" | "image" | "network" | "crypto"

export type ToolSubcategory =
  | "json" | "yaml" | "xml" | "csv"
  | "base64" | "url" | "html" | "jwt"
  | "uuid" | "hash" | "password"
  | "regex" | "diff" | "lint" | "design"
  | "timestamp" | "timezone" | "color-space"
  | "markdown" | "unicode" | "word-count"
  | "number-base" | "ip" | "dns"

export type ToolStatus = "stable" | "beta" | "new"

export interface ToolFaq {
  q: string
  a: string
}

export interface ToolContent {
  intro:    string
  usage:    string
  example:  string
  useCases: string
  faq:      ToolFaq[]
}

export interface ToolWorkflow {
  before: string[]
  after:  string[]
}

export interface ToolSearchIntents {
  informational: string[]
  navigational:  string[]
  transactional: string[]
}

export interface ToolI18nOverride {
  name?:        string
  description?: string
  seo?:         { title: string; description: string }
  content?:     Partial<ToolContent>
}

export interface ToolMeta {
  slug:          string
  name:          string
  description:   string
  component:     string
  category:      ToolCategory
  subcategory:   ToolSubcategory
  tags:          string[]
  status:        ToolStatus
  featured?:     boolean
  addedAt:       string
  seo:           { title: string; description: string }
  content:       ToolContent
  problems:      string[]
  workflow:      ToolWorkflow
  searchIntents: ToolSearchIntents
  apiEndpoint?:  string
  i18n?:         Partial<Record<"ja" | "zh", ToolI18nOverride>>
}
