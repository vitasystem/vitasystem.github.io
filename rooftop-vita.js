(() => {
  const modal = document.getElementById('video-modal');
  const close = document.getElementById('modal-close');
  const player = document.getElementById('rooftop-player');
  const description = document.getElementById('modal-description');
  const note = modal.querySelector('.modal-note');
  const error = document.getElementById('video-error');
  const direct = document.getElementById('video-direct');
  const titles = ['Розмова без поспіху', 'Дорогою на дах', 'Запитання, що залишаються'];
  let lastTrigger = null;
  const stopVideo = () => {
    player.pause();
    player.removeAttribute('src');
    player.load();
    player.hidden = true;
    error.hidden = true;
  };
  document.querySelectorAll('[data-video]').forEach(button => {
    button.addEventListener('click', () => {
      const number = Number(button.dataset.video);
      const source = button.dataset.videoSrc;
      lastTrigger = button;
      stopVideo();
      document.getElementById('modal-number').textContent = 'Частина 0' + number;
      document.getElementById('modal-title').textContent = titles[number - 1];
      description.textContent = 'Ця частина розмови з’явиться тут незабаром.';
      description.hidden = Boolean(source);
      note.hidden = Boolean(source);
      if (source) {
        player.src = source;
        player.poster = button.querySelector('img').src;
        player.hidden = false;
        player.muted = false;
        player.volume = 1;
        direct.href = source;
      }
      modal.showModal();
      document.body.style.overflow = 'hidden';
      close.focus();
      if (source) player.play().catch(() => {
        if (player.error) error.hidden = false;
      });
    });
  });
  player.addEventListener('error', () => {
    if (player.hasAttribute('src') && modal.open) error.hidden = false;
  });
  close.addEventListener('click', () => modal.close());
  modal.addEventListener('click', event => {
    if (event.target !== modal) return;
    const box = modal.querySelector('.modal-dialog').getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) modal.close();
  });
  modal.addEventListener('close', () => {
    stopVideo();
    document.body.style.overflow = '';
    lastTrigger?.focus({preventScroll:true});
  });
})();
