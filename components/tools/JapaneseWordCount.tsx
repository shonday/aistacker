"use client"

import { useState, useCallback } from "react"
import { Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function JapaneseWordCount() {
  const [text, setText] = useState("")
  const [hiraganaCount, setHiraganaCount] = useState(0)
  const [katakanaCount, setKatakanaCount] = useState(0)
  const [kanjiCount, setKanjiCount] = useState(0)
  const [totalChars, setTotalChars] = useState(0)
  const [totalCharsNoSpaces, setTotalCharsNoSpaces] = useState(0)
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = useCallback(async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const el = document.createElement("textarea")
      el.value = text
      document.body.appendChild(el)
      el.select()
      document.execCommand("copy")
      document.body.removeChild(el)
    }
    setCopied(id)
    setTimeout(() => setCopied(null), 1500)
  }, [])

  const countCharacters = useCallback((text: string) => {
    const hiraganaRegex = /[ぁ-ゔ]/g
    const katakanaRegex = /[ァ-ヺ]/g
    const kanjiRegex = /[一-龥]/g

    setHiraganaCount((text.match(hiraganaRegex) || []).length)
    setKatakanaCount((text.match(katakanaRegex) || []).length)
    setKanjiCount((text.match(kanjiRegex) || []).length)
    setTotalChars(text.length)
    setTotalCharsNoSpaces(text.replace(/ /g, "").length)
  }, [])

  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
    countCharacters(e.target.value)
  }, [countCharacters])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey && e.key === "Enter" || e.metaKey && e.key === "Enter") {
      copyToClipboard(`Hiragana: ${hiraganaCount}, Katakana: ${katakanaCount}, Kanji: ${kanjiCount}, Total: ${totalChars}, Total (no spaces): ${totalCharsNoSpaces}`, "result")
    }
  }, [copyToClipboard, hiraganaCount, katakanaCount, kanjiCount, totalChars, totalCharsNoSpaces])

  return (
    <div className="bg-background p-4 rounded-lg shadow-sm">
      <h2 className="text-foreground mb-4">Japanese Word Counter</h2>
      <Input
        type="text"
        value={text}
        onChange={handleTextChange}
        onKeyDown={handleKeyDown}
        placeholder="Enter Japanese text..."
        className="w-full p-2 mb-4 border-border rounded-lg"
      />
      {text ? (
        <div className="mb-4">
          <p className="text-muted-foreground mb-2">Character Counts:</p>
          <ul>
            <li className="text-foreground mb-1">Hiragana: {hiraganaCount}</li>
            <li className="text-foreground mb-1">Katakana: {katakanaCount}</li>
            <li className="text-foreground mb-1">Kanji: {kanjiCount}</li>
            <li className="text-foreground mb-1">Total: {totalChars}</li>
            <li className="text-foreground mb-1">Total (no spaces): {totalCharsNoSpaces}</li>
          </ul>
          <Button
            onClick={() => copyToClipboard(`Hiragana: ${hiraganaCount}, Katakana: ${katakanaCount}, Kanji: ${kanjiCount}, Total: ${totalChars}, Total (no spaces): ${totalCharsNoSpaces}`, "result")}
            className="bg-primary text-primary-foreground p-2 rounded-lg mb-2"
          >
            {copied === "result" ? (
              <span className="flex items-center">
                <Check size={16} className="mr-1" />
                Copied
              </span>
            ) : (
              <span className="flex items-center">
                <Copy size={16} className="mr-1" />
                Copy
              </span>
            )}
          </Button>
        </div>
      ) : (
        <p className="text-muted-foreground mb-4">Please enter some Japanese text...</p>
      )}
    </div>
  )
}