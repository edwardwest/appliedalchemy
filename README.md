# Applied Alchemy website (appliedalchemy.co)

**What it is:** the public website for Applied Alchemy, rebuilt from Squarespace into plain HTML/CSS so the code lives in GitHub, Vercel serves it, and it can be edited by asking Claude.
**Rebuilt:** Nov 2026 from a saved offline copy of the Squarespace site.

## Status

| Part | Status |
|---|---|
| Home (with Featured projects carousel), Our Approach, Pillars of a Changing World, Meet the Alchemists, 404 | ✅ Built |
| Vercel project linked to this repo | ❌ Not yet (see "Go live" below) |
| appliedalchemy.co domain | ❌ Still points at Squarespace |
| Squarespace pages not in the nav (Contact, Company, Our Services, Our Work) | Not rebuilt on purpose: they held placeholder or template-demo content. Their URLs redirect (see `vercel.json`). |

## How it works

```
partials/header.html, footer.html ─┐
data/projects.json ─────────────────┼─► node scripts/build.js ─► rewrites marked regions in each page's index.html
data/team.json ─────────────────────┘                              + sitemap.xml ─► git push ─► Vercel serves files as-is
```

- **Pages are plain committed HTML.** The build script only refreshes marked regions: the shared header and footer, the project cards and the team list. Vercel runs no build step.
- **One stylesheet:** `assets/css/site.css`, after `modern-normalize.css`. Breakpoints: tablet ≤1024px, mobile ≤767px.
- **One small script:** `assets/js/site.js` (mobile menu, carousel arrows, "Read more" on long project cards). Everything still works without it.

## Pages

| URL | Source file |
|---|---|
| `/` | `index.html` (project cards from `data/projects.json`) |
| `/our-approach/` | `our-approach/index.html` |
| `/pillars/` | `pillars/index.html` |
| `/meet-the-alchemists/` | `meet-the-alchemists/index.html` (people from `data/team.json`) |
| Old Squarespace URLs (`/home`, `/contact`, `/company`, `/our-services`, `/our-work/*`) | 301 redirects in `vercel.json` |

## Day to day

- **Add or edit a featured project:** edit `data/projects.json` (order in the file is the order on the page), put the image in `assets/img/projects/`, run `npm run site`.
- **Add or edit a team member:** edit `data/team.json`, photo in `assets/img/team/`, run `npm run site`.
- **Change page text:** edit the page's `index.html` (or `partials/` for header and footer), then `npm run site`.
- **Preview locally:** `npm install` once, then `npm run preview` and open the printed URL.
- **Publish:** commit and push. Vercel deploys `main` to the live site and gives every other branch a preview URL.

## Go live (one-time)

1. **Vercel:** vercel.com → Add New → Project → import this GitHub repo. Framework preset **Other**, leave Build Command and Output Directory empty (the files are served as they are). Deploy.
2. **Check the `*.vercel.app` URL** on desktop and phone.
3. **Domain:** in the Vercel project → Settings → Domains, add `www.appliedalchemy.co` and `appliedalchemy.co` (redirect the bare domain to `www`). Vercel shows the DNS records to set. Wherever DNS is managed (Squarespace Domains or elsewhere), replace the Squarespace records with Vercel's.
4. **Cancel the Squarespace site plan** once the domain serves from Vercel. If the domain is registered through Squarespace, keep that part or transfer it out first.

## Fonts

- Body: **Poppins** (same as the Squarespace site), self-hosted in `assets/fonts/`.
- Headings: the original uses **Acumin Pro**, an Adobe Fonts typeface that can't be stored in a public repo. The site uses **Hanken Grotesk** (free, very close) instead. To switch back to Acumin with your Adobe Fonts kit: add the kit's `<link>` to each page `<head>` and put `"acumin-pro"` first in `--font-heading` at the top of `site.css`.

## Cost and size

- Hosting: Vercel free (Hobby) plan covers a static site this size. Total about 4.5 MB (images resized from ~15 MB in the Squarespace export).

## Decisions (6 Nov 2026)

- **Plain HTML plus a tiny build script, same setup as aiprc-site,** so both sites are edited the same way.
- **Projects and team live in JSON files** because they're the parts that change; everything else is hardcoded.
- **Long project cards are clamped with "Read more"** so one long entry (e.g. Collaborative Technology Alliance) doesn't stretch the whole carousel row.
- **Kohala has no "Visit Site" button** because the Squarespace one linked back to the home page.
- **Matt Jorgensen's "LindedIn" button typo is fixed.**
- **Small footer added** (© and email); the Squarespace site had none.
- **"Let's talk" stays a mailto link** to connect@appliedalchemy.co, as before. The Squarespace Contact page (unlinked, with example.com emails and a Squarespace-only form) was not carried over.
