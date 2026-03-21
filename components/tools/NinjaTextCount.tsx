"use client"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card" // Assuming you have a Card component; if not, use a div
import { Copy, Download, Trash2, AlertCircle } from "lucide-react"

// Utility: Debounce hook for performance
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])
  return debouncedValue
}

const kanjiRegex = /[\u4e00-\u9faf\u3400-\u4dbf]/g
const hiraganaRegex = /[\u3040-\u309f]/g
const katakanaRegex = /[\u30a0-\u30ff]/g

interface CharacterCounts {
  kanji: number
  hiragana: number
  katakana: number
  other: number
  total: number
}

export default function NinjaTextCount() {
  const [text, setText] = useState("")
  const [warning, setWarning] = useState("")
  const [counts, setCounts] = useState<CharacterCounts>({ kanji: 0, hiragana: 0, katakana: 0, other: 0, total: 0 })
  const [copied, setCopied] = useState<string | null>(null)
  const [notification, setNotification] = useState<string | null>(null)

  const debouncedText = useDebounce(text, 300)

  useEffect(() => {
    countCharacters(debouncedText)
  }, [debouncedText])

  const countCharacters = useCallback((input: string) => {
    const kanjiCount = (input.match(kanjiRegex) || []).length
    const hiraganaCount = (input.match(hiraganaRegex) || []).length
    const katakanaCount = (input.match(katakanaRegex) || []).length
    const totalCount = input.replace(/\s/g, '').length // Exclude spaces for total
    const otherCount = totalCount - (kanjiCount + hiraganaCount + katakanaCount)
    setCounts({ kanji: kanjiCount, hiragana: hiraganaCount, katakana: katakanaCount, other: otherCount, total: totalCount })

    if (input && kanjiCount === 0 && hiraganaCount === 0 && katakanaCount === 0) {
      setWarning("No Japanese characters detected. Counts may be zero.")
    } else {
      setWarning("")
    }
  }, [])

  const copyToClipboard = useCallback(async (content: string, type: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setNotification(`${type} copied to clipboard!`)
    } catch {
      // Fallback for older browsers
      const el = document.createElement("textarea")
      el.value = content
      document.body.appendChild(el)
      el.select()
      document.execCommand("copy")
      document.body.removeChild(el)
      setNotification(`${type} copied to clipboard!`)
    }
    setTimeout(() => setNotification(null), 2000)
  }, [])

  const handleExport = useCallback((format: string) => {
    let content: string
    if (format === "csv") {
      content = `Type,Count\nKanji,${counts.kanji}\nHiragana,${counts.hiragana}\nKatakana,${counts.katakana}\nOther,${counts.other}\nTotal,${counts.total}`
    } else {
      content = JSON.stringify(counts, null, 2)
    }
    copyToClipboard(content, format.toUpperCase())
  }, [counts, copyToClipboard])

  const handleClear = useCallback(() => {
    setText("")
    setCounts({ kanji: 0, hiragana: 0, katakana: 0, other: 0, total: 0 })
    setWarning("")
  }, [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      handleExport("csv")
    }
  }, [handleExport])

  return (
    <div className="max-w-4xl mx-auto p-6 bg-background rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">Ninja Text Counter</h2>
        <Button variant="outline" size="sm" onClick={handleClear} aria-label="Clear text">
          <Trash2 className="w-4 h-4 mr-2" />
          Clear
        </Button>
      </div>

      {warning && (
        <div className="flex items-center p-3 mb-4 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded">
          <AlertCircle className="w-5 h-5 mr-2" />
          {warning}
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="text-input" className="block text-sm font-medium text-foreground mb-2">
          Enter text (mixed languages allowed)
        </label>
        <textarea
          id="text-input"
          className="w-full h-40 p-3 bg-muted border border-border rounded-md resize-y focus:ring-2 focus:ring-primary focus:border-transparent"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type or paste your text here..."
          maxLength={10000}
          aria-describedby="char-count"
        />
        <p id="char-count" className="text-xs text-muted-foreground mt-1">
          {text.length}/10000 characters
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Kanji</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">{counts.kanji}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Hiragana</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">{counts.hiragana}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Katakana</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">{counts.katakana}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Other</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">{counts.other}</p>
          </CardContent>
        </Card>
      </div>

      <div className="text-center mb-4">
        <p className="text-lg font-semibold text-foreground">Total Characters (non-space): {counts.total}</p>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        <Button onClick={() => handleExport("csv")} disabled={!text}>
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
        <Button onClick={() => handleExport("json")} disabled={!text}>
          <Download className="w-4 h-4 mr-2" />
          Export JSON
        </Button>
        <Button onClick={() => copyToClipboard(JSON.stringify(counts, null, 2), "Results")} disabled={!text}>
          <Copy className="w-4 h-4 mr-2" />
          Copy Results
        </Button>
      </div>

      {notification && (
        <div className="mt-4 p-3 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-center">
          {notification}
        </div>
      )}
    </div>
  )
}