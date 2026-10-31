/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingIncludes: {
    '/api/artworks': ['./public/artworks/**/*'],
  },
};

module.exports = nextConfig;
