# Deploying LeadMaxx.ai to Cloudflare Pages

Why Cloudflare instead of Vercel: Cloudflare Pages allows **commercial use on the free
tier**, gives unlimited bandwidth, and hosts a single static file perfectly. Vercel's free
Hobby plan prohibits commercial use, which this site is.

The repo is already prepared and committed. You have three steps: push to GitHub, connect
Cloudflare, verify. There is no build step anywhere in this process.

---

## Step 0: two things to fix before you push

### a) Fill in your Razorpay key

Open `public/index.html`, find `CONFIG` in the script, and set:

```js
RAZORPAY_KEY_ID: "rzp_live_xxxxxxxxxxxx",
```

Leave it empty and the site still works, but the pay button falls back to a WhatsApp
handoff instead of taking payment. Set it now so your first live deploy is the real thing.

### b) Fix the URL that's still pointing at Vercel

Two lines in `public/index.html` still reference your old host:

```
line 8:   <link rel="canonical" href="https://leadmaxx-ai.vercel.app/" />
line 16:  <meta property="og:url" content="https://leadmaxx-ai.vercel.app/" />
```

Replace both with whatever your live URL ends up being. If you're using
`leadmaxx-ai.pages.dev`, that's:

```html
<link rel="canonical" href="https://leadmaxx-ai.pages.dev/" />
<meta property="og:url" content="https://leadmaxx-ai.pages.dev/" />
```

Then update `public/robots.txt` and `public/sitemap.xml` the same way (they also carry a
placeholder `pages.dev` URL).

This matters more than it looks. A canonical tag pointing at a dead domain tells Google the
real page lives somewhere that no longer exists, which can drop you out of search results
entirely. If you have a custom domain, use that instead of `pages.dev` everywhere.

### c) Set your git identity

I committed with a placeholder so the repo is ready:

```bash
cd leadmaxx
git config user.name "Your Name"
git config user.email "you@yourbusiness.in"
git commit --amend --reset-author --no-edit
```

---

## Step 1: push to GitHub

Create the repo at **github.com/new**, named `leadmaxx-site`. Make it **Private**: your
funnel copy and offer structure are competitive assets, and Cloudflare connects to private
repos fine. Don't initialise it with a README or .gitignore; you already have both.

```bash
cd leadmaxx
git remote add origin https://github.com/YOUR-USERNAME/leadmaxx-site.git
git push -u origin main
```

GitHub asks for a **Personal Access Token**, not your account password. Create one at
github.com/settings/tokens with the `repo` scope and paste it as the password.

---

## Step 2: connect Cloudflare Pages

1. Go to **dash.cloudflare.com** and sign up free if you haven't (no domain required).
2. In the left sidebar, open **Workers & Pages**.
3. Click **Create** → **Pages** tab → **Connect to Git**.
4. Authorise Cloudflare on GitHub. Choose **Only select repositories** and pick
   `leadmaxx-site`. This is safer than granting access to everything.

### Build settings: the part that matters

| Setting | Value |
|---|---|
| Production branch | `main` |
| Framework preset | **None** |
| Build command | **leave completely empty** |
| Build output directory | `public` |
| Root directory | leave empty |
| Environment variables | none |

These five lines are the whole trick. Because the site is plain HTML with no framework:

- **Build command stays empty.** There is nothing to compile. An empty command means
  Cloudflare publishes your files exactly as they are, which is what you want. It also means
  each deploy takes seconds, not minutes.
- **Output directory is `public`.** This is the folder that becomes your live site.
  Everything outside it stays private.

The single most common Cloudflare Pages failure is a blank page caused by a wrong output
directory. Don't type `dist`, `build` or `/`. It's `public`.

Click **Save and Deploy**. First build takes under a minute.

### What you'll get

A URL like `https://leadmaxx-ai.pages.dev`. If that exact subdomain is taken, Cloudflare
will pick a variant. Whatever it gives you, **put that URL into the two canonical lines and
the robots/sitemap files from Step 0b** and push again. Takes one more minute.

---

## Step 3: what happens automatically from now on

Once connected, every push to `main` redeploys production, and every other branch or pull
request gets its own **preview URL** at no cost. That's the real benefit of wiring the repo
up rather than uploading files by hand.

```bash
cd leadmaxx
# edit public/index.html
git add . && git commit -m "Update hero copy" && git push
# live in about 10 seconds
```

You never need the Cloudflare dashboard again, and never need a deploy command.

> **Never edit files in the Cloudflare dashboard.** It has an editor that creates changes
> which are invisible to your repo, and the next push silently wipes them. Edit locally,
> commit, push.

---

## Step 4: custom domain (optional, do this when ready)

If you own `leadmaxx.ai`:

1. Cloudflare Pages project → **Custom domains** → **Set up a custom domain**
2. Enter `leadmaxx.ai`, and again for `www.leadmaxx.ai`
3. If your domain's nameservers are already on Cloudflare, DNS and the SSL certificate are
   created for you automatically. If your domain is registered elsewhere, Cloudflare shows
   you the two records to add at your registrar.
4. HTTPS is provisioned automatically. No certificate to buy.

Then update the canonical and OG URLs from Step 0b to `https://leadmaxx.ai/` and push. Until
you do, search engines will keep pointing at the old host.

**If you don't own a domain yet**, stay on `pages.dev` for now. It's free, has HTTPS, and is
perfectly fine to run a beta from. Buy the domain when the first paying customers land.

---

## Step 5: verify the deploy

Check these in order on the live URL. The first two catch the failures that actually happen.

1. **The page loads, not a blank screen.** Blank means the output directory is wrong
   (Step 2). Failed build means the build command isn't empty.
2. **The demo works.** Click *Send test enquiry* and confirm all four things appear: the
   customer question, the green reply with the PDF card, and the owner alert, with the timer
   stopping at **1.8s**. This was a real bug once, so check it every single time.
3. **No settings panel in the header.** The old build exposed a public "Razorpay Checkout
   Config" panel to every visitor. Confirm it's gone.
4. **The form saves.** Submit a test booking and confirm a new row lands in your Google Sheet.
5. **Security headers applied.** Run:
   ```bash
   curl -sI https://YOUR-URL.pages.dev | grep -i "x-content-type\|referrer\|permissions"
   ```
   You should see all three. If nothing comes back, `_headers` isn't being read, which
   almost always means it isn't in the published folder (`public/_headers`).
6. **The canonical is right.** View source and confirm line 8 shows your live domain, not
   `vercel.app`.

---

## Step 6: switch off the old Vercel site

Once Cloudflare is live and verified:

1. Move the domain (if you have one) to Cloudflare first, so there's no gap where the site is
   unreachable.
2. Then **delete the Vercel project**. Deleting it also releases `leadmaxx-ai.vercel.app`.
   Do this: the old build still has the publicly exposed config panel, and leaving it up
   means that panel stays reachable.

If the old URL was indexed by Google, the canonical tag change from Step 0b is what tells
search engines to move over. Give it a few weeks.

---

## Alternative: deploy without the dashboard (manual upload)

If you'd rather not connect GitHub, you can upload directly. Creates a project called
`leadmaxx-ai` and pushes the `public/` folder:

```bash
cd leadmaxx
npx wrangler login                 # opens a browser to authorise
npx wrangler pages deploy public --project-name=leadmaxx-ai
```

Good for a quick first look. The downside is you must re-run that command on every change,
and you get no preview URLs. For ongoing work, the Git integration in Step 2 is better.

<details>
<summary>Alternative: GitHub Actions deploy (if you want deploys from CI)</summary>

Native Git integration is simpler and needs no config, so only do this if you have a reason.
You'd need a Cloudflare API token (My Profile → API Tokens) with the **Cloudflare Pages:
Edit** permission, plus your Account ID, saved as GitHub secrets `CLOUDFLARE_API_TOKEN` and
`CLOUDFLARE_ACCOUNT_ID` (Settings → Secrets and variables → Actions).

```yaml
# .github/workflows/deploy.yml
name: Deploy to Cloudflare Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      deployments: write
    steps:
      - uses: actions/checkout@v4
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy public --project-name=leadmaxx-ai
```
</details>

---

## Local development

```bash
npm run dev      # serves public/ on http://localhost:8080
npm test         # 80 assertions: logic, maths, form, copy, CSS
npm run test:browser   # 19 assertions: headless Chromium, checks it actually renders
npm run test:all       # both
```

First time on a new machine:

```bash
npm install && npx playwright install chromium
```

Run `npm run test:all` before every push. `test:browser` is the one that matters most: it
measures real computed opacity, so a bug like the invisible-demo-bubble can't reach
production again.

---

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Blank page, deploy succeeded | Wrong output directory | Set it to `public` |
| `Could not find directory` in build log | Wrong output directory | Same |
| Build takes minutes / fails | Build command is set | Clear it entirely |
| `_headers` ignored | File not in published dir | Must be `public/_headers`, not repo root |
| Demo bubbles don't appear | JS blocked or old cached build | Hard-refresh; check console |
| Changes not showing | Browser cache, or edited in dashboard | Hard-refresh; edit locally and push |
| 404 on `pages.dev` | First deploy still running | Wait 60 seconds |

---

## Deployment record

The site is **live** at https://leadmaxx-ai.pages.dev

Direct dashboard link (bookmark this. The "Workers & Pages" list sometimes shows
a cached empty state, so use the direct link if the project seems missing):

https://dash.cloudflare.com/5d0919aae6e63a6ee66ca0537d9c301f/pages/view/leadmaxx-ai

| | |
|---|---|
| Cloudflare account | `5d0919aae6e63a6ee66ca0537d9c301f` |
| Pages project | `leadmaxx-ai` |
| Production branch | `main` |
| Git provider | **not connected** (deployed via wrangler) |
| Deployed | 14 Sep 2026 |

### Verified on the live URL

- Page loads, HTTP 200, 91,677 bytes. **23,193 bytes over the wire** (Brotli), HTTP/3 available.
- TTFB **84 ms**.
- All four security headers applied from `public/_headers`: `x-content-type-options`,
  `referrer-policy`, `permissions-policy`, `x-frame-options`.
- Private files return **404**: `/tests/test-site.js`, `/README.md`, `/package.json`,
  `/CLOUDFLARE.md`, and any unknown path.
- Full browser test suite run **against production**: **19/19 passed**, including the demo
  playing through with the timer stopping at 1.8s and no page errors.

### To deploy a change from here on

Because Git is not connected, pushing to GitHub does **not** deploy. Use wrangler:

```bash
cd leadmaxx
npx wrangler login                     # one time, browser based
npx wrangler pages deploy public --project-name=leadmaxx-ai --branch=main
```

### Recommended next: connect Git

Right now the repo and the live site can drift apart, because nothing ties them together.
Connecting Git gives you auto-deploy on every push and a preview URL for every pull request,
on the free plan. Takes about three minutes:

1. Push the repo to GitHub (private) — see Step 1 above.
2. Cloudflare dashboard → **Workers & Pages** → **leadmaxx-ai** → **Settings** →
   **Builds & deployments** → **Connect to Git**.
3. Build command: **empty**. Build output directory: **`public`**.

After that, stop using wrangler for routine changes so the two don't fight each other.

---

## Creating a Cloudflare API token (for agent or CI deploys)

Needed whenever you want a deploy without using the dashboard. Takes about a minute.

### Step by step

1. Go to **https://dash.cloudflare.com/profile/api-tokens**
   (or: avatar top-right → **My Profile** → **API Tokens**)

2. Click **Create Token**

3. Scroll to the bottom, past the templates, to **Custom Token** → click **Get started**
   Do not use "Edit Cloudflare Workers" — it grants more than this needs.

4. **Token name**: `leadmaxx-deploy`

5. **Permissions** — set these three dropdowns to exactly:
   | Dropdown | Value |
   |---|---|
   | first | `Account` |
   | second | `Cloudflare Pages` |
   | third | `Edit` |

   That is the only permission required. Nothing else.

6. **Account Resources** → `Include` → select your account
   (should be the only option; account ID is `5d0919aae6e63a6ee66ca0537d9c301f`)

7. **Client IP Address Filtering** — leave empty unless you want to lock the token to
   your own IP. If you do, note it will then fail from any other machine.

8. **TTL** → **Set a custom expiry** → pick a short window (**1 day** is plenty).
   Default "No expiry" is a bad idea for a throwaway token.

9. **Continue to summary** → check it reads
   `Account · Cloudflare Pages · Edit` → **Create Token**

10. **Copy the token now.** Cloudflare shows it once and never again. If you lose it,
    delete and create a new one.

### What this token can and cannot do

| Can | Cannot |
|---|---|
| Deploy the site to Pages | Touch DNS records |
| Read project settings | See or change billing |
| Change build config | Access other Cloudflare services |
| List deployments | Act outside the selected account |

### After the deploy

**Delete the token immediately.** Same page: find it under API Tokens → **Delete**.
If it was pasted into a chat, message or ticket, treat it as compromised regardless of
what happened next, and delete it even if the deploy worked.

### Common errors

| Error | Cause | Fix |
|---|---|---|
| `Invalid access token [code: 9109]` | Token revoked, expired, or mistyped | Create a new one |
| `Rate limited [code: 10429]` | Too many API calls in a short window | Wait 60 seconds and retry |
| `Unable to retrieve email for this user` | Missing `User → User Details → Read` | Harmless. Pass `CLOUDFLARE_ACCOUNT_ID` explicitly and ignore it. |
| `Authentication error [code: 10000]` | Permission set to a different service | Must be `Account · Cloudflare Pages · Edit` |

---

## Incident: routing broke after connecting Git (14 Sep 2026)

### What happened

Connecting Git created a new production deployment (`c76f2bd5`, source `github`) which
took the production alias from the working wrangler deploy (`e2323111`). The site loaded,
but the deployment was missing files, so these broke:

| Symptom | Cause |
|---|---|
| `/?utm_source=...` returned **404** | No `404.html` in the published output |
| `404` page was **0 bytes** | Same |
| All four security headers gone | No `_headers` in the published output |
| `x-robots-tag: noindex` on production | Tied to the Git-built deployment |
| `/index.html` returned 404 | No `_redirects` / clean-url handling |

Content was identical (91,677 bytes at `/`) so the page *looked* fine. Only routing,
headers and metadata were broken.

**The near-miss:** every ad or Instagram link carries `?utm_source=...`. All of them
would have landed on a blank page. Do not run paid traffic against a deployment that
hasn't been checked with a query string.

### Root cause

The GitHub repo's `public/` folder does not contain all the published files. The build
config was correct (`destination_dir: public`, empty build command), so Cloudflare
published exactly what the repo had — which was incomplete.

### Why wrangler deploys work when Git deploys don't

`wrangler pages deploy public` uploads **everything in `public/`**. A Git deploy uploads
whatever the repo contains. If the repo is out of sync, the two produce different sites.

### The fix, and how to stop it recurring

`wrangler pages deploy public` restored the full site. But **the next `git push` will
re-break it**, because Git is still connected and the repo is still incomplete.

Pick one:

**Option 1 - sync the repo (recommended).** Make the repo's `public/` folder contain all
five files:
```
public/index.html
public/_headers
public/404.html
public/robots.txt
public/sitemap.xml
```
Then push. Verify after the build with the checklist below.

**Option 2 - disconnect Git.** Pages project -> Settings -> Builds & deployments ->
Disconnect. All deploys then come from wrangler, so the workspace copy is the single
source of truth.

### Post-deploy verification (run every time)

```bash
BASE=https://leadmaxx-ai.pages.dev
curl -s -o /dev/null -w '%{http_code}\n' "$BASE/?utm_source=test"   # must be 200
curl -s -o /dev/null -w '%{http_code}\n' "$BASE/index.html"         # must be 308
curl -s     "$BASE/does-not-exist" | wc -c                          # must be > 0
curl -sI    "$BASE/" | grep -iE 'x-content-type|permissions-policy' # both present
curl -sI    "$BASE/" | grep -i x-robots-tag                         # must be EMPTY
```
Or just run `BASE_URL=$BASE npm run test:browser`, which checks the page end to end.

### Note on `noindex`

Cloudflare adds `x-robots-tag: noindex` to **deployment-specific URLs**
(`<hash>.leadmaxx-ai.pages.dev`). That is intentional - it stops Google indexing
duplicate copies of every build. The production alias `leadmaxx-ai.pages.dev` must NOT
carry it. If it ever does, the site is invisible to search engines.

### Verified after the fix

- Routing: `/` 200, query strings 200 (8/8), `/index.html` 308, unknown path 404
- Security headers: all four present
- 404 page: 3,737 bytes with real content
- `x-robots-tag`: gone from production, still on hash URLs (correct)
- Razorpay: live key deployed, checkout constructs at 39,900 paise
- Browser suite against production: **30 passed, 0 failed**
