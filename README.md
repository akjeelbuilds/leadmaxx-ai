# LeadMaxx.ai

Two plain HTML files that sell a ₹399 consultation call, and build a named demo of the product
for any business. No build step, no dependencies, no framework, nothing that expires.

| Page | File | Live at |
|---|---|---|
| Main site: sells the call, collects the enquiry, hands off to WhatsApp | `public/index.html` | https://leadmaxx-ai.pages.dev/ |
| Niche demo generator: ten niche packs, unlimited businesses | `public/demo.html` | https://leadmaxx-ai.pages.dev/demo |

**The full handover, security audit and quality report is kept with the owner, deliberately
outside this public repository**, because it carries the sheet cleanup list and notes about
pricing. Ask the owner for `HANDOVER-FINAL.md`. It is written in plain language and it starts
with the things that need attention.

---

## How publishing works

Cloudflare Pages watches this repository. **Every commit to `main` goes live by itself, in under
a minute.** There is no build command and no upload step.

```
Build command          : (leave empty)
Build output directory : public
```

To change the site: open the file on GitHub, click the pencil, edit, **Commit changes**.

Note: Cloudflare serves `public/demo.html` at `/demo`. Both addresses work, and `/demo.html`
redirects to `/demo`.

A demo link can carry `view=clean`. On that side the builder panel is hidden and a
"Prepared for" bar names the business, so the buyer sees the demo and nothing else. The Copy
link button on the demo page builds that link for you. Open the page with no `view=clean` when
you want the builder in front of you on a call.

## What is in here

```
public/index.html      the main site, one self contained file
public/demo.html       the demo generator, ten niche packs, driven by the link
public/404.html        a plain not-found page
public/_headers        security headers served by Cloudflare
public/robots.txt      keeps the demo out of search results, lists the sitemap
public/sitemap.xml     one entry, the main page
tests/test-site.js     page logic tests, 98 assertions, no browser needed
tests/test-browser.js  real browser tests, 75 assertions, Chromium
```

## Running the tests

```
npm install
npx playwright install chromium
npm test              # expect 98 passed, 0 failed
npm run test:browser  # expect 75 passed, 0 failed
```

The tests never touch anything real. The payment window is replaced with a stub and the sheet
request is intercepted inside the browser, so no money moves and no row is written.

## The offer, and the rules around it

| | |
|---|---|
| **What is sold** | A 20 minute consultation call, ₹399, fully deducted from the build bill if they go ahead |
| **What they get** | Their enquiries audited, the demo shown on their own business, and a plan in writing they keep either way |
| **Build price** | Never printed as a number. Quoted on the call |
| **The only published build figure** | "Complete setups start from ₹4,999", one low anchor, twice on the page |
| **Banned** | ₹14,999, tier names, free offers |

Rules the content must keep: no em dashes or en dashes, plain Indian service business English,
every claim defensible, no invented case studies or testimonials, and the four field form
(name, WhatsApp number, business type, notes) stays four fields.

## The pipe

| Piece | Value |
|---|---|
| Enquiry endpoint | Google Apps Script, `SHEET_ENDPOINT` in the `CONFIG` block |
| Payload | the four original keys, `{name, phone, email, notes}` with `email` left as an empty string |
| WhatsApp handoff | +91 63822 98388 |
| Payment | Razorpay, live key only in the front end. A webhook is parked, see the handover |

**Known issue, needs the owner's Google account:** the Apps Script replies
`Exception: Failed to send email: no recipient` on every submission. The page cannot see this,
because it posts in fire and forget mode. Fix steps are in `HANDOVER-FINAL.md`.
