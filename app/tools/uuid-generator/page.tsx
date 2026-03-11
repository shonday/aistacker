import ToolLayout from "@/components/ToolLayout";
import UUIDGenerator from "@/components/UUIDGenerator";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Online UUID/GUID Generator - Free V4 UUID Creator | AIStacker",
  description: "Generate unique V4 UUIDs (Universally Unique Identifiers) instantly. Create secure, random GUIDs for your software projects.",
  alternates: {
    canonical: 'https://aistacker.dev/tools/uuid-generator',
  },
};

export default function UuidPage() {
  const relatedTools = [
    { name: "JSON Formatter", path: "/tools/json-formatter" },
    { name: "Base64 Encoder", path: "/tools/base64-encode" },
    { name: "Timestamp Converter", path: "/tools/timestamp-converter" },
    { name: "Password Generator", path: "/tools/password-generator" }
  ];

  const seoArticle = (
    <>
      <h2>What is a UUID?</h2>
      <p>A UUID (Universally Unique Identifier) is a 128-bit number used to identify information in computer systems. A UUID v4 is generated using random numbers, making the probability of a duplicate virtually zero.</p>
      
      <h3>Why Use Our UUID Generator?</h3>
      <p>Our generator uses the cryptographically secure <code>crypto.randomUUID()</code> method provided by modern web browsers, ensuring high entropy and true randomness for your identifiers.</p>

      <h3>How to Use</h3>
      <ol>
        <li>Click the <strong>Generate New UUID</strong> button to create a fresh identifier.</li>
        <li>View your history below if you need to retrieve a previously generated ID from the current session.</li>
        <li>Use the <strong>Copy</strong> button to instantly add the ID to your clipboard.</li>
      </ol>

      <h3>Technical Format</h3>
      <p>A standard UUID is represented by 32 hexadecimal digits, displayed in five groups separated by hyphens, in the form <code>8-4-4-4-12</code> for a total of 36 characters.</p>

      <h3>FAQ</h3>
      <h4>Is it really unique?</h4>
      <p>While not mathematically guaranteed to be unique, the number of possible UUIDs is 2^128. The chance of a collision is so infinitesimally small that it is considered negligible for most practical applications.</p>
    </>
  );

  return (
    <ToolLayout 
      h1="Online UUID/GUID Generator"
      description="Generate cryptographically strong Version 4 UUIDs instantly."
      tool={<UUIDGenerator />}
      content={seoArticle}
      relatedTools={relatedTools}
    />
  );
}