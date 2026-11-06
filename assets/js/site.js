// Applied Alchemy — small progressive enhancements. The site works without this file.
document.documentElement.classList.add('js');

// Mobile menu
const toggle = document.querySelector('.menu-toggle');
if (toggle) {
  toggle.addEventListener('click', () => {
    const open = document.body.classList.toggle('menu-open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && document.body.classList.contains('menu-open')) toggle.click();
  });
}

// Long project cards: clamp, with a Read more / Read less toggle.
document.querySelectorAll('.project__body').forEach(body => {
  body.classList.add('is-clamped');
  if (body.scrollHeight <= body.clientHeight + 64) { body.classList.remove('is-clamped'); return; }
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'project__more';
  btn.textContent = 'Read more';
  btn.setAttribute('aria-expanded', 'false');
  btn.addEventListener('click', () => {
    const open = body.classList.toggle('is-clamped') === false;
    btn.textContent = open ? 'Read less' : 'Read more';
    btn.setAttribute('aria-expanded', String(open));
  });
  body.after(btn);
});

// Featured projects carousel: arrows step one card and wrap around at the ends.
document.querySelectorAll('[data-carousel]').forEach(root => {
  const track = root.querySelector('.carousel');
  if (!track) return;
  const step = () => {
    const [a, b] = track.children;
    return b ? b.offsetLeft - a.offsetLeft : track.clientWidth;
  };
  root.querySelectorAll('[data-dir]').forEach(btn => {
    btn.addEventListener('click', () => {
      const s = step();
      const max = track.scrollWidth - track.clientWidth;
      const index = Math.round(track.scrollLeft / s);
      let left;
      if (btn.dataset.dir === 'next') left = track.scrollLeft >= max - 4 ? 0 : Math.min((index + 1) * s, max);
      else left = track.scrollLeft <= 4 ? max : Math.max((index - 1) * s, 0);
      track.scrollTo({ left, behavior: 'smooth' });
    });
  });
});
