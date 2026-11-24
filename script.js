// All Day Childminding — site interactions
(function () {
  // ----- Mobile menu -----
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('main-nav');
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }));

  // ----- Active nav link on scroll -----
  const links = [...nav.querySelectorAll('a')];
  const sections = ['about', 'services', 'gallery', 'reviews', 'contact']
    .map(id => document.getElementById(id)).filter(Boolean);
  function setActive() {
    let current = 'top';
    const y = window.scrollY + 120;
    sections.forEach(s => { if (s.offsetTop <= y) current = s.id; });
    links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
  }
  window.addEventListener('scroll', setActive, { passive: true });
  setActive();

  // ----- Hero slider -----
  const slides = [...document.querySelectorAll('.hero-slide')];
  const dots = [...document.querySelectorAll('.hero-dots button')];
  let index = 0, timer;
  function show(i) {
    index = (i + slides.length) % slides.length;
    slides.forEach((s, n) => s.classList.toggle('is-active', n === index));
    dots.forEach((d, n) => d.classList.toggle('is-active', n === index));
  }
  function restart() {
    clearInterval(timer);
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      timer = setInterval(() => show(index + 1), 6000);
    }
  }
  document.querySelector('.hero-prev').addEventListener('click', () => { show(index - 1); restart(); });
  document.querySelector('.hero-next').addEventListener('click', () => { show(index + 1); restart(); });
  dots.forEach((d, n) => d.addEventListener('click', () => { show(n); restart(); }));
  // swipe on touch screens
  let startX = null;
  const hero = document.querySelector('.hero');
  hero.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  hero.addEventListener('touchend', e => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) { show(index + (dx < 0 ? 1 : -1)); restart(); }
    startX = null;
  });
  restart();

  // ----- Gallery lightbox -----
  const lightbox = document.getElementById('lightbox');
  const lbImg = lightbox.querySelector('img');
  document.querySelectorAll('.gallery-item').forEach(btn => btn.addEventListener('click', () => {
    const img = btn.querySelector('img');
    lbImg.src = btn.dataset.full;
    lbImg.alt = img.alt;
    lightbox.hidden = false;
  }));
  function closeLightbox() { lightbox.hidden = true; lbImg.src = ''; }
  lightbox.addEventListener('click', e => { if (e.target !== lbImg) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !lightbox.hidden) closeLightbox(); });
  document.getElementById('view-more').addEventListener('click', e => {
    e.preventDefault();
    document.querySelector('.gallery-item').click();
  });

  // ----- Contact form (front-end validation) -----
  // NOTE: connect this to a form service (e.g. Formspree / Netlify Forms) or your
  // web host's mail handler to actually receive messages.
  const form = document.getElementById('contact-form');
  const status = form.querySelector('.form-status');
  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    form.querySelectorAll('[required]').forEach(f => {
      const bad = !f.value.trim() || (f.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value));
      f.classList.toggle('invalid', bad);
      if (bad) ok = false;
    });
    if (!ok) { status.textContent = 'Please fill in the required fields.'; return; }
    status.textContent = 'Thank you! We will be in touch very soon.';
    form.reset();
  });

  // ----- Reveal on scroll -----
  const revealEls = document.querySelectorAll('.feature-card, .about-grid > *, .service-card, .gallery-item, .review-card, .contact-grid > *');
  if ('IntersectionObserver' in window) {
    revealEls.forEach(el => el.classList.add('reveal'));
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); }
    }), { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  }

  document.getElementById('year').textContent = new Date().getFullYear();
})();
