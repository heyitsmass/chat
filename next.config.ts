import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	compiler: {
		styledComponents: true,
	},
	images: {
		dangerouslyAllowSVG: true,
		remotePatterns: [
			{
				protocol: "https",
				hostname: "fastly.picsum.photos",
				port: "",
				pathname: "/**",
				search: "*",
			},
		],
	},
};

export default nextConfig;
