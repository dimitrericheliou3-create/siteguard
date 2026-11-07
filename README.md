# SiteGuard

Website uptime monitoring SaaS built with Cloudflare Pages Functions, Cloudflare Workers and D1.

## Included
- Responsive public site and customer dashboard
- Email/password registration and login
- Website creation, deletion, status and recent check history
- Scheduled monitoring Worker (5-minute cron; bounded work per run)
- Free, Starter, Pro and Agency monitoring limits
- PayPal Subscriptions API checkout and signature-verified webhook endpoint
- D1 schema, deployment configuration, privacy/terms drafts and release checklist

## Local setup
1. Install Node.js 20+ and run `npm install`.
2. Create a D1 database: `npx wrangler d1 create siteguard-db`.
3. Put the returned database ID in both Wrangler files.
4. Apply schema: `npx wrangler d1 execute siteguard-db --local --file=./schema.sql`.
5. Run locally: `npm run dev`.
6. Deploy Pages and the monitor Worker using the scripts in package.json.

## Cloudflare configuration
Pages and monitor Worker both require a D1 binding named `DB` pointing to the same database. Set PayPal values as Cloudflare secrets, never in source control. See PAYPAL_SETUP.md.

## Important release status
This is an MVP foundation, **not approved for commercial launch yet**. The release checklist identifies remaining blockers including rate limiting, email verification/password reset, account deletion/export, notification delivery, SSRF/DNS-rebinding hardening, subscription reconciliation, legal review, and full production testing. Do not accept public paid customers until these are resolved and verified.

## Plans
Free: 1 site / 30-minute checks. Starter: 5 sites / 15-minute checks ($7/month). Pro: 25 sites / 5-minute checks ($19/month). Agency: 100 sites / 5-minute checks ($49/month).
