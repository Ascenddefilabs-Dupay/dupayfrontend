

  /** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  optimizeFonts: false,
  webpack: (config) => {
    config.cache = false; // Disable caching
    return config;
  },
  productionBrowserSourceMaps: false,
};

export default nextConfig;
