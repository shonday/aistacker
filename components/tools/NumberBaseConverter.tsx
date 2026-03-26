"use client";

import React, { useState, useCallback, useEffect } from "react";
import { 
  Hash, 
  Copy, 
  Check, 
  RotateCcw, 
  AlertCircle, 
  Activity,
  Binary,
  Variable
} from "lucide-react";

/**
 * Base Definitions
 */
interface BaseConfig {
  label: string;
  base: number;
  id: string;
  placeholder: string;
}

const BASES: BaseConfig[] = [
  { id: "bin", label: "Binary", base: 2, placeholder: "0101..." },
  { id: "oct", label: "Octal", base: 8, placeholder: "0-7..." },
  { id: "dec", label: "Decimal", base: 10, placeholder: "0-9..." },
  { id: "hex", label: "Hexadecimal", base: 16, placeholder: "0-F..." },
  { id: "b32", label: "Base 32", base: 32, placeholder: "0-V..." },
  { id: "b36", label: "Base 36", base: 36, placeholder: "0-Z..." },
];

export default function NumberBaseConverter() {
  const [val, setVal] = useState<bigint | null>(null);
  const [inputVal, setInputVal] = useState("");
  const [activeBase, setActiveBase] = useState<number>(10);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleUpdate = (input: string, base: number) => {
    setInputVal(input);
    setActiveBase(base);
    setError(null);

    if (!input.trim()) {
      setVal(null);
      return;
    }

    try {
      // BigInt used to prevent overflow on large numbers
      const parsed = BigInt(`0x0`); // dummy to check if BigInt is available
      const cleanInput = base === 16 ? input.replace(/^0x/i, "") : input;
      
      // Manual parsing for bases because BigInt only supports 2, 8, 10, 16 literals
      let decimalValue = BigInt(0);
      const digits = "0123456789abcdefghijklmnopqrstuvwxyz";
      const normalizedInput = cleanInput.toLowerCase();

      for (const char of normalizedInput) {
        const digit = digits.indexOf(char);
        if (digit === -1 || digit >= base) throw new Error("Invalid character");
        decimalValue = decimalValue * BigInt(base) + BigInt(digit);
      }
      
      setVal(decimalValue);
    } catch {
      setError(`Invalid input for Base ${base}`);
      setVal(null);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const reset = () => {
    setVal(null);
    setInputVal("");
    setError(null);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Info */}
      <div className="flex items-center justify-between px-1">
        <div className="flex flex-col">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <Hash className="h-3 w-3" /> Number System Engine
          </h2>
          <p className="text-[10px] text-muted-foreground/60 font-medium italic">Supports arbitrary precision BigInt conversion</p>
        </div>
        <button 
          onClick={reset}
          className="p-2 hover:bg-muted rounded-md text-muted-foreground transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Conversion Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {BASES.map((b) => (
          <div 
            key={b.id} 
            className={`rounded-lg border transition-all duration-200 overflow-hidden bg-card ${
              activeBase === b.base && val !== null 
                ? "border-primary/40 ring-1 ring-primary/10" 
                : "border-border/60"
            }`}
          >
            <div className="flex items-center justify-between px-3 py-2 border-b border-border/40 bg-muted/20">
              <span className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground flex items-center gap-1.5">
                {b.base === 2 ? <Binary className="h-3 w-3"/> : <Variable className="h-3 w-3"/>}
                {b.label} <span className="opacity-40">(Base {b.base})</span>
              </span>
              {val !== null && (
                <button 
                  onClick={() => copyToClipboard(val.toString(b.base).toUpperCase(), b.id)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {copiedId === b.id ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                </button>
              )}
            </div>
            
            <input
              type="text"
              spellCheck={false}
              placeholder={b.placeholder}
              value={activeBase === b.base ? inputVal : (val?.toString(b.base).toUpperCase() || "")}
              onChange={(e) => handleUpdate(e.target.value, b.base)}
              className="w-full bg-transparent px-3 py-3 font-mono text-sm focus:outline-none placeholder:opacity-30"
            />
          </div>
        ))}
      </div>

      {/* Error & Feedback Bar */}
      <div className="flex flex-col gap-3 min-h-[40px]">
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive text-[11px] font-medium animate-in fade-in zoom-in-95">
            <AlertCircle className="h-3.5 w-3.5" /> {error}
          </div>
        )}
        
        {val !== null && !error && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-widest animate-in slide-in-from-left-2 transition-all">
            <Activity className="h-3 w-3 animate-pulse" /> Live Synchronized Pipeline
          </div>
        )}
      </div>
    </div>
  );
}
