# PayPal setup

Configure as Cloudflare Pages secrets/variables: PAYPAL_MODE (sandbox first), PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_WEBHOOK_ID, PAYPAL_STARTER_PLAN_ID, PAYPAL_PRO_PLAN_ID and PAYPAL_AGENCY_PLAN_ID. Never commit credentials.

Create monthly PayPal subscription plans for Essential ($7), Professional ($12.99) and Agency ($39.99) USD. Set PAYPAL_STARTER_PLAN_ID to the Essential plan ID, PAYPAL_PRO_PLAN_ID to the Professional plan ID, and PAYPAL_AGENCY_PLAN_ID to the Agency plan ID. The current Essential plan ID supplied by the owner is P-7FT48077PY765924LNLXIL3A. The current Professional plan ID supplied by the owner is P-57X581110C1557122NLXIOBI. The current Agency plan ID supplied by the owner is P-55V35811HS450913CNLXIOZY. Register the deployed endpoint /api/billing/webhook and subscribe to subscription activated, cancelled, suspended, expired, payment failed, and payment completed events. Save the webhook ID as a secret. Test the full lifecycle in Sandbox before considering Live. Confirm PayPal recurring-payment and payout eligibility in Saint Lucia with PayPal directly.

Paid access is granted only from verified webhook events, not from browser redirects. This MVP still needs event ordering/reconciliation and complete live test coverage.
