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
