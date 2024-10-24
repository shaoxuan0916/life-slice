/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          hostname: "lh3.googleusercontent.com",
        },
        {
          hostname: "gipkzolaugsifkzdthph.supabase.co",
        },
        {
          hostname: "assets.aceternity.com",
        },
        
      ],
    },
    experimental: {
      missingSuspenseWithCSRBailout: false,
    },
  };
  
  export default nextConfig;
  