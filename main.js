// Dán link embed video khai trương (vd: https://www.youtube.com/embed/ID?autoplay=1)
const VIDEO_URL = '';
const AUTOPLAY_MS = 3500;

// ---------- Mobile menu ----------
const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.getElementById('mobile-nav');
menuToggle.addEventListener('click', () => {
  const open = mobileNav.hidden;
  mobileNav.hidden = !open;
  menuToggle.setAttribute('aria-expanded', String(open));
});
window.matchMedia('(min-width: 760px)').addEventListener('change', () => {
  mobileNav.hidden = true;
  menuToggle.setAttribute('aria-expanded', 'false');
});

// ---------- Carousel ----------
const track = document.querySelector('.carousel__track');
let timer;

function slide(dir) {
  const first = track.firstElementChild;
  const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
  const step = first ? first.getBoundingClientRect().width + gap : track.clientWidth;
  const max = track.scrollWidth - track.clientWidth;
  let x = track.scrollLeft + dir * step;
  if (x > max + 2) x = 0;
  else if (x < -2) x = max;
  track.scrollTo({ left: x, behavior: 'smooth' });
}
function stopAuto() { clearInterval(timer); }
function startAuto() { stopAuto(); timer = setInterval(() => slide(1), AUTOPLAY_MS); }

document.querySelector('.carousel__btn--prev').addEventListener('click', () => { slide(-1); startAuto(); });
document.querySelector('.carousel__btn--next').addEventListener('click', () => { slide(1); startAuto(); });
track.addEventListener('mouseenter', stopAuto);
track.addEventListener('mouseleave', startAuto);
track.addEventListener('touchstart', stopAuto, { passive: true });
track.addEventListener('touchend', startAuto);
startAuto();

// ---------- Lightbox ----------
const lightbox = document.getElementById('lightbox');
const lbImg = lightbox.querySelector('.lightbox__img');
const lbVideo = lightbox.querySelector('.lightbox__video');
const lbCaption = lightbox.querySelector('.lightbox__caption');

function openLightbox({ type, src, caption }) {
  stopAuto();
  lbImg.hidden = type !== 'img';
  lbVideo.hidden = type !== 'video';
  if (type === 'img') {
    lbImg.src = src;
    lbImg.alt = caption;
  } else {
    lbVideo.innerHTML = VIDEO_URL
      ? `<iframe src="${VIDEO_URL}" title="${caption}" allow="autoplay; encrypted-media; fullscreen" allowfullscreen></iframe>`
      : '<span>Video đang được cập nhật</span>';
  }
  lbCaption.textContent = caption;
  lightbox.hidden = false;
}
function closeLightbox() {
  if (lightbox.hidden) return;
  lightbox.hidden = true;
  lbImg.removeAttribute('src');
  lbVideo.innerHTML = '';
  startAuto();
}

track.querySelectorAll('.slide img').forEach(img => {
  img.addEventListener('click', () => openLightbox({ type: 'img', src: img.src, caption: img.dataset.caption }));
});
document.querySelector('.video').addEventListener('click', () => {
  openLightbox({ type: 'video', caption: 'Video toàn cảnh ngày khai trương' });
});
lightbox.addEventListener('click', e => {
  if (e.target === lbImg || lbVideo.contains(e.target)) return;
  closeLightbox();
});
window.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
