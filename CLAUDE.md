# Applied Alchemy site — instructions for Claude

Project overview, status and decisions: see `README.md`. Don't duplicate them here.

## Golden rules
- Pages are plain HTML. Never hand-edit content between `<!-- @header -->`, `<!-- @footer -->` or `<!-- @list … -->` markers; edit `partials/*.html` or `data/*.json` instead.
- After any change run `node scripts/build.js` (needs `npm install` once). Commit the regenerated files with the source change. The build stamps CSS/JS links with `?v=<hash>`; skipping it leaves visitors on stale CSS.
- Keep the look: reuse existing classes in `assets/css/site.css`; colours and fonts are the variables at the top of that file. Don't add new colours, fonts or spacing scales.
- Verify visually at 1440px, 1024px and 390px before saying a change is done.

## Adding a featured project
Add an object to `data/projects.json` where it should appear (file order = page order):
```json
{
  "title": "Project name",
  "url": "https://… (or null for no button)",
  "cta": "Visit Site",
  "image": "/assets/img/projects/project-name.jpg",
  "width": 1200,
  "height": 800,
  "description": ["Paragraph about the project.", "Another paragraph."],
  "credits": ["Principal … served as …"]
}
```
- Image: JPEG, 1200px wide max, 3:2 works best (it is cropped to 3:2). Put the real pixel size in `width`/`height`.
- Paragraphs may contain simple inline HTML (`<a href>`, `<strong>`, `<em>`).

## Adding a team member
Add to `data/team.json`: `name`, `image` (`/assets/img/team/first-last.jpg`, ~800px wide, cropped to 4:3), `width`, `height`, `linkedin` (URL or null), `bio` (array of paragraphs).

## New pages
Copy the `<head>` from an existing page (title, description, canonical, OG tags, fonts, CSS/JS), set `data-page` on `<body>`, keep the header/footer markers, register the file in `PAGES` in `scripts/build.js`, and add a nav link in `partials/header.html` with a matching `data-nav` only if asked.
