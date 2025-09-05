import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    // Handle Three.js examples
    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      use: {
        loader: 'file-loader',
        options: {
          publicPath: '/_next/static/',
          outputPath: 'static/',
        },
      },
    });

    // Handle Three.js examples modules
    config.resolve.alias = {
      ...config.resolve.alias,
      'three/examples/jsm': 'three/examples/jsm',
    };

    return config;
  },
};

export default nextConfig;
