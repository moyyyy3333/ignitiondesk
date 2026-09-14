# Ignition

Document-prep and scheduling software for brand-new U.S. LLCs.  
Live site: https://ignitiondesk.biz

## What this repo is

Static pages + client JS for the desk, plus a PHP Stripe API that runs on the existing LiteSpeed host (`api/`).

This commit ships the revenue pass:

- Homepage paywall copy ($0 / $149 / $29)
- Vendor names off the free lobby cards
- Tightened 30-day trade-credit guarantee in `terms.html`
- SEO pages: EIN, DUNS, starter net-30
- Desk task list hides vendor names until Sprint Pass

## Deploy to ignitiondesk.biz

The production host is LiteSpeed, not GitHub Pages.

Upload these over the live files:

- `index.html`
- `setup.html`
- `desk.html`
- `terms.html`
- `ein-is-free.html`
- `free-duns-number.html`
- `starter-net30-vendors.html`
- `sitemap.xml`
- `js/sprint.js`
- `js/stripe.js` (unchanged contract; add `preflight_kit` on the server)

Do **not** overwrite `api/stripe-config.php` from this repo. Secrets stay on the server.

## Stripe

`data-checkout="sprint_pass"` already works.

`$29` Pre-flight Kit uses `data-checkout="preflight_kit"`. That will return `unknown plan` until you:

1. Create a $29 one-time Stripe product
2. Add the plan key in `api/stripe.php` next to `sprint_pass`

## Emails

Paste `EMAILS-1-7.txt` into Resend / Buttondown / MailerLite.  
Trigger email 1 when the setup form is submitted.
