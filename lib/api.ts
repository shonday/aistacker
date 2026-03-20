// lib/api.ts — Thin fetch wrapper for future FastAPI backend calls.
//
// All current tools are fully client-side — this file is dormant.
// When a tool sets `apiEndpoint` in data/tools.ts, call it through here:
//
//   const result = await callToolApi("pdf-compress", payload, tool.apiEndpoint)
//
// FastAPI (Python) receives: { toolId, payload }
// FastAPI responds with:    { success, data, error, processingMs }

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8000"

export interface ToolApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  processingMs?: number
}

export async function callToolApi<TPayload, TResult>(
  toolId: string,
  payload: TPayload,
  endpoint?: string
): Promise<ToolApiResponse<TResult>> {
  const url = endpoint
    ? `${API_BASE}${endpoint}`
    : `${API_BASE}/api/tools/${toolId}`

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toolId, payload }),
    })
    if (!res.ok) {
      return { success: false, error: `HTTP ${res.status}: ${res.statusText}` }
    }
    return await res.json()
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Network error",
    }
  }
}
