import dynamic from 'next/dynamic';

// 使用动态导入，进一步优化首屏加载速度（只有访问该工具才加载对应逻辑）
export const toolRegistry: Record<string, any> = {
  "JsonFormatter": dynamic(() => import("@/components/JsonFormatter")),
  "Base64Encoder": dynamic(() => import("@/components/Base64Encoder")),
  "UUIDGenerator": dynamic(() => import("@/components/UUIDGenerator")),
  "RegexTester": dynamic(() => import("@/components/RegexTester")),
  "TimestampConverter": dynamic(() => import("@/components/TimestampConverter")),
  "UrlEncoder": dynamic(() => import("@/components/UrlEncoder")),
  "UrlDecoder": dynamic(() => import("@/components/UrlDecoder")),
};