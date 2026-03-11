import ToolLayout from "@/components/ToolLayout";
import UrlDecoder from "@/components/UrlDecoder";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Online URL Decoder - Decode URI Components | AIStacker",
  description: "Decode URL parameters instantly with our free online tool. Convert percent-encoded strings back to human-readable text.",
};

export default function UrlDecodePage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "URL Decoder",
    "applicationCategory": "DeveloperApplication"
  };

  const relatedTools = [
    { name: "URL Encoder", path: "/tools/url-encode" },
    { name: "Base64 Encode", path: "/tools/base64-encode" },
    { name: "JSON Formatter", path: "/tools/json-formatter" },
    { name: "UUID Generator", path: "/tools/uuid-generator" }
  ];

  const seoArticle = (
    <>
      <h2>How to Decode a URL String</h2>
      <p>If you have a URL that contains characters like <code>%20</code>, <code>%3F</code>, or <code>%26</code>, it has been URL-encoded. To read the original text, you need to decode it.</p>
      <h3>Steps to Use the Decoder</h3>
      <p>Paste the encoded string into our tool above and click 'Decode'. The system will return the plain text version instantly using standard URI decoding algorithms.</p>
    </>
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <ToolLayout 
        h1="Online URL Decoder"
        description="Decode percent-encoded URL strings back to plain text."
        tool={<UrlDecoder />}
        content={seoArticle}
        relatedTools={relatedTools}
      />
    </>
  );
}