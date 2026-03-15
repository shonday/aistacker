import { tools } from "@/data/tools";
import { toolRegistry } from "@/lib/toolRegistry";
import ToolLayout from "@/components/ToolLayout";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * 修复一：校准 Metadata 路径
 */
export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const tool = tools.find((t) => t.slug === params.slug);
  
  if (!tool) return { title: "Tool Not Found" };

  return {
    title: `${tool.seo.title} | AIStacker`,
    description: tool.seo.description,
    // 注入 Canonical 标签
    alternates: {
      canonical: `https://aistacker.dev/tools/${tool.slug}`,
    },
    // 额外增强：针对爬虫的开放图谱
    openGraph: {
      title: tool.seo.title,
      description: tool.seo.description,
      url: `https://aistacker.dev/tools/${tool.slug}`,
      type: 'website',
    }
  };
}

export async function generateStaticParams() {
  return tools.map((tool) => ({
    slug: tool.slug,
  }));
}

/**
 * 修复二：确保数据完整传递给 Layout
 */
export default async function ToolPage(props: PageProps) {
  const params = await props.params;
  const tool = tools.find((t) => t.slug === params.slug);

  if (!tool) return notFound();

  const Component = toolRegistry[tool.component];

  // 内链系统
  const relatedTools = tools
    .filter((t) => t.slug !== params.slug)
    .sort(() => 0.5 - Math.random())
    .slice(0, 4)
    .map((t) => ({
      name: t.name,
      path: `/tools/${t.slug}`,
    }));

  return (
    <>
      {/* 结构化数据补全 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": tool.name,
            "applicationCategory": "DeveloperApplication",
            "description": tool.description,
            "operatingSystem": "Any",
          }),
        }}
      />
      <ToolLayout
        h1={tool.name}
        description={tool.description}
        tool={<Component />}
        // 确保传递的是 tool.content 对象
        content={tool.content}
        relatedTools={relatedTools}
      />
    </>
  );
}