import { tools } from "@/data/tools";
import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
          The Ultimate <span className="text-blue-600">Developer Stack</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Lightweight, open-source, and lightning-fast browser-based tools.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <Link 
            key={tool.slug} 
            href={`/tools/${tool.slug}`} 
            className="group block p-6 bg-white border border-slate-200 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all"
          >
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 mb-2">
              {tool.name}
            </h3>
            <p className="text-slate-500 text-sm line-clamp-2">
              {tool.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
