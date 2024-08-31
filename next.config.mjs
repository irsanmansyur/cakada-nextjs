/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "images.unsplash.com" },
      { hostname: "img.daisyui.com" },
      { hostname: "localhost" },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination:
          (process.env?.API_URL || "http://0.0.0.0:23000") + "/:path*",
      },
    ];
  },
  output: "standalone",
};

export default nextConfig;
