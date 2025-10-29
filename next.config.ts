import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [new URL('https://res.cloudinary.com/dwb9p9jmc/image/upload/**'), new URL('https://lh3.googleusercontent.com/**')],
  },
};

export default nextConfig;


//*******************OR********************/
// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "res.cloudinary.com",
//         pathname: "/**", // allow all Cloudinary image paths
//       },
//     ],
//   },
// };

// export default nextConfig;
