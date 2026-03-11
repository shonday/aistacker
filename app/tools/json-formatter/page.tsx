import ToolLayout from "@/components/ToolLayout";
import JsonFormatter from "@/components/JsonFormatter";
import type { Metadata } from "next";

// 独立 SEO Meta (核心)
export const metadata: Metadata = {
  title: "Free JSON Formatter Online - Format & Beautify JSON Instantly | AIStacker",
  description: "Format and beautify JSON instantly with our free online JSON formatter. Validate and prettify JSON data for developers.",
  alternates: {
    canonical: 'https://aistacker.dev/tools/json-formatter',
  },
};

export default function JsonFormatterPage() {
  const relatedTools = [
    { name: "Base64 Encoder", path: "/tools/base64-encode" },
    { name: "UUID Generator", path: "/tools/uuid-generator" },
    { name: "Regex Tester", path: "/tools/regex-tester" },
    { name: "URL Encoder", path: "/tools/url-encode" }
  ];

  const seoArticle = (
    <>
      <h2>What is JSON Formatter?</h2>
      <p>JSON (JavaScript Object Notation) is a lightweight data-interchange format. Our free JSON Formatter online tool helps developers instantly validate, parse, and beautify minified JSON code into a readable structure.</p>
      
      <h3>How to Use Our Free JSON Formatter</h3>
      <ol>
        <li>Paste your raw or minified JSON string into the input text area.</li>
        <li>Click the <strong>Format & Beautify</strong> button.</li>
        <li>Copy the neatly formatted output, complete with proper indentation.</li>
      </ol>

      <h3>FAQ</h3>
      <h4>Is this tool secure?</h4>
      <p>Yes. All formatting and validation processes happen locally in your browser. No data is sent to or stored on our servers.</p>
      {/* 待扩充至 1000 字 */}
    </>
  );

  return (
    <ToolLayout 
      h1="Free JSON Formatter Online"
      description="Format, validate, and beautify your JSON data instantly in your browser."
      tool={<JsonFormatter />}
      content={seoArticle}
      relatedTools={relatedTools}
    />
  );
}