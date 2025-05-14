/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_KV_REST_API_URL: process.env.KV_REST_API_URL,
    NEXT_PUBLIC_KV_REST_API_TOKEN: process.env.KV_REST_API_TOKEN,
  },
};

export default nextConfig;
