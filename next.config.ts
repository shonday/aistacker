import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: false, // 彻底解决 /tools/json-formatter 与 / 冲突的 SEO 灾难
  /* config options here */
};

export default nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
