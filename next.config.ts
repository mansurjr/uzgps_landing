import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "static.wixstatic.com" },
      { protocol: "https", hostname: "uzgps.uz" },
      { protocol: "https", hostname: "uz103.uz" },
      { protocol: "https", hostname: "play-lh.googleusercontent.com" },
    ],
  },
  async rewrites() {
    return [
      // UZGPS's own OSM tile server sends no CORS headers, which WebGL needs; serve it same-origin
      { source: "/tiles/osm/:z/:x/:y", destination: "https://osm.uzgps.uz/tile/:z/:x/:y.png" },
    ];
  },
};

export default nextConfig;
