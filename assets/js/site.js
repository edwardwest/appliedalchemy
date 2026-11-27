// Applied Alchemy — small progressive enhancements. The site works without this file.
document.documentElement.classList.add('js');

// Mobile menu (a <details>): close on Escape or when clicking outside it.
const menu = document.querySelector('.menu');
if (menu) {
  document.addEventListener('keydown', e => { if (e.key === 'Escape') menu.open = false; });
  document.addEventListener('click', e => { if (menu.open && !menu.contains(e.target)) menu.open = false; });
}

// Accordions (every <details> except the menu): animate open and close instead of snapping.
// Without JS, or with reduced motion, they still open and close instantly as normal.
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const running = new WeakMap();
const heightWhen = (el, open) => {
  const was = el.open;
  el.open = open;
  const h = el.getBoundingClientRect().height;
  el.open = was;
  return h;
};
document.querySelectorAll('details:not(.menu)').forEach(el => {
  const summary = el.querySelector(':scope > summary');
  if (!summary) return;
  summary.addEventListener('click', e => {
    if (reduceMotion.matches || !el.animate) return;
    e.preventDefault();
    const prev = running.get(el);
    const closing = prev ? prev.opening : el.open;
    const from = el.getBoundingClientRect().height;
    if (prev) prev.anims.forEach(a => a.cancel());
    const to = heightWhen(el, !closing);
    el.open = true;
    el.style.overflow = 'hidden';
    const duration = Math.min(600, Math.max(250, Math.abs(to - from) * 0.6));
    const anim = el.animate({ height: [`${from}px`, `${to}px`] }, { duration, easing: 'cubic-bezier(.2, .7, .2, 1)' });
    const fades = [...el.children].filter(c => c !== summary).map(c =>
      c.animate({ opacity: closing ? [1, 0] : [0, 1] }, { duration: closing ? duration * 0.6 : duration, easing: 'ease-out', fill: 'forwards' }));
    const anims = [anim, ...fades];
    running.set(el, { anims, opening: !closing });
    anim.onfinish = () => {
      running.delete(el);
      el.open = !closing;
      el.style.overflow = '';
      fades.forEach(a => a.cancel());
    };
  });
});

// Capabilities accordion: a link like /capabilities/#software opens that row.
const openFromHash = () => {
  const row = location.hash && document.getElementById(location.hash.slice(1));
  const cap = row && row.querySelector('details.cap');
  if (cap) { cap.open = true; row.scrollIntoView(); }
};
openFromHash();
window.addEventListener('hashchange', openFromHash);

// Featured projects slider: round arrows step one card. The left arrow only exists once
// there is something to go back to; the right arrow goes away at the last card.
document.querySelectorAll('[data-slider]').forEach(root => {
  const track = root.querySelector('.slider__track');
  const prev = root.querySelector('[data-dir="prev"]');
  const next = root.querySelector('[data-dir="next"]');
  if (!track || !prev || !next) return;
  const step = () => {
    const [a, b] = track.children;
    return b ? b.offsetLeft - a.offsetLeft : track.clientWidth;
  };
  const sync = () => {
    prev.hidden = track.scrollLeft <= 4;
    next.hidden = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
  };
  prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
  next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
  track.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync);
  sync();
});

// Project pop-ups. Any link with data-project opens the <dialog> with that id when it is on the
// page ("View full project" on the home page, every name on the Projects page). Without JS those
// links go to /projects/#name instead. Clicking the dimmed backdrop closes; Escape is built in.
const openProject = (id, updateHash) => {
  const dialog = id && document.getElementById(id);
  if (!dialog || !dialog.matches('dialog.pd') || dialog.open) return false;
  dialog.showModal();
  dialog.querySelectorAll('.pd__panes, .pd__gallery, .pd__info').forEach(el => { el.scrollTop = 0; });
  if (updateHash) history.replaceState(null, '', '#' + id);
  return true;
};
document.addEventListener('click', e => {
  const link = e.target.closest('a[data-project]');
  if (link && openProject(link.dataset.project, link.pathname === location.pathname)) e.preventDefault();
});
document.querySelectorAll('dialog.pd').forEach(dialog => {
  dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => {
    if (location.hash === '#' + dialog.id) history.replaceState(null, '', location.pathname + location.search);
  });
});
// A link like /projects/#mission-motors opens that project straight away.
if (location.hash) openProject(location.hash.slice(1), false);
window.addEventListener('hashchange', () => openProject(location.hash.slice(1), false));

// Projects page: hovering or focusing a name shows that project on the image stage.
document.querySelectorAll('[data-pindex]').forEach(root => {
  const part = name => root.querySelector(`[data-stage="${name}"]`);
  const items = [...root.querySelectorAll('.plist__item')];
  const show = item => {
    items.forEach(i => i.classList.toggle('is-active', i === item));
    part('image').src = item.dataset.image;
    part('tag').textContent = item.dataset.tag;
  };
  items.forEach(item => {
    item.addEventListener('mouseenter', () => show(item));
    item.addEventListener('focus', () => show(item));
  });
  const first = items.find(i => i.classList.contains('is-active')) || items[0];
  if (first) show(first);
  // Fetch the other covers quietly so the stage swaps without a flash.
  const warm = () => items.forEach(i => { new Image().src = i.dataset.image; });
  if (matchMedia('(min-width: 768px)').matches) (window.requestIdleCallback || setTimeout)(warm);
});
