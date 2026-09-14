# What still has to happen on the server

GitHub and GitHub Pages are done. ignitiondesk.biz is not. This file is the rest.

## 1. LiteSpeed upload

Copy from this repo over the live docroot:

- index.html setup.html desk.html terms.html privacy.html
- ein-is-free.html free-duns-number.html starter-net30-vendors.html
- sitemap.xml
- js/sprint.js js/support.js js/stripe.js
- css/ignition.css

Do not overwrite api/stripe-config.php with anything from git.

## 2. Stripe is currently dead

Live `api/stripe.php?action=checkout&plan=sprint_pass` returns:

    Invalid API Key provided: sk_live_**********HERE

That string is a placeholder. $149 checkout cannot work until a real `sk_live_...` is in `api/stripe-config.php` on the host.

Then add the $29 plan next to sprint_pass:

    preflight_kit => the Price id from a $29 one-time Stripe product

Until that key exists, the $29 button will keep saying `unknown plan`.

## 3. Emails

Paste EMAILS-1-7.txt into Resend / Buttondown / MailerLite.
From: help@ignitiondesk.biz
Trigger email 1 on setup submit. Kill the sequence on Sprint Pass purchase.

No ESP is connected here. The copy is ready. The sends are not.
