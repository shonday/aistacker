"use client"
import { useState } from "react"

export default function UrlDecoder() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")

  const handleDecode = () => {
    try {
      setOutput(decodeURIComponent(input))
    } catch {
      setOutput("Error: Could not decode. Check if the string is correctly encoded.")
    }
  }

  return (
    <div className="space-y-4">
      <textarea
        className="w-full border border-slate-300 p-4 rounded-md font-mono text-sm h-32 focus:ring-2 focus:ring-blue-500 outline-none"
        placeholder="Enter Base64 encoded URL string..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={handleDecode} className="bg-slate-900 text-white px-6 py-2 rounded-md hover:bg-slate-800 transition-colors">
        Decode
      </button>
      <textarea
        className="w-full border border-slate-300 p-4 rounded-md bg-slate-50 font-mono text-sm h-32"
        value={output}
        readOnly
        placeholder="Decoded result..."
      />
    </div>
  )
}