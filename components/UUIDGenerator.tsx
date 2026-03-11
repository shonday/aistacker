"use client"

import { useState } from "react"

export default function UUIDGenerator() {
  const generateUUID = () => crypto.randomUUID()
  const [uuid, setUuid] = useState(generateUUID())
  const [history, setHistory] = useState<string[]>([])

  const handleGenerate = () => {
    const newUuid = generateUUID()
    setUuid(newUuid)
    setHistory(prev => [newUuid, ...prev].slice(0, 5))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert("Copied to clipboard!")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
        <div className="text-2xl font-mono font-bold text-slate-900 mb-6 break-all text-center">
          {uuid}
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleGenerate} 
            className="bg-slate-900 hover:bg-slate-800 text-white font-medium px-8 py-3 rounded-md transition-colors shadow-sm"
          >
            Generate New UUID
          </button>
          <button 
            onClick={() => copyToClipboard(uuid)} 
            className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium px-6 py-3 rounded-md transition-colors"
          >
            Copy
          </button>
        </div>
      </div>

      {history.length > 0 && (
        <div className="mt-8">
          <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Recent History</h4>
          <ul className="space-y-2">
            {history.map((item, index) => (
              <li key={index} className="flex justify-between items-center p-3 bg-white border border-slate-100 rounded-md text-sm font-mono text-slate-600">
                {item}
                <button onClick={() => copyToClipboard(item)} className="text-blue-600 hover:underline text-xs">Copy</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}