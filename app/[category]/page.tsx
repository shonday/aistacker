import { tools } from "@/data/tools";
import { siteConfig } from "@/lib/config";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

// 预定义合法分类及其 SEO Meta
const CATEGORY_META: Record<string, { title: string; desc: string }> = {
  "developer-tools": { title: "Free Developer Tools", desc: "Essential online tools for web developers: formatters, validators, and more." },
  "text-tools": { title: "Online Text Tools", desc: "Powerful utilities for text manipulation, counting, and diffing." },
  "security-tools": { title: "Security & Hash Tools", desc: "Generate secure passwords, hashes, and manage basic encryption needs." },
  // ... 可根据蓝图持续补充
};

export async function generateMetadata(props: CategoryPageProps): Promise<Metadata> {
  const params = await props.params;
  const meta = CATEGORY_META[params.category];
  
  if (!meta) return { title: "Category Not Found" };

  return {
    title: `${meta.title} | ${siteConfig.name}`,
    description: meta.desc,
    alternates: {
      canonical: `${siteConfig.url}/${params.category}`,
    },
  };
}

export async function generateStaticParams() {
  return Object.keys(CATEGORY_META).map((cat) => ({ category: cat }));
}

export default async function CategoryPage(props: CategoryPageProps) {
  const params = await props.params;
  const meta = CATEGORY_META[params.category];

  if (!meta) return notFound();

  // 映射 category slug 到实际的 data 字段 (比如 "developer-tools" -> "developer")
  const dataCategory = params.category.split('-')[0]; 
  const categoryTools = tools.filter(t => t.category === dataCategory);

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4 capitalize">{meta.title}</h1>
        <p className="text-xl text-slate-600">{meta.desc}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoryTools.map((tool) => (
          <Link key={tool.slug} href={`/tools/${tool.slug}`} className="block p-6 bg-white border border-slate-200 rounded-2xl hover:shadow-xl hover:border-blue-500 transition-all group">
            <h2 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 mb-2">{tool.name}</h2>
            <p className="text-slate-600 text-sm leading-relaxed">{tool.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}