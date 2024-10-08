/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: "https",
            hostname: "lovely-flamingo-139.convex.cloud",
            pathname: "**",
          },
          {
            protocol: "https",
            hostname: "fearless-husky-341.convex.cloud",
            pathname: "**",
          },
        ],
      },
};

export default nextConfig;
