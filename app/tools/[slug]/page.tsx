import { tools } from "@/data/tools";
import { toolRegistry } from "@/lib/toolRegistry";
import ToolLayout from "@/components/ToolLayout";
import { notFound } from "next/navigation";
import { Metadata } from "next";

/**
 * 军师，这里是核心变化：
 * 明确定义 PageProps 类型，符合 Next.js 16 严格模式。
 */
interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * 1. 官方推荐的 generateMetadata 姿势
 * 框架会自动处理这个 Promise
 */
export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params; // 这里是标准的 Promise 处理
  const tool = tools.find((t) => t.slug === params.slug);
  
  if (!tool) return { title: "Tool Not Found" };

  return {
    title: `${tool.seoTitle} | AIStacker`,
    description: tool.seoDescription,
  };
}

/**
 * 2. 保持 generateStaticParams 
 * 这是 SEO 静态化的压舱石，也是框架理解 [slug] 范围的依据
 */
export async function generateStaticParams() {
  return tools.map((tool) => ({
    slug: tool.slug,
  }));
}

/**
 * 3. 终极渲染组件
 * 使用 props 直接接收，并保持异步一致性
 */
export default async function ToolPage(props: PageProps) {
  const params = await props.params;
  const tool = tools.find((t) => t.slug === params.slug);

  if (!tool) return notFound();

  // 这里的 Component 获取保持不变，依然通过 Registry
  const Component = toolRegistry[tool.component];

  // 内链系统（随机化算法保持不变，确保每次渲染的 SEO 活力）
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
      <ToolLayout
        h1={tool.name}
        description={tool.description}
        tool={<Component />}
        content={
          <div className="prose prose-slate max-w-none">
            <h2>Utilizing the {tool.name} for Maximum Efficiency</h2>
            <p>Our {tool.name} is designed to provide seamless, browser-side processing for high-performance needs.</p>
            {/* 这里的 Content 未来将通过 data/tools.ts 里的 markdown 字段动态注入 */}
          </div>
        }
        relatedTools={relatedTools}
      />
    </>
  );
}