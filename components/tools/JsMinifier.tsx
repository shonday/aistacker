"use client";

import { useState, useCallback, useMemo } from "react";
import { 
  Zap, Copy, Check, Trash2, 
  Settings2, FileCode, ShieldCheck, 
  Loader2, AlertCircle, Play, BarChart3
} from "lucide-react";

/**
 * Type Definitions
 */
interface TerserOptions {
  mangle: boolean;
  compress: {
    drop_console: boolean;
    dead_code: boolean;
  };
  format: {
    comments: boolean;
  };
}

interface MinificationStats {
  originalSize: number;
  minifiedSize: number;
  ratio: string;
}

// Extend Window for Terser Global
declare global {
  interface Window {
    Terser: {
      minify: (code: string, options: TerserOptions) => Promise<{ code?: string }>;
    };
  }
}

async function runTerser(code: string, options: TerserOptions): Promise<string> {
  if (typeof window === "undefined") return code;
  if (!window.Terser) {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/terser/dist/bundle.min.js";
    document.head.appendChild(script);
    await new Promise((res) => (script.onload = res));
  }
  try {
    const result = await window.Terser.minify(code, options);
    return result.code || "";
  } catch (err) {
    throw err;
  }
}

export default function JsMinifier() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [config, setConfig] = useState<TerserOptions>({
    mangle: true,
    compress: { drop_console: false, dead_code: true },
    format: { comments: false }
  });

  const handleMinify = useCallback(async () => {
    if (!input.trim()) return;
    setIsProcessing(true);
    setError(null);
    try {
      const minified = await runTerser(input, config);
      setOutput(minified);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Minification failed";
      setError(message);
    } finally {
      setIsProcessing(false);
    }
  }, [input, config]);

  const stats = useMemo<MinificationStats | null>(() => {
    if (!input || !output) return null;
    const originalSize = new Blob([input]).size;
    const minifiedSize = new Blob([output]).size;
    const ratio = (((originalSize - minifiedSize) / originalSize) * 100).toFixed(1);
    return { originalSize, minifiedSize, ratio };
  }, [input, output]);

  const copyResult = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Input Section */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider">
            <FileCode className="h-3 w-3" /> Source JavaScript
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
          rows={10}
          spellCheck={false}
          placeholder="// Paste your production code here..."
          className="w-full resize-none rounded-lg border border-border bg-background p-3 font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all"
        />
      </div>

      {/* Control Panel */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex flex-wrap gap-3 mb-4">
          <ConfigToggle 
            active={config.mangle} 
            onClick={() => setConfig(prev => ({ ...prev, mangle: !prev.mangle }))}
            label="Mangle"
          />
          <ConfigToggle 
            active={config.compress.drop_console} 
            onClick={() => setConfig(prev => ({ ...prev, compress: { ...prev.compress, drop_console: !prev.compress.drop_console } }))}
            label="Drop Console"
          />
          <div className="ml-auto flex items-center gap-2 px-3 border-l border-border/50">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Terser Engine v5</span>
          </div>
        </div>
        
        <button 
          onClick={handleMinify}
          disabled={isProcessing || !input}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-primary-foreground rounded-lg font-bold text-sm hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-30 shadow-none border-none"
        >
          {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4 fill-current" />}
          {isProcessing ? "Optimizing AST..." : "Run Optimizer"}
        </button>
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive text-[11px] font-mono whitespace-pre-wrap">
          <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      {/* Result Section */}
      {output && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="rounded-lg border border-border/60 bg-card overflow-hidden">
            <div className="flex items-center justify-between border-b border-border/40 bg-muted/30 px-4 py-2.5">
              <div className="flex flex-col">
                <p className="text-xs font-bold uppercase tracking-tight">Compressed Build</p>
                {stats && <p className="text-[10px] text-emerald-500 font-bold">Saved {stats.ratio}% of original size</p>}
              </div>
              <button
                onClick={copyResult}
                className="flex items-center gap-1.5 rounded border border-border bg-background px-3 py-1 text-xs font-medium text-foreground hover:bg-accent transition-colors"
              >
                {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                {copied ? "Copied" : "Copy Result"}
              </button>
            </div>
            <textarea
              readOnly
              value={output}
              className="w-full h-64 p-4 font-mono text-[11px] leading-normal text-muted-foreground bg-transparent outline-none resize-none"
            />
          </div>

          {/* Stats Bar */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard label="Input" value={`${stats.originalSize} B`} />
              <StatCard label="Output" value={`${stats.minifiedSize} B`} />
              <StatCard label="Ratio" value={`-${stats.ratio}%`} highlight />
              <StatCard label="Gzip (est)" value={`${Math.round(stats.minifiedSize * 0.4)} B`} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Sub-components
 */
interface ConfigToggleProps {
  active: boolean;
  onClick: () => void;
  label: string;
}

function ConfigToggle({ active, onClick, label }: ConfigToggleProps) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-md border text-[10px] font-bold uppercase tracking-wider transition-all ${
        active 
          ? 'bg-primary/5 border-primary/40 text-primary' 
          : 'bg-background border-border text-muted-foreground hover:border-border/80'
      }`}
    >
      <Settings2 className="h-3 w-3" />
      {label}: {active ? "ON" : "OFF"}
    </button>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  highlight?: boolean;
}

function StatCard({ label, value, highlight }: StatCardProps) {
  return (
    <div className="p-3 bg-muted/20 rounded-lg border border-border/60">
      <div className="flex items-center gap-1.5 mb-1 opacity-60">
        <BarChart3 className="h-2.5 w-2.5 text-muted-foreground" />
        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{label}</span>
      </div>
      <p className={`text-sm font-mono font-bold ${highlight ? 'text-primary' : 'text-foreground'}`}>{value}</p>
    </div>
  );
}
