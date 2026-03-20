// app/[category]/page.tsx
// NOTE: This file is DELETED in the new architecture.
// Category filtering now lives entirely at /tools?category=xxx
// using the ToolsDirectory client component with URL search params.
//
// Keeping a [category] route at the root level would conflict with
// other top-level pages (like /about, /blog) as the project grows.
//
// ✅ Delete this entire directory: app/[category]/
