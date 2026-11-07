# PayPal setup

## Already configured in SiteGuard source

The three PayPal subscription Plan IDs supplied by the owner are already wired into the server-side checkout endpoint as defaults:

- Essential ($7/month): `P-7FT48077PY765924LNLXIL3A`
- Professional ($12.99/month): `P-57X581110C1557122NLXIOBI`
- Agency ($39.99/month): `P-55V35811HS450913CNLXIOZY`

Optional Cloudflare variables `PAYPAL_STARTER_PLAN_ID`, `PAYPAL_PRO_PLAN_ID`, and `PAYPAL_AGENCY_PLAN_ID` can override those defaults. These IDs are public plan identifiers, not secrets.

## Still required in Cloudflare Pages

Configure these values for the same PayPal REST application and environment in which the subscription plans exist:

- `PAYPAL_MODE`: currently set to `sandbox`; keep it sandbox until sandbox credentials, plans, and webhook are tested. Use `live` only with the matching live app credentials, live plan IDs, and live webhook.
- `PAYPAL_CLIENT_ID`: the public REST app client ID. The Client ID in the owner's PayPal button snippet can be used only if it belongs to the same REST app as these plans.
- `PAYPAL_CLIENT_SECRET`: the matching REST app secret; store as a Cloudflare secret and never commit it.
- `PAYPAL_WEBHOOK_ID`: the webhook ID created in the same PayPal app and environment; store as a Cloudflare secret.

The server-side endpoint is `/api/billing/webhook`. Register it in PayPal and subscribe to subscription activated, cancelled, suspended, expired, payment failed, and payment completed events. The webhook handler verifies PayPal signatures before changing access.

## Testing and launch

1. Confirm the three plan IDs belong to the currently selected PayPal mode. Sandbox and Live plans are not interchangeable.
2. Configure the matching Client ID, Client Secret, and Webhook ID in Cloudflare Pages.
3. Test subscription creation, approval, activation, renewal/payment, failed payment, cancellation, suspension, expiry, duplicate delivery, and out-of-order events in Sandbox.
4. Confirm recurring billing and payout eligibility for the Saint Lucia PayPal Business account directly with PayPal.
5. Only switch `PAYPAL_MODE` to `live` after adding matching Live credentials, Live plans, and a Live webhook, then complete a real low-value payment and payout test.

Paid access is granted from verified webhook events, not from the browser return URL. Plan IDs are configured in source, but payment processing is not considered verified until credentials, webhook registration, environment matching, and end-to-end tests are complete.
