# Deployment Guide — Gotch Studio

The site is built with **Next.js 15** in **static export** mode (`output: 'export'`),
so a production build produces a plain `out/` folder of HTML/CSS/JS that runs on
any static host — including **cPanel / shared hosting** — with no Node runtime.

## 1. Build the static site

```bash
npm install
npm run build          # generates ./out
```

`out/` contains:

- `index.html` — root entry that geo-detects language and redirects to `/<locale>/`.
- `en/`, `de/`, `es/`, `pt/`, `fr/`, `zh/`, `ja/`, `nl/` — fully pre-rendered locales.
- `404.html`, `sitemap.xml`, `robots.txt`, `favicon.svg`, `site.webmanifest`, `.htaccess`.
- `_next/` — hashed, long-cacheable assets.

Preview locally before uploading:

```bash
npm run serve          # npx serve out → http://localhost:3000
```

## 2. Upload to cPanel (static — recommended)

1. In cPanel → **File Manager**, open `public_html` (or a subdomain's docroot).
2. Upload the **contents of `out/`** (not the folder itself) into `public_html`.
   - Easiest: zip `out/`, upload the zip, then **Extract** in File Manager.
   - Ensure the included `.htaccess` lands at `public_html/.htaccess`
     (enable "show hidden files" in File Manager settings).
3. Visit your domain. The root redirects to the visitor's language automatically.

That's it — no Node, no database required.

## 3. Optional: dynamic backend (forms, newsletter, bookings)

The static site uses mocked submit handlers. To persist submissions:

1. Follow `server/README.md` to run the small Express API (locally or via
   cPanel's **Setup Node.js App**).
2. Set `NEXT_PUBLIC_API_URL` and replace the mocked handlers as documented.
3. Rebuild and re-upload `out/`.

### PHP fallback (no Node available)

If your host has **PHP but not Node**, you can accept the contact form with a
tiny mail script instead of the Express API. Create `public_html/contact.php`:

```php
<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $data = json_decode(file_get_contents('php://input'), true);
  $to = 'studio@gotchstudio.com';
  $subject = 'New inquiry from gotchstudio.com';
  $body = "Name: {$data['name']}\nEmail: {$data['email']}\n\n{$data['message']}";
  mail($to, $subject, $body, "From: no-reply@gotchstudio.com");
  http_response_code(201);
  echo json_encode(['ok' => true]);
}
```

Then point `ContactForm`'s submit at `/contact.php`.

## 4. Custom domain & HTTPS

Point `gotchstudio.com` at the host and enable **AutoSSL** (Let's Encrypt) in
cPanel. Update `siteConfig.url` in `config/site.ts` if the production URL differs.

## 5. Translations

`messages/en.json` is the complete authored source. The other locales contain
professionally-phrased starter translations for high-visibility UI and **fall
back to English** for any missing key (deep-merged in `i18n/request.ts`). Before
launch, have the remaining keys professionally translated and drop them into the
matching `messages/<locale>.json`.

## 6. Performance & SEO checklist

- Images use Unsplash placeholders — replace with **optimized, licensed/shot
  assets** (WebP/AVIF, properly sized) for best Lighthouse performance.
- `metadataBase`, canonical, hreflang, OG/Twitter, JSON-LD (`LocalBusiness` +
  `CreativeWork`), `sitemap.xml`, and `robots.txt` are all wired.
- Add real OG images at `public/og/default.jpg` (1200×630).
