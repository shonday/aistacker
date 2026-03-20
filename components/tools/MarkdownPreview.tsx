"use client"

import { useState, useMemo, useCallback, useEffect  } from "react"
// ... existing imports ...
import { Copy, Eye, EyeOff, LayoutGrid, Trash2, Bold, Italic, Link, Code, List, Quote, Image, Minus } from "lucide-react" // Add new icons
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import React, { useRef } from "react" // Import useRef

const escapeHtml = (text: string) =>
  text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")

const formatCount = (n: number) => n.toLocaleString()

const markdownStats = (text: string) => {
  const lineCount = text === "" ? 0 : text.split(/\r?\n/).length
  const wordCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).length
  const charCount = text.length
  const headingCount = (text.match(/^#{1,6} /gm) || []).length
  const codeBlockCount = Math.max(0, (text.match(/```/g) || []).length / 2)
  return { lineCount, wordCount, charCount, headingCount, codeBlockCount }
}

const parseMarkdown = (source: string): string => {
  if (!source.trim()) {
    return `<div class="text-muted">Live preview: type markdown in the editor on the left.</div>`
  }

  let converted = escapeHtml(source)

  // 1. Fenced Code Blocks (must be first to prevent parsing internal code)
  converted = converted.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang = "", code) => {
    const langClass = lang ? `language-${lang}` : "language-text"
    const encodedCode = encodeURIComponent(code); // Encode for data attribute
    return `<div class="relative group">
              <pre class="rounded-lg bg-slate-900 p-4 text-sm text-white overflow-auto"><code class="${langClass}">${escapeHtml(code)}</code></pre>
              <button class="copy-code-button absolute top-2 right-2 p-1 rounded text-white/70 hover:text-white bg-slate-800/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200" data-code="${encodedCode}">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
              </button>
            </div>`
  })

  // 2. Horizontal Rules
  converted = converted.replace(/^( {0,3}[-*_]){3,}\s*$/gm, "<hr class=\"my-6 border-slate-200 dark:border-slate-700\" />")

  // 3. Blockquotes (handle multi-line blocks)
  converted = converted.replace(/^(>.*(?:\n>.*)*)/gm, (match, block) => {
    const lines = block.split('\n').map((line: string) => line.replace(/^>\s*/, ''));
    const innerHtml = lines.join('\n');
    const paragraphs = innerHtml.split(/\n{2,}/).map(p => `<p>${p.trim().replace(/\n/g, '<br />')}</p>`).join('');
    return `<blockquote class=\"border-l-4 border-slate-300 pl-4 italic text-slate-600 dark:text-slate-300 my-4\">${paragraphs}</blockquote>`;
  });

  // 4. Headings
  converted = converted
    .replace(/^######\s+(.+)$/gm, "<h6 class=\"mt-4 mb-2 text-sm font-semibold\">$1</h6>")
    .replace(/^#####\s+(.+)$/gm, "<h5 class=\"mt-4 mb-2 text-base font-semibold\">$1</h5>")
    .replace(/^####\s+(.+)$/gm, "<h4 class=\"mt-4 mb-2 text-lg font-semibold\">$1</h4>")
    .replace(/^###\s+(.+)$/gm, "<h3 class=\"mt-4 mb-2 text-xl font-semibold\">$1</h3>")
    .replace(/^##\s+(.+)$/gm, "<h2 class=\"mt-4 mb-2 text-2xl font-semibold\">$1</h2>")
    .replace(/^#\s+(.+)$/gm, "<h1 class=\"mt-4 mb-3 text-3xl font-bold\">$1</h1>")

  // 5. Tables (improved to handle data rows)
  converted = converted.replace(/^(?:\|(.+)\|)\n(?:\|([\s:-]+)\|)((?:\n\|.*\|)*)/gm, (match, headerRow, separator, dataRows) => {
    const headers = headerRow.split("|").map((cell: string) => `<th class=\"border px-2 py-1 bg-slate-100 dark:bg-slate-800\">${cell.trim()}</th>`).join("");
    let bodyRows = "";
    if (dataRows) {
        bodyRows = dataRows.split('\n').filter(Boolean).map((row: string) => {
            const cells = row.split("|").map((cell: string) => `<td class=\"border px-2 py-1\">${cell.trim()}</td>`).join("");
            return `<tr>${cells}</tr>`;
        }).join("");
    }
    return `<table class=\"w-full border border-slate-300 dark:border-slate-700 mb-4 text-sm\"><thead><tr>${headers}</tr></thead><tbody>${bodyRows}</tbody></table>`;
  });

  // 6. Lists (improved for multi-line list items within a single block)
  // This step tries to identify list blocks and parse their items.
  converted = converted.split(/(?=\n(?:\s*[-*+] |\s*\d+\. ))/).map(block => {
    if (!/^\s*([-*+] |\d+\. )/.test(block)) {
        // Not a list block, treat as paragraph(s) or return as is if already processed
        return block.split(/\n{2,}/).map(p => {
          if (/^<h[1-6]|^<blockquote|^<pre|^<hr|^<table/.test(p.trim())) return p; // Already processed block-level elements
          return `<p>${p.trim().replace(/\n/g, '<br />')}</p>`;
        }).join('');
    }

    const lines = block.split('\n');
    let listType = /^\s*\d+\. /.test(lines[0]) ? "ol" : "ul";
    const listItems: string[] = [];
    let currentItemLines: string[] = [];

    lines.forEach(line => {
        const isNewItem = /^\s*([-*+] |\d+\. )/.test(line);
        if (isNewItem && currentItemLines.length > 0) {
            listItems.push(currentItemLines.join('\n'));
            currentItemLines = [];
        }
        currentItemLines.push(line.replace(/^\s*([-*+] |\d+\. )/, ''));
    });
    if (currentItemLines.length > 0) {
        listItems.push(currentItemLines.join('\n'));
    }

    const itemsHtml = listItems.map(itemContent => {
        // Process content within list item for paragraphs
        const paragraphs = itemContent.split(/\n{2,}/).map(p => `<p>${p.trim().replace(/\n/g, '<br />')}</p>`).join('');
        return `<li>${paragraphs}</li>`;
    }).join('');

    return `<${listType} class=\"ml-5 mb-4 list-disc dark:list-none space-y-1\">${itemsHtml}</${listType}>`;
  }).join('');


  // 7. Inline elements
  converted = converted
    .replace(/!\[([^\]]*)\]\(([^\)]+)\)/g, "<img src=\"$2\" alt=\"$1\" class=\"my-3 max-w-full rounded\" />")
    .replace(/\[([^\]]+)\]\(([^\)]+)\)/g, "<a class=\"text-blue-600 hover:underline dark:text-blue-400\" href=\"$2\" target=\"_blank\" rel=\"noopener noreferrer\">$1</a>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/__(.+?)__/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/_(.+?)_/g, "<em>$1</em>")
    .replace(/~~(.+?)~~/g, "<del>$1</del>")
    .replace(/`([^`]+?)`/g, "<code class=\"rounded bg-slate-100 px-1 font-mono text-sm dark:bg-slate-700\">$1</code>")

  // Ensure paragraphs for remaining text not caught by other block-level parsers
  // This is a simplified fallback and might need careful ordering with other block parsers.
  // The block processing for lists and blockquotes already handles turning their inner content into paragraphs.
  // We'll trust the previous block-level parsing for `p` tags.
  if (converted.startsWith('<div class="text-muted">')) return converted; // Don't add paragraphs to empty state
  if (!/<(h[1-6]|blockquote|pre|hr|table|ul|ol|p)>/i.test(converted)) {
      // If no block elements found, wrap entire content in a paragraph
      converted = `<p>${converted.split(/\n{2,}/).map(p => p.trim().replace(/\n/g, '<br />')).join('</p><p>')}</p>`;
  }

  return converted
}

export default function MarkdownPreview() {
  const [markdown, setMarkdown] = useState("")
  const [copied, setCopied] = useState<string | null>(null)
  const [copiedRaw, setCopiedRaw] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"split" | "editor" | "preview">("split")

  const previewRef = useRef<HTMLDivElement>(null); // Ref for the preview panel

  const stats = useMemo(() => markdownStats(markdown), [markdown])
  const renderedHtml = useMemo(() => parseMarkdown(markdown), [markdown])

  const copyToClipboard = useCallback(async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      if (id === "result") {
        setCopied("result")
      } else {
        setCopiedRaw("raw")
      }
    } catch (err) {
      console.error("Failed to copy text: ", err);
      // Fallback for older browsers or security restrictions
      const el = document.createElement("textarea")
      el.value = text
      document.body.appendChild(el)
      el.select()
      document.execCommand("copy")
      document.body.removeChild(el)
      if (id === "result") {
        setCopied("result")
      } else {
        setCopiedRaw("raw")
      }
    }

    setTimeout(() => {
      setCopied(null)
      setCopiedRaw(null)
    }, 1500)
  }, [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget
    const start = target.selectionStart
    const end = target.selectionEnd
    const value = markdown

    if (e.key === "Tab") {
      e.preventDefault()
      const updated = `${value.substring(0, start)}\t${value.substring(end)}`
      setMarkdown(updated)
      window.requestAnimationFrame(() => {
        target.selectionStart = target.selectionEnd = start + 1
      })
      return
    }

    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault() // Prevent new line
      setViewMode((prev) => (prev === "preview" ? "split" : "preview"))
    }
  }, [markdown])

  const handleInsertMarkdown = useCallback((prefix: string, suffix: string = "", placeholder: string = "") => {
    const textarea = document.querySelector('textarea')
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = markdown.substring(start, end);

    let newText;
    let newCursorPos;

    if (selectedText) {
      newText = prefix + selectedText + suffix;
      newCursorPos = start + newText.length; // Place cursor after inserted text
    } else {
      newText = prefix + placeholder + suffix;
      newCursorPos = start + prefix.length + placeholder.length; // Place cursor after placeholder
    }

    const updatedMarkdown = markdown.substring(0, start) + newText + markdown.substring(end);
    setMarkdown(updatedMarkdown);

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = newCursorPos;
    }, 0);
  }, [markdown]);

  // Effect to attach copy event listeners to code blocks in the preview
  useEffect(() => {
    if (previewRef.current) {
      const buttons = previewRef.current.querySelectorAll('.copy-code-button');
      buttons.forEach(button => {
        const code = decodeURIComponent(button.getAttribute('data-code') || '');
        const copyHandler = async (event: Event) => {
          event.stopPropagation(); // Prevent parent clicks if any
          try {
            await navigator.clipboard.writeText(code);
            const originalIcon = button.innerHTML;
            button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check text-green-400"><polyline points="20 6 9 17 4 12"/></svg>'; // Check icon
            setTimeout(() => {
              button.innerHTML = originalIcon; // Restore original icon
            }, 1500);
          } catch (err) {
            console.error('Failed to copy code block:', err);
          }
        };
        button.addEventListener('click', copyHandler);
        // Cleanup event listener when component unmounts or renderedHtml changes
        return () => button.removeEventListener('click', copyHandler);
      });
    }
  }, [renderedHtml]); // Re-run this effect when the rendered HTML content changes

  const isEditorVisible = viewMode !== "preview"
  const isPreviewVisible = viewMode !== "editor"

  return (
    <div className="flex min-h-screen flex-col gap-4 px-4 py-3 md:px-8">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Button onClick={() => setViewMode("split")} size="sm" variant={viewMode === "split" ? "default" : "outline"}>
            <LayoutGrid className="mr-1 h-4 w-4" /> Split
          </Button>
          <Button onClick={() => setViewMode("editor")} size="sm" variant={viewMode === "editor" ? "default" : "outline"}>
            <EyeOff className="mr-1 h-4 w-4" /> Editor
          </Button>
          <Button onClick={() => setViewMode("preview")} size="sm" variant={viewMode === "preview" ? "default" : "outline"}>
            <Eye className="mr-1 h-4 w-4" /> Preview
          </Button>
          <Button onClick={() => setMarkdown("")} size="sm" variant="destructive">
            <Trash2 className="mr-1 h-4 w-4" /> Clear
          </Button>
        </div>
        <div className="text-sm text-slate-600 dark:text-slate-300">
          <span className="font-medium">{formatCount(stats.wordCount)}</span> words &middot; <span className="font-medium">{formatCount(stats.charCount)}</span> chars &middot; <span className="font-medium">{formatCount(stats.lineCount)}</span> lines &middot; <span className="font-medium">{stats.headingCount}</span> headings &middot; <span className="font-medium">{stats.codeBlockCount}</span> code blocks
        </div>
      </div>

      <div className="flex min-h-[70vh] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
        {isEditorVisible && (
          <div className={`${isPreviewVisible ? "w-full md:w-1/2" : "w-full"} border-r border-slate-200 p-3 dark:border-slate-700 flex flex-col`}>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Markdown Editor</h2>
              <span className="text-xs text-slate-500 dark:text-slate-400">Ctrl/Cmd+Enter to toggle preview</span>
            </div>
            {/* Editor Toolbar */}
            <div className="flex flex-wrap gap-1 p-2 border-b border-slate-200 dark:border-slate-700 mb-2">
                <Button size="icon" variant="ghost" onClick={() => handleInsertMarkdown("**", "**", "bold text")} title="Bold"><Bold className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" onClick={() => handleInsertMarkdown("*", "*", "italic text")} title="Italic"><Italic className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" onClick={() => handleInsertMarkdown("`", "`", "inline code")} title="Inline Code"><Code className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" onClick={() => handleInsertMarkdown("```javascript\n", "\n```", "console.log('Hello');")} title="Code Block"><Code className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" onClick={() => handleInsertMarkdown("[", "](url)", "link text")} title="Link"><Link className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" onClick={() => handleInsertMarkdown("![", "](image-url)", "alt text")} title="Image"><Image className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" onClick={() => handleInsertMarkdown("- ", "", "List item")} title="Unordered List"><List className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" onClick={() => handleInsertMarkdown("> ", "", "Quote text")} title="Blockquote"><Quote className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" onClick={() => handleInsertMarkdown("\n---\n", "", "")} title="Horizontal Rule"><Minus className="h-4 w-4" /></Button>
            </div>
            <Textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="# Type Markdown rhythmically..."
              className="min-h-[60vh] h-full w-full resize-none bg-slate-50 p-3 text-sm dark:bg-slate-800 flex-grow" // flex-grow to fill space
            />
            <div className="mt-3 flex gap-2">
              <Button onClick={() => copyToClipboard(markdown, "raw")} size="sm" variant="outline">
                <Copy className="mr-1 h-4 w-4" /> {copiedRaw === "raw" ? "Raw Copied" : "Copy raw Markdown"}
              </Button>
            </div>
          </div>
        )}

        {isPreviewVisible && (
          <div className={`${isEditorVisible ? "w-full md:w-1/2" : "w-full"} p-3 flex flex-col`}>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Live Preview</h2>
              <Button onClick={() => copyToClipboard(renderedHtml, "result")} size="sm" variant="outline">
                <Copy className="mr-1 h-4 w-4" /> {copied === "result" ? "Rendered Copied" : "Copy rendered HTML"}
              </Button>
            </div>
            {/* Attach ref here */}
            <div
              ref={previewRef} 
              className="prose prose-sm dark:prose-invert min-h-[60vh] overflow-y-auto rounded-lg border border-slate-200 bg-white p-4 text-sm dark:border-slate-700 dark:bg-slate-950 flex-grow" // flex-grow to fill space
              dangerouslySetInnerHTML={{ __html: renderedHtml }}
            />
          </div>
        )}
      </div>

      <div className="rounded-lg border border-dashed border-slate-300 p-3 text-xs text-slate-500 dark:border-slate-600 dark:text-slate-400">
        Supports headings, bold, italic, strikethrough, inline `code`, fenced code blocks, lists, blockquotes, tables, images, links, and horizontal rules.
      </div>
    </div>
  )
}