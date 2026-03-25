"use client";

import React, { useState, useCallback, useMemo } from "react";
import { 
  Download, 
  Trash2, 
  Settings2, 
  AlertCircle, 
  FileCode,
  Play,
  Check,
  Zap
} from "lucide-react";

/**
 * Type Definitions
 */
interface DanmakuConfig {
  resX: number;
  resY: number;
  fontSize: number;
  duration: number;
  opacity: string;
}

/**
 * Core Logic: XML to ASS
 */
const convertDanmakuToAss = (xmlString: string, config: DanmakuConfig): string => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");
  const nodes = Array.from(xmlDoc.getElementsByTagName("d"));

  const { resX, resY, fontSize, duration, opacity } = config;
  const tracks = new Array(Math.floor(resY / (fontSize + 8))).fill(0);
  
  let ass = `[Script Info]\nScriptType: v4.00+\nPlayResX: ${resX}\nPlayResY: ${resY}\nScaledBorderAndShadow: yes\n\n`;
  ass += `[V4+ Styles]\nFormat: Name, Fontname, Fontsize, PrimaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding\n`;
  assBody: ass += `Style: Default,Arial,${fontSize},&H${opacity}FFFFFF,&H${opacity}000000,&H${opacity}000000,0,0,0,0,100,100,0,0,1,1,0,2,20,20,20,1\n\n`;
  ass += `[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n`;

  nodes.forEach((node) => {
    const p = node.getAttribute("p")?.split(",") || [];
    if (p.length < 4) return;

    const time = parseFloat(p[0]);
    const type = parseInt(p[1]);
    const decColor = parseInt(p[3]);
    const content = node.textContent?.replace(/\r|\n/g, "") || "";

    const b = (decColor >> 16) & 0xFF;
    const g = (decColor >> 8) & 0xFF;
    const r = decColor & 0xFF;
    const assColor = `${b.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${r.toString(16).padStart(2, '0')}`.toUpperCase();

    const fmt = (s: number) => {
      const ms = Math.floor((s % 1) * 100);
      const full = new Date(s * 1000).toISOString().substring(11, 19);
      return `${full}.${ms.toString().padStart(2, '0')}`;
    };

    let trackIdx = 0;
    if (type === 1) {
      trackIdx = tracks.findIndex(lastTime => time > lastTime);
      if (trackIdx === -1) trackIdx = Math.floor(Math.random() * tracks.length);
      tracks[trackIdx] = time + (duration * 0.45);
    }

    const y = (trackIdx + 1) * (fontSize + 12);
    const start = fmt(time);
    const end = fmt(time + duration);

    ass += `Dialogue: 0,${start},${end},Default,,0,0,0,,{\\c&H${assColor}&\\move(${resX + 50},${y},-500,${y})}${content}\n`;
  });

  return ass;
};

export default function Danmaku2ASS() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloaded, setDownloaded] = useState(false);

  const [config, setConfig] = useState<DanmakuConfig>({
    resX: 1920,
    resY: 1080,
    fontSize: 40,
    duration: 10,
    opacity: "00"
  });

  const handleProcess = useCallback(() => {
    if (!input.trim()) return;
    setIsProcessing(true);
    setError(null);
    try {
      const result = convertDanmakuToAss(input, config);
      setOutput(result);
    } catch {
      setError("Parsing error: Ensure your input is a valid Bilibili XML file.");
    } finally {
      setIsProcessing(false);
    }
  }, [input, config]);

  const handleDownload = () => {
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'danmaku.ass';
    a.click();
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  const count = useMemo(() => (input.match(/<\/d>/g) || []).length, [input]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Input Section */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider">
            <FileCode className="h-3 w-3" /> Source Danmaku (XML)
          </label>
          <button 
            onClick={() => setInput("")} 
            className="text-[10px] text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors"
          >
            <Trash2 className="h-3 w-3" /> Clear
          </button>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={8}
          spellCheck={false}
          placeholder="Paste your Bilibili XML content here..."
          className="w-full resize-none rounded-lg border border-border bg-background p-3 font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all"
        />
      </div>

      {/* Control & Config Panel */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <ConfigItem label="Width" value={config.resX} onChange={(v) => setConfig(c => ({...c, resX: v}))} />
          <ConfigItem label="Height" value={config.resY} onChange={(v) => setConfig(c => ({...c, resY: v}))} />
          <ConfigItem label="Font Size" value={config.fontSize} onChange={(v) => setConfig(c => ({...c, fontSize: v}))} />
          <ConfigItem label="Speed (s)" value={config.duration} onChange={(v) => setConfig(c => ({...c, duration: v}))} />
        </div>
        
        <button 
          onClick={handleProcess}
          disabled={!input || isProcessing}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-primary-foreground rounded-lg font-bold text-sm hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-30"
        >
          {isProcessing ? <Zap className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4 fill-current" />}
          {isProcessing ? "Processing..." : "Generate ASS Script"}
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive text-xs">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Result Section */}
      {output && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="rounded-lg border border-border/60 bg-card overflow-hidden">
            <div className="flex items-center justify-between border-b border-border/40 bg-muted/30 px-4 py-2.5">
              <div className="flex flex-col">
                <p className="text-xs font-bold uppercase tracking-tight">Output Preview</p>
                <p className="text-[10px] text-muted-foreground">{count} items processed successfully</p>
              </div>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 rounded border border-border bg-background px-3 py-1 text-xs font-medium text-foreground hover:bg-accent transition-colors"
              >
                {downloaded ? <Check className="h-3 w-3 text-emerald-500" /> : <Download className="h-3 w-3" />}
                {downloaded ? "Saved" : "Download .ass"}
              </button>
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-[11px] leading-normal text-muted-foreground max-h-[400px] whitespace-pre">
              {output.split('\n').slice(0, 50).join('\n')}
              {output.split('\n').length > 50 && "\n... (Remaining content hidden for performance)"}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Config Field Helper
 */
function ConfigItem({ label, value, onChange }: { label: string, value: number, onChange: (v: number) => void }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider flex items-center gap-1">
        <Settings2 className="h-2.5 w-2.5" /> {label}
      </label>
      <input 
        type="number" 
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value) || 0)}
        className="w-full rounded-md border border-border bg-muted/20 px-2 py-1.5 text-xs font-mono focus:outline-none focus:bg-background transition-all"
      />
    </div>
  );
}
