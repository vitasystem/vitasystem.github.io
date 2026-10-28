(() => {
  const modal = document.getElementById('video-modal');
  const close = document.getElementById('modal-close');
  const titles = ['Розмова без поспіху', 'Дорогою на дах', 'Запитання, що залишаються'];
  let lastTrigger = null;
  const closeModal = () => modal.close();
  document.querySelectorAll('[data-video]').forEach(button => {
    button.addEventListener('click', () => {
      const number = Number(button.dataset.video);
      lastTrigger = button;
      document.getElementById('modal-number').textContent = 'Частина 0' + number;
      document.getElementById('modal-title').textContent = titles[number - 1];
      document.getElementById('modal-description').textContent = 'Ця частина розмови з’явиться тут незабаром.';
      modal.showModal();
      document.body.style.overflow = 'hidden';
      close.focus();
    });
  });
  close.addEventListener('click', closeModal);
  modal.addEventListener('click', event => {
    if (event.target !== modal) return;
    const box = modal.querySelector('.modal-dialog').getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) closeModal();
  });
  modal.addEventListener('close', () => {
    document.body.style.overflow = '';
    lastTrigger?.focus({preventScroll:true});
  });
})();
