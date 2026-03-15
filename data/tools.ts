export interface Tool {
  slug: string;
  name: string;
  description: string;
  component: string;
  category: "developer" | "ai" | "text";
  seoTitle: string;
  seoDescription: string;
}

export const tools: Tool[] = [
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    description: "Format, validate, and beautify your JSON data instantly.",
    component: "JsonFormatter",
    category: "developer",
    seoTitle: "Free JSON Formatter Online - Beautify JSON Instantly",
    seoDescription: "The fastest online JSON formatter. Validate and prettify your JSON code with zero latency."
  },
  {
    slug: "base64-encode",
    name: "Base64 Encoder",
    description: "Encode text to Base64 or decode strings back to plain text.",
    component: "Base64Encoder",
    category: "developer",
    seoTitle: "Base64 Encode & Decode Online - Secure & Fast",
    seoDescription: "Convert strings to Base64 format or decode them back. Browser-based, secure, and free."
  },
  {
    slug: "uuid-generator",
    name: "UUID Generator",
    description: "Generate cryptographically secure random UUID v4.",
    component: "UUIDGenerator",
    category: "developer",
    seoTitle: "Online UUID Generator - Create Random V4 UUIDs",
    seoDescription: "Generate secure, random UUIDs (GUIDs) instantly for your software projects."
  },
  {
    slug: "regex-tester",
    name: "Regex Tester",
    description: "Test regular expressions with real-time highlighting.",
    component: "RegexTester",
    category: "developer",
    seoTitle: "Online Regex Tester - Real-time Regular Expression Debugger",
    seoDescription: "Test your regex patterns against strings with instant highlighting. Supports global and case-insensitive flags."
  },
  {
    slug: "timestamp-converter",
    name: "Timestamp Converter",
    description: "Convert between Unix timestamps and human-readable dates.",
    component: "TimestampConverter",
    category: "developer",
    seoTitle: "Unix Timestamp Converter - Epoch Time to Date",
    seoDescription: "Convert Unix epoch timestamps to UTC and Local time instantly."
  },
  {
    slug: "url-encode",
    name: "URL Encoder",
    description: "Encode characters for URI parameters safely.",
    component: "UrlEncoder",
    category: "developer",
    seoTitle: "URL Encoder Online - Percent-Encoding Tool",
    seoDescription: "Safely encode URL components using percent-encoding (URL encoding)."
  },
  {
    slug: "url-decode",
    name: "URL Decoder",
    description: "Decode percent-encoded strings back to plain text.",
    component: "UrlDecoder",
    category: "developer",
    seoTitle: "URL Decoder Online - Decode URI Components",
    seoDescription: "Instantly decode percent-encoded (URL encoded) strings back to their original text."
  }
];
