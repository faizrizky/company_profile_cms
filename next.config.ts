import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const isProduction = process.env.NODE_ENV === 'production'
// Pages are edited in the website's visual editor, embedded in the admin.
const frontendOrigin = process.env.FRONTEND_URL ? new URL(process.env.FRONTEND_URL).origin : ''
// Media served from S3-compatible storage (previews in the admin): either a
// public origin, or a path on this app proxied to the bucket (any host works).
const s3PublicUrl = process.env.S3_PUBLIC_URL ?? ''
const mediaProxyPath = s3PublicUrl.startsWith('/') ? s3PublicUrl : ''
const mediaOrigin = s3PublicUrl && !mediaProxyPath ? new URL(s3PublicUrl).origin : ''

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
  {
    key: 'Permissions-Policy',
    value:
      'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()',
  },
  {
    // The admin UI needs inline scripts/styles (Next.js RSC payload, Payload UI).
    // Everything else is locked to this origin: no third-party scripts, no framing.
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline'${isProduction ? '' : " 'unsafe-eval'"}`,
      "style-src 'self' 'unsafe-inline'",
      // OpenStreetMap tiles + address search for the office map picker.
      `img-src 'self' data: blob: https://tile.openstreetmap.org ${mediaOrigin}`.trim(),
      `media-src 'self' blob: ${mediaOrigin}`.trim(),
      "font-src 'self' data:",
      "connect-src 'self' https://photon.komoot.io https://nominatim.openstreetmap.org",
      `frame-src 'self' ${frontendOrigin}`.trim(),
      "object-src 'none'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      ...(isProduction ? ['upgrade-insecure-requests'] : []),
    ].join('; '),
  },
  ...(isProduction
    ? [{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' }]
    : []),
]

// Uploaded files are data, never documents: even if a crafted file slipped
// through, the browser won't run scripts or render it as a page.
const mediaHeaders = [
  {
    key: 'Content-Security-Policy',
    value: "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'; sandbox",
  },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Cross-Origin-Resource-Policy', value: 'cross-origin' },
]

const nextConfig: NextConfig = {
  // Self-contained server for the Docker image (see Dockerfile); Vercel ignores it.
  output: process.env.BUILD_STANDALONE === 'true' ? 'standalone' : undefined,
  poweredByHeader: false,
  images: {
    localPatterns: [{ pathname: '/api/media/file/**' }],
  },
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      { source: '/api/media/file/:path*', headers: mediaHeaders },
      ...(mediaProxyPath ? [{ source: `${mediaProxyPath}/:path*`, headers: mediaHeaders }] : []),
    ]
  },
  async rewrites() {
    if (!mediaProxyPath || !process.env.S3_ENDPOINT) return []
    const bucket = `${process.env.S3_ENDPOINT.replace(/\/$/, '')}/${process.env.S3_BUCKET}`
    return [{ source: `${mediaProxyPath}/:path*`, destination: `${bucket}/:path*` }]
  },
  async redirects() {
    // This app only serves the CMS; the public site lives in the frontend repo.
    return [{ source: '/', destination: '/admin', permanent: false }]
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }
    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
