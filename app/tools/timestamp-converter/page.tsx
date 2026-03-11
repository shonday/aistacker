import ToolLayout from "@/components/ToolLayout";
import TimestampConverter from "@/components/TimestampConverter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unix Timestamp Converter Online - Epoch to Date | AIStacker",
  description: "Convert Unix timestamps (Epoch) to human-readable dates in Local and UTC time instantly. Fast and free online developer tool.",
};

export default function TimestampPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Timestamp Converter",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Any"
  };

  const relatedTools = [
    { name: "JSON Formatter", path: "/tools/json-formatter" },
    { name: "Regex Tester", path: "/tools/regex-tester" },
    { name: "UUID Generator", path: "/tools/uuid-generator" },
    { name: "URL Encoder", path: "/tools/url-encode" }
  ];

  const seoArticle = (
    <>
      <h2>What is a Unix Timestamp?</h2>
      <p>A Unix timestamp (also known as Epoch time) is a system for describing a point in time. It is the number of seconds that have elapsed since 00:00:00 UTC, Thursday, 1 January 1970.</p>
      <h3>How to Use Our Converter</h3>
      <p>Simply enter the numerical timestamp into the field. Our tool will instantly show you the conversion in Local time, UTC, and the ISO 8601 standard format.</p>
      <h3>FAQ</h3>
      <h4>Does this support milliseconds?</h4>
      <p>This version is optimized for seconds. If your timestamp has 13 digits instead of 10, it is likely in milliseconds.</p>
    </>
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <ToolLayout 
        h1="Unix Timestamp Converter"
        description="Quickly convert between Unix epoch time and human-readable dates."
        tool={<TimestampConverter />}
        content={seoArticle}
        relatedTools={relatedTools}
      />
    </>
  );
}