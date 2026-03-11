import Link from "next/link"

export default function Header() {
  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="font-extrabold text-2xl tracking-tighter text-slate-900">
          AI<span className="text-blue-600">Stacker</span>
        </Link>
        <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
          <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
          <Link href="/tools/json-formatter" className="hover:text-slate-900 transition-colors">JSON</Link>
          <Link href="/tools/base64-encode" className="hover:text-slate-900 transition-colors">Base64</Link>
          <Link href="/tools/uuid-generator" className="hover:text-slate-900 transition-colors">UUID</Link>
          <Link href="/tools/regex-tester" className="hover:text-slate-900 transition-colors">Regex</Link>
        </nav>
      </div>
    </header>
  )
}