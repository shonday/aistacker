import Link from "next/link";
import React from "react";

interface RelatedTool { name: string; path: string; }

interface ToolLayoutProps {
  h1: string;
  description?: string;
  tool: React.ReactNode;
  content?: React.ReactNode;
  relatedTools?: RelatedTool[];
  showAIBeta?: boolean;
}

export default function ToolLayout({ h1, description, tool, content, relatedTools = [], showAIBeta = true }: ToolLayoutProps) {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{h1}</h1>
        {description && <p className="text-sm text-slate-600 mt-2">{description}</p>}
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="mb-6">{tool}</div>
          {content}
        </div>

        <aside className="space-y-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="text-sm font-semibold mb-2">Related Tools</h4>
            <ul className="space-y-2">
              {relatedTools.map((t) => (
                <li key={t.path}>
                  <Link href={t.path} className="text-sm text-blue-600 hover:underline">{t.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {showAIBeta && (
            <div className="rounded-lg border bg-card p-4">
              <h4 className="text-sm font-semibold mb-2">AI Beta</h4>
              <p className="text-xs text-slate-600">Preview AI features here in the future. Sign up for early access when available.</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
