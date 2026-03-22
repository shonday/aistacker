"use client"

import { useState, useEffect, useCallback } from "react"
import { Copy, Check } from "lucide-react"

// Web Crypto API — supported in all modern browsers
async function digest(algo: string, text: string): Promise<string> {
  const encoder = new TextEncoder()
  const data    = encoder.encode(text)
  const buffer  = await crypto.subtle.digest(algo, data)
  return [...new Uint8Array(buffer)].map(b => b.toString(16).padStart(2, "0")).join("")
}

// MD5 via pure JS (Web Crypto doesn't support MD5)
function md5(input: string): string {
  function safeAdd(x: number, y: number): number {
    const lsw = (x & 0xffff) + (y & 0xffff)
    return ((x >> 16) + (y >> 16) + (lsw >> 16)) << 16 | lsw & 0xffff
  }
  function bitRotate(num: number, cnt: number): number {
    return num << cnt | num >>> (32 - cnt)
  }
  function md5cmn(q: number, a: number, b: number, x: number, s: number, t: number): number {
    return safeAdd(bitRotate(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b)
  }
  function md5ff(a:number,b:number,c:number,d:number,x:number,s:number,t:number){return md5cmn(b&c|~b&d,a,b,x,s,t)}
  function md5gg(a:number,b:number,c:number,d:number,x:number,s:number,t:number){return md5cmn(b&d|c&~d,a,b,x,s,t)}
  function md5hh(a:number,b:number,c:number,d:number,x:number,s:number,t:number){return md5cmn(b^c^d,a,b,x,s,t)}
  function md5ii(a:number,b:number,c:number,d:number,x:number,s:number,t:number){return md5cmn(c^(b|~d),a,b,x,s,t)}

  const str8 = new TextEncoder().encode(input)
  const len8  = str8.length
  const words: number[] = []
  for (let i=0;i<len8;i++) words[i>>2]|=str8[i]<<(i%4*8)
  words[len8>>2]|=0x80<<(len8%4*8)
  words[(((len8+8)>>6)<<4)+14]=len8*8

  let a=1732584193,b=-271733879,c=-1732584194,d=271733878
  for(let i=0;i<words.length;i+=16){
    const [oa,ob,oc,od]=[a,b,c,d]
    a=md5ff(a,b,c,d,words[i+0],7,-680876936);d=md5ff(d,a,b,c,words[i+1],12,-389564586);c=md5ff(c,d,a,b,words[i+2],17,606105819);b=md5ff(b,c,d,a,words[i+3],22,-1044525330)
    a=md5ff(a,b,c,d,words[i+4],7,-176418897);d=md5ff(d,a,b,c,words[i+5],12,1200080426);c=md5ff(c,d,a,b,words[i+6],17,-1473231341);b=md5ff(b,c,d,a,words[i+7],22,-45705983)
    a=md5ff(a,b,c,d,words[i+8],7,1770035416);d=md5ff(d,a,b,c,words[i+9],12,-1958414417);c=md5ff(c,d,a,b,words[i+10],17,-42063);b=md5ff(b,c,d,a,words[i+11],22,-1990404162)
    a=md5ff(a,b,c,d,words[i+12],7,1804603682);d=md5ff(d,a,b,c,words[i+13],12,-40341101);c=md5ff(c,d,a,b,words[i+14],17,-1502002290);b=md5ff(b,c,d,a,words[i+15],22,1236535329)
    a=md5gg(a,b,c,d,words[i+1],5,-165796510);d=md5gg(d,a,b,c,words[i+6],9,-1069501632);c=md5gg(c,d,a,b,words[i+11],14,643717713);b=md5gg(b,c,d,a,words[i+0],20,-373897302)
    a=md5gg(a,b,c,d,words[i+5],5,-701558691);d=md5gg(d,a,b,c,words[i+10],9,38016083);c=md5gg(c,d,a,b,words[i+15],14,-660478335);b=md5gg(b,c,d,a,words[i+4],20,-405537848)
    a=md5gg(a,b,c,d,words[i+9],5,568446438);d=md5gg(d,a,b,c,words[i+14],9,-1019803690);c=md5gg(c,d,a,b,words[i+3],14,-187363961);b=md5gg(b,c,d,a,words[i+8],20,1163531501)
    a=md5gg(a,b,c,d,words[i+13],5,-1444681467);d=md5gg(d,a,b,c,words[i+2],9,-51403784);c=md5gg(c,d,a,b,words[i+7],14,1735328473);b=md5gg(b,c,d,a,words[i+12],20,-1926607734)
    a=md5hh(a,b,c,d,words[i+5],4,-378558);d=md5hh(d,a,b,c,words[i+8],11,-2022574463);c=md5hh(c,d,a,b,words[i+11],16,1839030562);b=md5hh(b,c,d,a,words[i+14],23,-35309556)
    a=md5hh(a,b,c,d,words[i+1],4,-1530992060);d=md5hh(d,a,b,c,words[i+4],11,1272893353);c=md5hh(c,d,a,b,words[i+7],16,-155497632);b=md5hh(b,c,d,a,words[i+10],23,-1094730640)
    a=md5hh(a,b,c,d,words[i+13],4,681279174);d=md5hh(d,a,b,c,words[i+0],11,-358537222);c=md5hh(c,d,a,b,words[i+3],16,-722521979);b=md5hh(b,c,d,a,words[i+6],23,76029189)
    a=md5hh(a,b,c,d,words[i+9],4,-640364487);d=md5hh(d,a,b,c,words[i+12],11,-421815835);c=md5hh(c,d,a,b,words[i+15],16,530742520);b=md5hh(b,c,d,a,words[i+2],23,-995338651)
    a=md5ii(a,b,c,d,words[i+0],6,-198630844);d=md5ii(d,a,b,c,words[i+7],10,1126891415);c=md5ii(c,d,a,b,words[i+14],15,-1416354905);b=md5ii(b,c,d,a,words[i+5],21,-57434055)
    a=md5ii(a,b,c,d,words[i+12],6,1700485571);d=md5ii(d,a,b,c,words[i+3],10,-1894986606);c=md5ii(c,d,a,b,words[i+10],15,-1051523);b=md5ii(b,c,d,a,words[i+1],21,-2054922799)
    a=md5ii(a,b,c,d,words[i+8],6,1873313359);d=md5ii(d,a,b,c,words[i+15],10,-30611744);c=md5ii(c,d,a,b,words[i+6],15,-1560198380);b=md5ii(b,c,d,a,words[i+13],21,1309151649)
    a=md5ii(a,b,c,d,words[i+4],6,-145523070);d=md5ii(d,a,b,c,words[i+11],10,-1120210379);c=md5ii(c,d,a,b,words[i+2],15,718787259);b=md5ii(b,c,d,a,words[i+9],21,-343485551)
    a=safeAdd(a,oa);b=safeAdd(b,ob);c=safeAdd(c,oc);d=safeAdd(d,od)
  }

  const result=[a,b,c,d]
  return result.map(n=>(n<0?n+4294967296:n).toString(16).padStart(8,"0").match(/../g)!.map(h=>h[1]+h[0]).join("")).join("")
}

type HashName = "MD5" | "SHA-1" | "SHA-256" | "SHA-512"
const HASH_ALGOS: HashName[] = ["MD5", "SHA-1", "SHA-256", "SHA-512"]

export default function HashGenerator() {
  const [input,  setInput]  = useState("")
  const [hashes, setHashes] = useState<Record<HashName, string>>({
    "MD5": "", "SHA-1": "", "SHA-256": "", "SHA-512": "",
  })
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function compute() {
      if (!input) {
        setHashes({ "MD5": "", "SHA-1": "", "SHA-256": "", "SHA-512": "" })
        return
      }
      const [sha1, sha256, sha512] = await Promise.all([
        digest("SHA-1",   input),
        digest("SHA-256", input),
        digest("SHA-512", input),
      ])
      const md5hash = md5(input)
      if (!cancelled) setHashes({ "MD5": md5hash, "SHA-1": sha1, "SHA-256": sha256, "SHA-512": sha512 })
    }
    compute()
    return () => { cancelled = true }
  }, [input])

  const copy = useCallback(async (text: string, id: string) => {
    try { await navigator.clipboard.writeText(text) }
    catch {
      const el = document.createElement("textarea")
      el.value = text; document.body.appendChild(el)
      el.select(); document.execCommand("copy"); document.body.removeChild(el)
    }
    setCopied(id)
    setTimeout(() => setCopied(null), 1500)
  }, [])

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="hash-input" className="text-xs font-medium text-muted-foreground">
          Input text — hashes update as you type
        </label>
        <textarea
          id="hash-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          rows={4}
          spellCheck={false}
          placeholder="Enter any text to hash…"
          className="w-full resize-y rounded-lg border border-border bg-background p-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring/20"
        />
      </div>

      <div className="space-y-2">
        {HASH_ALGOS.map(algo => (
          <div key={algo} className="rounded-lg border border-border/60 bg-card overflow-hidden">
            <div className="flex items-center justify-between border-b border-border/30 bg-muted/30 px-3 py-1.5">
              <span className="font-mono text-xs font-semibold">{algo}</span>
              {hashes[algo] && (
                <button
                  onClick={() => copy(hashes[algo], algo)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  {copied === algo
                    ? <><Check className="h-3 w-3 text-emerald-500" /> Copied</>
                    : <><Copy className="h-3 w-3" /> Copy</>
                  }
                </button>
              )}
            </div>
            <div className="px-3 py-2.5 font-mono text-xs break-all text-muted-foreground min-h-[36px]">
              {hashes[algo] || <span className="opacity-40">—</span>}
            </div>
          </div>
        ))}
      </div>

      {input && (
        <button
          onClick={() => {
            const all = HASH_ALGOS.map(a => `${a}: ${hashes[a]}`).join("\n")
            copy(all, "all")
          }}
          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
        >
          {copied === "all" ? <><Check className="h-3 w-3 text-emerald-500" /> Copied all</> : <><Copy className="h-3 w-3" /> Copy all hashes</>}
        </button>
      )}
    </div>
  )
}
