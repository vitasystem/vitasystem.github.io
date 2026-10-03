(() => {
  const $ = (s, el=document) => el.querySelector(s);
  const $$ = (s, el=document) => [...el.querySelectorAll(s)];

  window.addEventListener('load', () => setTimeout(() => $('#preloader')?.classList.add('is-done'), 350));
  setTimeout(() => $('#preloader')?.classList.add('is-done'), 2600);

  const header = $('#siteHeader');
  const onScroll = () => header?.classList.toggle('scrolled', scrollY > 28);
  addEventListener('scroll', onScroll, {passive:true}); onScroll();

  const menuToggle = $('#menuToggle'), mobileMenu = $('#mobileMenu');
  const closeMenu = () => { menuToggle?.setAttribute('aria-expanded','false'); mobileMenu?.classList.remove('open'); mobileMenu?.setAttribute('aria-hidden','true'); document.body.classList.remove('menu-open'); };
  menuToggle?.addEventListener('click', () => { const open = menuToggle.getAttribute('aria-expanded') !== 'true'; menuToggle.setAttribute('aria-expanded', String(open)); mobileMenu.classList.toggle('open', open); mobileMenu.setAttribute('aria-hidden', String(!open)); document.body.classList.toggle('menu-open', open); });
  $$('#mobileMenu a').forEach(a => a.addEventListener('click', closeMenu));

  // HERO: five 6-second transmissions
  const videos = $$('.hero-video');
  const segments = $$('.progress-segment');
  let heroIndex = 0, timer;
  const duration = 6000;
  const playHero = (idx) => {
    clearTimeout(timer);
    heroIndex = (idx + videos.length) % videos.length;
    videos.forEach((v,i) => { v.classList.toggle('is-active', i===heroIndex); if(i===heroIndex){v.currentTime=0; v.play().catch(()=>{});} else {v.pause();} });
    segments.forEach((s,i) => { s.classList.toggle('is-active', i===heroIndex); s.classList.toggle('is-past', i<heroIndex); const bar=s.querySelector('i'); if(bar){ bar.style.animation='none'; void bar.offsetWidth; bar.style.animation=''; } });
    timer = setTimeout(() => playHero(heroIndex+1), duration);
  };
  segments.forEach(s => s.addEventListener('click', () => playHero(Number(s.dataset.index))));
  if(videos.length) playHero(0);
  document.addEventListener('visibilitychange', () => { if(document.hidden){ clearTimeout(timer); videos.forEach(v=>v.pause()); } else { playHero(heroIndex); } });

  // Doors open before navigating
  const openPortal = (portal) => {
    if(portal.classList.contains('opening')) return;
    portal.classList.add('opening');
    const target = portal.dataset.target;
    setTimeout(() => { document.querySelector(target)?.scrollIntoView({behavior:'smooth'}); setTimeout(()=>portal.classList.remove('opening'), 900); }, 620);
  };
  $$('.portal').forEach(p => { p.addEventListener('click',()=>openPortal(p)); p.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openPortal(p);}}); });

  // Scroll reveals
  const io = new IntersectionObserver(entries => entries.forEach(e => { if(e.isIntersecting){e.target.classList.add('in-view');io.unobserve(e.target);} }), {threshold:.13, rootMargin:'0px 0px -7% 0px'});
  $$('.reveal').forEach(el=>io.observe(el));

  // Lazy video play in visual transmissions
  const vio = new IntersectionObserver(entries => entries.forEach(e => { const v=e.target; if(e.isIntersecting) v.play().catch(()=>{}); else v.pause(); }), {threshold:.28});
  $$('.transmission video').forEach(v=>vio.observe(v));

  // 224 FM player
  const tracks = [
    {title:'Candy Dealer', src:'assets/audio/candy-dealer.mp3'},
    {title:'Leroy', src:'assets/audio/leroy.mp3'},
    {title:'Нічний Париж', src:'assets/audio/night-paris.mp3'}
  ];
  const audio=$('#audioPlayer'), playBtn=$('#playButton'), title=$('#trackTitle'), time=$('#trackTime'), prog=$('#trackProgress');
  let trackIndex=0;
  const fmt = s => { if(!isFinite(s)) return '00:00'; const m=Math.floor(s/60), r=Math.floor(s%60); return `${String(m).padStart(2,'0')}:${String(r).padStart(2,'0')}`; };
  const setTrack = (i, autoplay=false) => { trackIndex=(i+tracks.length)%tracks.length; audio.src=tracks[trackIndex].src; title.textContent=tracks[trackIndex].title; $$('.track').forEach((t,j)=>t.classList.toggle('is-active',j===trackIndex)); if(autoplay) audio.play().catch(()=>{}); };
  setTrack(0);
  playBtn?.addEventListener('click',()=> audio.paused ? audio.play().catch(()=>{}) : audio.pause());
  $('#prevTrack')?.addEventListener('click',()=>setTrack(trackIndex-1,true));
  $('#nextTrack')?.addEventListener('click',()=>setTrack(trackIndex+1,true));
  $$('.track').forEach(t=>t.addEventListener('click',()=>setTrack(Number(t.dataset.track),true)));
  audio?.addEventListener('play',()=>playBtn?.classList.add('is-playing'));
  audio?.addEventListener('pause',()=>playBtn?.classList.remove('is-playing'));
  audio?.addEventListener('ended',()=>setTrack(trackIndex+1,true));
  audio?.addEventListener('timeupdate',()=>{ const pct=audio.duration?audio.currentTime/audio.duration*100:0; prog?.querySelector('i')?.style.setProperty('width',pct+'%'); prog?.setAttribute('aria-valuenow',String(Math.round(pct))); if(time) time.textContent=fmt(audio.currentTime); });
  prog?.addEventListener('click',e=>{ if(!audio.duration)return; const r=prog.getBoundingClientRect(); audio.currentTime=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width))*audio.duration; });

  // Gallery lightbox
  const lightbox=$('#lightbox'), lbImg=$('#lightboxImage');
  const closeLb=()=>{lightbox?.classList.remove('open');lightbox?.setAttribute('aria-hidden','true');document.body.classList.remove('lightbox-open');};
  $$('.gallery-item').forEach(item=>item.addEventListener('click',()=>{ lbImg.src=item.dataset.full; lbImg.alt=item.querySelector('img')?.alt||'ВІТА'; lightbox.classList.add('open'); lightbox.setAttribute('aria-hidden','false'); document.body.classList.add('lightbox-open'); }));
  $('#lightboxClose')?.addEventListener('click',closeLb); lightbox?.addEventListener('click',e=>{if(e.target===lightbox)closeLb();}); addEventListener('keydown',e=>{if(e.key==='Escape'){closeLb();closeMenu();}});

  $('#year').textContent = new Date().getFullYear();
})();
