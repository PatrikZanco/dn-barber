import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  async redirects() {
    return [
      { source: '/dashboard', destination: '/admin/dashboard', permanent: true },
      { source: '/agenda', destination: '/admin/agenda', permanent: true },
      { source: '/servicos', destination: '/admin/servicos', permanent: true },
      { source: '/barbeiros', destination: '/admin/barbeiros', permanent: true },
      { source: '/galeria', destination: '/admin/galeria', permanent: true },
      { source: '/config', destination: '/admin/config', permanent: true },
      { source: '/login', destination: '/admin/login', permanent: true },
    ];
  },
};

export default nextConfig;
