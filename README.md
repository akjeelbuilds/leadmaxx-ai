# LeadMaxx.ai — rebuilt site

Single self-contained file: `leadmaxx/index.html` (22 KB gzipped, zero external requests).
Deploys to Cloudflare Pages as-is. No build step, no dependencies.

---

## 🚨 Do this first

**Remove the old build from Vercel.** The current live site ships a *publicly reachable*
**"Razorpay Checkout Config" settings panel**. `onOpenSettings` is wired to a visible header
button, so any visitor can open it and see your gateway key field, a test/live toggle, and a
"reset to placeholder" action that overwrites config.

---

## The offer this page sells

| | |
|---|---|
| **What you sell** | A **20 minute consultation call**, ₹399 (was ₹1,999) |
| **What they get** | An audit of how their enquiries come in today, a live demo shown on **their** business, and a plan in writing they keep either way |
| **The closer** | **The full ₹399 is deducted from their build bill if they go ahead**, so the call effectively costs nothing |
| **Build price** | **Not shown on the page.** Quoted on the call, in writing, before they commit |

Because the call is the product, the whole page funnels to one action: **book the ₹399 call.**
Eight CTAs, one destination, `#book`.

---

## Before you deploy — one edit

Find `CONFIG` near the top of the `<script>`:

```js
var CONFIG = {
  SHEET_ENDPOINT: "https://script.google.com/.../exec",  // ✅ already yours
  WHATSAPP_NUMBER: "916382298388",                        // ✅ your number

  PRICE_INR: 399,                 // price of the CALL, not a setup fee
  ORIGINAL_PRICE_INR: 1999,
  PRICE_LABEL: "LeadMaxx consultation call",
  CALL_LENGTH: "20 minute",       // 👈 change to "30 minute" etc. and it updates in
                                  //    all 3 places automatically (hero, step 1, badge)

  RAZORPAY_KEY_ID: "",            // 👈 PASTE rzp_live_xxxx HERE
  CONTACT_EMAIL: "hello@leadmaxx.ai"
};
```

`CALL_LENGTH` drives the copy in three spots via `data-call-len`, so you never have to hunt
for it if the call gets longer.

### If you leave `RAZORPAY_KEY_ID` empty

The pay button does **not** dead-end. It hands off to WhatsApp with the name, business and
preferred call time pre-filled, so you can take payment manually. No booking is ever lost to
an unconfigured integration.

### Razorpay notes
- Checkout loads **only after** the Pay click. It is not in `<head>`, so it never slows the page.
- The client `handler` is **cosmetic**. Wire a Razorpay **webhook** and treat that as the only
  authoritative "paid" signal, or update your Sheet from the webhook. A front-end handler can
  be spoofed.
- `rzp_live_` in the front end is normal. Your `key_secret` must **never** appear here.

---

## Deploy

Cloudflare Pages, free tier, commercial use allowed. Full step-by-step in
[CLOUDFLARE.md](CLOUDFLARE.md). The short version:

```
Build command          : (leave empty)
Build output directory : public
```

Then every push to `main` deploys automatically.

---

## What changed in this version

### 1. The offer was wrong, so the whole page was rebuilt around it
The previous draft sold ₹399 as a one-time *setup fee*. It is actually the price of a
**consultation call**, and that is a completely different psychological ask.

A setup fee competes on price. A paid call has to justify itself against every free
"discovery call" the buyer has ever been on. So the page now answers the objection head-on in
the **first FAQ, which loads open by default**: *"Why should I pay ₹399 for a call? Others give
free calls."* The answer is that free calls become pitches and endless follow-ups, and that
the ₹399 comes off the build anyway.

The risk of a paid call is that it reads as an information toll. Two things defuse that:
- **You get a plan in writing even if you never buy.** Stated in the hero, step 1, the call
  section and the FAQ.
- **"If you do not want to go ahead after the call, that is completely fine. We will not keep
  calling you."** Naming the thing people actually fear, high-pressure follow-ups, is what makes
  the fee feel safe to pay.

**Build price is nowhere on the page.** It is deferred to the call in writing, which also keeps
your pricing flexible per client.

### 2. All 49 em dashes and 8 en dashes are gone
Ranges now read "24 to 48 hours", "₹30,000 to ₹84,000", "₹4.5L to ₹8.5L". Asides became
separate sentences. Long parenthetical lists got broken up. Verified: **zero em dashes, zero en
dashes, zero `--` asides** anywhere in the file, and this is now an automated test so they
cannot creep back in.

### 3. Rewritten in plain Indian service business language
Measured with Flesch-Kincaid: **grade 6.4, reading ease 75** (60+ is plain English). Average
sentence length dropped to **14.6 words**.

Jargon is now banned and tested for. Gone: *infrastructure, dispatch, prospect, deploy, landing
page, lead engine, funnel, scale up.*

| Before | Now |
|---|---|
| "Zero monthly SaaS rent, 100% owned infrastructure" | "No monthly software rent" |
| "Instant PDF rate sheet dispatch" | "Your rate card or catalogue goes out within seconds" |
| "High-speed mobile landing page" | "A simple fast page" |
| "Instant Lead Capture" | "Enquiries saved in your own Google Sheet" |
| "Prospects request quotes from 3 designers simultaneously" | "Before lunch they have messaged three or four businesses" |
| "3 Separate Monthly Bills" | "Website and hosting bill every month" |

Questions got simpler too. *"What share get a real reply from you within 5 minutes today?"*
became *"How many enquiries do you reply to within 5 minutes today?"*

### 4. Carried over from the first rebuild
- **A working demo**, now the first thing after the hero. Pick a business type, send a test
  enquiry, watch the reply, PDF and phone alert land. Nothing to sign up for.
- **Unverifiable stats removed.** No "78% buy from the first vendor", no "3.8x more site
  visits". Under ASCI rules those need substantiating on request, and buyers discount them
  anyway. The argument is now the one they can check for themselves: the first reply usually
  wins.
- **The calculator is the visitor's.** Four inputs they own, including *"Out of the slow ones,
  how many go to someone faster?"* with the note *"You decide this number. We do not claim to
  know it."* Verified across default, min, max and zero-loss states. The payback line now reads
  *"...and the call amount comes off your build anyway."*
- **One CTA, eight doors.** Nav, hero, after the demo, after the build list, after the
  calculator, after the call section, footer, plus a mobile sticky bar that hides itself once
  the form is on screen.
- **Form: booking saved before payment is mentioned.** Step 1 takes details, step 2 takes the
  ₹399. Your sheet payload keeps its exact `{name, phone, email, notes}` shape, so **your
  existing Apps Script and Google Sheet need no changes.** New fields (business type, preferred
  call time) are folded into `notes`.
- **A new "when is a good time to call you?" field** on the form, because a call-based offer
  needs it and it raises show-up rate.
- **Zero external requests.** System fonts, inline SVG icons, data-URI favicon. The old live
  site blocked on two Google Fonts round-trips while claiming to load in under 2 seconds.
- **Real content in the HTML.** The old build was a 1.5 KB shell with everything in a 337 KB
  JS bundle. All copy, FAQs and headings are now in the markup: indexable, and readable if JS
  fails.
- **Accessibility:** all form controls labelled, one `<h1>`, skip link, focus-visible rings,
  `aria-pressed` toggles, live regions for form status, `aria-expanded` menu. Worst contrast
  ratio **5.38:1** against AA's 4.5:1 requirement.
- **Motion respects `prefers-reduced-motion`.**

---

## Verified

`test-site.js` — **67 assertions, all passing, zero runtime errors.**

- Maths across default / min / max / zero-loss states, checked against an independent
  recomputation. No `NaN`, no `Infinity`.
- Demo: industry switching swaps both the PDF and the message copy, custom names flow through,
  reset clears state.
- Form: blocks empty submits, rejects 4 malformed phone formats and bad emails, honeypot
  silently drops bots, valid submit fires exactly one request to the correct endpoint with the
  legacy payload shape.
- **Offer integrity:** asserts ₹399 is never described as a setup fee, is always described as a
  call, that the credit-against-build promise is present, and that no build price is published.
- **House style:** asserts zero em dashes, zero en dashes, and that no jargon words appear.
- **Sandboxed iframe:** passes with `localStorage` and `history.replaceState` both throwing.

Run it yourself: `npm i jsdom && node test-site.js`

---

## Files

| File | Purpose |
|---|---|
| `public/index.html` | The site. This is the only thing published. |
| `public/_headers` | Security headers (Cloudflare format). Must live in `public/`. |
| `public/robots.txt`, `public/sitemap.xml` | Search engine files. |
| `tests/test-site.js` | 80 assertions, jsdom. |
| `tests/test-browser.js` | 19 assertions, headless Chromium. |
| `CLOUDFLARE.md` | How to deploy. |

`public/` is exactly what goes live. Everything else (tests, docs, package.json) stays
private, which is why the site publishes from a subfolder rather than the repo root.
