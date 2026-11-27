# Applied Alchemy website (appliedalchemy.co)

**What it is:** the public website for Applied Alchemy, rebuilt from Squarespace into plain HTML/CSS so the code lives in GitHub, Vercel serves it, and it can be edited by asking Claude.
**Rebuilt:** Nov 2026 from a saved offline copy of the Squarespace site.
**Redesigned:** 25 Nov 2026. New monochrome layout (thin rules, label on the left, large two-tone statements), project slider on the home page, and a new Capabilities page. The design was worked out as a mockup in Claude first, then ported here.

## Status

| Part | Status |
|---|---|
| Home (with Featured projects slider), Projects, Studio, Capabilities, Our Approach, Pillars of a Changing World, Meet the Alchemists, 404 | ✅ Built |
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
| `/projects/` | `projects/index.html` (list and pop-ups from `data/projects.json`) |
| `/studio/` | `studio/index.html` (was `/about/`, which now redirects here) |
| `/capabilities/` | `capabilities/index.html` (capability accordion from `data/capabilities.json`, cards looked up in `data/projects.json`) |
| `/our-approach/` | `our-approach/index.html` |
| `/pillars/` | `pillars/index.html` |
| `/meet-the-alchemists/` | `meet-the-alchemists/index.html` (people from `data/team.json`) |
| Old Squarespace URLs (`/home`, `/contact`, `/company`, `/our-services`, `/our-work/*`) | 301 redirects in `vercel.json` |

## Day to day

- **Add or edit a featured project:** edit `data/projects.json` (order in the file is the order on the page), put the image in `assets/img/projects/`, run `npm run site`.
- **Add gallery images or press to a project:** in its `data/projects.json` entry add `"gallery": [{ "src": "/assets/img/projects/<name>/<file>.jpg", "width": …, "height": … }, …]` (JPEG, 1400px wide at most, any proportions; list order is display order, top to bottom of the left column and then the right) and/or `"press": [{ "outlet": "…", "title": "…", "year": "…", "url": "…" }, …]`. Optional: `"pressHeading": "Press & publications"` and `"short": "Name used in the Projects list"`. Run `npm run site`.
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
- **The About page was renamed Studio** (27 Nov 2026), at `/studio/`; `/about/` redirects to it. Its heading is "Studio / We partner with founders, companies, and funds to build things that matter." (Edward's wording).

## Decisions (27 Nov 2026, Projects page)

- **New Projects page at `/projects/`**, modelled on branchcreative.com/projects and worked out as a mockup in Claude first: every project as a large name, A to Z (ignoring a leading "The"), with an image stage on the left that follows the pointer or keyboard focus. Phones have no hover, so there the stage is dropped and each name shows its tagline.
- **Every project opens a pop-up** (a native `<dialog>`): gallery on the left, then tagline, title, description (first paragraph larger), "Our role", press and the site link on the right. One image is shown on its own; two or more become two equal-width columns with mixed heights. On phones the text comes first and the images follow in one column. Links like `/projects/#mission-motors` open that project directly.
- **Home page cards:** a project with a gallery or press shows "View full project" inside "About this project", which opens the same pop-up; the others keep their site link. A new "All projects" link sits beside the "Featured projects" label.
- **Projects is linked from the home page, the menu button (≤1100px) and the footer, but not the desktop header bar**, which has no room for a seventh link.
- **Press lists** (Mission Motors, Prometheus Fuels, Raya Power, AIPRC, The BioFi Project, Consilience Project, Salmon Nation Trust, Declaring Our Tech Futures) were gathered by web search and curated by Edward; most links were not opened and checked individually, and a few years are estimates or left blank. The Declaring Our Tech Futures list mirrors the "In the media" list on its own site.
- **"Prometheus" is now "Prometheus Fuels".** **Added: Declaring Our Tech Futures**; its tagline and description are drafts written from the project's site.
- **Some description paragraphs were split in two** (same wording) so the pop-up has a short opening line.
