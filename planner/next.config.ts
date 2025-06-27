import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  // Add headers for PWA
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
  // Ensure files in the public folder are served correctly
  rewrites: async () => {
    return [
      {
        source: '/sw.js',
        destination: '/sw.js',
      },
      {
        source: '/manifest.json',
        destination: '/manifest.json',
      },
    ];
  },
  
  // Optional: Add webpack configuration if needed for PWA
  webpack: (config, { isServer }) => {
    // Only run on client-side
    if (!isServer) {
      // Add any specific webpack configurations if needed
    }
    
    return config;
  },
};

export default nextConfig;