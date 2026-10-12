# TrustCenter

A Next.js 14 App Router MVP for founder-managed public AI trust and compliance pages.

## Requirements

- Node.js 18.17+
- A Supabase project

## Local setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. Run `schema.sql` in the Supabase SQL editor.
4. Enable Email OTP in Supabase Authentication and add `http://localhost:3000/dashboard` to the allowed redirect URLs.
5. Start the app with `npm run dev` and open `http://localhost:3000`.

The dashboard uses Supabase email magic-link authentication. A user can create one trust center per account; the public page is available at `/trust/[slug]`. Without Supabase environment variables, the landing page and sample public trust page remain viewable, while dashboard editing is disabled.

## Commands

- `npm run dev` - development server
- `npm run build` - production build
- `npm run start` - serve production build
- `npm run typecheck` - TypeScript validation

## Production notes

Configure the production site URL and corresponding Supabase Auth redirect allowlist. Before publishing, replace the demo trust-page controls with verified company details, connect a real uptime source if displaying uptime history, and provide a working security-contact workflow. RLS makes trust-center records public-readable and limits inserts/updates to their authenticated owner; only publish details intended to be public.
