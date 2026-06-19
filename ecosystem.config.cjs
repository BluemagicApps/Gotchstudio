/**
 * PM2 process definition for the Gotch Studio Next.js server on a VPS.
 *
 * Runs the standalone server emitted by `next build` (output: "standalone").
 * Single instance (fork mode) so the in-memory AI rate limiter is authoritative;
 * for horizontal scaling, move the limiter to Redis (see lib/ai/rate-limit.ts)
 * before raising `instances`.
 *
 * Usage on the server:
 *   npm ci
 *   npm run build
 *   cp -r .next/static .next/standalone/.next/static
 *   cp -r public .next/standalone/public
 *   pm2 start ecosystem.config.cjs && pm2 save
 */
module.exports = {
  apps: [
    {
      name: "gotchstudio",
      script: ".next/standalone/server.js",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        HOSTNAME: "127.0.0.1",
      },
      max_memory_restart: "512M",
      autorestart: true,
    },
  ],
};
