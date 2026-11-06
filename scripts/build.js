#!/usr/bin/env node
/*
 * Applied Alchemy site build. Zero runtime dependencies. Run from the repo root:  node scripts/build.js
 *
 * Every page is a plain, committed HTML file. This script rewrites the marked regions
 * inside them in place, so it is safe to run as often as you like:
 *
 *   <!-- @header -->…<!-- /@header -->        ← partials/header.html (active link from <body data-page>)
 *   <!-- @footer -->…<!-- /@footer -->        ← partials/footer.html
 *   <!-- @list projects -->…<!-- /@list -->   ← one card per entry in data/projects.json (in file order)
 *   <!-- @list team -->…<!-- /@list -->       ← one person per entry in data/team.json (in file order)
 *
 * It also regenerates sitemap.xml, copies the CSS reset from node_modules, and stamps
 * CSS/JS links with ?v=<hash> so browsers pick up changes straight away.
 */
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SITE_URL = 'https://www.appliedalchemy.co';
const read = p => fs.readFileSync(path.join(ROOT, p), 'utf8');
const write = (p, s) => fs.writeFileSync(path.join(ROOT, p), s);

const PAGES = [
  { file: 'index.html', url: '/', public: true },
  { file: 'our-approach/index.html', url: '/our-approach/', public: true },
  { file: 'pillars/index.html', url: '/pillars/', public: true },
  { file: 'meet-the-alchemists/index.html', url: '/meet-the-alchemists/', public: true },
  { file: '404.html', url: null, public: false },
];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// Paragraph text in data files may contain simple inline HTML (<a>, <strong>, <em>, <br>).
const paras = list => (list || []).map(p => `<p>${p}</p>`).join('\n              ');

function need(item, keys, file) {
  for (const k of keys) if (!item[k] || (Array.isArray(item[k]) && !item[k].length))
    throw new Error(`${file}: an entry is missing "${k}" (${item.title || item.name || 'untitled'})`);
  if (item.image && !fs.existsSync(path.join(ROOT, item.image)))
    throw new Error(`${file}: image not found: ${item.image}`);
}

const RENDERERS = {
  projects(item, file) {
    need(item, ['title', 'image', 'description'], file);
    const button = item.url
      ? `\n            <p class="project__button"><a class="button" href="${esc(item.url)}" target="_blank" rel="noopener">${esc(item.cta || 'Visit Site')}</a></p>`
      : '';
    const credits = item.credits && item.credits.length
      ? `\n            <hr class="project__rule">\n            <div class="project__credits">\n              ${paras(item.credits)}\n            </div>`
      : '';
    return `
        <li class="project">
          <div class="project__media"><img src="${esc(item.image)}" width="${item.width || ''}" height="${item.height || ''}" alt="" loading="lazy" decoding="async"></div>
          <h3 class="project__title">${esc(item.title)}</h3>
          <div class="project__body">
            <div class="project__description">
              ${paras(item.description)}
            </div>${credits}
          </div>${button}
        </li>`;
  },
  team(item, file) {
    need(item, ['name', 'image', 'bio'], file);
    const link = item.linkedin
      ? `\n          <a class="button" href="${esc(item.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>`
      : '';
    return `
        <li class="member">
          <img class="member__photo" src="${esc(item.image)}" width="${item.width || ''}" height="${item.height || ''}" alt="${esc(item.name)}" loading="lazy" decoding="async">
          <h2 class="member__name">${esc(item.name)}</h2>
          <div class="member__bio">
            ${paras(item.bio)}
          </div>${link}
        </li>`;
  },
};

function renderList(name) {
  const file = `data/${name}.json`;
  const render = RENDERERS[name];
  if (!render) throw new Error(`No renderer for "${name}" (known: ${Object.keys(RENDERERS).join(', ')})`);
  const items = JSON.parse(read(file));
  if (!Array.isArray(items)) throw new Error(`${file} must be a JSON array`);
  return items.map(i => render(i, file)).join('') + '\n      ';
}

function replaceRegion(html, open, close, content) {
  const re = new RegExp(`(<!-- ${open} -->)[\\s\\S]*?(<!-- ${close} -->)`, 'g');
  return html.replace(re, (_, a, b) => `${a}${content}${b}`);
}

const VERSIONED = ['assets/css/modern-normalize.css', 'assets/css/site.css', 'assets/js/site.js'];
function versionAssets(html) {
  for (const file of VERSIONED) {
    const full = path.join(ROOT, file);
    if (!fs.existsSync(full)) continue;
    const hash = crypto.createHash('md5').update(fs.readFileSync(full)).digest('hex').slice(0, 8);
    const escaped = ('/' + file).replace(/[.]/g, '\\.');
    html = html.replace(new RegExp('"' + escaped + '(\\?v=[a-f0-9]+)?"', 'g'), '"/' + file + '?v=' + hash + '"');
  }
  return html;
}

function build() {
  // CSS reset (modern-normalize), copied so the deployed site needs no node_modules.
  const reset = path.join(ROOT, 'node_modules/modern-normalize/modern-normalize.css');
  if (fs.existsSync(reset)) fs.copyFileSync(reset, path.join(ROOT, 'assets/css/modern-normalize.css'));
  else if (!fs.existsSync(path.join(ROOT, 'assets/css/modern-normalize.css'))) throw new Error('Run "npm install" first (modern-normalize missing).');

  const header = read('partials/header.html');
  const footer = read('partials/footer.html');

  for (const page of PAGES) {
    if (!fs.existsSync(path.join(ROOT, page.file))) { console.warn('Skipping missing page', page.file); continue; }
    let html = read(page.file);
    const key = (html.match(/<body[^>]*data-page="([^"]+)"/) || [])[1] || '';
    const h = header.replace(/(<a [^>]*data-nav="([^"]+)"[^>]*)>/g, (m, a, nav) =>
      nav === key ? `${a} aria-current="page">` : `${a}>`);
    html = replaceRegion(html, '@header', '/@header', '\n' + h.trim() + '\n');
    html = replaceRegion(html, '@footer', '/@footer', '\n' + footer.trim() + '\n');
    html = html.replace(/<!-- @list ([\w-]+) -->[\s\S]*?<!-- \/@list -->/g,
      (_, name) => `<!-- @list ${name} -->${renderList(name)}<!-- /@list -->`);
    html = versionAssets(html);
    write(page.file, html);
  }

  const urls = PAGES.filter(p => p.public).map(p => `  <url><loc>${SITE_URL}${p.url}</loc></url>`).join('\n');
  write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);

  console.log('Built', PAGES.length, 'pages.');
}

try { build(); } catch (e) { console.error('Build failed:', e.message); process.exit(1); }
