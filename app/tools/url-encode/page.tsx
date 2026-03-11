import ToolLayout from "@/components/ToolLayout";
import UrlEncoder from "@/components/UrlEncoder";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Online URL Encoder - Percent-Encoding Tool | AIStacker",
  description: "Safely encode URL components with our free online Percent-Encoding tool. Ensure your URI parameters are properly formatted.",
};

export default function UrlEncodePage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "URL Encoder",
    "applicationCategory": "DeveloperApplication"
  };

  const relatedTools = [
    { name: "URL Decoder", path: "/tools/url-decode" },
    { name: "Base64 Encoder", path: "/tools/base64-encode" },
    { name: "JSON Formatter", path: "/tools/json-formatter" },
    { name: "UUID Generator", path: "/tools/uuid-generator" }
  ];

  const seoArticle = (
    <>
      <h2>What is URL Encoding?</h2>
      <p>URL encoding, also known as percent-encoding, is a mechanism for encoding information in a Uniform Resource Identifier (URI) by replacing reserved characters with a percent sign followed by two hexadecimal digits.</p>
      <h3>Why is URL Encoding Necessary?</h3>
      <p>Characters that are not allowed in a URL must be encoded. For example, a space becomes <code>%20</code>. This ensures that browsers and servers correctly interpret parameters in a GET request.</p>
    </>
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <ToolLayout 
        h1="Online URL Encoder"
        description="Encode text for use in URI parameters and query strings."
        tool={<UrlEncoder />}
        content={seoArticle}
        relatedTools={relatedTools}
      />
    </>
  );
}