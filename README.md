# Applied Alchemy website (appliedalchemy.co)

**What it is:** the public website for Applied Alchemy, rebuilt from Squarespace into plain HTML/CSS so the code lives in GitHub, Vercel serves it, and it can be edited by asking Claude.
**Rebuilt:** Nov 2026 from a saved offline copy of the Squarespace site.
**Redesigned:** 25 Nov 2026. New monochrome layout (thin rules, label on the left, large two-tone statements), project slider on the home page, and a new Capabilities page. The design was worked out as a mockup in Claude first, then ported here.

## Status

| Part | Status |
|---|---|
| Home (with Featured projects slider), Capabilities, Our Approach, Pillars of a Changing World, Meet the Alchemists, 404 | ✅ Built |
| Vercel project linked to this repo | ✅ Project `appliedalchemy` deploys `main` to appliedalchemy.vercel.app. A second project, `appliedalchemy-5s2w`, is disconnected from Git on purpose and keeps the old Squarespace-clone design for reference. |
| appliedalchemy.co domain | ✅ DNS (at DreamHost) switched to Vercel on 25 Nov 2026: `www` is the main address and the bare domain redirects to it. Email (Google MX records) was left unchanged. |
| Squarespace pages not in the nav (Contact, Company, Our Services, Our Work) | Not rebuilt on purpose: they held placeholder or template-demo content. Their URLs redirect (see `vercel.json`). |

## How it works

```
partials/header.html, footer.html ─┐
data/projects.json ─────────────────┼─► node scripts/build.js ─► rewrites marked regions in each page's index.html
data/team.json ─────────────────────┘                              + sitemap.xml ─► git push ─► Vercel serves files as-is
```

- **Pages are plain committed HTML.** The build script only refreshes marked regions: the shared header and footer, the project cards and the team list. Vercel runs no build step.
- **One stylesheet:** `assets/css/site.css`, after `modern-normalize.css`. Breakpoints: tablet ≤1024px, mobile ≤767px.
- **One small script:** `assets/js/site.js` (closes the mobile menu on Escape or outside click, and runs the slider arrows). Everything still works without it: the menu and the "About this project" and bio panels are native `<details>` elements, and the slider scrolls sideways on its own.

## Pages

| URL | Source file |
|---|---|
| `/` | `index.html` (project cards from `data/projects.json`) |
| `/about/` | `about/index.html` |
| `/capabilities/` | `capabilities/index.html` (capability accordion from `data/capabilities.json`, cards looked up in `data/projects.json`) |
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

- One typeface: **Geist** (free, SIL Open Font License), self-hosted as a variable font in `assets/fonts/`. It replaced Poppins and Hanken Grotesk in the Nov 2026 redesign.

## Cost and size

- Hosting: Vercel free (Hobby) plan covers a static site this size. Total about 3.5 MB.

## Decisions (6 Nov 2026)

- **Plain HTML plus a tiny build script, same setup as aiprc-site,** so both sites are edited the same way.
- **Projects and team live in JSON files** because they're the parts that change; everything else is hardcoded.
- **Long project cards are clamped with "Read more"** so one long entry (e.g. Collaborative Technology Alliance) doesn't stretch the whole carousel row.
- **Kohala has no "Visit Site" button** because the Squarespace one linked back to the home page.
- **Matt Jorgensen's "LindedIn" button typo is fixed.**
- **Small footer added** (© and email); the Squarespace site had none.
- **"Let's talk" stays a mailto link** to connect@appliedalchemy.co, as before. The Squarespace Contact page (unlinked, with example.com emails and a Squarespace-only form) was not carried over.

## Decisions (25 Nov 2026 redesign)

- **Home page is hero, project slider, then four statement sections** (Our shared challenge, A unique opportunity, A team of alchemists, Who we work with). The hero photo and the satellite photo were dropped on purpose.
- **Our Approach, Pillars and Meet the Alchemists are sub-pages only**; they are no longer repeated on the home page.
- **Projects are a sideways slider of 3:2 tiles.** Round arrows appear when the pointer is over the row; the left one only once there is something to go back to. On touch screens the arrows are always visible.
- **Project details and team bios open in place** ("About this project", or clicking a person), so cards stay the same height when closed.
- **Removed projects:** OpenDoor, Regen Network, Hilltop Urban Farm. **Added:** Raya Power, AI Psychological Research Coalition.
- **Each project has a short `tagline` and each person a short `role`.** These were drafted during the redesign, not taken from the old site; edit them in the data files.
- **Capabilities page** combines the capabilities one-pager (software and AI sections, in its wording) with eleven broader capabilities. The eleven descriptions and their "Seen in" lines are drafts, except Supply chain & manufacturing, which is Edward's wording.
- **Narrow screens (≤767px) get a hamburger menu** instead of stacked page links.
- **Section rules run edge to edge** of the browser window on every page, while content stays in the 1120px column. **The home headline is left-aligned with the logo and 50% larger** than other statements (`.statement--lead`).

## Decisions (27 Nov 2026)

- **Capabilities are an accordion.** Each of the eleven rows opens to a longer description, the project cards that prove it (image, tagline, and an "Our role" panel with the project's credits), and, for Software & AI, the build list, core technologies and how we work. The separate Software & AI sections below the list were folded into that row.
- **Capabilities live in `data/capabilities.json`.** `projects` entries are titles from `data/projects.json` (a prefix like "Tesseract" works); a project with no featured card is an object `{ "title", "tagline" }` and shows as a text row. Rows can be linked directly, e.g. `/capabilities/#software`.
- **The longer descriptions are drafts** written from the project credits; edit them in the data file.

## Decisions (27 Nov 2026, About page)

- **Home page is now just the hero, the project slider and the closing call to action.** The four statement sections (Our shared challenge, A unique opportunity, A team of alchemists, Who we work with) moved, unchanged, to a new About page at `/about/`.
- **About is the first link in the header and footer nav.** With six links the header no longer fits on one line below about 1100px, so the menu button now takes over at ≤1100px (it was ≤767px).
- **The About page heading** is "About Applied Alchemy / We partner with founders, companies, and funds to build things that matter." (Edward's wording).
