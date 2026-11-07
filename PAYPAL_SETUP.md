# PayPal setup

Configure as Cloudflare Pages secrets/variables: PAYPAL_MODE (sandbox first), PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_WEBHOOK_ID, PAYPAL_STARTER_PLAN_ID, PAYPAL_PRO_PLAN_ID and PAYPAL_AGENCY_PLAN_ID. Never commit credentials.

Create monthly PayPal subscription plans for $7, $19 and $49 USD. Register the deployed endpoint /api/billing/webhook and subscribe to subscription activated, cancelled, suspended, expired, payment failed, and payment completed events. Save the webhook ID as a secret. Test the full lifecycle in Sandbox before considering Live. Confirm PayPal recurring-payment and payout eligibility in Saint Lucia with PayPal directly.

Paid access is granted only from verified webhook events, not from browser redirects. This MVP still needs event ordering/reconciliation and complete live test coverage.
