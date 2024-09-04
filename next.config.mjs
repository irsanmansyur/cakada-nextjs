/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "images.unsplash.com" },
      { hostname: "img.daisyui.com" },
      { hostname: "cakada-makassar.chank.my.id" },
      { hostname: "localhost" },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://0.0.0.0:3000" + "/:path*",
      },
    ];
  },
  output: "standalone",
};

export default nextConfig;
