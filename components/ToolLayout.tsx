import { ReactNode } from "react";
import Link from "next/link";

interface ToolLayoutProps {
  h1: string;
  description: string;
  tool: ReactNode;
  content: ReactNode;
  relatedTools: { name: string; path: string }[];
}

export default function ToolLayout({ h1, description, tool, content, relatedTools }: ToolLayoutProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* 1. Header (SEO Meta Data Reflected Here) */}
      <header className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mb-4">{h1}</h1>
        <p className="text-lg text-slate-600">{description}</p>
      </header>

      {/* 2. Tool UI Container (首屏直接操作，拒绝废话) */}
      <main className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 mb-10">
        {tool}
      </main>

      {/* 3. Adsense Slot 1 (工具下方) */}
      <div className="w-full h-24 bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 mb-10 rounded">
        <span>[ AdSense: Tool Bottom Slot ]</span>
      </div>

      {/* 4. SEO Content Article (1000+ words 承载区) */}
      <article className="prose prose-slate max-w-none mb-10">
        {content}
      </article>

      {/* 5. Adsense Slot 2 (文章底部) */}
      <div className="w-full h-24 bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 mb-10 rounded">
        <span>[ AdSense: Article Bottom Slot ]</span>
      </div>

      {/* 6. Related Tools (内链矩阵引擎) */}
      <section className="border-t border-slate-200 pt-8">
        <h3 className="text-2xl font-bold mb-4">Related Developer Tools</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {relatedTools.map((t) => (
            <Link key={t.name} href={t.path} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-center text-sm font-medium text-slate-700">
              {t.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}