import ToolLayout from "@/components/ToolLayout";
import Base64Encoder from "@/components/Base64Encoder";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Base64 Encode & Decode Online - Fast, Secure, Free | AIStacker",
  description: "Encode text to Base64 or decode Base64 strings back to plain text instantly. Safe and secure browser-based tool for developers.",
  alternates: {
    canonical: 'https://aistacker.dev/tools/base64-encode',
  },
};

export default function Base64Page() {
  const relatedTools = [
    { name: "JSON Formatter", path: "/tools/json-formatter" },
    { name: "UUID Generator", path: "/tools/uuid-generator" },
    { name: "URL Encoder", path: "/tools/url-encode" },
    { name: "Unix Timestamp", path: "/tools/timestamp-converter" }
  ];

  const seoArticle = (
    <>
      <h2>What is Base64 Encoding?</h2>
      <p>Base64 is a group of binary-to-text encoding schemes that represent binary data in an ASCII string format. It is commonly used when there is a need to encode binary data that needs to be stored and transferred over media that are designed to deal with textual data.</p>
      
      <h3>How to Use Our Base64 Tool</h3>
      <p>Our tool provides a simple interface to both <strong>encode</strong> and <strong>decode</strong> data:</p>
      <ul>
        <li><strong>Encoding:</strong> Paste your plain text into the input field and click &apos;Encode to Base64&apos;.</li>
        <li><strong>Decoding:</strong> Paste a Base64 string into the field, switch to &apos;Decode Mode&apos;, and click &apos;Decode from Base64&apos;.</li>
      </ul>

      <h3>Common Use Cases</h3>
      <ul>
        <li>Embedding image data within HTML or CSS.</li>
        <li>Encoding data for inclusion in URLs.</li>
        <li>Sending data through systems that only support 7-bit ASCII.</li>
      </ul>

      <h3>FAQ</h3>
      <h4>Is my data safe?</h4>
      <p>Absolutely. Like all tools on AIStacker, the conversion happens entirely within your web browser. We never upload your text to our servers.</p>
    </>
  );

  return (
    <ToolLayout 
      h1="Base64 Encode & Decode Online"
      description="Quickly convert text to Base64 format or decode it back to human-readable text."
      tool={<Base64Encoder />}
      content={seoArticle}
      relatedTools={relatedTools}
    />
  );
}