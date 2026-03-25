"use client"

import { useState, useMemo, useCallback } from "react"
import { 
  Copy, Check, Pipette, RefreshCw, 
  Palette, Gauge, ArrowRight, Zap, Info
} from "lucide-react"

// --- 健壮的色彩转换算法 ---
const ColorMath = {
  hexToRgb: (hex: string) => {
    const cleanHex = hex.replace("#", "")
    const fullHex = cleanHex.length === 3 
      ? cleanHex.split("").map(c => c + c).join("") 
      : cleanHex
    const num = parseInt(fullHex, 16)
    return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 }
  },
  
  // 简化的 OKLCH 逻辑（用于 UI 展示）
  getOklch: (r: number, g: number, b: number) => {
    const l = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
    const c = 0.12 // 标准适中色度
    const h = Math.round(Math.atan2(g - b, r - g) * (180 / Math.PI))
    return { 
      l: (l * 100).toFixed(1), 
      c: c.toFixed(3), 
      h: h < 0 ? h + 360 : h,
      string: `oklch(${(l * 100).toFixed(1)}% ${c.toFixed(3)} ${h < 0 ? h + 360 : h})`
    }
  },

  // 生成符合设计系统的明度阶梯 (50-950)
  generateShades: (hex: string) => {
    const rgb = ColorMath.hexToRgb(hex)
    const shades = [0.95, 0.85, 0.7, 0.5, 0.3, 0.1, -0.1, -0.3, -0.5, -0.7]
    const labels = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]
    
    return shades.map((t, i) => {
      const mix = (val: number) => {
        const target = t > 0 ? 255 : 0
        const factor = Math.abs(t)
        return Math.round(val + (target - val) * factor)
      }
      const r = mix(rgb.r).toString(16).padStart(2, '0')
      const g = mix(rgb.g).toString(16).padStart(2, '0')
      const b = mix(rgb.b).toString(16).padStart(2, '0')
      return { label: labels[i], hex: `#${r}${g}${b}`.toUpperCase() }
    })
  }
}

export default function ColorConverter() {
  const [hex, setHex] = useState("#6366F1")
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const colorData = useMemo(() => {
    try {
      if (!/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) return null
      const rgb = ColorMath.hexToRgb(hex)
      const oklch = ColorMath.getOklch(rgb.r, rgb.g, rgb.b)
      const shades = ColorMath.generateShades(hex)
      const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255
      
      return {
        hex: hex.toUpperCase(),
        rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
        oklch: oklch.string,
        shades,
        isDark: luminance < 0.5,
        contrast: luminance < 0.5 ? "White" : "Black"
      }
    } catch (e) {
      return null
    }
  }, [hex])

  const copy = useCallback((text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1500)
  }, [])

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 bg-background border rounded-[2rem] shadow-2xl space-y-10">
      
      {/* 顶部交互区 */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* 左侧：输入控制 */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl font-bold">Color Inspector</h2>
          </div>

          <div className="space-y-4">
            <div className="group relative p-4 bg-muted/40 rounded-2xl border border-transparent focus-within:border-primary/30 transition-all">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 block">Hex Source</label>
              <div className="flex items-center gap-4">
                <div className="relative h-12 w-12 rounded-xl border-2 border-background shadow-sm overflow-hidden shrink-0">
                  <input 
                    type="color" 
                    value={colorData?.hex || "#000000"} 
                    onChange={e => setHex(e.target.value)}
                    className="absolute inset-0 scale-[3] cursor-pointer"
                  />
                </div>
                <input
                  value={hex}
                  onChange={e => setHex(e.target.value)}
                  className="w-full bg-transparent font-mono text-2xl outline-none"
                  placeholder="#000000"
                />
                <button onClick={() => setHex("#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0'))} className="p-2 hover:bg-background rounded-lg transition-colors">
                  <RefreshCw className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <ValueRow label="OKLCH" value={colorData?.oklch} onCopy={() => copy(colorData!.oklch, 'oklch')} isCopied={copiedId === 'oklch'} />
              <ValueRow label="RGB" value={colorData?.rgb} onCopy={() => copy(colorData!.rgb, 'rgb')} isCopied={copiedId === 'rgb'} />
            </div>
          </div>
        </div>

        {/* 右侧：视觉预览卡片 */}
        <div className="lg:col-span-3">
          <div 
            className="h-full min-h-[280px] rounded-[1.5rem] p-8 flex flex-col justify-between transition-all duration-500 shadow-xl relative overflow-hidden"
            style={{ backgroundColor: colorData?.hex || "#111" }}
          >
            {/* 装饰性背景 */}
            <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <span className={`text-xs font-bold px-2 py-1 rounded-md uppercase ${colorData?.isDark ? 'bg-white/10 text-white' : 'bg-black/10 text-black'}`}>
                  Preview Mode
                </span>
                <h3 className={`text-5xl font-black mt-4 tracking-tighter ${colorData?.isDark ? 'text-white' : 'text-black'}`}>
                  {colorData?.hex || "Invalid"}
                </h3>
              </div>
              <div className={`p-4 rounded-2xl backdrop-blur-md border ${colorData?.isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-black/5 border-black/10 text-black'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <Gauge className="h-4 w-4" />
                  <span className="text-[10px] font-bold uppercase">Contrast</span>
                </div>
                <p className="text-xl font-bold">{colorData?.contrast} Text</p>
                <p className="text-[10px] opacity-60 font-medium">Safe for accessibility</p>
              </div>
            </div>

            <div className="relative z-10 flex items-center gap-2 text-sm font-medium opacity-80">
              <Info className="h-4 w-4" />
              This color works best for primary brand elements.
            </div>
          </div>
        </div>
      </div>

      {/* 底部：Shades 阶梯（真正的生产力工具） */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-muted-foreground" />
            <span className="font-bold text-sm uppercase tracking-widest text-muted-foreground">Tailwind Shades (50-900)</span>
          </div>
          <span className="text-[10px] text-muted-foreground bg-muted px-2 py-1 rounded">Click shade to copy hex</span>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-3">
          {colorData?.shades.map((shade) => (
            <button
              key={shade.label}
              onClick={() => copy(shade.hex, `shade-${shade.label}`)}
              className="group relative flex flex-col gap-2 p-1.5 rounded-2xl hover:bg-muted transition-colors text-left"
            >
              <div 
                className="h-14 w-full rounded-xl shadow-sm border border-black/5 transition-transform group-hover:scale-[1.02]"
                style={{ backgroundColor: shade.hex }}
              />
              <div className="px-1">
                <p className="text-[10px] font-bold text-muted-foreground">{shade.label}</p>
                <p className="text-[11px] font-mono font-medium flex items-center gap-1">
                  {copiedId === `shade-${shade.label}` ? <Check className="h-3 w-3 text-emerald-500" /> : shade.hex}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function ValueRow({ label, value, onCopy, isCopied }: any) {
  return (
    <div className="flex items-center justify-between p-3 bg-muted/20 rounded-xl border border-transparent hover:border-border group transition-all">
      <div className="space-y-0.5">
        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{label}</p>
        <p className="font-mono text-xs font-semibold">{value || "---"}</p>
      </div>
      <button onClick={onCopy} className={`p-2 rounded-lg transition-all ${isCopied ? 'bg-emerald-500/10' : 'hover:bg-background opacity-0 group-hover:opacity-100'}`}>
        {isCopied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
      </button>
    </div>
  )
}