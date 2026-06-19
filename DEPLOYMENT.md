# Deploying Gotch Studio to a VPS

The site is a **Next.js (App Router) server application** — it renders pages and
runs the AI Studio's API routes (Design Concierge, Room Visualizer, Virtual
Staging, Style Profile). It is built with `output: "standalone"`, which emits a
small self-contained Node server you run behind Nginx with PM2.

> The AI tools degrade gracefully: with no API keys set, the concierge uses
> scripted replies, the image tools show curated reference imagery, and the
> style profile uses a static fallback. Add keys to switch everything to live.

---

## 0. Prerequisites on the VPS

- Ubuntu/Debian (or similar) with sudo.
- **Node.js 20 LTS+** and npm.
- **Nginx** (reverse proxy + TLS).
- **PM2** process manager: `npm i -g pm2`.
- A domain pointed at the server (A/AAAA records).

```bash
# Node 20 via nodesource (example)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs nginx
sudo npm i -g pm2
```

---

## 1. Get the code and configure environment

```bash
git clone <your-repo-url> /var/www/gotchstudio
cd /var/www/gotchstudio
cp .env.example .env
# Edit .env — set NEXT_PUBLIC_SITE_URL, and (optionally) ANTHROPIC_API_KEY and
# REPLICATE_API_TOKEN to enable live AI generation.
nano .env
```

Keys (all optional; the site runs without them):

| Variable | Enables |
|---|---|
| `ANTHROPIC_API_KEY` | Live Design Concierge + AI Style Profile (Claude) |
| `REPLICATE_API_TOKEN` | Live Room Visualizer + Virtual Staging (image generation) |
| `NEXT_PUBLIC_SITE_URL` | Correct canonical/OG/sitemap URLs |

---

## 2. Build

```bash
npm ci
npm run build
```

`output: "standalone"` puts a minimal server at `.next/standalone/server.js`.
It does **not** copy static assets or `public/` automatically — do that once
after each build:

```bash
cp -r .next/static .next/standalone/.next/static
cp -r public .next/standalone/public
```

Quick local smoke test (optional): `npm run start:standalone` then visit
`http://localhost:3000`.

---

## 3. Run with PM2

`ecosystem.config.cjs` is included. It runs one fork-mode instance on
`127.0.0.1:3000` (the in-memory AI rate limiter assumes a single instance — see
`lib/ai/rate-limit.ts` to move it to Redis if you scale out).

```bash
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup   # follow the printed command so PM2 survives reboots
```

PM2 inherits your shell environment; the standalone server also reads `.env` via
Next at build/runtime. To be explicit, you can export the keys before
`pm2 start`, or add an `env` block to the ecosystem file.

---

## 4. Nginx + TLS

```bash
sudo cp deploy/nginx.conf.example /etc/nginx/sites-available/gotchstudio
sudo ln -s /etc/nginx/sites-available/gotchstudio /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# TLS via Let's Encrypt
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d gotchstudio.com -d www.gotchstudio.com
```

The provided Nginx config disables buffering on `/api/` so the concierge streams
token-by-token, raises the body limit for image uploads, and sets a 180s timeout
for image generation.

---

## 5. Updating

```bash
cd /var/www/gotchstudio
git pull
npm ci
npm run build
cp -r .next/static .next/standalone/.next/static
cp -r public .next/standalone/public
pm2 reload gotchstudio
```

---

## Backend & database (inquiries, bookings, subscribers, audit, exports)

The contact, booking, and newsletter forms persist to a database via built-in
Next API routes (`app/api/inquiry`, `/subscribe`, `/consultation`) backed by
Prisma. There's an append-only **audit log**, marketing-attribution capture
(source/UTM/locale, IP stored only as a salted hash), and bearer-protected
**export** endpoints for auditing + marketing.

### One-time setup

```bash
# In .env: set DATABASE_URL, ADMIN_API_KEY (long random), AUDIT_SALT (random)
npm run db:migrate     # applies prisma/migrations to the database
```

`postinstall` runs `prisma generate` automatically on `npm ci`. Default DB is
**SQLite** (one file, resolved relative to `prisma/`; back it up by copying the
file). For **Postgres** (Supabase/Neon) or **MySQL**, change `provider` in
`prisma/schema.prisma`, set `DATABASE_URL` to that connection string, and re-run
`npm run db:migrate`.

> **Standalone + Prisma:** copy the generated client into the standalone bundle
> after build, alongside the static/public copy step:
> ```bash
> cp -r node_modules/.prisma .next/standalone/node_modules/.prisma
> cp -r node_modules/@prisma/client .next/standalone/node_modules/@prisma/client
> ```

### Admin: auditing + marketing exports

Protected by `Authorization: Bearer $ADMIN_API_KEY`.

```bash
# Operational summary (counts by status, last-7-days, audit total)
curl -H "Authorization: Bearer $ADMIN_API_KEY" https://your-domain/api/admin/stats

# Marketing list as CSV (open in Excel / import to your ESP/CRM)
curl -H "Authorization: Bearer $ADMIN_API_KEY" \
  "https://your-domain/api/admin/export?type=subscribers&format=csv&status=subscribed" -o subscribers.csv

# Inquiries / bookings / audit trail, with date + status filters
curl -H "Authorization: Bearer $ADMIN_API_KEY" \
  "https://your-domain/api/admin/export?type=inquiries&from=2026-01-01&to=2026-12-31" -o inquiries.csv
```

`type` = `inquiries | subscribers | consultations | audit`; `format` =
`csv | json`. The legacy Express service in `server/` is superseded by these
routes and can be ignored.

---

## Notes on the AI Studio

- **Cost control is built in:** uploads are downscaled in the browser before
  upload; every AI route is per-IP rate limited; image payloads are size-capped.
- **Replicate model versions** change over time. If image generation starts
  falling back to curated imagery, set a current `REPLICATE_VISUALIZE_MODEL` /
  `REPLICATE_STAGE_MODEL` (`owner/name:version`) in `.env`.
- **Keys are server-side only.** They are never bundled into client JavaScript —
  all AI calls go through `app/api/*` routes.
