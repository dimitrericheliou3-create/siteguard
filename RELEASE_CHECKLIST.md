# SiteGuard release checklist

Do not launch paid public service until each blocker is tested and verified.

## Infrastructure
- [ ] Create production D1 and configure the same DB binding in Pages and monitor Worker.
- [ ] Apply migrations and verify schema.
- [ ] Configure production domain, HTTPS, Git deployment and scheduled Worker.
- [ ] Set all production secrets outside source control.
- [ ] Verify backup/export and restore.

## Authentication and privacy
- [ ] Add rate limiting and abuse protection to registration/login.
- [ ] Implement email verification and password reset.
- [ ] Implement account deletion and data export.
- [ ] Test sessions, expiry, logout and user isolation.
- [ ] Review password hashing and session handling.
- [ ] Complete privacy/terms legal review.

## Monitoring and security
- [ ] Test HTTP 200, 404, 500, redirects, DNS failures and timeouts.
- [ ] Implement DNS/IP validation at connection time to mitigate SSRF and DNS rebinding.
- [ ] Add retries, alert deduplication, monitoring-worker health checks and logs.
- [ ] Confirm plan interval/limits and retention behavior.
- [ ] Test queue backlog and D1 limits.
- [ ] Perform independent security review and penetration tests.

## Billing
- [ ] Confirm PayPal Business recurring billing and payout support for Saint Lucia.
- [ ] Configure sandbox credentials, plans and webhook.
- [ ] Test activation, renewal, failed payment, cancellation, suspension, expiry, duplicate and out-of-order events.
- [ ] Add subscription reconciliation and self-service cancellation.
- [ ] Complete a live end-to-end payment and payout test before launch.

## Notifications and quality
- [ ] Choose email provider, verify sender domain and implement outage/recovery alerts.
- [ ] Test alert deduplication, cooldown, bounces and unsubscribe preferences.
- [ ] Test desktop/mobile, accessibility, browser compatibility, load and error handling.
- [ ] Add support contact, refund policy and incident response.
- [ ] Complete backup restore and production smoke test.

**Current status: MVP source foundation only; not release-ready.**

## Source improvements completed

- [x] Wire the owner's Essential, Professional, and Agency PayPal Plan IDs into server-side checkout defaults.
- [x] Correct paid-plan monitoring interval handling to five minutes, including existing sites on the next monitor run.
- [x] Enforce same-origin checks on registration, login, and logout POST requests.
- [x] Strengthen URL hostname syntax checks and reject common reserved/private-use hostname suffixes.
- [x] Add automated Node.js tests and JavaScript syntax checks on pushes and pull requests.

These source changes do not mean the production services are deployed or fully verified. The monitor Worker was not present in the Cloudflare account during the latest inspection. PayPal Pages settings showed only `PAYPAL_MODE=sandbox`; the REST Client ID, Client Secret, and Webhook ID were not visible as configured. Hostname filtering also does not replace DNS-resolution/IP pinning and independent SSRF testing.
