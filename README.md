# LeadMaxx website

This repository holds the LeadMaxx website. Cloudflare publishes the `public`
folder to https://leadmaxx-ai.pages.dev

## Editing the site

All the words, prices and phone numbers live in one file:

    public/index.html

Open it, click the pencil icon, make your change, and press "Commit changes".
Your change appears on the live site in about a minute.

Rules of the road:

- Only change text between tags. Leave anything that starts with a `<` alone.
- Do not rename or move any file. The names matter to Cloudflare.
- If a change looks wrong on the live site, come back here, undo the change
  the same way, and commit. The old version comes back.

## Files

| File | What it is |
|---|---|
| `public/index.html` | The whole website: text, layout, colours, scripts |
| `public/404.html` | The page shown for a wrong web address |
| `public/_headers` | Security and caching settings. Do not edit. |
| `public/robots.txt` | Tells search engines they may index the site |
| `public/sitemap.xml` | The list of pages for search engines |

## How hosting is wired up

Cloudflare (the project called `leadmaxx-ai`) reads this repository and
publishes the `public` folder to https://leadmaxx-ai.pages.dev

The settings that make that work, written down in case a future developer
needs them:

| Setting | Value |
|---|---|
| Git repository | `akjeelbuilds/leadmaxx-ai` |
| Production branch | `main` |
| Automatic production deployments | Enabled |
| Build command | empty |
| Build output directory | `public` |
| Root directory | empty |

Build command is deliberately empty. This is a plain HTML site, so there is
nothing to build. Anything in that box would run a program instead of simply
publishing the files.
