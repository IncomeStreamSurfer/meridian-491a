# Meridian — Specialty Coffee

A coming-soon landing site for a specialty coffee brand. Dark editorial homepage with Supabase-wired email capture, a long-form brand story page, and a confirmation page.

## Stack

- **Astro 5** (server output) with the `@astrojs/vercel` adapter
- **Tailwind v4** via `@tailwindcss/vite`
- **@astrojs/sitemap** auto-generating `/sitemap-index.xml`
- **Supabase** — `meridian_waitlist` table (email capture) + `meridian_content` (future articles, filled by Harbor Writer)
- **Resend** — sends the plain-text welcome email via `onboarding@resend.dev`

## Pages

| Path | Purpose |
|---|---|
| `/` | Hero + waitlist capture + brand philosophy + launch overview + FAQ + closing CTA |
| `/our-story` | Long-form founders' notebook (editorial, ~1200 words) |
| `/thanks` | Post-signup confirmation, noindex, share back to / and /our-story |
| `/api/waitlist` | `POST { email, source }` — writes to Supabase + fires Resend welcome email |

## SEO

- `SEOHead.astro` on every page: title, meta, canonical, OG, Twitter card, JSON-LD
- Organization + WebSite + FAQPage on homepage
- AboutPage + Organization + BreadcrumbList on `/our-story`
- WebPage + BreadcrumbList on `/thanks` (noindex)
- `public/robots.txt` references `/sitemap-index.xml`

## Environment variables

See `.env.example`.

- `PUBLIC_SITE_URL` — the production URL, used for canonicals and JSON-LD
- `PUBLIC_SUPABASE_URL` / `PUBLIC_SUPABASE_ANON_KEY` — used by the server-side API route to insert into `meridian_waitlist`
- `RESEND_API_KEY` — for the welcome email

## Running locally

```bash
npm install --legacy-peer-deps
cp .env.example .env            # then fill in the Supabase + Resend values
npm run dev
```
