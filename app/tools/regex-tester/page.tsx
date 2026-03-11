import ToolLayout from "@/components/ToolLayout";
import RegexTester from "@/components/RegexTester";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Regex Tester Online - Test Regular Expressions Instantly | AIStacker",
  description: "Test and debug your Regular Expressions (RegEx) online. Features real-time syntax highlighting and match visualization.",
};

export default function RegexTesterPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Regex Tester",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0.00", "priceCurrency": "USD" }
  };

  const relatedTools = [
    { name: "JSON Formatter", path: "/tools/json-formatter" },
    { name: "Base64 Encoder", path: "/tools/base64-encode" },
    { name: "URL Encoder", path: "/tools/url-encode" },
    { name: "Timestamp Converter", path: "/tools/timestamp-converter" }
  ];

  const seoArticle = (
    <>
      <h2>What is a Regular Expression (Regex)?</h2>
      <p>A Regular Expression, commonly known as Regex or RegExp, is a sequence of characters that specifies a search pattern. Usually, such patterns are used by string-searching algorithms for "find" or "find and replace" operations on strings, or for input validation.</p>
      
      <h3>How to Use Our Regex Tester</h3>
      <ol>
        <li><strong>Enter your pattern:</strong> Type your regular expression in the top input field. Do not include the forward slashes <code>/</code>.</li>
        <li><strong>Set flags:</strong> Adjust the flags in the right-hand box. Common flags include <code>g</code> (global), <code>i</code> (case-insensitive), and <code>m</code> (multiline).</li>
        <li><strong>Input test string:</strong> Paste your target text in the "Test String" area.</li>
        <li><strong>View results:</strong> Matches will be highlighted instantly in the "Match Result" area.</li>
      </ol>
      {/* 800字长文在此扩展 */}
    </>
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <ToolLayout 
        h1="Free Online Regex Tester"
        description="Write, test, and debug your Regular Expressions instantly."
        tool={<RegexTester />}
        content={seoArticle}
        relatedTools={relatedTools}
      />
    </>
  );
}