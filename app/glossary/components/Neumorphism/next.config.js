/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Enable styled-components SSR support
    styledComponents: true,
  },
  compiler: {
    // Enable styled-components compiler
    styledComponents: true,
  },
  // Ensure CSS imports work properly
  webpack: (config) => {
    config.module.rules.push({
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
    });
    return config;
  },
};

module.exports = nextConfig;
