"use client";

import { useState, useCallback, useMemo } from "react";
import * as Diff from "diff";
import { 
  GitPullRequest, Trash2, FileText, FilePlus, 
  Settings2, ShieldCheck, Loader2, AlertCircle, 
  SplitSquareHorizontal
} from "lucide-react";

/**
 * 类型定义（直接绑定官方库）
 */
type DiffEngine = typeof Diff;
type DiffPart = Diff.Change;

type DiffMode = "lines" | "words" | "chars";

interface DiffOptions {
  ignoreCase?: boolean;
  ignoreWhitespace?: boolean;
  newlineIsToken?: boolean;
}

export default function DiffChecker() {
  const [originalText, setOriginalText] = useState("");
  const [modifiedText, setModifiedText] = useState("");
  const [diffResult, setDiffResult] = useState<DiffPart[] | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [config, setConfig] = useState({
    mode: "lines" as DiffMode,
    ignoreCase: false,
    ignoreWhitespace: false,
  });

  /**
   * 核心比较逻辑（无异步依赖，更稳定）
   */
  const handleCompare = useCallback(() => {
    if (!originalText && !modifiedText) return;

    setIsProcessing(true);
    setError(null);
    setDiffResult(null);

    try {
      const options: DiffOptions = {
        ignoreCase: config.ignoreCase,
        ignoreWhitespace: config.ignoreWhitespace,
      };

      let result: DiffPart[];

      if (config.mode === "lines") {
        result = Diff.diffLines(originalText, modifiedText, options);
      } else if (config.mode === "words") {
        result = Diff.diffWords(originalText, modifiedText, options);
      } else {
        result = Diff.diffChars(originalText, modifiedText, options);
      }

      setDiffResult(result);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Comparison failed";
      setError(message);
    } finally {
      setIsProcessing(false);
    }
  }, [originalText, modifiedText, config]);

  /**
   * 统计信息
   */
  const stats = useMemo(() => {
    if (!diffResult) return null;

    let additions = 0;
    let deletions = 0;

    diffResult.forEach((part) => {
      const count = part.count || part.value.length;

      if (part.added) additions += count;
      if (part.removed) deletions += count;
    });

    return { additions, deletions, total: diffResult.length };
  }, [diffResult]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* 输入区 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 原文 */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider">
              <FileText className="h-3 w-3" /> Original Text
            </label>
            <button 
              onClick={() => setOriginalText("")} 
              className="text-[10px] text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors"
            >
              <Trash2 className="h-3 w-3" /> Clear
            </button>
          </div>
          <textarea
            value={originalText}
            onChange={(e) => setOriginalText(e.target.value)}
            rows={12}
            spellCheck={false}
            className="w-full resize-none rounded-lg border border-border bg-muted/20 p-4 font-mono text-xs"
          />
        </div>

        {/* 修改后 */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider">
              <FilePlus className="h-3 w-3 text-emerald-500" /> Modified Text
            </label>
            <button 
              onClick={() => setModifiedText("")} 
              className="text-[10px] text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors"
            >
              <Trash2 className="h-3 w-3" /> Clear
            </button>
          </div>
          <textarea
            value={modifiedText}
            onChange={(e) => setModifiedText(e.target.value)}
            rows={12}
            spellCheck={false}
            className="w-full resize-none rounded-lg border border-border bg-muted/20 p-4 font-mono text-xs"
          />
        </div>
      </div>

      {/* 控制区 */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-1 p-1 bg-muted rounded-md border border-border/50">
              {(["lines", "words", "chars"] as DiffMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setConfig({ ...config, mode })}
                  className={`px-3 py-1 text-[10px] font-bold uppercase ${
                    config.mode === mode ? 'bg-background shadow-sm' : ''
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            <ConfigToggle 
              active={config.ignoreWhitespace} 
              onClick={() => setConfig(prev => ({ ...prev, ignoreWhitespace: !prev.ignoreWhitespace }))}
              label="Ignore Whitespace"
            />

            <ConfigToggle 
              active={config.ignoreCase} 
              onClick={() => setConfig(prev => ({ ...prev, ignoreCase: !prev.ignoreCase }))}
              label="Ignore Case"
            />
          </div>

          <div className="flex items-center gap-2 px-3">
            <ShieldCheck className="h-3.5 w-3.5 text-blue-500" />
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Local Diff Engine
            </span>
          </div>
        </div>
        
        <button 
          onClick={handleCompare}
          disabled={isProcessing || (!originalText && !modifiedText)}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-primary-foreground rounded-lg font-bold text-sm"
        >
          {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <GitPullRequest className="h-4 w-4" />}
          {isProcessing ? "Analyzing..." : "Compare Texts"}
        </button>
      </div>

      {/* 错误 */}
      {error && (
        <div className="flex items-start gap-2 p-3 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive text-[11px] font-mono">
          <AlertCircle className="h-3.5 w-3.5" />
          {error}
        </div>
      )}

      {/* 结果 */}
      {diffResult && (
        <div className="space-y-4">
          {stats && (
            <div className="grid grid-cols-3 gap-3">
              <StatCard label="Additions" value={`+${stats.additions}`} type="added" />
              <StatCard label="Deletions" value={`-${stats.deletions}`} type="removed" />
              <StatCard label="Total" value={stats.additions + stats.deletions} />
            </div>
          )}

          <div className="rounded-lg border bg-zinc-950 p-4 overflow-x-auto">
            <pre className="font-mono text-[13px] whitespace-pre-wrap">
              {diffResult.map((part, index) => {
                const color = part.added
                  ? "text-green-400"
                  : part.removed
                  ? "text-red-400"
                  : "text-gray-400";

                return (
                  <span key={index} className={color}>
                    {part.value}
                  </span>
                );
              })}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * 子组件
 */
function ConfigToggle({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button onClick={onClick} className={`px-3 py-1 text-xs border rounded ${active ? 'bg-primary/10' : ''}`}>
      <Settings2 className="inline w-3 h-3 mr-1" />
      {label}
    </button>
  );
}

function StatCard({ label, value, type }: { label: string; value: string | number; type?: 'added' | 'removed' }) {
  const color = type === 'added' ? 'text-green-500' : type === 'removed' ? 'text-red-500' : '';

  return (
    <div className="p-3 border rounded text-center">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={`font-bold ${color}`}>{value}</div>
    </div>
  );
}