(() => {
  const videos = [...document.querySelectorAll('.show-episode video')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const startVideo = async (video) => {
    if (!video) return;
    videos.forEach(other => { if (other !== video) other.pause(); });
    video.controls = true;
    try { await video.play(); }
    catch {
      video.controls = true;
      video.closest('.show-episode').querySelector('.episode-play').hidden = true;
    }
  };
  videos.forEach(video => {
    const card = video.closest('.show-episode');
    const play = card.querySelector('.episode-play');
    const error = card.querySelector('.show-video-error');
    video.controls = false;
    play.hidden = false;
    play.addEventListener('click', () => startVideo(video));
    video.addEventListener('play', () => {
      play.hidden = true;
      video.parentElement.classList.add('has-played');
      video.controls = true;
      videos.forEach(other => { if (other !== video) other.pause(); });
    });
    video.addEventListener('ended', () => { play.hidden = false; });
    video.addEventListener('error', () => { error.hidden = false; video.controls = true; play.hidden = true; });
  });
  document.querySelector('[data-latest]')?.addEventListener('click', event => {
    event.preventDefault();
    const latest = document.querySelector('#episode-3');
    latest.scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'center' });
    startVideo(latest.querySelector('video'));
  });
  const menu = document.querySelector('.show-menu-toggle');
  const nav = document.querySelector('.show-nav');
  const closeMenu = () => { menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Відкрити меню'); nav.classList.remove('is-open'); };
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Закрити меню' : 'Відкрити меню');
    nav.classList.toggle('is-open', open);
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  window.addEventListener('pagehide', () => videos.forEach(video => video.pause()));
})();
