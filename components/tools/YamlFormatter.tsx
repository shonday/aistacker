"use client";

import { useState, useCallback, useMemo } from "react";
import { 
  Wand2, Trash2, FileCode2, Settings2, 
  ShieldCheck, Loader2, AlertCircle, Copy, Check,
  CheckCircle2, XCircle
} from "lucide-react";

/**
 * 严格的 TypeScript 接口定义，杜绝 any
 */
interface YamlDumpOptions {
  indent?: number;
  skipInvalid?: boolean;
  flowLevel?: number;
  sortKeys?: boolean;
  lineWidth?: number;
}

interface YamlMark {
  name: string | null;
  buffer: string;
  position: number;
  line: number;
  column: number;
}

// js-yaml 抛出的异常结构
interface YamlException extends Error {
  name: string;
  reason: string;
  mark: YamlMark;
}

interface JsYamlEngine {
  load: (str: string) => unknown;
  dump: (obj: unknown, opts?: YamlDumpOptions) => string;
}

declare global {
  interface Window {
    jsyaml: JsYamlEngine;
  }
}

// 防御性 CDN 加载逻辑
async function getYamlEngine(): Promise<JsYamlEngine> {
  if (typeof window === "undefined") throw new Error("Server side");
  if (window.jsyaml && typeof window.jsyaml.load === "function") return window.jsyaml;

  return new Promise((resolve, reject) => {
    const existingScript = document.getElementById("jsyaml-cdn-script");
    if (existingScript) {
      const checkInterval = setInterval(() => {
        if (window.jsyaml && typeof window.jsyaml.load === "function") {
          clearInterval(checkInterval);
          resolve(window.jsyaml);
        }
      }, 50);
      return;
    }

    const script = document.createElement("script");
    script.id = "jsyaml-cdn-script";
    script.src = "https://cdn.jsdelivr.net/npm/js-yaml@4.1.0/dist/js-yaml.min.js";
    script.async = true;
    
    script.onload = () => {
      if (window.jsyaml && typeof window.jsyaml.load === "function") {
        resolve(window.jsyaml);
      } else {
        reject(new Error("js-yaml loaded but window.jsyaml is missing."));
      }
    };
    script.onerror = () => reject(new Error("Failed to load js-yaml from CDN."));
    document.head.appendChild(script);
  });
}

export default function YamlFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<YamlException | string | null>(null);
  const [copied, setCopied] = useState(false);
  
  const [config, setConfig] = useState<YamlDumpOptions>({
    indent: 2,
    sortKeys: false,
    lineWidth: 80,
  });

  const handleFormat = useCallback(async () => {
    if (!input.trim()) {
      setOutput("");
      setError(null);
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const engine = await getYamlEngine();
      
      // 1. 解析验证 (Validate)
      const parsedData = engine.load(input);
      
      // 如果输入为空或者只包含注释，parsedData 可能是 undefined
      if (parsedData === undefined) {
        setOutput(input);
        return;
      }

      // 2. 序列化格式化 (Format)
      const formatted = engine.dump(parsedData, config);
      setOutput(formatted);
      
    } catch (err: unknown) {
      // 区分解析错误和普通错误
      if (err instanceof Error && "mark" in err) {
        setError(err as YamlException);
      } else {
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
      }
      setOutput("");
    } finally {
      setIsProcessing(false);
    }
  }, [input, config]);

  const copyResult = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lineCount = useMemo(() => input.split("\n").length, [input]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 md:p-0">
      
      {/* 顶部控制面板 */}
      <div className="bg-card border border-border rounded-3xl p-5 md:p-6 shadow-sm flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20">
            <FileCode2 className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight">YAML Formatter</h1>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Standard js-yaml Parser
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="flex items-center bg-muted/50 rounded-lg p-1 border border-border/50">
            <button 
              onClick={() => setConfig(p => ({ ...p, indent: 2 }))}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${config.indent === 2 ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              2 Spaces
            </button>
            <button 
              onClick={() => setConfig(p => ({ ...p, indent: 4 }))}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${config.indent === 4 ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              4 Spaces
            </button>
          </div>
          
          <button 
            onClick={() => setConfig(p => ({ ...p, sortKeys: !p.sortKeys }))}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-wider transition-all ${
              config.sortKeys ? 'bg-primary/5 border-primary/40 text-primary' : 'bg-background border-border text-muted-foreground'
            }`}
          >
            <Settings2 className="h-3 w-3" /> Sort Keys
          </button>

          <button 
            onClick={handleFormat}
            disabled={isProcessing || !input.trim()}
            className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
            Format & Validate
          </button>
        </div>
      </div>

      {/* 验证状态条 */}
      {input.trim() && !isProcessing && (
        <div className={`p-3 rounded-xl border flex items-center gap-3 text-sm font-medium animate-in fade-in ${
          error ? 'bg-destructive/10 border-destructive/20 text-destructive' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
        }`}>
          {error ? <XCircle className="h-5 w-5 shrink-0" /> : <CheckCircle2 className="h-5 w-5 shrink-0" />}
          {error ? (
            <div className="flex flex-col">
              <span className="font-bold">Invalid YAML Configuration</span>
              <span className="text-xs opacity-90 mt-0.5">
                {typeof error === 'string' ? error : `Line ${error.mark.line + 1}, Column ${error.mark.column + 1}: ${error.reason}`}
              </span>
            </div>
          ) : (
            <span>YAML is valid and properly structured.</span>
          )}
        </div>
      )}

      {/* 工作区 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Area */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-2">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              Raw Input <span className="text-[9px] font-medium opacity-60 normal-case bg-muted px-1.5 py-0.5 rounded">{lineCount} lines</span>
            </label>
            <button 
              onClick={() => { setInput(""); setOutput(""); setError(null); }} 
              className="text-[10px] text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors"
            >
              <Trash2 className="h-3 w-3" /> Clear
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            placeholder="# Paste your raw YAML or JSON here..."
            className="w-full h-[500px] resize-none rounded-2xl border border-border bg-muted/20 p-5 font-mono text-xs md:text-[13px] leading-relaxed focus:outline-none focus:ring-4 focus:ring-primary/5 focus:bg-background transition-all"
          />
        </div>

        {/* Output Area */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-2">
            <label className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2">
              Formatted Output
            </label>
            <button
              onClick={copyResult}
              disabled={!output}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                copied ? 'bg-emerald-500 text-white' : 'bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground disabled:opacity-30'
              }`}
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copied ? "Copied!" : "Copy YAML"}
            </button>
          </div>
          <div className="relative rounded-2xl border bg-zinc-950 dark:bg-[#0d1117] overflow-hidden group shadow-xl">
             <textarea
                readOnly
                value={output}
                placeholder="Formatted YAML will appear here..."
                className="w-full h-[500px] p-5 font-mono text-xs md:text-[13px] leading-relaxed text-zinc-300 bg-transparent outline-none resize-none"
              />
              {/* 解析错误时的标记覆盖层 */}
              {error && typeof error !== 'string' && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center p-6 text-center">
                  <div className="bg-destructive/10 border border-destructive/30 p-4 rounded-xl max-w-sm">
                    <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-3" />
                    <p className="text-sm font-bold text-destructive mb-1">Syntax Error at Line {error.mark.line + 1}</p>
                    <p className="text-xs text-destructive/80 font-mono bg-black/20 p-2 rounded text-left mt-3 whitespace-pre-wrap">
                      {error.mark.buffer.split('\n')[error.mark.line]}
                      <br/>
                      <span className="text-yellow-500">{' '.repeat(error.mark.column)}^</span>
                    </p>
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}