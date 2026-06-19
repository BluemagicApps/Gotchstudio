# Gotch Studio — Optional API

The website ships as a **static export** and runs with **no backend**. This
small Express service is an optional upgrade for when you want to persist form
submissions (inquiries, newsletter signups, consultation requests).

## Run locally

```bash
cd server
npm install
# from the repo root, create the SQLite DB the schema describes:
cd .. && echo 'DATABASE_URL="file:./gotch.db"' > .env
npx prisma generate && npx prisma db push
cd server && npm start            # → http://localhost:4000
```

## Connect the frontend

1. Set `NEXT_PUBLIC_API_URL` in the site's `.env` (e.g. `http://localhost:4000`).
2. Replace the mocked `onSubmit` bodies in:
   - `components/shared/Newsletter.tsx` → `POST {API}/api/subscribe`
   - `components/contact/ContactForm.tsx` → `POST {API}/api/inquiry`
   - `components/contact/BookingWidget.tsx` → `POST {API}/api/consultation`

Example:

```ts
await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/inquiry`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});
```

## Deploy on cPanel

Use cPanel's **Setup Node.js App**: point the application root at `server/`,
the startup file at `index.mjs`, run `npm install`, and add the `DATABASE_URL`
environment variable. cPanel proxies it behind a path (e.g. `/api`) you then use
as `NEXT_PUBLIC_API_URL`.

To switch from SQLite to Supabase/PlanetScale, change `datasource db` in
`../prisma/schema.prisma` and re-run `prisma db push`.
