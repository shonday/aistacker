"use client"

import { useState, useCallback } from "react"
import { Copy, Check, RefreshCw, Trash2 } from "lucide-react"

// ── UUID v4 ───────────────────────────────────────────────────────────────────
function generateV4(): string {
  return crypto.randomUUID()
}

// ── UUID v7 (RFC 9562) ────────────────────────────────────────────────────────
// Time-ordered: first 48 bits = unix ms timestamp → friendly for DB indexes
function generateV7(): string {
  const now = Date.now()
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)

  // Set timestamp (48 bits = 6 bytes)
  const high = Math.floor(now / 0x100000000)
  const low  = now >>> 0
  bytes[0] = (high >>> 8) & 0xff
  bytes[1] = high & 0xff
  bytes[2] = (low >>> 24) & 0xff
  bytes[3] = (low >>> 16) & 0xff
  bytes[4] = (low >>> 8) & 0xff
  bytes[5] = low & 0xff

  // Version 7
  bytes[6] = (bytes[6] & 0x0f) | 0x70
  // Variant
  bytes[8] = (bytes[8] & 0x3f) | 0x80

  const hex = [...bytes].map(b => b.toString(16).padStart(2, "0")).join("")
  return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`
}

// ── ULID (Universally Unique Lexicographically Sortable Identifier) ────────────
const ENCODING = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"
function generateULID(): string {
  const now  = Date.now()
  let time   = now
  let result = ""

  // 10 chars time component
  for (let i = 9; i >= 0; i--) {
    result = ENCODING[time % 32] + result
    time   = Math.floor(time / 32)
  }

  // 16 chars random component
  const rand = new Uint8Array(10)
  crypto.getRandomValues(rand)
  let randBits = 0n
  for (const b of rand) randBits = (randBits << 8n) | BigInt(b)
  for (let i = 0; i < 16; i++) {
    result += ENCODING[Number(randBits % 32n)]
    randBits >>= 5n
  }

  return result.slice(0, 10) + result.slice(10, 26)
}

type Mode = "v4" | "v7" | "ulid"

const MODE_LABELS: Record<Mode, string> = {
  v4:   "UUID v4 — random",
  v7:   "UUID v7 — time-ordered",
  ulid: "ULID — sortable",
}

const MODE_DESCRIPTIONS: Record<Mode, string> = {
  v4:   "128-bit random. Best for most use cases.",
  v7:   "Time-ordered. Better for database primary keys — avoids index fragmentation.",
  ulid: "26-char alphanumeric. Sortable, URL-safe, case-insensitive.",
}

function generate(mode: Mode): string {
  switch (mode) {
    case "v4":   return generateV4()
    case "v7":   return generateV7()
    case "ulid": return generateULID()
  }
}

export default function UUIDGenerator() {
  const [mode, setMode]       = useState<Mode>("v4")
  const [current, setCurrent] = useState(() => generate("v4"))
  const [bulkCount, setBulk]  = useState(10)
  const [bulk, setBulkList]   = useState<string[]>([])
  const [history, setHistory] = useState<string[]>([])
  const [copied, setCopied]   = useState<string | null>(null)

  const copy = useCallback(async (text: string, id: string) => {
    try { await navigator.clipboard.writeText(text) }
    catch {
      const el = document.createElement("textarea")
      el.value = text; document.body.appendChild(el)
      el.select(); document.execCommand("copy"); document.body.removeChild(el)
    }
    setCopied(id)
    setTimeout(() => setCopied(null), 1500)
  }, [])

  function handleGenerate() {
    const next = generate(mode)
    setCurrent(next)
    setBulkList([])
    setHistory(prev => [next, ...prev].slice(0, 10))
  }

  function handleBulk() {
    const count = Math.min(Math.max(1, bulkCount), 1000)
    const list  = Array.from({ length: count }, () => generate(mode))
    setBulkList(list)
    setHistory(prev => [...list.slice(0, 5), ...prev].slice(0, 10))
  }

  function changeMode(m: Mode) {
    setMode(m)
    const next = generate(m)
    setCurrent(next)
    setBulkList([])
    setHistory([next])
  }

  const CopyBtn = ({ text, id, label = "Copy" }: { text: string; id: string; label?: string }) => (
    <button
      onClick={() => copy(text, id)}
      className="flex shrink-0 items-center gap-1 rounded-md border border-border/60 bg-background px-2 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
    >
      {copied === id
        ? <><Check className="h-3 w-3 text-emerald-500" /> Copied</>
        : <><Copy className="h-3 w-3" /> {label}</>
      }
    </button>
  )

  return (
    <div className="space-y-6">

      {/* Mode selector */}
      <div className="grid grid-cols-3 gap-2">
        {(["v4","v7","ulid"] as Mode[]).map(m => (
          <button
            key={m}
            onClick={() => changeMode(m)}
            className={`rounded-lg border p-3 text-left transition-colors ${
              mode === m
                ? "border-primary/50 bg-primary/10"
                : "border-border/60 bg-card hover:border-border hover:bg-muted/30"
            }`}
          >
            <p className="font-mono text-xs font-semibold">{m.toUpperCase()}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{MODE_DESCRIPTIONS[m]}</p>
          </button>
        ))}
      </div>

      {/* Current value */}
      <div className="flex flex-col gap-3 rounded-xl border border-border/60 bg-muted/30 p-5">
        <p className="break-all text-center font-mono font-semibold tracking-wide">
          {current}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={handleGenerate}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            <RefreshCw className="h-4 w-4" /> Generate new
          </button>
          <CopyBtn text={current} id="main" />
        </div>
      </div>

      {/* Bulk generator */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <label htmlFor="bulk-count" className="text-sm font-medium">Bulk generate</label>
          <input
            id="bulk-count"
            type="number"
            min={1}
            max={1000}
            value={bulkCount}
            onChange={e => setBulk(Math.min(1000, Math.max(1, Number(e.target.value))))}
            className="w-24 rounded-md border border-border bg-background px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring/20"
          />
          <button
            onClick={handleBulk}
            className="rounded-md border border-border bg-card px-4 py-1.5 text-sm font-medium hover:bg-muted"
          >
            Generate {bulkCount}
          </button>
          {bulk.length > 0 && (
            <>
              <CopyBtn text={bulk.join("\n")} id="bulk-all" label="Copy all" />
              <button
                onClick={() => setBulkList([])}
                className="ml-auto flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
                title="Clear bulk list"
              >
                <Trash2 className="h-3.5 w-3.5" /> Clear
              </button>
            </>
          )}
        </div>

        {bulk.length > 0 && (
          <div className="max-h-56 overflow-y-auto rounded-lg border border-border/60 bg-muted/20 font-mono text-xs">
            {bulk.map((id, i) => (
              <div key={`${id}-${i}`} className="flex items-center gap-2 border-b border-border/30 px-3 py-1.5 last:border-0">
                <span className="w-8 shrink-0 text-right text-muted-foreground/50">{i + 1}</span>
                <span className="flex-1 break-all">{id}</span>
                <CopyBtn text={id} id={`bulk-${i}`} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* History */}
      {history.length > 1 && (
        <div className="space-y-1.5">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Recent ({history.length})
          </p>
          <div className="space-y-1">
            {history.slice(1).map((id, i) => (
              <div key={`${id}-${i}`} className="flex items-center gap-2 rounded-md border border-border/40 bg-card px-3 py-2">
                <span className="flex-1 break-all font-mono text-xs text-muted-foreground">{id}</span>
                <CopyBtn text={id} id={`hist-${i}`} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
