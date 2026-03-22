"use client"

import { useState, useMemo, useCallback } from "react"
import { Copy, Check, AlertTriangle, Clock, ShieldCheck, ShieldAlert } from "lucide-react"

function base64UrlDecode(str: string): string {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/")
  const pad    = padded.length % 4
  const fixed  = pad ? padded + "=".repeat(4 - pad) : padded
  try {
    return decodeURIComponent(
      atob(fixed).split("").map(c => "%" + c.charCodeAt(0).toString(16).padStart(2, "0")).join("")
    )
  } catch {
    return atob(fixed)
  }
}

function prettyJson(obj: unknown): string {
  return JSON.stringify(obj, null, 2)
}

function formatExpiry(exp: number): { label: string; expired: boolean; relative: string } {
  const now   = Date.now() / 1000
  const diff  = exp - now
  const expired = diff < 0
  const abs   = Math.abs(diff)
  const days  = Math.floor(abs / 86400)
  const hours = Math.floor((abs % 86400) / 3600)
  const mins  = Math.floor((abs % 3600) / 60)

  const label    = new Date(exp * 1000).toISOString()
  const relative = expired
    ? `Expired ${days ? days + "d " : ""}${hours ? hours + "h " : ""}${mins}m ago`
    : `Expires in ${days ? days + "d " : ""}${hours ? hours + "h " : ""}${mins}m`

  return { label, expired, relative }
}

interface DecodedJWT {
  header:  Record<string, unknown>
  payload: Record<string, unknown>
  signature: string
}

const SAMPLE = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyXzEyMyIsIm5hbWUiOiJBbGljZSIsImVtYWlsIjoiYWxpY2VAZXhhbXBsZS5jb20iLCJpYXQiOjE3MDQwNjcyMDAsImV4cCI6MjA1MDAwMDAwMH0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"

export default function JwtDecoder() {
  const [token, setToken]   = useState(SAMPLE)
  const [copied, setCopied] = useState<string | null>(null)

  const decoded = useMemo((): DecodedJWT | null => {
    const t = token.trim()
    if (!t) return null
    const parts = t.split(".")
    if (parts.length !== 3) return null
    try {
      const header  = JSON.parse(base64UrlDecode(parts[0]))
      const payload = JSON.parse(base64UrlDecode(parts[1]))
      return { header, payload, signature: parts[2] }
    } catch {
      return null
    }
  }, [token])

  const isInvalid = token.trim() && token.split(".").length !== 3

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

  const CopyBtn = ({ text, id }: { text: string; id: string }) => (
    <button
      onClick={() => copy(text, id)}
      className="flex items-center gap-1 rounded border border-border/60 bg-background px-2 py-0.5 text-xs text-muted-foreground hover:text-foreground"
    >
      {copied === id ? <><Check className="h-3 w-3 text-emerald-500" /> Copied</> : <><Copy className="h-3 w-3" /> Copy</>}
    </button>
  )

  const exp     = decoded?.payload?.exp as number | undefined
  const expInfo = exp ? formatExpiry(exp) : null

  return (
    <div className="space-y-5">

      {/* Input */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="jwt-input" className="text-xs font-medium text-muted-foreground">
          Paste your JWT token
        </label>
        <textarea
          id="jwt-input"
          value={token}
          onChange={e => setToken(e.target.value)}
          rows={4}
          spellCheck={false}
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
          className="w-full resize-none rounded-lg border border-border bg-background p-3 font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-ring/20"
        />
        {isInvalid && (
          <p className="flex items-center gap-1.5 text-xs text-destructive">
            <AlertTriangle className="h-3.5 w-3.5" />
            Invalid JWT structure — expected 3 dot-separated parts
          </p>
        )}
      </div>

      {decoded && (
        <div className="space-y-4">

          {/* Expiry status */}
          {expInfo && (
            <div className={`flex items-start gap-3 rounded-lg border px-4 py-3 ${
              expInfo.expired
                ? "border-destructive/30 bg-destructive/10 text-destructive"
                : "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
            }`}>
              {expInfo.expired
                ? <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
                : <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
              }
              <div className="text-sm">
                <p className="font-medium">{expInfo.relative}</p>
                <p className="text-xs opacity-75">{expInfo.label}</p>
              </div>
            </div>
          )}

          {/* Header */}
          <Section
            title="Header"
            subtitle={`alg: ${decoded.header.alg ?? "?"} · typ: ${decoded.header.typ ?? "?"}`}
            content={prettyJson(decoded.header)}
            id="header"
            CopyBtn={CopyBtn}
          />

          {/* Payload */}
          <Section
            title="Payload"
            subtitle={`${Object.keys(decoded.payload).length} claims`}
            content={prettyJson(decoded.payload)}
            id="payload"
            CopyBtn={CopyBtn}
          />

          {/* Signature */}
          <div className="rounded-lg border border-border/60 bg-card overflow-hidden">
            <div className="flex items-center justify-between border-b border-border/40 bg-muted/30 px-4 py-2">
              <div>
                <p className="text-sm font-semibold">Signature</p>
                <p className="text-xs text-muted-foreground">Cannot be verified client-side without the secret key</p>
              </div>
              <CopyBtn text={decoded.signature} id="signature" />
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-xs text-muted-foreground break-all whitespace-pre-wrap">
              {decoded.signature}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}

function Section({
  title, subtitle, content, id, CopyBtn,
}: {
  title: string
  subtitle: string
  content: string
  id: string
  CopyBtn: React.ComponentType<{ text: string; id: string }>
}) {
  return (
    <div className="rounded-lg border border-border/60 bg-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-border/40 bg-muted/30 px-4 py-2">
        <div>
          <p className="text-sm font-semibold">{title}</p>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <CopyBtn text={content} id={id} />
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed">
        {content}
      </pre>
    </div>
  )
}
