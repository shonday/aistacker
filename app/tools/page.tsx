import { Suspense } from "react"
import { tools } from "@/data/tools"
import { ToolsDirectory } from "@/components/layout/ToolsDirectory"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "All Tools",
  description:
    "Browse free developer tools: JSON formatter, Base64 encoder, UUID generator, Regex tester, Japanese word counter, and many more — all run locally in your browser.",
}

export default function ToolsPage() {
  // Pass the full tools list as a prop so the client component can search/filter
  // without a server round-trip. Works perfectly for up to ~500 tools.
  return (
    <Suspense>
      <ToolsDirectory tools={tools} />
    </Suspense>
  )
}
