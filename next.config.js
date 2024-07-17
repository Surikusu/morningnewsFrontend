/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['cdn.vox-cdn.com',"techcrunch.com","s.yimg.com","media.zenfs.com","s.aolcdn.com"],
  },
};

module.exports = nextConfig;
