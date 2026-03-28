"use client";

import { useState, useCallback, useRef } from "react";
import { 
  Upload, Zap, Download, RefreshCcw, ShieldCheck, Sliders, 
  FileWarning, Percent, FileType, CheckCircle2, Trash2
} from "lucide-react";
import imageCompression from "browser-image-compression";

interface ImageStats {
  name: string;
  originalSize: number;
  compressedSize: number;
  format: string;
  ratio: string;
}

type TargetFormat = "image/jpeg" | "image/png" | "image/webp" | "original";

export default function ImageCompressor() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [stats, setStats] = useState<ImageStats | null>(null);
  const [targetFormat, setTargetFormat] = useState<TargetFormat>("image/webp");
  
  const [options, setOptions] = useState({
    maxSizeMB: 0.8,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    initialQuality: 0.75,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    
    // 清理旧的 URL 避免内存泄漏
    if (preview) URL.revokeObjectURL(preview);
    if (compressedUrl) URL.revokeObjectURL(compressedUrl);

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setCompressedUrl(null);
    setStats(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleCompress = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    try {
      const compressionOptions = {
        ...options,
        fileType: targetFormat === "original" ? selectedFile.type : targetFormat,
      };

      const compressedFile = await imageCompression(selectedFile, compressionOptions);
      const url = URL.createObjectURL(compressedFile);
      setCompressedUrl(url);

      const ratio = ((1 - compressedFile.size / selectedFile.size) * 100).toFixed(1);
      setStats({
        name: selectedFile.name,
        originalSize: selectedFile.size,
        compressedSize: compressedFile.size,
        format: compressedFile.type,
        ratio: ratio
      });
    } catch (error) {
      console.error("Compression failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getExtension = () => {
    if (targetFormat === "original") return "";
    return `.${targetFormat.split("/")[1]}`;
  };

  const reset = () => {
    setSelectedFile(null);
    setPreview(null);
    setCompressedUrl(null);
    setStats(null);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-500">
      {/* Header */}
      <div className="bg-card border   rounded-sm p-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20">
            <Zap className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight">Smart Image Optimizer</h1>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
              <ShieldCheck className="h-3.5 w-3.5 text-blue-500" /> 100% Client-side processing
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-muted/50 p-1.5 rounded-2xl border border-border">
          <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-tighter text-muted-foreground">Privacy Guaranteed: No images leave your browser</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Panel */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-card border  rounded-sm p-6 space-y-6">
            <div className="flex items-center gap-2">
              <Sliders className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-black uppercase tracking-widest">Settings</h2>
            </div>

            <div className="space-y-5">
              {/* Format Selection */}
              <div>
                <label className="text-[10px] font-black uppercase text-muted-foreground mb-3 block flex items-center gap-1.5">
                  <FileType className="h-3.5 w-3.5" /> Output Format
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(["image/webp", "image/jpeg", "image/png", "original"] as const).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setTargetFormat(fmt)}
                      className={`px-3 py-2.5 rounded-xl text-[10px] font-bold uppercase border transition-all ${
                        targetFormat === fmt 
                        ? "bg-primary border-primary text-primary-foreground shadow-md shadow-primary/20" 
                        : "bg-muted/30 border-transparent text-muted-foreground hover:border-border"
                      }`}
                    >
                      {fmt === "original" ? "Original" : fmt.split("/")[1]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Compression Slider */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-[10px] font-black uppercase text-muted-foreground">Target Size</label>
                  <span className="text-[10px] font-mono font-bold text-primary">{options.maxSizeMB}MB</span>
                </div>
                <input 
                  type="range" min="0.1" max="5" step="0.1"
                  value={options.maxSizeMB}
                  onChange={(e) => setOptions(o => ({...o, maxSizeMB: parseFloat(e.target.value)}))}
                  className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              {/* Quality Slider */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-[10px] font-black uppercase text-muted-foreground">Quality</label>
                  <span className="text-[10px] font-mono font-bold text-primary">{Math.round(options.initialQuality * 100)}%</span>
                </div>
                <input 
                  type="range" min="0.1" max="1" step="0.05"
                  value={options.initialQuality}
                  onChange={(e) => setOptions(o => ({...o, initialQuality: parseFloat(e.target.value)}))}
                  className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
            </div>

            <button 
              onClick={handleCompress}
              disabled={!selectedFile || isProcessing}
              className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-30 disabled:pointer-events-none"
            >
              {isProcessing ? (
                <span className="flex items-center justify-center gap-2">
                  <RefreshCcw className="h-4 w-4 animate-spin" /> Processing...
                </span>
              ) : "Optimize Image"}
            </button>
          </div>

{/* Stats Display */}
          {stats && (
            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-[2rem] p-5 space-y-4 animate-in slide-in-from-bottom-4 duration-500">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Percent className="h-4 w-4 text-emerald-500" />
                    <span className="text-[10px] font-black uppercase text-emerald-600">Savings</span>
                  </div>
                  <span className="text-xl font-black text-emerald-600">-{stats.ratio}%</span>
               </div>
               <div className="grid grid-cols-2 gap-4 pt-2 border-t border-emerald-500/10">
                  <div>
                    <p className="text-[9px] uppercase font-bold text-muted-foreground">Before</p>
                    <p className="text-xs font-mono font-bold">{formatSize(stats.originalSize)}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase font-bold text-muted-foreground">After</p>
                    <p className="text-xs font-mono font-bold text-emerald-600">{formatSize(stats.compressedSize)}</p>
                  </div>
               </div>
            </div>
          )}
        </div>

        {/* Workspace Area */}
        <div className="lg:col-span-2 space-y-4">
          {!preview ? (
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`h-[450px] border-2 border-dashed rounded-sm flex flex-col items-center justify-center gap-4 transition-all duration-300 cursor-pointer ${
                isDragging 
                ? "border-primary bg-primary/5 scale-[0.99]" 
                : "border-border bg-muted/5 hover:bg-muted/10"
              }`}
            >
              <div className="h-20 w-20 bg-background rounded-[2rem] flex items-center justify-center shadow-sm border border-border group-hover:scale-110 transition-transform">
                <Upload className={`h-8 w-8 ${isDragging ? "text-primary animate-bounce" : "text-muted-foreground"}`} />
              </div>
              <div className="text-center">
                <p className="text-sm font-black uppercase tracking-tight">Drop your image here</p>
                <p className="text-[10px] text-muted-foreground font-bold mt-1 tracking-widest uppercase">Supports PNG, JPG, WebP up to 20MB</p>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            </div>
          ) : (
            <div className="space-y-4 h-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Original Preview */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between px-2">
                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Original Source</p>
                    <p className="text-[10px] font-mono font-bold">{formatSize(selectedFile?.size || 0)}</p>
                  </div>
                  <div className="h-[530px] md:h-[450px] rounded-sm border border-border bg-zinc-900 overflow-hidden flex items-center justify-center relative">
                    <img src={preview} alt="Original" className="max-w-full max-h-full object-contain p-2" />
                  </div>
                </div>

                {/* Optimized Result */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between px-2">
                    <p className="text-[10px] font-black uppercase text-primary tracking-widest">Optimized Result</p>
                    {stats && <p className="text-[10px] font-mono font-bold text-emerald-500">{formatSize(stats.compressedSize)}</p>}
                  </div>
                  <div className={`h-[350px] md:h-[450px] rounded-sm border overflow-hidden flex items-center justify-center relative transition-all ${
                        compressedUrl ? "border-emerald-500/30 bg-zinc-950 " : "border-border bg-zinc-900"
                    }`}>
                    {isProcessing ? (
                      <div className="flex flex-col items-center gap-3">
                        <RefreshCcw className="h-8 w-8 text-primary animate-spin" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground animate-pulse">Calculating...</p>
                      </div>
                    ) : compressedUrl ? (
                      <>
                        <img src={compressedUrl} alt="Compressed" className="max-w-full max-h-full object-contain p-2 animate-in zoom-in-95 duration-300" />
                        <div className="absolute top-4 right-4 bg-emerald-500 text-white p-1.5 rounded-full shadow-lg">
                           <CheckCircle2 className="h-4 w-4" />
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-6">
                        <FileWarning className="h-8 w-8 text-muted-foreground/20 mx-auto mb-3" />
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Waiting for optimization</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button 
                  onClick={reset}
                  className="flex-1 py-4 border border-border rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-destructive/5 hover:text-destructive hover:border-destructive/20 transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Clear
                </button>
                {compressedUrl && (
                  <a 
                    href={compressedUrl} 
                    download={`optimized-${selectedFile?.name.split('.')[0]}${getExtension()}`}
                    className="flex-[2] py-4 bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 hover:brightness-110 active:scale-[0.98] transition-all"
                  >
                    <Download className="h-4 w-4" /> Download {targetFormat === "original" ? "" : targetFormat.split('/')[1].toUpperCase()}
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}