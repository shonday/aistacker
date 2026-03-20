import { ReactNode } from "react";
import Link from "next/link";
import { ToolContent } from "@/data/tools";

interface ToolLayoutProps {
  h1: string;
  description: string;
  tool: ReactNode;
  content: ToolContent;
  relatedTools: { name: string; path: string }[];
}

export default function ToolLayout({ h1, description, tool, content, relatedTools }: ToolLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* 头部：增加层次感 */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            {h1}
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
        </header>

        {/* 核心工具区：增加阴影和圆角，突出主体 */}
        <section className="bg-white border border-slate-200 shadow-xl shadow-slate-200/50 rounded-3xl p-6 md:p-10 mb-20">
          <div className="min-h-[300px]">
            {tool}
          </div>
        </section>

        {/* SEO 深度文章区：这里是大兵的改良核心 */}
        <article className="prose prose-slate max-w-none lg:prose-lg">
          {/* 使用 prose 类名，并显式指定字体和颜色 */}
          <div className="prose prose-slate prose-lg max-w-none 
            prose-headings:font-bold prose-headings:text-slate-900
            prose-h2:text-3xl prose-h2:border-b prose-h2:pb-4 prose-h2:mt-12
            prose-p:text-slate-600 prose-p:leading-loose
            prose-li:text-slate-600
            prose-strong:text-slate-900
            prose-code:text-blue-600 prose-code:bg-blue-50 prose-code:px-1 prose-code:rounded">
            
            <h2 id="what-is">What is {h1}?</h2>
            {/* 改进：将文本按换行符切割，转为段落，触发 prose 样式 */}
            {content?.intro.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}

            <h2 id="how-to">How to use {h1} effectively?</h2>
            {content?.usage.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}

            <h2 id="examples">Example and Output</h2>
            <div className="not-prose my-8">
              <pre className="bg-slate-900 text-blue-400 p-6 rounded-2xl overflow-x-auto font-mono text-sm shadow-inner ring-1 ring-white/10">
                <code>{content?.example}</code>
              </pre>
            </div>

            <h2 id="use-cases">Common Use Cases</h2>
            {content?.useCases.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
            
            {content?.faq && content.faq.length > 0 && (
              <>
                <h2 id="faq">Frequently Asked Questions</h2>
                <div className="not-prose space-y-4 mt-8">
                  {content.faq.map((item, idx) => (
                    <details key={idx} className="group border border-slate-200 rounded-xl bg-slate-50/50 overflow-hidden">
                      <summary className="list-none p-5 cursor-pointer font-bold text-slate-800 flex justify-between items-center group-open:bg-white transition-colors">
                        Q: {item.q}
                        <span className="transition-transform group-open:rotate-180">▼</span>
                      </summary>
                      <div className="p-5 text-slate-600 border-t border-slate-200 bg-white">
                        A: {item.a}
                      </div>
                    </details>
                  ))}
                </div>
              </>
            )}
          </div>
        </article>

        {/* 底部内链：改成网格卡片式 */}
        <footer className="mt-24 border-t border-slate-200 pt-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Explore Other Free Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedTools.map((t) => (
              <Link 
                key={t.name} 
                href={t.path} 
                className="group p-6 bg-white border border-slate-200 rounded-2xl hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10 transition-all text-center"
              >
                <span className="block text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                  {t.name}
                </span>
              </Link>
            ))}
          </div>
        </footer>
      </div>
    </div>
  );
}