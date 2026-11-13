/* VITA SYSTEM — showroom mobile navigation, isolated from player and game scripts. */
(() => {
  'use strict';
  const init = () => {
    const header = document.querySelector('header.site-head, header.site-header');
    if (!header || header.querySelector('.vita-showroom-mobile-menu')) return;
    const isCatalog = header.classList.contains('site-header');
    const navigation = isCatalog
      ? header.querySelector('nav.nav-links')
      : header.querySelector('nav[aria-label="Навігація"]');
    if (!navigation) return;
    const destinations = isCatalog
      ? [
          ['#directory', 'Усі шоуруми ВІТИ'],
          ['music.html?lang=uk', 'Музика'],
          ['index.html?lang=uk', 'На головну']
        ]
      : Array.from(navigation.querySelectorAll('a:not(.head-buy)'))
          .map(link => [link.getAttribute('href'), link.textContent.trim()]);
    if (destinations.length === 0) return;
    const menu = document.createElement('details');
    menu.className = 'vita-showroom-mobile-menu';
    const trigger = document.createElement('summary');
    trigger.setAttribute('aria-label', 'Відкрити меню шоуруму');
    trigger.setAttribute('title', 'Меню');
    trigger.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
    const panel = document.createElement('div');
    panel.className = 'vita-showroom-mobile-menu-panel';
    for (const [href, title] of destinations) {
      const link = document.createElement('a');
      link.setAttribute('href', href);
      link.textContent = title;
      link.addEventListener('click', () => { menu.open = false; });
      panel.appendChild(link);
    }
    menu.append(trigger, panel);
    navigation.insertAdjacentElement('afterend', menu);
    document.addEventListener('pointerdown', event => {
      if (menu.open && !menu.contains(event.target)) menu.open = false;
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menu.open) {
        menu.open = false;
        trigger.focus();
      }
    });
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, {once:true});
  } else init();
})();
