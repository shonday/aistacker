"use client";

import { useState, useCallback } from "react"; // 移除了 useMemo
import { 
  ArrowRightLeft, Trash2, FileSpreadsheet, FileJson, 
  Settings2, ShieldCheck, Loader2, AlertCircle, Copy, Check,
  Database
} from "lucide-react";

/**
 * 严格的 TypeScript 接口定义：PapaParse
 */
interface PapaParseError {
  type: string;
  code: string;
  message: string;
  row: number;
}

interface PapaParseResult<T> {
  data: T[];
  errors: PapaParseError[];
  meta: {
    delimiter: string;
    linebreak: string;
    aborted: boolean;
    truncated: boolean;
    cursor: number;
    fields?: string[];
  };
}

interface PapaParseOptions {
  header?: boolean;
  skipEmptyLines?: boolean | 'greedy';
  delimiter?: string;
  quotes?: boolean;
}

interface PapaEngine {
  parse: <T = Record<string, unknown>>(csvString: string, config?: PapaParseOptions) => PapaParseResult<T>;
  unparse: (data: unknown[] | object, config?: PapaParseOptions) => string;
}

declare global {
  interface Window {
    Papa: PapaEngine;
  }
}

// 递归扁平化函数，处理嵌套 JSON 结构
const flattenObject = (obj: Record<string, unknown>, prefix = '', res: Record<string, unknown> = {}): Record<string, unknown> => {
  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
    
    const propName = prefix ? `${prefix}_${key}` : key;
    const value = obj[key];

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      flattenObject(value as Record<string, unknown>, propName, res);
    } else if (Array.isArray(value)) {
      res[propName] = JSON.stringify(value);
    } else {
      res[propName] = value;
    }
  }
  return res;
};

async function getPapaEngine(): Promise<PapaEngine> {
  if (typeof window === "undefined") throw new Error("Server side");
  if (window.Papa && typeof window.Papa.parse === "function") return window.Papa;

  return new Promise((resolve, reject) => {
    const existingScript = document.getElementById("papaparse-cdn-script");
    if (existingScript) {
      const checkInterval = setInterval(() => {
        if (window.Papa && typeof window.Papa.parse === "function") {
          clearInterval(checkInterval);
          resolve(window.Papa);
        }
      }, 50);
      return;
    }

    const script = document.createElement("script");
    script.id = "papaparse-cdn-script";
    script.src = "https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js";
    script.async = true;
    
    script.onload = () => {
      if (window.Papa && typeof window.Papa.parse === "function") {
        resolve(window.Papa);
      } else {
        reject(new Error("PapaParse loaded but window.Papa is missing."));
      }
    };
    script.onerror = () => reject(new Error("Failed to load PapaParse from CDN."));
    document.head.appendChild(script);
  });
}

type ConversionMode = "csv-to-json" | "json-to-csv";

export default function CsvJsonConverter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<ConversionMode>("csv-to-json");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState<{ records: number; fields: number } | null>(null);
  
  const [config, setConfig] = useState({
    prettyPrint: true,
    hasHeader: true,
  });

  const handleConvert = useCallback(async () => {
    if (!input.trim()) {
      setOutput("");
      setError(null);
      setStats(null);
      return;
    }

    setIsProcessing(true);
    setError(null);
    setStats(null);

    try {
      const engine = await getPapaEngine();

      if (mode === "csv-to-json") {
        const result = engine.parse(input, {
          header: config.hasHeader,
          skipEmptyLines: 'greedy',
        });

        if (result.errors.length > 0) {
          throw new Error(`CSV Parsing Error: ${result.errors[0].message}`);
        }

        const jsonString = config.prettyPrint 
          ? JSON.stringify(result.data, null, 2) 
          : JSON.stringify(result.data);
          
        setOutput(jsonString);
        setStats({
          records: result.data.length,
          fields: result.meta.fields?.length || 0
        });

      } else {
        // --- JSON -> CSV (修复版) ---
        let parsedJson: unknown;
        try {
          parsedJson = JSON.parse(input);
        } catch (err) {
          throw new Error(`Invalid JSON syntax: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }

        if (typeof parsedJson !== 'object' || parsedJson === null) {
          throw new Error("JSON must be an array of objects or an object.");
        }

        // 统一转换为数组处理，并进行类型断言
        const dataArray = Array.isArray(parsedJson) 
          ? (parsedJson as Record<string, unknown>[]) 
          : [parsedJson as Record<string, unknown>];

        // 核心：处理嵌套数据的扁平化
        const flattenedData = dataArray.map(item => flattenObject(item));

        const csvString = engine.unparse(flattenedData, {
          header: config.hasHeader,
        });

        setOutput(csvString);
        
        setStats({
          records: flattenedData.length,
          fields: flattenedData.length > 0 ? Object.keys(flattenedData[0]).length : 0
        });
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Conversion failed.");
      setOutput("");
    } finally {
      setIsProcessing(false);
    }
  }, [input, config, mode]);

  const toggleMode = () => {
    setMode(prev => prev === "csv-to-json" ? "json-to-csv" : "csv-to-json");
    if (output && !error) {
      setInput(output);
      setOutput("");
      setStats(null);
    } else {
      setInput("");
      setOutput("");
      setError(null);
      setStats(null);
    }
  };

  const copyResult = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isCsvToJson = mode === "csv-to-json";

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 md:p-0">
      <div className="bg-card border border-border rounded-3xl p-5 md:p-6 shadow-sm flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20">
            <Database className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight">Data Converter</h1>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> PapaParse Engine
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <button 
            onClick={toggleMode}
            className="flex items-center gap-2 px-4 py-2 bg-muted/50 hover:bg-muted border border-border rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
          >
            {isCsvToJson ? <FileSpreadsheet className="h-4 w-4 text-blue-500" /> : <FileJson className="h-4 w-4 text-amber-500" />}
            <ArrowRightLeft className="h-3 w-3 text-muted-foreground" />
            {isCsvToJson ? <FileJson className="h-4 w-4 text-amber-500" /> : <FileSpreadsheet className="h-4 w-4 text-blue-500" />}
          </button>
          
          <div className="w-px h-6 bg-border mx-1 hidden sm:block"></div>

          <button 
            onClick={() => setConfig(p => ({ ...p, hasHeader: !p.hasHeader }))}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all ${
              config.hasHeader ? 'bg-primary/5 border-primary/40 text-primary' : 'bg-background border-border text-muted-foreground'
            }`}
          >
            <Settings2 className="h-3 w-3" /> Headers
          </button>

          <button 
            onClick={handleConvert}
            disabled={isProcessing || !input.trim()}
            className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRightLeft className="h-4 w-4" />}
            {isCsvToJson ? "Convert to JSON" : "Convert to CSV"}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-2xl text-destructive text-xs font-mono flex gap-3 items-center">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <div>{error}</div>
        </div>
      )}

      {stats && !error && (
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-muted/20 border rounded-2xl flex flex-col items-center justify-center">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Records Parsed</span>
            <p className="text-xl font-mono font-bold text-foreground">{stats.records}</p>
          </div>
          <div className="p-4 bg-muted/20 border rounded-2xl flex flex-col items-center justify-center">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Data Fields (Cols)</span>
            <p className="text-xl font-mono font-bold text-foreground">{stats.fields}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2 px-2">
            {isCsvToJson ? "CSV Input" : "JSON Input"}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            className="w-full h-125 resize-none rounded-2xl border border-border bg-muted/20 p-5 font-mono text-[13px] leading-relaxed focus:outline-none focus:ring-4 focus:ring-primary/5 focus:bg-background transition-all whitespace-pre"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between px-2">
            <label className="text-[10px] font-black text-primary uppercase tracking-widest">
              {isCsvToJson ? "JSON Output" : "CSV Output"}
            </label>
            <button onClick={copyResult} disabled={!output} className="text-[10px] font-bold uppercase text-muted-foreground hover:text-primary transition-colors">
              {copied ? "Copied!" : "Copy Output"}
            </button>
          </div>
          <div className="relative rounded-2xl border bg-zinc-950 overflow-hidden shadow-xl">
            <textarea
              readOnly
              value={output}
              className="w-full h-125 p-5 font-mono text-[13px] leading-relaxed text-zinc-300 bg-transparent outline-none resize-none whitespace-pre"
            />
          </div>
        </div>
      </div>
    </div>
  );
}