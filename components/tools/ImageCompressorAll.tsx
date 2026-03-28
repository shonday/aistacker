"use client";

import { useState, useRef, useEffect } from "react";
import {
  Upload,
  Zap,
  Download,
  RefreshCcw,
  Trash2,
  CheckCircle,
  AlertCircle,
  Image as ImageIcon,
  X,
} from "lucide-react";
import imageCompression from "browser-image-compression";

type OutputFormat = "original" | "webp" | "jpg" | "png";

interface Task {
  id: string;
  file: File;
  preview: string;
  result?: string;
  progress: number;
  status: "idle" | "processing" | "done" | "error";
  originalSize: number;
  compressedSize?: number;
}

export default function ImageOptimizerPro() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [options, setOptions] = useState({
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    initialQuality: 0.75,
    outputFormat: "webp" as OutputFormat,
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const MAX_BATCH_COUNT = 10; // 👉 可自由修改
  // Cleanup object URLs
  useEffect(() => {
    return () => {
      tasks.forEach((t) => {
        if (t.preview) URL.revokeObjectURL(t.preview);
        if (t.result) URL.revokeObjectURL(t.result);
      });
    };
  }, []); // ✅ 只在组件卸载时执行

  const addFiles = (files: FileList) => {
    const incoming = Array.from(files);
    setTasks((prev) => {
      const remainingSlots = MAX_BATCH_COUNT - prev.length;

      if (remainingSlots <= 0) {
        alert(`Maximum ${MAX_BATCH_COUNT} images allowed.`);
        return prev;
      }

      const acceptedFiles = incoming.slice(0, remainingSlots);

      const newTasks: Task[] = acceptedFiles.map((file) => ({
        id: crypto.randomUUID(),
        file,
        preview: URL.createObjectURL(file),
        progress: 0,
        status: "idle",
        originalSize: file.size,
      }));

      if (incoming.length > remainingSlots) {
        alert(
          `Only ${remainingSlots} images added (limit: ${MAX_BATCH_COUNT}).`,
        );
      }

      return [...prev, ...newTasks];
    });
  };

  const getFileType = (file: File): string => {
    if (options.outputFormat === "original") return file.type;
    if (options.outputFormat === "jpg") return "image/jpeg";
    if (options.outputFormat === "png") return "image/png";
    if (options.outputFormat === "webp") return "image/webp";
    return file.type;
  };

  const processAll = async () => {
    if (!tasks.length) return;
    setIsProcessing(true);
    let successCount = 0;

    for (const task of tasks) {
      if (task.status === "done") continue;

      setTasks((prev) =>
        prev.map((t) =>
          t.id === task.id ? { ...t, status: "processing", progress: 0 } : t,
        ),
      );

      try {
        const compressed = await imageCompression(task.file, {
          ...options,
          fileType: getFileType(task.file),
          onProgress: (p: number) => {
            setTasks((prev) =>
              prev.map((t) =>
                t.id === task.id ? { ...t, progress: Math.round(p) } : t,
              ),
            );
          },
        });

        const url = URL.createObjectURL(compressed);

        setTasks((prev) =>
          prev.map((t) =>
            t.id === task.id
              ? {
                  ...t,
                  result: url,
                  compressedSize: compressed.size,
                  status: "done",
                  progress: 100,
                }
              : t,
          ),
        );
        successCount++;
      } catch {
        setTasks((prev) =>
          prev.map((t) => (t.id === task.id ? { ...t, status: "error" } : t)),
        );
      }
    }

    setIsProcessing(false);
    if (successCount > 0) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2800);
    }
  };

  const removeTask = (id: string) => {
    setTasks((prev) => {
      const task = prev.find((t) => t.id === id);
      if (task?.preview) URL.revokeObjectURL(task.preview);
      if (task?.result) URL.revokeObjectURL(task.result);
      return prev.filter((t) => t.id !== id);
    });
  };

  const formatSize = (bytes: number): string => {
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toFixed(1) + " " + sizes[i];
  };

  const getFileName = (file: File): string => {
    const name = file.name.replace(/\.[^/.]+$/, "");
    if (options.outputFormat === "original") return file.name;
    return `${name}.${options.outputFormat}`;
  };

  const savings = (task: Task): number => {
    if (!task.compressedSize) return 0;
    return Math.round(
      ((task.originalSize - task.compressedSize) / task.originalSize) * 100,
    );
  };

  // Batch Download - 修复版（推荐替换）
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadAll = async () => {
    if (isDownloading) return;

    const doneTasks = tasks.filter((t) => t.status === "done" && t.result);
    if (doneTasks.length === 0) return;

    setIsDownloading(true);

    for (const task of doneTasks) {
      try {
        const a = document.createElement("a");
        a.href = task.result!; // ✅ 直接用 blob URL
        a.download = getFileName(task.file);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } catch (err) {
        console.error("Download failed:", err);
      }

      // ⚠️ 必须延迟，否则浏览器只执行最后一个
      await new Promise((r) => setTimeout(r, 300));
    }

    setIsDownloading(false);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-200 py-8 transition-colors">
      <div className="max-w-6xl mx-auto px-6 space-y-8">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tighter bg-gradient-to-r from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
              Image Optimizer Pro
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-1">
              Batch compress &amp; convert • Browser-only
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={processAll}
              disabled={!tasks.length || isProcessing}
              className="px-6 py-3 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-semibold flex items-center gap-2 hover:bg-zinc-800 dark:hover:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.985] shadow-lg"
            >
              {isProcessing ? (
                <RefreshCcw className="w-4 h-4 animate-spin" />
              ) : (
                <Zap className="w-4 h-4" />
              )}
              {isProcessing ? "Optimizing..." : "Optimize All"}
            </button>

            {tasks.some((t) => t.status === "done") && (
              <button
                onClick={downloadAll}
                disabled={
                  isDownloading || !tasks.some((t) => t.status === "done")
                }
                className="px-6 py-3 rounded-2xl border border-emerald-600 text-emerald-600 dark:border-emerald-500 dark:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 font-semibold flex items-center gap-2 transition-all disabled:opacity-50"
              >
                {isDownloading ? (
                  <div>
                    <RefreshCcw className="w-4 h-4 animate-spin" />
                    Downloading...
                  </div>
                ) : (
                  <div>
                    <Download className="w-4 h-4" />
                    Download All (
                    {tasks.filter((t) => t.status === "done").length})
                  </div>
                )}
              </button>
            )}

            <button
              onClick={() => setTasks([])}
              className="px-6 py-3 rounded-2xl border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900 font-semibold flex items-center gap-2 transition-all"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          </div>
        </div>

        {/* SUCCESS TOAST */}
        {showSuccess && (
          <div className="fixed bottom-6 right-6 bg-emerald-600 text-white px-6 py-3.5 rounded-2xl flex items-center gap-3 shadow-2xl z-50 animate-in slide-in-from-bottom-4">
            <CheckCircle className="w-5 h-5" />
            Optimization completed successfully!
          </div>
        )}

        {/* UPLOAD AREA */}
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={(e) => {
            e.preventDefault();
            addFiles(e.dataTransfer.files);
          }}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={(e) => {
            e.currentTarget.classList.add(
              "border-emerald-500",
              "bg-emerald-50",
              "dark:bg-emerald-950/30",
            );
          }}
          onDragLeave={(e) => {
            e.currentTarget.classList.remove(
              "border-emerald-500",
              "bg-emerald-50",
              "dark:bg-emerald-950/30",
            );
          }}
          className="group border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-emerald-500 bg-white dark:bg-zinc-900/70 rounded-3xl h-64 flex flex-col items-center justify-center gap-5 cursor-pointer transition-all duration-300 hover:scale-[1.01]"
        >
          <div className="w-20 h-20 rounded-3xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Upload className="w-10 h-10 text-zinc-500 dark:text-zinc-400" />
          </div>
          <div className="text-center">
            <p className="text-xl font-semibold text-zinc-800 dark:text-zinc-100">
              Drop images here or click to upload
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Supports multiple files • PNG, JPG, WebP, etc.
            </p>
          </div>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => e.target.files && addFiles(e.target.files)}
            className="hidden"
          />
        </div>

        {/* SETTINGS */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-zinc-800 dark:text-zinc-100">
            <ImageIcon className="w-5 h-5" /> Optimization Settings
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Max Size */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-600 dark:text-zinc-400">
                  Max Size (MB)
                </span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400">
                  {options.maxSizeMB}
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="5"
                step="0.1"
                value={options.maxSizeMB}
                onChange={(e) =>
                  setOptions((o) => ({
                    ...o,
                    maxSizeMB: parseFloat(e.target.value),
                  }))
                }
                className="w-full accent-emerald-600 dark:accent-emerald-500"
              />
            </div>

            {/* Quality */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-600 dark:text-zinc-400">
                  Quality
                </span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400">
                  {Math.round(options.initialQuality * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={options.initialQuality}
                onChange={(e) =>
                  setOptions((o) => ({
                    ...o,
                    initialQuality: parseFloat(e.target.value),
                  }))
                }
                className="w-full accent-emerald-600 dark:accent-emerald-500"
              />
            </div>

            {/* Resolution */}
            <div className="space-y-2">
              <label className="text-sm text-zinc-600 dark:text-zinc-400 block">
                Max Resolution
              </label>
              <select
                value={options.maxWidthOrHeight}
                onChange={(e) =>
                  setOptions((o) => ({
                    ...o,
                    maxWidthOrHeight: parseInt(e.target.value),
                  }))
                }
                className="w-full bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
              >
                <option value={1280}>1280px</option>
                <option value={1920}>1920px (Full HD)</option>
                <option value={2560}>2560px (2K)</option>
              </select>
            </div>

            {/* Format */}
            <div className="space-y-2">
              <label className="text-sm text-zinc-600 dark:text-zinc-400 block">
                Output Format
              </label>
              <select
                value={options.outputFormat}
                onChange={(e) =>
                  setOptions((o) => ({
                    ...o,
                    outputFormat: e.target.value as OutputFormat,
                  }))
                }
                className="w-full bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
              >
                <option value="original">Original</option>
                <option value="webp">WebP (Recommended)</option>
                <option value="jpg">JPG</option>
                <option value="png">PNG</option>
              </select>
            </div>
          </div>
        </div>

        {/* TASKS SECTION */}
        {tasks.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6 px-1">
              <h3 className="font-semibold text-lg">Images ({tasks.length})</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Hover cards • Click Download or use &rdquo;Download All&rdquo;
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {tasks.map((task) => {
                const saved = savings(task);
                const isDone = task.status === "done";

                return (
                  <div
                    key={task.id}
                    className="group relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden hover:border-emerald-500/50 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="aspect-video relative overflow-hidden bg-zinc-950">
                      <img
                        src={task.result || task.preview}
                        alt={task.file.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Status overlays */}
                      {task.status === "processing" && (
                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-9 h-9 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-3" />
                            <p className="text-sm text-white">Optimizing...</p>
                          </div>
                        </div>
                      )}

                      {task.status === "done" && (
                        <div className="absolute top-3 right-3 bg-emerald-500 text-white text-xs px-3 py-1 rounded-full font-mono tracking-wider shadow">
                          DONE
                        </div>
                      )}

                      {task.status === "error" && (
                        <div className="absolute inset-0 bg-red-950/90 flex items-center justify-center">
                          <AlertCircle className="w-12 h-12 text-red-400" />
                        </div>
                      )}

                      {/* Hover action hint */}
                      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    {/* Info */}
                    <div className="p-5 space-y-4">
                      <div>
                        <p className="font-medium text-sm line-clamp-1 pr-6">
                          {task.file.name}
                        </p>
                        <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-mono">
                          <span>Original: {formatSize(task.originalSize)}</span>
                          {task.compressedSize && (
                            <span className="text-emerald-600 dark:text-emerald-400">
                              → {formatSize(task.compressedSize)}
                            </span>
                          )}
                        </div>
                      </div>

                      {task.compressedSize && saved > 5 && (
                        <div className="text-xs bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-2xl inline-flex items-center">
                          Saved {saved}%
                        </div>
                      )}

                      {/* Progress */}
                      {task.status === "processing" && (
                        <div className="h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 transition-all duration-200"
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-3 pt-2">
                        {isDone && task.result && (
                          // 把单个下载的 <a> 标签也改成下面这种写法
                          <button
                            onClick={() => {
                              if (!task.result) return;

                              const a = document.createElement("a");
                              a.href = task.result;
                              a.download = getFileName(task.file);
                              document.body.appendChild(a);
                              a.click();
                              document.body.removeChild(a);
                            }}
                            className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-2xl text-sm font-semibold transition-all"
                          >
                            <Download className="w-4 h-4" />
                            Download
                          </button>
                        )}

                        <button
                          onClick={() => removeTask(task.id)}
                          className="flex-1 flex items-center justify-center gap-2 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 py-3 rounded-2xl text-sm font-semibold transition-all"
                        >
                          <X className="w-4 h-4" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tasks.length === 0 && (
          <div className="text-center py-24 text-zinc-400 dark:text-zinc-500">
            <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-40" />
            <p className="text-lg">No images yet</p>
            <p className="text-sm mt-1">Drop some images above to begin</p>
          </div>
        )}
      </div>
    </div>
  );
}
