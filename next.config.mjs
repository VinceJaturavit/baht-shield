/** @type {import('next').NextConfig} */
const nextConfig = {
  // @gorules/zen-engine ships a native Node.js addon (napi-rs compiled .node binary).
  // We mark it as server-external so webpack does not attempt to bundle it,
  // and tell webpack to treat .node files as external resources.
  experimental: {
    serverComponentsExternalPackages: ['@gorules/zen-engine'],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Prevent webpack from trying to bundle native .node addons.
      config.externals = [
        ...(Array.isArray(config.externals) ? config.externals : [config.externals].filter(Boolean)),
        ({ request }, callback) => {
          if (request && request.endsWith('.node')) {
            return callback(null, `commonjs ${request}`);
          }
          callback();
        },
      ];
    }
    return config;
  },
};

export default nextConfig;
