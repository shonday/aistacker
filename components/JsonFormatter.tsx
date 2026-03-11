"use client"
import { useState } from "react"

export default function JsonFormatter() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")

  const formatJSON = () => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed, null, 2))
    } catch {
      setOutput("Invalid JSON. Please check your syntax.")
    }
  }

  return (
    <div className="space-y-4">
      <textarea
        className="w-full border border-slate-300 p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono text-sm"
        rows={6}
        placeholder="Paste your raw JSON here..."
        value={input}
        onChange={(e)=>setInput(e.target.value)}
      />
      <div className="flex gap-4">
        <button onClick={formatJSON} className="bg-slate-900 hover:bg-slate-800 text-white font-medium px-6 py-2 rounded-md transition-colors">
          Format & Beautify
        </button>
        <button onClick={() => {setInput(""); setOutput("");}} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-6 py-2 rounded-md transition-colors">
          Clear
        </button>
      </div>
      <textarea
        className="w-full border border-slate-300 p-4 rounded-md bg-slate-50 font-mono text-sm"
        rows={8}
        value={output}
        readOnly
        placeholder="Formatted JSON will appear here..."
      />
    </div>
  )
}