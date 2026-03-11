"use client"
import { useState, useMemo } from "react"

export default function RegexTester() {
  const [pattern, setPattern] = useState("")
  const [flags, setFlags] = useState("g")
  const [text, setText] = useState("")

  const highlightedText = useMemo(() => {
    if (!pattern || !text) return text;
    try {
      const regex = new RegExp(pattern, flags);
      // 防止空正则导致死循环
      if (regex.test("")) return text; 
      return text.replace(regex, (match) => `<mark class="bg-yellow-300 text-slate-900 rounded-sm px-0.5">${match}</mark>`);
    } catch (e) {
      return text; // 正则错误时优雅降级，返回原文本
    }
  }, [pattern, flags, text]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <span className="flex items-center justify-center bg-slate-100 border border-slate-300 rounded-l-md px-4 text-xl font-mono text-slate-500">/</span>
        <input 
          type="text" 
          className="flex-grow border-y border-slate-300 p-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter regular expression (e.g., \b\w+\b)"
          value={pattern}
          onChange={(e) => setPattern(e.target.value)}
        />
        <span className="flex items-center justify-center bg-slate-100 border-y border-slate-300 px-2 text-xl font-mono text-slate-500">/</span>
        <input 
          type="text" 
          className="w-20 border border-slate-300 rounded-r-md p-3 font-mono text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="flags"
          value={flags}
          onChange={(e) => setFlags(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Test String</label>
          <textarea
            className="w-full border border-slate-300 p-4 rounded-md font-mono text-sm h-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your test string here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Match Result</label>
          <div 
            className="w-full border border-slate-300 p-4 rounded-md bg-slate-50 font-mono text-sm h-64 overflow-auto whitespace-pre-wrap break-words"
            dangerouslySetInnerHTML={{ __html: highlightedText || "No matches yet." }}
          />
        </div>
      </div>
    </div>
  )
}