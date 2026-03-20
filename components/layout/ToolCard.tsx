import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { isNewTool, CATEGORY_LABELS, type ToolMeta } from "@/data/tools"

interface ToolCardProps {
  tool: ToolMeta
  compact?: boolean
}

export function ToolCard({ tool, compact = false }: ToolCardProps) {
  const isNew = isNewTool(tool)

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className={cn(
        "group relative flex flex-col rounded-lg border border-border/60 bg-card transition-all",
        "hover:border-border hover:bg-muted/40 hover:shadow-sm",
        compact ? "gap-1 p-3" : "gap-2 p-4"
      )}
    >
      {/* Category + badges row */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">{CATEGORY_LABELS[tool.category]}</span>
        {isNew && (
          <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
            New
          </span>
        )}
        {tool.status === "beta" && (
          <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-400">
            Beta
          </span>
        )}
      </div>

      {/* Tool name */}
      <h3 className={cn("font-semibold leading-snug", compact ? "text-sm" : "text-base")}>
        {tool.name}
      </h3>

      {/* Description — hidden in compact mode */}
      {!compact && (
        <p className="line-clamp-2 text-sm text-muted-foreground">{tool.description}</p>
      )}

      {/* Arrow hint */}
      <ArrowRight className="absolute bottom-4 right-4 h-4 w-4 text-muted-foreground/30 transition-all group-hover:translate-x-0.5 group-hover:text-muted-foreground/70" />
    </Link>
  )
}
