/* ==========================================
   PURNITURE FURNITURE — script.js
   ========================================== */

/* ── Gallery data ── */
const products = [
  { img: 'images/sofa-ivory-chester.jpg',    name: 'Ivory Chester Sofa',     cat: 'living-room', label: 'Living Room' },
  { img: 'images/sofa-corner-beige.jpg',     name: 'Haven Corner Sofa',      cat: 'living-room', label: 'Living Room' },
  { img: 'images/chairs-boucle-accent.jpg',  name: 'Boucle Accent Chairs',   cat: 'living-room', label: 'Living Room' },
  { img: 'images/dining-round-table.jpg',    name: 'Round Dining Set',       cat: 'dining',      label: 'Dining' },
  { img: 'images/living-contrast-set.jpg',   name: 'Contrast Living Set',    cat: 'living-room', label: 'Living Room' },
  { img: 'images/bedroom-minimal.jpg',       name: 'Minimal Bedroom Suite',  cat: 'bedroom',     label: 'Bedroom' },
  { img: 'images/sofa-velvet.jpg',           name: 'Velvet Cloud Sofa',      cat: 'living-room', label: 'Living Room' },
  { img: 'images/armchair-cream.jpg',        name: 'Cream Lounge Chair',     cat: 'living-room', label: 'Living Room' },
  { img: 'images/dining-modern-set.jpg',     name: 'Modern Dining Set',      cat: 'dining',      label: 'Dining' },
  { img: 'images/table-coffee-oak.jpg',      name: 'Oak Coffee Table',       cat: 'living-room', label: 'Living Room' },
  { img: 'images/bedroom-wardrobe.jpg',      name: 'Fitted Wardrobe',        cat: 'bedroom',     label: 'Bedroom' },
  { img: 'images/shelf-display.jpg',         name: 'Display Shelf Unit',     cat: 'living-room', label: 'Living Room' },
  { img: 'images/sofa-modular.jpg',          name: 'Modular Sofa System',    cat: 'living-room', label: 'Living Room' },
  { img: 'images/chair-designer.jpg',        name: 'Designer Accent Chair',  cat: 'living-room', label: 'Living Room' },
  { img: 'images/bed-linen.jpg',             name: 'Linen Bed Frame',        cat: 'bedroom',     label: 'Bedroom' },
  { img: 'images/table-dining-marble.jpg',   name: 'Marble Dining Table',    cat: 'dining',      label: 'Dining' },
  { img: 'images/sofa-sectional-grey.jpg',   name: 'Grey Sectional Sofa',    cat: 'living-room', label: 'Living Room' },
  { img: 'images/living-room-complete.jpg',  name: 'Complete Living Set',    cat: 'living-room', label: 'Living Room' },
];

/* ── Header scroll state ── */
const header = document.getElementById('siteHeader');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

/* ── Mobile nav ── */
const burger = document.getElementById('burger');
const mobileNav = document.getElementById('mobileNav');

burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  mobileNav.classList.toggle('open');
  document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
});

document.querySelectorAll('.mobile-nav a').forEach(a => {
  a.addEventListener('click', () => {
    burger.classList.remove('open');
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ── Gallery rendering ── */
const grid = document.getElementById('galleryGrid');
let currentFilter = 'all';

function renderGallery(filter) {
  currentFilter = filter;
  grid.innerHTML = '';

  const visible = products.filter(p => filter === 'all' || p.cat === filter);
  visible.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'g-card';
    card.style.transitionDelay = (i % 8) * 60 + 'ms';
    card.innerHTML = `
      <div class="img-wrap">
        <img src="${p.img}" alt="${p.name}" loading="lazy">
      </div>
      <div class="card-info">
        <div class="card-name">${p.name}</div>
        <div class="card-cat">${p.label}</div>
      </div>
    `;
    card.addEventListener('click', () => openLightbox(p));
    grid.appendChild(card);

    /* trigger reveal */
    requestAnimationFrame(() => {
      requestAnimationFrame(() => card.classList.add('visible'));
    });
  });

  observeReveal();
}

/* ── Filter buttons ── */
document.getElementById('filters').addEventListener('click', e => {
  const btn = e.target.closest('button');
  if (!btn) return;
  document.querySelectorAll('#filters button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderGallery(btn.dataset.filter);
});

/* ── Lightbox ── */
const lightbox   = document.getElementById('lightbox');
const lbImg      = document.getElementById('lbImg');
const lbName     = document.getElementById('lbName');
const lbCat      = document.getElementById('lbCat');
let   lbItems    = [];
let   lbIndex    = 0;

function openLightbox(product) {
  lbItems = products.filter(p => currentFilter === 'all' || p.cat === currentFilter);
  lbIndex = lbItems.findIndex(p => p.img === product.img);
  showLbItem();
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function showLbItem() {
  const p = lbItems[lbIndex];
  lbImg.src  = p.img;
  lbImg.alt  = p.name;
  lbName.textContent = p.name;
  lbCat.textContent  = p.label;
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function lbDelta(d) {
  lbIndex = (lbIndex + d + lbItems.length) % lbItems.length;
  showLbItem();
}

document.getElementById('lbClose').addEventListener('click', closeLightbox);
document.getElementById('lbNext').addEventListener('click', () => lbDelta(1));
document.getElementById('lbPrev').addEventListener('click', () => lbDelta(-1));
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape')      closeLightbox();
  if (e.key === 'ArrowRight')  lbDelta(1);
  if (e.key === 'ArrowLeft')   lbDelta(-1);
});

/* ── Intersection observer for reveal ── */
function observeReveal() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('visible');
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}

/* ── Init ── */
renderGallery('all');
observeReveal();
