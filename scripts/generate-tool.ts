import fs from 'fs';
import path from 'path';

const toolName = process.argv[2]; // 例如: "PasswordGenerator"
const slug = process.argv[3];     // 例如: "password-generator"

if (!toolName || !slug) {
  console.log("Usage: npx ts-node scripts/generate-tool.ts <ToolName> <slug>");
  process.exit(1);
}

// 1. 定义模板：自动化生成基础 UI 组件
const componentTemplate = `"use client"
import { useState } from "react"

export default function ${toolName}() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")

  const handleAction = () => {
    // TODO: Implement tool logic
    setOutput(input)
  }

  return (
    <div className="space-y-4">
      <textarea
        className="w-full border border-slate-300 p-4 rounded-md font-mono text-sm h-32 focus:ring-2 focus:ring-blue-500 outline-none"
        placeholder="Enter input..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={handleAction} className="bg-slate-900 text-white px-6 py-2 rounded-md hover:bg-slate-800 transition-colors">
        Process
      </button>
      <div className="p-4 bg-slate-50 border rounded-md font-mono text-sm break-all min-h-[100px]">
        {output || "Result will appear here..."}
      </div>
    </div>
  )
}
`;

// 2. 执行写入操作
const componentPath = path.join(process.cwd(), 'components', `${toolName}.tsx`);

try {
  // 创建组件文件
  fs.writeFileSync(componentPath, componentTemplate);
  
  console.log(`✅ Success: Component created at ${componentPath}`);
  console.log(`\nNext Steps:`);
  console.log(`1. Add to lib/toolRegistry.ts: "${toolName}": dynamic(() => import("@/components/${toolName}"))`);
  console.log(`2. Add entry to data/tools.ts with slug: "${slug}"`);
  console.log(`3. Run build to generate static SEO page.`);
} catch (error) {
  console.error("❌ Failed to generate tool:", error);
}