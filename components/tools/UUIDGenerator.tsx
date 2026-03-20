"use client"

import { useState, useCallback } from "react"
import { Copy, Check, RefreshCw } from "lucide-react"

function generateUUID() {
  return crypto.randomUUID()
}

export default function UUIDGenerator() {
  const [uuid, setUuid]         = useState(() => generateUUID())
  const [history, setHistory]   = useState<string[]>([])
  const [bulkCount, setBulkCount] = useState(5)
  const [bulk, setBulk]         = useState<string[]>([])
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const copy = useCallback(async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // Fallback for HTTP contexts
      const el = document.createElement("textarea")
      el.value = text
      document.body.appendChild(el)
      el.select()
      document.execCommand("copy")
      document.body.removeChild(el)
    }
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1500)
  }, [])

  const handleGenerate = () => {
    const next = generateUUID()
    setUuid(next)
    setHistory((prev) => [next, ...prev].slice(0, 10))
    setBulk([])
  }

  const handleBulk = () => {
    const list = Array.from({ length: Math.min(bulkCount, 100) }, generateUUID)
    setBulk(list)
    setHistory((prev) => [...list, ...prev].slice(0, 10))
  }

  const CopyBtn = ({ text, id }: { text: string; id: string }) => {
    const copied = copiedId === id
    return (
      <button
        onClick={() => copy(text, id)}
        className="flex shrink-0 items-center gap-1 rounded-md border border-border/60 bg-background px-2 py-1 text-xs text-muted-foreground transition-colors hover:border-border hover:text-foreground"
        aria-label="Copy to clipboard"
      >
        {copied
          ? <><Check className="h-3 w-3 text-emerald-500" /> Copied</>
          : <><Copy className="h-3 w-3" /> Copy</>
        }
      </button>
    )
  }

  return (
    <div className="space-y-6">

      {/* ── Single UUID ─────────────────────────────────────── */}
      <div className="flex flex-col gap-3 rounded-lg border border-border/60 bg-muted/40 p-5">
        <p className="break-all text-center font-mono text-lg font-semibold tracking-wide text-foreground">
          {uuid}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={handleGenerate}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <RefreshCw className="h-4 w-4" /> Generate new
          </button>
          <CopyBtn text={uuid} id="main" />
        </div>
      </div>

      {/* ── Bulk generator ──────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm font-medium">Bulk generate</label>
          <input
            type="number"
            min={1}
            max={100}
            value={bulkCount}
            onChange={(e) => setBulkCount(Math.min(100, Math.max(1, Number(e.target.value))))}
            className="w-20 rounded-md border border-border bg-background px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
          />
          <button
            onClick={handleBulk}
            className="rounded-md border border-border bg-card px-4 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
          >
            Generate {bulkCount} UUIDs
          </button>
          {bulk.length > 0 && (
            <button
              onClick={() => copy(bulk.join("\n"), "bulk-all")}
              className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              {copiedId === "bulk-all"
                ? <><Check className="h-3 w-3 text-emerald-500" /> All copied</>
                : <><Copy className="h-3 w-3" /> Copy all</>
              }
            </button>
          )}
        </div>

        {bulk.length > 0 && (
          <div className="max-h-64 overflow-y-auto rounded-lg border border-border/60 bg-muted/30">
            {bulk.map((id, i) => (
              <div
                key={id}
                className="flex items-center justify-between gap-3 border-b border-border/40 px-3 py-2 last:border-0"
              >
                <span className="font-mono text-xs text-muted-foreground">{i + 1}</span>
                <span className="flex-1 break-all font-mono text-sm">{id}</span>
                <CopyBtn text={id} id={`bulk-${i}`} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── History ─────────────────────────────────────────── */}
      {history.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Recent ({history.length})
          </p>
          <div className="space-y-1.5">
            {history.map((id, i) => (
              <div
                key={`${id}-${i}`}
                className="flex items-center justify-between gap-3 rounded-md border border-border/40 bg-card px-3 py-2"
              >
                <span className="break-all font-mono text-sm text-muted-foreground">{id}</span>
                <CopyBtn text={id} id={`hist-${i}`} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
