// aistacker/components/ToolSearch.tsx

"use client";

import { useState, useMemo, useRef, useEffect, KeyboardEvent } from "react";
import Fuse from "fuse.js";
import { tools } from "@/data/tools";
import Link from "next/link";


export default function ToolSearch() {
  const [query, setQuery] = useState("");
  // 将 selectedIndex 初始化为 null，表示未选中任何项
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 初始化 Fuse 实例
  const fuse = useMemo(() => new Fuse(tools, {
    keys: ["name", "description", "category"],
    threshold: 0.3,
    includeMatches: true,
  }), []);

  // 计算结果（使用 useMemo 避免重复计算）
  const results = useMemo(() => {
    if (!query) return [];
    return fuse.search(query).map(result => result.item);
  }, [query, fuse]);

  // 处理键盘事件
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      // 如果 selectedIndex 为 null 或超出范围，重置为 0，否则向下移动
      setSelectedIndex((prevIndex) => {
        if (prevIndex === null || prevIndex >= results.length) {
          return 0;
        }
        return prevIndex + 1;
      });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      // 如果 selectedIndex 为 0 或小于 0，重置为末尾，否则向上移动
      setSelectedIndex((prevIndex) => {
        if (prevIndex === null || prevIndex < 0) {
          return results.length > 0 ? results.length - 1 : null;
        }
        return prevIndex - 1;
      });
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex !== null && selectedIndex !== -1 && selectedIndex < results.length) {
        const tool = results[selectedIndex];
        if (tool && tool.slug) {
          window.location.href = `/tools/${tool.slug}`;
        }
      }
      // 可选：Enter 后是否清空输入框或保持焦点？这里选择保持焦点以便继续输入
    }
  };

  // 处理搜索结果点击（这里主要为了响应 onClick，虽然 Link 会自动跳转）
  // 确保点击时选中状态保持或更新，这里为了简单，Link 跳转后自动重置
  const handleResultClick = (tool: typeof tools[0]) => {
    // 如果需要在点击跳转后自动将 selectedIndex 重置为 null，可以在这里做
    // setSelectedIndex(null);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto my-8">
      <div className="relative" onClick={() => inputRef.current?.focus()}>
        <input
          ref={inputRef}
          type="text"
          className="w-full px-6 py-4 text-lg border-2 border-slate-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all shadow-sm"
          // 使用模板字符串解决双引号转义警告
          placeholder="Search tools (e.g., JSON, Base64, MD5)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Tool search"
          aria-autocomplete="list"
          aria-controls="tool-results-list"
          aria-activedescendant={selectedIndex !== null ? `tool-result-${selectedIndex}` : undefined}
          onFocus={() => inputRef.current?.focus()}
        />

        {/* 搜索结果下拉面板 */}
        {query && (
          <ul
            id="tool-results-list"
            role="listbox"
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50 max-h-96 overflow-y-auto cursor-default"
          >
            {results.length > 0 ? (
              results.map((tool, index) => {
                const isSelected = selectedIndex === index;
                // 确保 tool 变量在 JSX 中被引用，避免 TS 警告
                return (
                  <li
                    key={tool.slug}
                    id={`tool-result-${index}`}
                    role="option"
                    aria-selected={isSelected}
                    // 确保 tool 变量在 onClick 回调中被使用
                    onClick={() => handleResultClick(tool)}
                    className={`p-4 cursor-pointer hover:bg-slate-50 transition-colors ${
                      isSelected ? "bg-blue-50 text-blue-700" : ""
                    }`}
                  >
                    <Link href={`/tools/${tool.slug}`} className="block w-full">
                      <div className="font-bold text-slate-900">{tool.name}</div>
                      {/* 如果描述中包含双引号，建议转义或使用单引号包裹，但这里通常不需要 */}
                      <div className="text-sm text-slate-500 truncate">{tool.description}</div>
                    </Link>
                  </li>
                );
              })
            ) : (
              // 修复转义实体警告：使用单引号包裹字符串
              <div className="p-6 text-center text-slate-500">
                No tools found for "{query}".
              </div>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}