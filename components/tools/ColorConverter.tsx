"use client"

import { useState, useMemo, useCallback } from "react"
import { Copy, Check, Hash, Pipette, AlertCircle, RefreshCw } from "lucide-react"

// --- Utilities ---

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const fullHex = hex.length === 4 
    ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}` 
    : hex
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

function rgbToHsl(r: number, g: number, b: number): string {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h = 0, s, l = (max + min) / 2

  if (max === min) {
    h = s = 0
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h /= 6
  }
  return `${Math.round(h * 360)}°, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%`
}

// --- Components ---

export default function ColorConverter() {
  const [hex, setHex] = useState("#6366f1")
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // 核心逻辑：基于 hex 派生其他值
  const colorData = useMemo(() => {
    const rgb = hexToRgb(hex)
    if (!rgb) return null
    return {
      hex: hex.startsWith("#") ? hex : `#${hex}`,
      rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
      hsl: `hsl(${rgbToHsl(rgb.r, rgb.g, rgb.b)})`,
      isDark: (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000 < 128
    }
  }, [hex])

  const copy = useCallback(async (text: string, id: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1500)
  }, [])

  return (
    <div className="max-w-md mx-auto space-y-6 p-1">
      {/* 实时预览大卡片 */}
      <div 
        className="h-32 w-full rounded-2xl shadow-inner flex items-end p-4 transition-colors duration-300 border border-black/5"
        style={{ backgroundColor: colorData?.hex || "#eee" }}
      >
        <div className={`text-xs font-mono px-2 py-1 rounded bg-white/20 backdrop-blur-md ${colorData?.isDark ? 'text-white' : 'text-black'}`}>
          {colorData?.hex.toUpperCase() || "Invalid Color"}
        </div>
      </div>

      <div className="grid gap-5">
        {/* HEX 输入区 */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Pipette className="h-3 w-3" /> Base Hex Color
          </label>
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <input 
                type="color" 
                value={colorData?.hex || "#000000"} 
                onChange={(e) => setHex(e.target.value)}
                className="w-6 h-6 rounded-md cursor-pointer border-0 p-0 bg-transparent overflow-hidden"
              />
            </div>
            <input
              value={hex}
              onChange={(e) => setHex(e.target.value)}
              placeholder="#000000"
              className="w-full pl-12 pr-4 py-3 bg-background border rounded-xl font-mono text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
            {!colorData && hex.length > 0 && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-destructive">
                <AlertCircle className="h-4 w-4" />
              </div>
            )}
          </div>
        </div>

        <hr className="border-border/50" />

        {/* 转换结果区 */}
        <div className="space-y-3">
          <ResultRow 
            label="RGB" 
            value={colorData?.rgb || "---"} 
            onCopy={() => colorData && copy(colorData.rgb, 'rgb')}
            isCopied={copiedId === 'rgb'}
            disabled={!colorData}
          />
          <ResultRow 
            label="HSL" 
            value={colorData?.hsl || "---"} 
            onCopy={() => colorData && copy(colorData.hsl, 'hsl')}
            isCopied={copiedId === 'hsl'}
            disabled={!colorData}
          />
        </div>
      </div>

      {/* 辅助操作 */}
      <div className="flex justify-center">
        <button 
          onClick={() => setHex("#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0'))}
          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          <RefreshCw className="h-3 w-3" /> Random Color
        </button>
      </div>
    </div>
  )
}

function ResultRow({ label, value, onCopy, isCopied, disabled }: { 
  label: string, 
  value: string, 
  onCopy: () => void, 
  isCopied: boolean,
  disabled: boolean
}) {
  return (
    <div className={`flex items-center justify-between p-3 rounded-lg border border-border/40 bg-muted/20 transition-opacity ${disabled ? 'opacity-50' : ''}`}>
      <div className="space-y-0.5">
        <span className="text-[10px] font-bold text-muted-foreground uppercase">{label}</span>
        <p className="font-mono text-sm">{value}</p>
      </div>
      <button
        disabled={disabled}
        onClick={onCopy}
        className="p-2 hover:bg-background rounded-md transition-colors border border-transparent hover:border-border group"
      >
        {isCopied ? (
          <Check className="h-4 w-4 text-emerald-500" />
        ) : (
          <Copy className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
        )}
      </button>
    </div>
  )
}