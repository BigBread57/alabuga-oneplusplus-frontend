import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import './src/libs/Env';

// Define the base Next.js configuration
const baseConfig: NextConfig = {
  output: 'standalone',
  eslint: {
    dirs: ['.'],
  },
  poweredByHeader: false,
  reactStrictMode: true,
  outputFileTracingIncludes: {
    '/': ['./migrations/**/*'],
  },
  images: {
    remotePatterns: [
      new URL('https://picsum.photos/**'),
      new URL('http://localhost:8000/**'),
    ],
  },
};

// Initialize the Next-Intl plugin
let configWithPlugins = createNextIntlPlugin('./src/libs/I18n.ts')(baseConfig);

// Conditionally enable bundle analysis (only import when needed)
if (process.env.ANALYZE === 'true') {
  try {
    const withBundleAnalyzer = require('@next/bundle-analyzer');
    configWithPlugins = withBundleAnalyzer()(configWithPlugins);
  } catch (error) {
    console.warn('Bundle analyzer not available, skipping...');
  }
}

// Conditionally enable Sentry configuration (only import when needed)
if (!process.env.NEXT_PUBLIC_SENTRY_DISABLED) {
  try {
    const { withSentryConfig } = require('@sentry/nextjs');
    configWithPlugins = withSentryConfig(configWithPlugins, {
      // For all available options, see:
      // https://www.npmjs.com/package/@sentry/webpack-plugin#options
      org: process.env.SENTRY_ORGANIZATION,
      project: process.env.SENTRY_PROJECT,

      // Only print logs for uploading source maps in CI
      silent: !process.env.CI,

      // For all available options, see:
      // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

      // Upload a larger set of source maps for prettier stack traces (increases build time)
      widenClientFileUpload: true,

      // Upload a larger set of source maps for prettier stack traces (increases build time)
      reactComponentAnnotation: {
        enabled: true,
      },

      // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
      // This can increase your server load as well as your hosting bill.
      // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
      // side errors will fail.
      tunnelRoute: '/monitoring',

      // Automatically tree-shake Sentry logger statements to reduce bundle size
      disableLogger: true,

      // Disable Sentry telemetry
      telemetry: false,
    });
  } catch (error) {
    console.warn('Sentry not available, skipping...');
  }
}

const nextConfig = configWithPlugins;
export default nextConfig;