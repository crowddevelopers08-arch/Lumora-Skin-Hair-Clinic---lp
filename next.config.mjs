/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    // Every image is served from Cloudinary. `unoptimized` bypasses the
    // optimizer today, so this only matters if that flag is ever dropped —
    // without it next/image would reject the remote host.
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/k4ojpvgo/**" },
    ],
  },
}

export default nextConfig
