/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Los paquetes del monorepo se publican como TypeScript sin build previo.
  transpilePackages: ['@finops/ui', '@finops/types'],
  experimental: {
    optimizePackageImports: ['@phosphor-icons/react'],
  },
}

export default nextConfig
