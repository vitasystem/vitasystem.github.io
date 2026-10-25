(() => {
  const body=document.body, query=new URLSearchParams(location.search).get('lang');
  let saved='uk';
  try { saved=localStorage.getItem('vita-language')||'uk'; } catch {}
  const lang=query==='en'?'en':query==='uk'?'uk':saved==='en'?'en':'uk';
  const en=lang==='en', name=en?body.dataset.albumEn:body.dataset.albumUk;
  document.documentElement.lang=lang;
  document.title=name+(en?' — VITA Gallery':' — Галерея ВІТИ');
  document.querySelector('meta[name="description"]').content=name+(en?' — VITA photo album.':' — фотоальбом ВІТИ.');
  document.querySelector('[data-album-title]').textContent=name;
  document.querySelector('[data-album-kicker]').textContent=body.dataset.albumNumber+(en?' / GALLERY':' / ГАЛЕРЕЯ');
  document.querySelector('.album-cover img').alt=(en?'VITA — ':'ВІТА — ')+name;
  const labels=en?{gallery:'GALLERY',radio:'RADIO 224 FM',home:'HOME',back:'← VITA GALLERY'}:{gallery:'ГАЛЕРЕЯ',radio:'РАДІО 224 FM',home:'НА ГОЛОВНУ',back:'← ГАЛЕРЕЯ ВІТИ'};
  document.querySelectorAll('[data-album-label]').forEach(a=>a.textContent=labels[a.dataset.albumLabel]);
  document.querySelectorAll('a[href^="index.html"]').forEach(a=>{
    const url=new URL(a.getAttribute('href'),location.href);
    url.searchParams.set('lang',lang);
    a.href=url.href;
  });
})();
