(() => {
  const videos = [...document.querySelectorAll('.show-episode video')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const startVideo = async (video, restart = false) => {
    if (!video) return;
    videos.forEach(other => { if (other !== video) other.pause(); });
    const card = video.closest('.show-episode');
    card.querySelector('.episode-end').hidden = true;
    if (restart || video.ended) video.currentTime = 0;
    video.controls = true;
    try { await video.play(); }
    catch {
      video.controls = true;
      card.querySelector('.episode-play').hidden = true;
    }
  };
  const switchEpisode = (number, fromVideo) => {
    const card = document.querySelector('#episode-' + number);
    const video = card?.querySelector('video');
    if (!video) return;
    if (fromVideo) {
      video.muted = fromVideo.muted;
      video.volume = fromVideo.volume;
    }
    startVideo(video, true);
    card.scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'center' });
    video.focus({ preventScroll:true });
  };
  videos.forEach(video => {
    const card = video.closest('.show-episode');
    const play = card.querySelector('.episode-play');
    const error = card.querySelector('.show-video-error');
    const end = card.querySelector('.episode-end');
    video.controls = false;
    video.tabIndex = -1;
    play.hidden = false;
    play.addEventListener('click', () => startVideo(video));
    card.querySelector('.episode-replay').addEventListener('click', () => startVideo(video, true));
    card.querySelectorAll('[data-episode-target]').forEach(button => {
      button.addEventListener('click', () => switchEpisode(Number(button.dataset.episodeTarget), video));
    });
    video.addEventListener('play', () => {
      end.hidden = true;
      play.hidden = true;
      video.parentElement.classList.add('has-played');
      video.controls = true;
      videos.forEach(other => { if (other !== video) other.pause(); });
    });
    video.addEventListener('ended', () => {
      play.hidden = true;
      end.hidden = false;
      // Make the next-episode controls visible after native fullscreen playback.
      const fullscreen = document.fullscreenElement;
      if (fullscreen && video.parentElement.contains(fullscreen)) {
        document.exitFullscreen().catch(() => {});
      } else if (video.webkitDisplayingFullscreen && video.webkitExitFullscreen) {
        video.webkitExitFullscreen();
      }
    });
    video.addEventListener('seeking', () => { if (!video.ended) end.hidden = true; });
    video.addEventListener('error', () => {
      error.hidden = false;
      end.hidden = true;
      video.controls = true;
      play.hidden = true;
    });
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
