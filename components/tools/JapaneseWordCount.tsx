"use client"

import { useState, useCallback } from "react"
import { Check, Copy, Trash2, ClipboardPaste, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function JapaneseWordCount() {
  const [text, setText] = useState("")
  const [hiraganaCount, setHiraganaCount] = useState(0)
  const [katakanaCount, setKatakanaCount] = useState(0)
  const [kanjiCount, setKanjiCount] = useState(0)
  const [totalChars, setTotalChars] = useState(0)
  const [totalCharsNoSpaces, setTotalCharsNoSpaces] = useState(0)
  const [wordCount, setWordCount] = useState(0)
  const [sentenceCount, setSentenceCount] = useState(0)
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = useCallback(async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(id)
      setTimeout(() => setCopied(null), 1500)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }, [])

  const countCharacters = useCallback((text: string) => {
    const hiraganaRegex = /[ぁ-ゔ]/g
    const katakanaRegex = /[ァ-ヺ]/g
    const kanjiRegex = /[一-龥]/g

    setHiraganaCount((text.match(hiraganaRegex) || []).length)
    setKatakanaCount((text.match(katakanaRegex) || []).length)
    setKanjiCount((text.match(kanjiRegex) || []).length)
    setTotalChars(text.length)
    setTotalCharsNoSpaces(text.replace(/\s/g, "").length)
    setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0)
    setSentenceCount(text.trim() ? text.split(/[。！？]/).filter(s => s.trim().length > 0).length : 0)
  }, [])

  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value
    setText(newText)
    countCharacters(newText)
  }, [countCharacters])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      copyToClipboard(`Hiragana: ${hiraganaCount}, Katakana: ${katakanaCount}, Kanji: ${kanjiCount}, Total: ${totalChars}, Total (no spaces): ${totalCharsNoSpaces}, Words: ${wordCount}, Sentences: ${sentenceCount}`, "result")
    }
  }, [copyToClipboard, hiraganaCount, katakanaCount, kanjiCount, totalChars, totalCharsNoSpaces, wordCount, sentenceCount])

  const clearText = useCallback(() => {
    setText("")
    countCharacters("")
  }, [countCharacters])

  const pasteText = useCallback(async () => {
    try {
      const pastedText = await navigator.clipboard.readText()
      setText(pastedText)
      countCharacters(pastedText)
    } catch (err) {
      console.error("Failed to paste:", err)
    }
  }, [countCharacters])

  const loadExample = useCallback(() => {
    const example = "こんにちは、世界！私は日本語を話します。今日は良い天気ですね。"
    setText(example)
    countCharacters(example)
  }, [countCharacters])

  const resultText = `Hiragana: ${hiraganaCount}, Katakana: ${katakanaCount}, Kanji: ${kanjiCount}, Total: ${totalChars}, Total (no spaces): ${totalCharsNoSpaces}, Words: ${wordCount}, Sentences: ${sentenceCount}`

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Japanese Word Counter
          </CardTitle>
          <CardDescription>
            Count hiragana, katakana, kanji, and other characters in Japanese text. Supports real-time analysis with detailed statistics.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={pasteText} variant="outline" size="sm">
              <ClipboardPaste className="h-4 w-4 mr-2" />
              Paste
            </Button>
            <Button onClick={loadExample} variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Example
            </Button>
            <Button onClick={clearText} variant="outline" size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>
          <Textarea
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            placeholder="Enter Japanese text here... (Ctrl+Enter to copy results)"
            className="min-h-[120px] resize-y"
          />
        </CardContent>
      </Card>

      {text && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
            <CardDescription>
              Detailed character and text statistics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <Badge variant="secondary" className="text-lg font-bold">
                  {hiraganaCount}
                </Badge>
                <p className="text-sm text-muted-foreground mt-1">Hiragana</p>
              </div>
              <div className="text-center">
                <Badge variant="secondary" className="text-lg font-bold">
                  {katakanaCount}
                </Badge>
                <p className="text-sm text-muted-foreground mt-1">Katakana</p>
              </div>
              <div className="text-center">
                <Badge variant="secondary" className="text-lg font-bold">
                  {kanjiCount}
                </Badge>
                <p className="text-sm text-muted-foreground mt-1">Kanji</p>
              </div>
              <div className="text-center">
                <Badge variant="secondary" className="text-lg font-bold">
                  {totalChars}
                </Badge>
                <p className="text-sm text-muted-foreground mt-1">Total Chars</p>
              </div>
              <div className="text-center">
                <Badge variant="secondary" className="text-lg font-bold">
                  {totalCharsNoSpaces}
                </Badge>
                <p className="text-sm text-muted-foreground mt-1">No Spaces</p>
              </div>
              <div className="text-center">
                <Badge variant="secondary" className="text-lg font-bold">
                  {wordCount}
                </Badge>
                <p className="text-sm text-muted-foreground mt-1">Words</p>
              </div>
              <div className="text-center">
                <Badge variant="secondary" className="text-lg font-bold">
                  {sentenceCount}
                </Badge>
                <p className="text-sm text-muted-foreground mt-1">Sentences</p>
              </div>
            </div>
            <Separator />
            <div className="flex justify-center">
              <Button
                onClick={() => copyToClipboard(resultText, "result")}
                className="flex items-center gap-2"
              >
                {copied === "result" ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy Results
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}