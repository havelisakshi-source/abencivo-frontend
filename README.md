# Abencivo Biotech — Frontend

React 19 + Vite site for Abencivo Biotech: animated hero, product catalogue,
franchise/manufacturing/quality pages, and an admin dashboard at `#admin`.

This is the **frontend only**. It talks to a separately-hosted backend API
— see the `abencivo-backend` project.

## Local setup

```
npm install
npm run dev     # http://localhost:5173
```

In local dev, API calls automatically go to `http://localhost:4000/api` —
run the backend project alongside this one for everything to work.

## Connecting to your live backend

Before building for production, tell this frontend where your backend
actually lives:

```
cp .env.example .env
```

Edit `.env` and set:

```
VITE_API_BASE=https://your-backend-url.onrender.com/api
```

Then build:

```
npm run build
```

This bakes the URL into the built files — **you must rebuild any time this
value changes**, since Vite env vars are resolved at build time, not
runtime.

## Deploying

This is a static site once built (`npm run build` produces a `dist/`
folder) — any static host works: Vercel, Netlify, Render (Static Site),
GitHub Pages, Cloudflare Pages, etc.

1. Push this folder to its own GitHub repo.
2. On your host: Build Command `npm install && npm run build`, Output
   Directory `dist`.
3. Set the `VITE_API_BASE` environment variable in the host's dashboard
   (most static hosts let you set build-time env vars) so it's baked in
   during their build step — don't rely on a local `.env` file alone.
4. Also update your **backend's** `CORS_ORIGIN` to this frontend's live
   URL once you know it, or the browser will block every API request with
   a CORS error even though both sides are running fine.

## Editing content

- `src/config.js` — company name, phone, WhatsApp, email, address, socials
- `src/content.js` — team bios, testimonials, certifications, FAQs, blog
  posts, milestones, job openings (all demo data — replace with real
  content before launch)
- Products, enquiries and their statuses are managed live through the
  admin dashboard at `#admin` (backed by the database, not this codebase)
