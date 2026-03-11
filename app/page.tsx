import Link from "next/link"

const tools = [
  { name: "JSON Formatter", slug: "json-formatter", desc: "Format, validate, and beautify JSON data." },
  { name: "Base64 Encoder", slug: "base64-encode", desc: "Encode text to Base64 or decode it back." },
  { name: "UUID Generator", slug: "uuid-generator", desc: "Generate secure v4 UUIDs instantly." },
  { name: "Regex Tester", slug: "regex-tester", desc: "Test regular expressions with real-time highlighting." },
  { name: "Timestamp Converter", slug: "timestamp-converter", desc: "Convert Unix epochs to human-readable dates." },
  { name: "URL Encoder", slug: "url-encode", desc: "Safely encode URL parameters." },
  { name: "URL Decoder", slug: "url-decode", desc: "Decode URI components back to plain text." },
]

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
          The Ultimate <span className="text-blue-600">Developer Tool Stack</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Fast, secure, and completely browser-based utilities. No data leaves your machine. Designed for speed and simplicity.
        </p>
      </div>

      {/* Tool Grid */}
      <h2 className="text-2xl font-bold mb-6 text-slate-800">Popular Tools</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map(tool => (
          <Link key={tool.slug} href={`/tools/${tool.slug}`} className="group block p-6 bg-white border border-slate-200 rounded-xl hover:border-blue-500 hover:shadow-md transition-all">
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 mb-2">{tool.name}</h3>
            <p className="text-slate-500 text-sm">{tool.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}