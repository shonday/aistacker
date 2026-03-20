// lib/search.ts — Fuse.js powered tool search
// fuse.js is already in package.json — no new dependency needed.
import Fuse from "fuse.js"
import { tools, type ToolMeta } from "@/data/tools"

const fuse = new Fuse(tools, {
  keys: [
    { name: "name",        weight: 3 },
    { name: "tags",        weight: 2 },
    { name: "description", weight: 1 },
    { name: "category",    weight: 1 },
  ],
  threshold: 0.35,
  includeScore: true,
  minMatchCharLength: 2,
})

export function searchTools(query: string): ToolMeta[] {
  if (!query.trim()) return tools
  return fuse.search(query).map((r) => r.item)
}

export function filterByCategory(list: ToolMeta[], category: string | null): ToolMeta[] {
  if (!category) return list
  return list.filter((t) => t.category === category)
}
