"use client"
import { useState, useEffect } from "react"

export default function TimestampConverter() {
  const [input, setInput] = useState(Math.floor(Date.now() / 1000).toString())
  const [results, setResults] = useState({ utc: "", local: "", iso: "" })

  const convert = () => {
    try {
      const ts = parseInt(input)
      if (isNaN(ts)) throw new Error()
      const date = new Date(ts * 1000)
      setResults({
        utc: date.toUTCString(),
        local: date.toString(),
        iso: date.toISOString()
      })
    } catch {
      setResults({ utc: "Invalid Timestamp", local: "Invalid Timestamp", iso: "Invalid Timestamp" })
    }
  }

  useEffect(() => { convert() }, [])

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Unix Timestamp (seconds)</label>
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-grow border border-slate-300 p-3 rounded-md font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button onClick={convert} className="bg-slate-900 text-white px-6 py-2 rounded-md hover:bg-slate-800 transition-colors">
            Convert
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="p-4 bg-slate-50 border rounded-md">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Local Time</span>
          <p className="font-mono text-slate-800 break-all">{results.local}</p>
        </div>
        <div className="p-4 bg-slate-50 border rounded-md">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">UTC Time</span>
          <p className="font-mono text-slate-800 break-all">{results.utc}</p>
        </div>
        <div className="p-4 bg-slate-50 border rounded-md">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">ISO 8601</span>
          <p className="font-mono text-slate-800 break-all">{results.iso}</p>
        </div>
      </div>
    </div>
  )
}