import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography"; // 采用 ESM 规范导入

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,js,jsx,mdx}",
    "./components/**/*.{ts,tsx,js,jsx,mdx}",
    "./lib/**/*.{ts,tsx,js,jsx}",
    "./data/**/*.{ts,tsx,js,jsx}", // 确保扫描到 markdown 文本
  ],
  theme: {
    extend: {
      // 可以在这里根据需要扩展排版颜色
    },
  },
  plugins: [typography], // 正确挂载
};

export default config;