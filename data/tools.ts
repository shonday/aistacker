export interface ToolContent {
  intro: string;
  usage: string;
  example: string;
  useCases: string;
  faq: { q: string; a: string }[];
}

export interface Tool {
  slug: string;
  name: string;
  description: string;
  component: string;
  category: "developer" | "text" | "ai";
  seo: {
    title: string;
    description: string;
  };
  content: ToolContent;
}

export const tools: Tool[] = [
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    description: "Deeply format and beautify JSON code instantly.",
    component: "JsonFormatter",
    category: "developer",
    seo: {
      title: "Free JSON Formatter Online - Beautify & Prettify JSON | AIStacker",
      description: "Fastest online JSON formatter with syntax validation. 100% private and secure browser-based tool."
    },
    content: {
      intro: "JSON Formatter is an essential utility for developers, data analysts, and system administrators who work with JavaScript Object Notation. In modern web development, APIs often return minified JSON to save bandwidth, which makes it nearly impossible for humans to read or debug. Our tool transforms these dense strings into a human-readable, hierarchical structure with proper indentation and syntax highlighting.",
      usage: "To use the JSON Formatter, simply paste your raw, minified, or messy JSON data into the primary input area. Our tool utilizes an intelligent parsing engine that automatically detects the structure. Once you click the format button, the system applies standard indentation and organizes keys and values for maximum clarity.",
      example: "// Input:\n{\"id\":1,\"name\":\"AIStacker\"}\n\n// Output:\n{\n  \"id\": 1,\n  \"name\": \"AIStacker\"\n}",
      useCases: "1. Debugging REST API responses.\n2. Formatting config files.\n3. Validating JSON syntax.\n4. Cleaning up production logs.",
      faq: [
        { q: "Is my JSON data secure?", a: "Yes. All processing happens locally in your browser." },
        { q: "Can it handle invalid JSON?", a: "The tool will provide an error message if the syntax is broken." }
      ]
    }
  },
  {
    slug: "base64-encode",
    name: "Base64 Encoder",
    description: "Encode text to Base64 or decode strings back to plain text.",
    component: "Base64Encoder",
    category: "developer",
    seo: {
      title: "Base64 Encode & Decode Online - Secure & Fast | AIStacker",
      description: "Convert strings to Base64 format or decode them back. Browser-based and secure."
    },
    content: {
      intro: "Base64 encoding schemes are commonly used when binary data needs to be stored and transferred over media designed for text. Our Base64 Encoder/Decoder provides a bidirectional interface for switching between plain text and Base64 representation.",
      usage: "Enter your text into the box; if encoding, it transforms UTF-8 string into Base64. If decoding, ensure you provide a valid Base64 string for accurate results.",
      example: "// Plain Text: Hello\n// Base64: SGVsbG8=",
      useCases: "1. Encoding URL parameters.\n2. Embedding data in HTML/CSS.\n3. Basic data obfuscation.",
      faq: [
        { q: "Is Base64 encryption?", a: "No, it is an encoding format, easily reversible." }
      ]
    }
  },
  {
    slug: "uuid-generator",
    name: "UUID Generator",
    description: "Generate secure random UUID v4.",
    component: "UUIDGenerator",
    category: "developer",
    seo: {
      title: "Online UUID Generator - Create Random V4 UUIDs | AIStacker",
      description: "Generate cryptographically secure v4 UUIDs (GUIDs) instantly in your browser."
    },
    content: {
      intro: "A Universally Unique Identifier (UUID) is a 128-bit label used for information in computer systems. Version 4 UUIDs are randomly generated and have an extremely low probability of collision.",
      usage: "Simply click the 'Generate' button to create a new unique identifier. You can generate multiple UUIDs at once for batch operations.",
      example: "Result: 550e8400-e29b-41d4-a716-446655440000",
      useCases: "1. Primary keys in databases.\n2. Unique session identifiers.\n3. Transaction IDs in distributed systems.",
      faq: [
        { q: "How random are these UUIDs?", a: "We use the window.crypto API for cryptographically secure randomness." }
      ]
    }
  },
  {
    slug: "regex-tester",
    name: "Regex Tester",
    description: "Test regular expressions with real-time highlighting.",
    component: "RegexTester",
    category: "developer",
    seo: {
      title: "Online Regex Tester - Real-time Regular Expression Debugger | AIStacker",
      description: "Write and test regular expressions with instant match highlighting."
    },
    content: {
      intro: "Regular expressions (Regex) are patterns used to match character combinations in strings. Our tester provides a real-time environment to validate your patterns.",
      usage: "Enter your regex pattern and flags, then type your test string. Matches will be highlighted automatically as you type.",
      example: "Pattern: \\d+\nString: Order 123\nMatch: 123",
      useCases: "1. Validating user input (emails, phones).\n2. Scraping data from text.\n3. Search and replace operations.",
      faq: [
        { q: "Which regex engine is used?", a: "It uses the standard JavaScript RegExp engine." }
      ]
    }
  },
  {
    slug: "timestamp-converter",
    name: "Timestamp Converter",
    description: "Convert between Unix timestamps and human-readable dates.",
    component: "TimestampConverter",
    category: "developer",
    seo: {
      title: "Unix Timestamp Converter - Epoch Time to Date | AIStacker",
      description: "Convert Unix epoch timestamps to UTC and Local time instantly."
    },
    content: {
      intro: "Unix time is the number of seconds that have elapsed since the Unix epoch (January 1, 1970). It is widely used in programming and operating systems.",
      usage: "Paste a Unix timestamp to see its human-readable date, or convert a date back into a numerical timestamp.",
      example: "Input: 1672531200\nResult: 2023-01-01 00:00:00 UTC",
      useCases: "1. Debugging database timestamps.\n2. Converting API log times.\n3. Scheduling system tasks.",
      faq: [
        { q: "Does it support milliseconds?", a: "Yes, our converter automatically detects both second and millisecond formats." }
      ]
    }
  },
  {
    slug: "url-encode",
    name: "URL Encoder",
    description: "Encode characters for URI parameters safely.",
    component: "UrlEncoder",
    category: "developer",
    seo: {
      title: "URL Encoder Online - Percent-Encoding Tool | AIStacker",
      description: "Safely encode URL components with percent-encoding."
    },
    content: {
      intro: "URL encoding, also known as percent-encoding, replaces unsafe ASCII characters with a '%' followed by two hexadecimal digits.",
      usage: "Paste your plain text into the input field to generate a URL-safe encoded string for query parameters.",
      example: "Input: hello world?\nResult: hello%20world%3F",
      useCases: "1. Constructing GET request URLs.\n2. Handling special characters in API calls.",
      faq: [
        { q: "What characters are encoded?", a: "All non-alphanumeric characters except - _ . ~" }
      ]
    }
  },
  {
    slug: "url-decode",
    name: "URL Decoder",
    description: "Decode percent-encoded strings back to plain text.",
    component: "UrlDecoder",
    category: "developer",
    seo: {
      title: "URL Decoder Online - Decode URI Components | AIStacker",
      description: "Instantly decode percent-encoded strings back to their original text."
    },
    content: {
      intro: "URL decoding is the reverse process of encoding, turning percent-encoded characters back into their original form.",
      usage: "Paste an encoded URL string to see the original human-readable text.",
      example: "Input: hello%20world\nResult: hello world",
      useCases: "1. Reading URL parameters from browser logs.\n2. Debugging encoded API endpoints.",
      faq: [
        { q: "Can it decode multiple times?", a: "Yes, if a string was double-encoded, you can decode it twice." }
      ]
    }
  }
];