// Applied Alchemy — small progressive enhancements. The site works without this file.
document.documentElement.classList.add('js');

// Mobile menu (a <details>): close on Escape or when clicking outside it.
const menu = document.querySelector('.menu');
if (menu) {
  document.addEventListener('keydown', e => { if (e.key === 'Escape') menu.open = false; });
  document.addEventListener('click', e => { if (menu.open && !menu.contains(e.target)) menu.open = false; });
}

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
