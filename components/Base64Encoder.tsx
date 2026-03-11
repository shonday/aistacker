"use client"

import { useState } from "react"

const encode = (str: string) => btoa(unescape(encodeURIComponent(str)))
const decode = (str: string) => decodeURIComponent(escape(atob(str)))

export default function Base64Encoder() {
  const [text, setText] = useState("")
  const [encoded, setEncoded] = useState("")
  const [mode, setMode] = useState<"encode" | "decode">("encode")

  const handleProcess = () => {
    if (!text.trim()) {
      setEncoded("")
      return
    }

    try {
      setEncoded(mode === "encode" ? encode(text) : decode(text))
    } catch {
      setEncoded("Error: Invalid input for " + mode)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setMode("encode")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            mode === "encode" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"
          }`}
        >
          Encode Mode
        </button>
        <button
          onClick={() => setMode("decode")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            mode === "decode" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"
          }`}
        >
          Decode Mode
        </button>
      </div>

      <textarea
        className="w-full border border-slate-300 p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono text-sm"
        rows={6}
        placeholder={mode === "encode" ? "Enter plain text to encode..." : "Enter Base64 string to decode..."}
        value={text}
        onChange={(e) => setText(e.target.value)}
        spellCheck={false}
      />

      <div className="flex gap-4">
        <button
          onClick={handleProcess}
          className="bg-slate-900 hover:bg-slate-800 text-white font-medium px-6 py-2 rounded-md transition-colors"
        >
          {mode === "encode" ? "Encode to Base64" : "Decode from Base64"}
        </button>
        <button
          onClick={() => {
            setText("")
            setEncoded("")
          }}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-6 py-2 rounded-md transition-colors"
        >
          Clear
        </button>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">Result:</label>
        <textarea
          className="w-full border border-slate-300 p-4 rounded-md bg-slate-50 font-mono text-sm"
          rows={6}
          value={encoded}
          readOnly
          spellCheck={false}
          placeholder="Result will appear here..."
        />
      </div>
    </div>
  )
}
