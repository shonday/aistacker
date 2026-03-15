"use client";

import { useCallback, useEffect, useState } from "react";
import {
  formatJson,
  type JsonFormatMode,
  type JsonFormatOptions,
} from "@/utils/jsonFormatter";

const DEFAULT_INPUT = `{
  "name": "aistacker.dev",
  "description": "Developer-first toolbox for JSON and web utilities.",
  "features": [
    "JSON formatting",
    "URL encoding",
    "JWT inspection"
  ],
  "version": 1
}`;

export default function JsonFormatter() {
  const [input, setInput] = useState(DEFAULT_INPUT);
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<JsonFormatMode>("pretty");
  const [sortKeys, setSortKeys] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasFormattedOnce, setHasFormattedOnce] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  const runFormat = useCallback(() => {
    const options: JsonFormatOptions = { mode, sortKeys };
    const result = formatJson(input, options);

    setHasFormattedOnce(true);

    if (result.ok && result.output !== undefined) {
      setOutput(result.output);
      setError(null);
    } else {
      setOutput("");
      setError(result.error?.message ?? "Invalid JSON input.");
    }
  }, [input, mode, sortKeys]);

  useEffect(() => {
    // Auto format on first load
    runFormat();
  }, [runFormat]);

  const handleCopy = async () => {
    if (!output) return;
    try {
      setIsCopying(true);
      await navigator.clipboard.writeText(output);
      // You can later replace this with a toast
    } finally {
      setIsCopying(false);
    }
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError(null);
    setHasFormattedOnce(false);
  };

  const showError = Boolean(error && hasFormattedOnce);

  return (
    <div className="flex flex-col gap-5">
      {/* Header / Intro */}
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-semibold tracking-tight">
          JSON Formatter &amp; Validator
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Paste your JSON on the left, then format, minify, or sort keys. 
          Designed for developers who need a fast, reliable JSON workspace.
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-card px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Mode
          </span>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as JsonFormatMode)}
            className="rounded-md border bg-background px-2 py-1 text-xs"
          >
            <option value="pretty">Pretty (readable)</option>
            <option value="minify">Minify (compact)</option>
          </select>
        </div>

        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          <input
            type="checkbox"
            checked={sortKeys}
            onChange={(e) => setSortKeys(e.target.checked)}
            className="h-3 w-3"
          />
          Sort object keys
        </label>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={runFormat}
            className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground shadow-sm hover:opacity-90"
          >
            Format JSON
            <span className="text-[10px] opacity-80">
              ⌘ / Ctrl + Enter
            </span>
          </button>
          <button
            type="button"
            onClick={handleCopy}
            disabled={!output || isCopying}
            className="inline-flex items-center gap-1 rounded-md border px-3 py-1 text-xs font-medium hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isCopying ? "Copied" : "Copy result"}
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex items-center gap-1 rounded-md border px-3 py-1 text-xs font-medium hover:bg-accent"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Main content: two-column layout */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Input panel */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-muted-foreground">
              JSON input
            </span>
            <span className="text-[11px] text-muted-foreground">
              Paste raw JSON or a JavaScript-style object.
            </span>
          </div>
          <div
            className={[
              "relative rounded-lg border bg-background",
              showError ? "border-red-500/70" : "border-border",
            ].join(" ")}
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                  e.preventDefault();
                  runFormat();
                }
              }}
              spellCheck={false}
              className="min-h-[260px] w-full resize-y rounded-lg bg-transparent p-3 font-mono text-xs leading-relaxed focus:outline-none"
              placeholder={`{ "example": true }`}
            />
            {showError && (
              <div className="border-t border-red-500/40 bg-red-500/5 px-3 py-2 text-[11px] text-red-600">
                <span className="font-medium">Parse error:</span>{" "}
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>

        {/* Output panel */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-muted-foreground">
              Formatted output
            </span>
            <span className="text-[11px] text-muted-foreground">
              Output is read-only. Use copy to reuse it elsewhere.
            </span>
          </div>
          <div className="relative rounded-lg border border-border bg-muted/60">
            <textarea
              value={output}
              readOnly
              spellCheck={false}
              className="min-h-[260px] w-full resize-y rounded-lg bg-transparent p-3 font-mono text-xs leading-relaxed text-foreground/90 focus:outline-none"
              placeholder="Formatted JSON will appear here."
            />
          </div>
        </div>
      </div>

      {/* Future extension hint (Tree view / AI) */}
      <div className="mt-1 text-[11px] text-muted-foreground">
        Coming next: JSON tree view, diff, and AI-powered explanations. This formatter is built to grow with aistacker.dev.
      </div>
    </div>
  );
}