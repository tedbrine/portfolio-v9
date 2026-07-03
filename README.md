# portfolio-v9

Personal portfolio site for [Ted Brine](https://ted.ac) — a software engineer focused on distributed systems, infrastructure, and real-time web applications.

## What it is

A Next.js app that serves as a personal site and a small set of supporting APIs. The main pages are a landing profile, services, and a PGP key page. The landing page includes live status widgets (Discord, Last.fm, Hackatime) and a contact form.

## Stack

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS 4, shadcn/ui, and a custom sensory UI layer (sound/haptics)
- Upstash Redis for caching
- Postmark for contact email
- gt-next for translations

## Development

```bash
bun install
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
bun run build   # runs translations, then builds
bun run lint
```

## Environment

Most features need env vars for external services (Discord bot, Last.fm, Hackatime, Upstash, Postmark). Without them, the site still runs locally, but status widgets, caching, and contact submission may not work.
