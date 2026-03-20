import { tools } from "@/data/tools";
import { toolRegistry } from "@/lib/toolRegistry";
import ToolLayout from "@/components/ToolLayout";
import { siteConfig } from "@/lib/config";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const tool = tools.find((t) => t.slug === params.slug);
  
  if (!tool) return { title: "Tool Not Found" };

  return {
    title: `${tool.seo.title} | ${siteConfig.name}`,
    description: tool.seo.description,
    alternates: {
      // 动态拼接 Canonical，绝对防止重复内容惩罚
      canonical: `${siteConfig.url}/tools/${tool.slug}`,
    },
  };
}

export async function generateStaticParams() {
  return tools.map((tool) => ({
    slug: tool.slug,
  }));
}

export default async function ToolPage(props: PageProps) {
  const params = await props.params;
  const tool = tools.find((t) => t.slug === params.slug);

  if (!tool) return notFound();

  const Component = toolRegistry[tool.component];

  // 核心修复：废弃 Math.random()，改用严格的 Category 聚类推荐，提升 Topical Authority
  const relatedTools = tools
    .filter((t) => t.category === tool.category && t.slug !== tool.slug)
    .slice(0, 4)
    .map((t) => ({
      name: t.name,
      path: `/tools/${t.slug}`,
    }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": tool.name,
              "applicationCategory": "DeveloperApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              }
            },
            {
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": tool.name,
              "url": `${siteConfig.url}/tools/${tool.slug}`,
              "applicationCategory": "DeveloperApplication",
              "browserRequirements": "Requires JavaScript"
            }
          ]),
        }}
      />
      <ToolLayout
        h1={tool.name}
        description={tool.description}
        tool={<Component />}
        content={tool.content}
        relatedTools={relatedTools}
      />
    </>
  );
}