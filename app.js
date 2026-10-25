(() => {
  const $ = (s, el=document) => el.querySelector(s);
  const $$ = (s, el=document) => [...el.querySelectorAll(s)];

  let preloaderFinished = false;
  const finishPreloader = () => {
    if (preloaderFinished) return;
    preloaderFinished = true;
    $('#preloader')?.classList.add('is-done');
  };
  window.addEventListener('load', () => setTimeout(finishPreloader, 1450), { once:true });
  setTimeout(finishPreloader, 4800);

  const header = $('#siteHeader');
  const onScroll = () => header?.classList.toggle('scrolled', scrollY > 28);
  addEventListener('scroll', onScroll, {passive:true}); onScroll();

  const menuToggle = $('#menuToggle'), mobileMenu = $('#mobileMenu');
  const closeMenu = () => { menuToggle?.setAttribute('aria-expanded','false'); mobileMenu?.classList.remove('open'); mobileMenu?.setAttribute('aria-hidden','true'); document.body.classList.remove('menu-open'); };
  menuToggle?.addEventListener('click', () => { const open = menuToggle.getAttribute('aria-expanded') !== 'true'; menuToggle.setAttribute('aria-expanded', String(open)); menuToggle.setAttribute('aria-label', open ? languageCopy[activeLanguage].menuClose : languageCopy[activeLanguage].menuOpen); mobileMenu.classList.toggle('open', open); mobileMenu.setAttribute('aria-hidden', String(!open)); document.body.classList.toggle('menu-open', open); });
  $$('#mobileMenu a').forEach(a => a.addEventListener('click', closeMenu));

  // HERO: advance when each short scene finishes.
  const videos = $$('.hero-video');
  const segments = $$('.progress-segment');
  const progress = $('#heroProgress');
  const heroSoundButton = $('#heroSoundToggle');
  let heroSoundEnabled = false, radioAudio = null;
  const updateHeroSoundButton = () => {
    if (!heroSoundButton) return;
    const en = activeLanguage === 'en';
    heroSoundButton.setAttribute('aria-pressed', String(heroSoundEnabled));
    heroSoundButton.setAttribute('aria-label', en
      ? (heroSoundEnabled ? 'Mute sound on the five opening clips' : 'Enable sound on the five opening clips')
      : (heroSoundEnabled ? 'Вимкнути звук у п’яти початкових кліпах' : 'Увімкнути звук у п’яти початкових кліпах'));
    const label = heroSoundButton.querySelector('span');
    if (label) label.textContent = en ? 'SOUND' : 'ЗВУК';
  };
  const updateVideoSoundButton = (button) => {
    const video = document.getElementById(button.dataset.soundFor);
    if (!video) return;
    const on = !video.muted, en = activeLanguage === 'en';
    button.setAttribute('aria-pressed', String(on));
    button.setAttribute('aria-label', en
      ? (on ? 'Mute video sound' : 'Enable video sound')
      : (on ? 'Вимкнути звук відео' : 'Увімкнути звук відео'));
    const label = button.querySelector('span');
    if (label) label.textContent = en ? (on ? 'SOUND ON' : 'SOUND') : (on ? 'ЗВУК УВІМКНЕНО' : 'ЗВУК');
  };
  const setHeroSound = (enabled) => {
    heroSoundEnabled = enabled;
    if (enabled) {
      $$('video').forEach(v => { v.muted = true; });
      radioAudio?.pause();
      const active = videos[heroIndex];
      if (active) { active.muted = false; active.play().catch(() => {}); }
    } else videos.forEach(v => { v.muted = true; });
    updateHeroSoundButton();
    $$('.video-sound-toggle').forEach(updateVideoSoundButton);
  };
  heroSoundButton?.addEventListener('click', () => setHeroSound(!heroSoundEnabled));
  let heroIndex = 0, timer;
  const scheduleEnd = (video, idx) => {
    if (idx !== heroIndex) return;
    const ms = Number.isFinite(video.duration) && video.duration > 0
      ? Math.max(1000, Math.min(12000, video.duration * 1000))
      : 6000;
    progress?.style.setProperty('--hero-duration', ms + 'ms');
    clearTimeout(timer);
    timer = setTimeout(() => playHero(idx + 1), ms + 350);
  };
  const playHero = (idx) => {
    clearTimeout(timer);
    heroIndex = (idx + videos.length) % videos.length;
    videos.forEach((v, i) => {
      v.classList.toggle('is-active', i === heroIndex);
      if (i === heroIndex) {
        v.currentTime = 0;
        v.muted = !heroSoundEnabled;
        v.play().catch(() => {});
        scheduleEnd(v, i);
      } else {
        v.pause();
        v.muted = true;
      }
    });
    segments.forEach((s, i) => {
      s.classList.toggle('is-active', i === heroIndex);
      s.classList.toggle('is-past', i < heroIndex);
      const bar = s.querySelector('i');
      if (bar) { bar.style.animation = 'none'; void bar.offsetWidth; bar.style.animation = ''; }
    });
  };
  videos.forEach((v, i) => {
    v.addEventListener('ended', () => { if (i === heroIndex) playHero(i + 1); });
    v.addEventListener('loadedmetadata', () => scheduleEnd(v, i));
  });
  segments.forEach(s => s.addEventListener('click', () => playHero(Number(s.dataset.index))));
  if (videos.length) playHero(0);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { clearTimeout(timer); videos.forEach(v => v.pause()); }
    else { playHero(heroIndex); }
  });

  // Keep the existing curtain animation; the middle door adds a brief film transition.
  const doorTransition = $('#showDoorTransition');
  const doorTransitionVideo = $('#showDoorTransitionVideo');
  let portalTimer = null, portalFallback = null, portalBusy = false;
  const resetPortalTransition = () => {
    clearTimeout(portalTimer);
    clearTimeout(portalFallback);
    portalBusy = false;
    doorTransition?.classList.remove('is-visible');
    if (doorTransition) doorTransition.hidden = true;
    if (doorTransitionVideo) {
      doorTransitionVideo.pause();
      doorTransitionVideo.onended = null;
      doorTransitionVideo.onplaying = null;
      doorTransitionVideo.onerror = null;
    }
    $$('.portal.opening').forEach(portal => portal.classList.remove('opening'));
  };
  const openPortal = (portal, event) => {
    if (event.button > 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (portalBusy) return;
    portalBusy = true;
    portal.classList.add('opening');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const go = () => { clearTimeout(portalFallback); window.location.href = portal.href; };
    if (!portal.matches('.portal-emerald') || !doorTransitionVideo || reduced) {
      portalTimer = window.setTimeout(go, reduced ? 80 : 1450);
      return;
    }
    // Authorize sound on the actual click, then retain the curtain's 950 ms lead-in.
    // Mobile browsers can reject a first audible play() made only inside a timer.
    let curtainReady = false;
    portalFallback = window.setTimeout(go, 6000);
    $$('video').forEach(video => { if (video !== doorTransitionVideo) video.muted = true; });
    radioAudio?.pause();
    heroSoundEnabled = false;
    updateHeroSoundButton();
    $$('.video-sound-toggle').forEach(updateVideoSoundButton);
    doorTransitionVideo.muted = false;
    doorTransitionVideo.volume = 0;
    doorTransitionVideo.currentTime = 0;
    doorTransitionVideo.onplaying = () => {
      if (!curtainReady) {
        // Prime this media element silently within the user's playback request.
        doorTransitionVideo.pause();
        doorTransitionVideo.currentTime = 0;
        return;
      }
      doorTransitionVideo.volume = 1;
      doorTransition.hidden = false;
      doorTransition.classList.add('is-visible');
    };
    doorTransitionVideo.onended = go;
    doorTransitionVideo.onerror = go;
    doorTransitionVideo.play().catch(go);
    portalTimer = window.setTimeout(() => {
      curtainReady = true;
      doorTransitionVideo.volume = 1;
      if (doorTransitionVideo.paused) doorTransitionVideo.play().catch(go);
    }, 950);
  };
  $$('.portal[href]').forEach(portal => portal.addEventListener('click', event => openPortal(portal, event)));
  // A return from the show must always restore all three closed door covers.
  window.addEventListener('pageshow', resetPortalTransition);

  // Scroll reveals
  const io = new IntersectionObserver(entries => entries.forEach(e => { if(e.isIntersecting){e.target.classList.add('in-view');io.unobserve(e.target);} }), {threshold:.13, rootMargin:'0px 0px -7% 0px'});
  $$('.reveal').forEach(el=>io.observe(el));

  // Lazy video play in visual transmissions
  const vio = new IntersectionObserver(entries => entries.forEach(e => { const v=e.target; if(e.isIntersecting) v.play().catch(()=>{}); else v.pause(); }), {threshold:.28});
  $$('.transmission video').forEach(v=>vio.observe(v));
  const ambientVideoObserver = new IntersectionObserver(entries => entries.forEach(e => {
    const v=e.target;
    if(e.isIntersecting) v.play().catch(()=>{});
    else v.pause();
  }), {threshold:.01,rootMargin:'240px 0px'});
  $$('.ambient-video').forEach(v=>ambientVideoObserver.observe(v));

  // 224 FM player
  const tracks = [
    {title:'ДилеR', src:'assets/audio/candy-dealer.mp3'},
    {title:'Leroy', src:'assets/audio/leroy.mp3'},
    {title:'Нічний Париж', src:'assets/audio/night-paris.mp3'}
  ];
  // Extra previews belong to the expandable homepage list only.
  if ($('#moreTracks')) tracks.push(
    {title:"Принцеса з Іншої Планети", src:'assets/audio/04-pryncesa.MP3'},
    {title:"Траса 224", src:'assets/audio/05-trasa-224.MP3'},
    {title:"Не-Колишній", src:'assets/audio/06-ne-kolyshniy.MP3'},
    {title:"На Площі Сонця", src:'assets/audio/07-na-ploshi-soncia.MP3'},
    {title:"Теракотовий Слон", src:'assets/audio/08-terakotovyi-slon.MP3'},
    {title:"Нічний Експрес", src:'assets/audio/09-nichnyi-ekspres.MP3'},
    {title:"Хто Випустив Собак?", src:'assets/audio/10-hto-vypustyv-sobak.MP3'},
    {title:"500 Років Тисячі Планет", src:'assets/audio/11-500-rokiv-tusiacha-planet.MP3'}
  );
  const moreTracks = $('#moreTracks'), moreTracksToggle = $('#moreTracksToggle');
  const updateMoreTracksLabel = () => {
    if (!moreTracksToggle) return;
    const expanded = moreTracksToggle.getAttribute('aria-expanded') === 'true';
    moreTracksToggle.querySelector('span').textContent = activeLanguage === 'en'
      ? (expanded ? 'Show fewer songs' : 'Listen to more songs')
      : (expanded ? 'Згорнути список' : 'Слухати більше пісень');
    moreTracksToggle.querySelector('i').textContent = expanded ? '↑' : '↓';
  };
  moreTracksToggle?.addEventListener('click', () => {
    const expanded = moreTracksToggle.getAttribute('aria-expanded') !== 'true';
    moreTracks.hidden = !expanded;
    moreTracksToggle.setAttribute('aria-expanded', String(expanded));
    updateMoreTracksLabel();
  });
  const audio=$('#audioPlayer'), playBtn=$('#playButton'), title=$('#trackTitle'), time=$('#trackTime'), prog=$('#trackProgress');
  radioAudio = audio;
  const videoSoundButtons = $$('.video-sound-toggle');
  videoSoundButtons.forEach(button => {
    const video = document.getElementById(button.dataset.soundFor);
    if (!video) return;
    button.addEventListener('click', () => {
      const enable = video.muted;
      if (enable) {
        $$('video').forEach(v => { v.muted = true; });
        heroSoundEnabled = false;
        radioAudio?.pause();
      }
      video.muted = !enable;
      updateHeroSoundButton();
      videoSoundButtons.forEach(updateVideoSoundButton);
      if (enable) video.play().catch(() => { video.muted = true; updateVideoSoundButton(button); });
    });
  });
  audio?.addEventListener('play', () => {
    $$('video').forEach(v => { v.muted = true; });
    heroSoundEnabled = false;
    updateHeroSoundButton();
    videoSoundButtons.forEach(updateVideoSoundButton);
  });
  let trackIndex=0;
  const fmt = s => { if(!isFinite(s)) return '00:00'; const m=Math.floor(s/60), r=Math.floor(s%60); return `${String(m).padStart(2,'0')}:${String(r).padStart(2,'0')}`; };
  const setTrack = (i, autoplay=false) => { trackIndex=(i+tracks.length)%tracks.length; audio.src=tracks[trackIndex].src; title.textContent=tracks[trackIndex].title; $$('.track').forEach((t,j)=>t.classList.toggle('is-active',j===trackIndex)); if(autoplay) audio.play().catch(()=>{}); };
  setTrack(0);
  playBtn?.addEventListener('click',()=> audio.paused ? audio.play().catch(()=>{}) : audio.pause());
  $('#prevTrack')?.addEventListener('click',()=>setTrack(trackIndex-1,true));
  $('#nextTrack')?.addEventListener('click',()=>setTrack(trackIndex+1,true));
  $$('.track').forEach(t=>t.addEventListener('click',()=>setTrack(Number(t.dataset.track),true)));
  audio?.addEventListener('play',()=>{playBtn?.classList.add('is-playing');$('.radio-stage')?.classList.add('is-playing');playBtn?.setAttribute('aria-label',languageCopy[activeLanguage].pause);});
  audio?.addEventListener('pause',()=>{playBtn?.classList.remove('is-playing');$('.radio-stage')?.classList.remove('is-playing');playBtn?.setAttribute('aria-label',languageCopy[activeLanguage].play);});
  audio?.addEventListener('ended',()=>setTrack(trackIndex+1,true));
  audio?.addEventListener('timeupdate',()=>{ const pct=audio.duration?audio.currentTime/audio.duration*100:0; prog?.querySelector('i')?.style.setProperty('width',pct+'%'); prog?.setAttribute('aria-valuenow',String(Math.round(pct))); if(time) time.textContent=fmt(audio.currentTime); });
  prog?.addEventListener('click',e=>{ if(!audio.duration)return; const r=prog.getBoundingClientRect(); audio.currentTime=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width))*audio.duration; });

  // Gallery lightbox
  const lightbox=$('#lightbox'), lbImg=$('#lightboxImage');
  const closeLb=()=>{lightbox?.classList.remove('open');lightbox?.setAttribute('aria-hidden','true');document.body.classList.remove('lightbox-open');};
  $$('.gallery-item').forEach(item=>item.addEventListener('click',()=>{ lbImg.src=item.dataset.full; lbImg.alt=item.querySelector('img')?.alt||'ВІТА'; lightbox.classList.add('open'); lightbox.setAttribute('aria-hidden','false'); document.body.classList.add('lightbox-open'); }));
  $('#lightboxClose')?.addEventListener('click',closeLb); lightbox?.addEventListener('click',e=>{if(e.target===lightbox)closeLb();}); addEventListener('keydown',e=>{if(e.key==='Escape'){closeLb();closeMenu();}});

  $('#year').textContent = new Date().getFullYear();

  const languageCopy = {"uk":{"title":"ВІТА — Співачка Нової Ери | Офіційний сайт","description":"Офіційний сайт ВІТИ — Співачки Нової Ери. Музика, відео, Система Віта, світ ВІТИ та 224 FM.","ogTitle":"ВІТА — Співачка Нової Ери","ogDescription":"Увійдіть до Системи Віта: музика, відео, 224 FM і світ ВІТИ.","languageLabel":"Мова сайту","navHome":"ГОЛОВНА","navMusic":"МУЗИКА","navAbout":"ПРО ВІТУ","navGallery":"ГАЛЕРЕЯ","navContact":"КОНТАКТИ","contactLabel":"КОНТАКТИ / 224 FM","contactHeading":"Для Преси та<br>Радіостанцій","contactCopy":"З питань співпраці пишіть ВІТІ в соціальних мережах.","contactLink":"НАПИСАТИ ВІТІ ↗","menuOpen":"Відкрити меню","menuClose":"Закрити меню","brandAria":"ВІТА — на початок","heroAria":"ВІТА — Співачка Нової Ери","heroProgress":"Сцени головного банера","scenePrefix":"Сцена","eyebrow":"СИСТЕМА ВІТА","heroSubtitle":"Співачка Нової Ери","doorOpen":"Відчинити","doorNoun":"двері","enter":"УВІЙТИ","introHeading":"<span>Співачка</span><span>Нової Ери</span>","introBody":"Воля, Свобода, Простір, Швидкість — ЇЇ ДНК","portalsAria":"Три входи до Системи Віта","portals":[{"title":"Нічна Розмова на Даху з Вітою","subtitle":"","aria":"Відкрити сторінку «Нічна Розмова на Даху з Вітою»"},{"title":"F*CK SHOW","subtitle":"з Фростером, Ро́маном та Вітою","aria":"Відкрити сторінку «F*CK SHOW з Фростером, Ро́маном та Вітою»"},{"title":"Кімнати Віти","subtitle":"","aria":"Відкрити сторінку «Кімнати Віти»"}],"musicCode":"01 / МУЗИКА","musicHeading":"РАДІО ВІТА <em>224 FM</em>","musicBody":"Обери сигнал. Увімкни уривок.","nowPlaying":"ЗАРАЗ ГРАЄ / 224 FM","previous":"Попередній трек","play":"Відтворити","pause":"Пауза","next":"Наступний трек","trackPosition":"Позиція треку","trackAction":"СЛУХАТИ","spotify":"УСЯ МУЗИКА НА SPOTIFY ↗","videoCode":"02 / ВІДЕО","videoHeading":"ВІЗУАЛЬНІ <em>СИГНАЛИ</em>","videoBody":"П’ять сцен Системи Віта. Одна історія.","transmissionPrefix":"СЦЕНА","transmissionTitles":["ЗАНУРЕННЯ","НА ПОРОЗІ","КРІЗЬ ПОРТАЛ","ШВИДКІСТЬ","ПАРИЖ УНОЧІ"],"youtube":"ДИВИТИСЯ ВІДЕО ВІТИ НА YOUTUBE ↗","worldCode":"03 / СВІТ ВІТИ","worldHeading":"СИСТЕМА<br><em>ВІТА</em>","worldBody":"Це не декорація довкола музики, а окремий світ, де звук переходить у кадр, кадр — у моду, а мода — у майбутнє.","worldLink":"УВІЙТИ ДО ВІЗУАЛЬНОГО АРХІВУ ↓","aboutKicker":"ПРО ВІТУ","aboutHeading":"<span class=\"about-artist-name\">ВІТА</span><span class=\"about-artist-tagline\">Співачка Нової Ери</span>","aboutLead":"ВІТА — артистка, чий світ існує на межі музики, кіно та майбутнього.","aboutBody":"Її звучання поєднує інтелектуальний денс-поп, синтвейв і сучасний диско-хаус. Візуальна мова ВІТИ — холодне світло, мокрі поверхні, швидкість, міста після дощу й мода без зайвого блиску.","aboutBody2":"Система Віта поєднує пісні, відео, образи й цифрові історії в один цілісний простір.","aboutMeta":["АРТИСТКА","ЛЕЙБЛ","СИГНАЛ"],"aboutAlt":"ВІТА — Співачка Нової Ери","galleryCode":"ВІЗУАЛЬНИЙ АРХІВ","galleryHeading":"ВІТА — <em>АРТИСТКА</em>","galleryBody":"Фотоархів Системи. Він і далі поповнюватиметься.","galleryLabels":["01 / СИСТЕМА","02 / ПАРИЖ","03 / ОБРАЗ"],"galleryAlts":["ВІТА у футуристичному світі","ВІТА в нічному Парижі","ВІТА у модному образі"],"openPhoto":"Відкрити фото","connect":"СЛІДУЙ ЗА ВІТОЮ","connectKicker":"СОЦІАЛЬНІ МЕРЕЖІ / 224 FM","subscribe":"ПІДПИСАТИСЯ","lightbox":"Перегляд фото","close":"Закрити","introLabel":"ВІТА | 224 FM","introStatement":"ВІТА — ЦЕ МАЙБУТНЄ"},"en":{"title":"VITA — Singer of the New Era | Official Website","description":"Official website of VITA, singer of the new era. Music, video, the Vita System, VITA World, and 224 FM.","ogTitle":"VITA — Singer of the New Era","ogDescription":"Enter the Vita System: music, video, 224 FM, and the world of VITA.","languageLabel":"Select language","navHome":"HOME","navMusic":"MUSIC","navAbout":"ABOUT VITA","navGallery":"GALLERY","navContact":"CONTACT","contactLabel":"CONTACT / 224 FM","contactHeading":"FOR PRESS AND<br>RADIO STATIONS","contactCopy":"For collaboration enquiries, message VITA on social media.","contactLink":"MESSAGE VITA ↗","menuOpen":"Open menu","menuClose":"Close menu","brandAria":"VITA — back to top","heroAria":"VITA — Singer of the New Era","heroProgress":"Hero scenes","scenePrefix":"Scene","eyebrow":"VITA SYSTEM","heroSubtitle":"Singer of the New Era","doorOpen":"Open","doorNoun":"the door","enter":"ENTER","introHeading":"<span>Singer of the</span><span>New Era</span>","introBody":"Will, Freedom, Space, Speed — HER DNA","portalsAria":"Three entrances to the Vita System","portals":[{"title":"Night Conversation on the Rooftop with VITA","subtitle":"","aria":"Open the page “Night Conversation on the Rooftop with VITA”"},{"title":"F*CK SHOW","subtitle":"with Froster, Róman and VITA","aria":"Open the page “F*CK SHOW with Froster, Róman and VITA”"},{"title":"VITA’s Rooms","subtitle":"","aria":"Open the page “VITA’s Rooms”"}],"musicCode":"01 / MUSIC","musicHeading":"VITA RADIO <em>224 FM</em>","musicBody":"Choose a signal. Play a preview.","nowPlaying":"NOW PLAYING / 224 FM","previous":"Previous track","play":"Play","pause":"Pause","next":"Next track","trackPosition":"Track position","trackAction":"PLAY","spotify":"FULL CATALOGUE ON SPOTIFY ↗","videoCode":"02 / VIDEO","videoHeading":"VISUAL <em>TRANSMISSIONS</em>","videoBody":"Five scenes from the Vita System. One story.","transmissionPrefix":"TRANSMISSION","transmissionTitles":["IMMERSION","AT THE THRESHOLD","THROUGH THE PORTAL","IN MOTION","PARIS AT NIGHT"],"youtube":"WATCH VITA VIDEOS ON YOUTUBE ↗","worldCode":"03 / VITA WORLD","worldHeading":"VITA<br><em>SYSTEM</em>","worldBody":"More than a backdrop for music: a world where sound becomes image, image becomes fashion, and fashion becomes the future.","worldLink":"ENTER THE VISUAL ARCHIVE ↓","aboutKicker":"ABOUT / VITA","aboutHeading":"<span class=\"about-artist-name\">VITA</span><span class=\"about-artist-tagline\">Singer of the New Era</span>","aboutLead":"VITA is an artist whose world lives at the crossroads of music, cinema, and the future.","aboutBody":"Her sound blends intellectual dance pop, synth wave, and modern disco house. Her visual language is cool light, wet surfaces, speed, rain-washed cities, and fashion without excess gloss.","aboutBody2":"The Vita System brings songs, videos, style, and digital stories together in one continuous world.","aboutMeta":["ARTIST","LABEL","SIGNAL"],"aboutAlt":"VITA — Singer of the New Era","galleryCode":"VISUAL ARCHIVE","galleryHeading":"VITA — <em>THE ARTIST</em>","galleryBody":"A visual archive of the Vita System, with more to come.","galleryLabels":["01 / SYSTEM","02 / PARIS","03 / EDITORIAL"],"galleryAlts":["VITA in a futuristic world","VITA in Paris at night","VITA in a fashion editorial"],"openPhoto":"Open photo","connect":"FOLLOW VITA","connectKicker":"SOCIAL CHANNELS / 224 FM","subscribe":"SUBSCRIBE","lightbox":"Photo viewer","close":"Close","introLabel":"VITA | 224 FM","introStatement":"VITA — THIS IS THE FUTURE"}};
  let activeLanguage = 'uk';
  const setText = (selector, value) => { const el=$(selector); if(el) el.textContent=value; };
  const setHTML = (selector, value) => { const el=$(selector); if(el) el.innerHTML=value; };
  const setAttr = (selector, name, value) => { const el=$(selector); if(el) el.setAttribute(name,value); };
  const aboutPageLabels={uk:['Досьє на Віту','Інтерв’ю зі Співачкою Нової Ери','Цікаві факти про Віту','Код Віти','Бліц із Вітою','РАДІО ВІТА — 224 FM'],en:['VITA dossier','Interview with the singer of the new era','Interesting facts about VITA','VITA code','Quick-fire with VITA','VITA RADIO — 224 FM']};
  const translatePage = (language) => {
    activeLanguage = language === 'en' ? 'en' : 'uk';
    const t=languageCopy[activeLanguage];
    updateHeroSoundButton();
    updateMoreTracksLabel();
    $$('.video-sound-toggle').forEach(updateVideoSoundButton);
    document.documentElement.lang=activeLanguage;
    document.title=t.title;
    const meta=(selector,value)=>{const el=$(selector);if(el)el.setAttribute('content',value);};
    meta('meta[name="description"]',t.description);
    meta('meta[property="og:title"]',t.ogTitle);
    meta('meta[property="og:description"]',t.ogDescription);
    try { localStorage.setItem('vita-language',activeLanguage); } catch {}
    $$('.language-switch [data-language]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.language===activeLanguage)));
    setAttr('.language-switch','aria-label',t.languageLabel);
    setAttr('.brand','aria-label',t.brandAria);
    setAttr('.desktop-nav','aria-label',activeLanguage==='uk'?'Головна навігація':'Main navigation');
    setAttr('.mobile-menu nav','aria-label',activeLanguage==='uk'?'Мобільна навігація':'Mobile navigation');
    const navLabels={home:t.navHome,music:t.navMusic,about:t.navAbout,gallery:t.navGallery,contact:t.navContact};
    $$('[data-nav]').forEach(link=>{const label=navLabels[link.dataset.nav];if(label)link.textContent=label;});
    const menuOpen=$('#menuToggle')?.getAttribute('aria-expanded')==='true';
    setAttr('#menuToggle','aria-label',menuOpen?t.menuClose:t.menuOpen);
    setAttr('.hero','aria-label',t.heroAria);
    setText('.preloader-title',activeLanguage==='uk'?'СИСТЕМА ВІТА ІНСТАЛЮЄТЬСЯ':'VITA SYSTEM IS INSTALLING');
    setText('.preloader-code',activeLanguage==='uk'?'ЧАСТОТА: 224 FM':'FREQUENCY: 224 FM');
    setText('.preloader-system',activeLanguage==='uk'?'СИСТЕМА ВІТА / 224 FM':'VITA SYSTEM / 224 FM');
    setAttr('.preloader-line','aria-label',activeLanguage==='uk'?'Завантаження сайту':'Website loading');
    setText('.hero-copy .eyebrow',t.eyebrow);
    setText('.hero-sub',t.heroSubtitle);
    setAttr('#heroProgress','aria-label',t.heroProgress);
    $$('.progress-segment').forEach((button,i)=>button.setAttribute('aria-label',t.scenePrefix+' '+(i+1)));
    setText('.scroll-cue span',t.enter);
    setText('.system-intro .kicker',t.introLabel);
    setHTML('.system-intro h2',t.introHeading);
    setHTML('.system-intro .intro-statement',t.introStatement);
    setText('.system-intro>p:last-child',t.introBody);
    setAttr('.portals','aria-label',t.portalsAria);
    document.querySelectorAll('.door-enter').forEach(el=>el.textContent=t.doorOpen+' '+t.doorNoun);
    ['.portal-burgundy','.portal-emerald','.portal-amber'].forEach((selector,i)=>{
      const portal=$(selector);if(!portal)return;
      setText(selector+' .portal-copy h3',t.portals[i].title);
      if (portal.matches('.portal-emerald')) {
        const wordmark = portal.querySelector('.portal-copy h3');
        wordmark.classList.add('portal-show-wordmark');
        wordmark.setAttribute('aria-label', t.portals[i].title);
        wordmark.innerHTML = '<span class="portal-show-serif">F*CK</span> <span class="portal-show-script">SHOW</span>';
      }
      setText(selector+' .portal-copy p',t.portals[i].subtitle);
      portal.setAttribute('aria-label',t.portals[i].aria);
    });
    setText('.music-section .section-heading>span',t.musicCode);
    setHTML('.music-section .section-heading h2',t.musicHeading);
    setText('.music-section .section-heading p',t.musicBody);
    setText('.now-playing small',t.nowPlaying);
    setAttr('#boomboxVideo','aria-label',activeLanguage==='uk'?'Анімований бумбокс Радіо ВІТА 224 FM':'Animated VITA 224 FM boombox');
    setAttr('#systemVideo','aria-label',activeLanguage==='uk'?'Відеосцена Системи Віта':'VITA System video scene');
    setAttr('#prevTrack','aria-label',t.previous);
    setAttr('#nextTrack','aria-label',t.next);
    setAttr('#playButton','aria-label',audio?.paused?t.play:t.pause);
    setAttr('#trackProgress','aria-label',t.trackPosition);
    $$('.track').forEach((track,i)=>{
      const action=track.querySelector('i');if(action)action.textContent=t.trackAction;
      const name=tracks[i]?.title||track.querySelector('b')?.textContent||'';
      track.setAttribute('aria-label',String(i+1).padStart(2,'0')+' '+name+' — '+t.trackAction);
    });
    setText('.music-section .outline-link',t.spotify);
    setText('.video-section .section-heading>span',t.videoCode);
    setHTML('.video-section .section-heading h2',t.videoHeading);
    setText('.video-section .section-heading p',t.videoBody);
    $$('.transmission').forEach((figure,i)=>{
      const code=figure.querySelector('figcaption span');
      const title=figure.querySelector('figcaption b');
      const video=figure.querySelector('video');
      if(code)code.textContent=t.transmissionPrefix+' '+String(i+1).padStart(2,'0');
      if(title)title.textContent=t.transmissionTitles[i];
      if(video)video.setAttribute('aria-label',t.transmissionTitles[i]);
    });
    setText('.video-section .outline-link',t.youtube);
    setText('.world-copy>span',t.worldCode);
    setHTML('.world-copy h2',t.worldHeading);
    setText('.world-copy p',t.worldBody);
    setText('.world-copy a',t.worldLink);
    setText('.about-copy .kicker',t.aboutKicker);
    setHTML('.about-copy h2',t.aboutHeading);
    setText('.about-copy .lead',t.aboutLead);
    const aboutParagraphs=$$('.about-copy>p:not(.lead)');
    if(aboutParagraphs[0])aboutParagraphs[0].textContent=t.aboutBody;
    if(aboutParagraphs[1])aboutParagraphs[1].textContent=t.aboutBody2;
    $$('.about-meta small').forEach((item,i)=>item.textContent=t.aboutMeta[i]||'');
    setAttr('.about-image img','alt',t.aboutAlt);
    setText('.gallery-section .section-heading>span',t.galleryCode);
    setHTML('.gallery-section .section-heading h2',t.galleryHeading);
    setText('.gallery-section .section-heading p',t.galleryBody);
    $$('.gallery-item').forEach((item,i)=>{
      const label=item.querySelector('span'),image=item.querySelector('img');
      if(label)label.textContent=t.galleryLabels[i];
      if(image)image.alt=t.galleryAlts[i];
      item.setAttribute('aria-label',t.openPhoto+' '+(i+1));
    });
    setText('.connect-heading>span',t.connectKicker);
    setText('.connect-heading h2',t.connect);
    setText('[data-subscribe-label]',t.subscribe);
    setAttr('.social-links','aria-label',activeLanguage==='uk'?'Соціальні мережі ВІТИ':'VITA social media');
    setText('[data-contact-label]',t.contactLabel);
    setHTML('[data-contact-heading]',t.contactHeading);
    setText('[data-contact-copy]',t.contactCopy);
    setText('[data-contact-link]',t.contactLink);
    setAttr('#lightbox','aria-label',t.lightbox);
    setAttr('#lightboxClose','aria-label',t.close);
    document.querySelectorAll('.about-page-link').forEach((link,i)=>{
      const label=aboutPageLabels[activeLanguage][i];
      const title=link.querySelector('b');if(title&&label)title.textContent=label;
      const route=activeLanguage==='en'?link.dataset.enHref:link.dataset.ukHref;
      if(route)link.href=route+'?lang='+activeLanguage;
    });

  };
  $$('.language-switch [data-language]').forEach(button=>button.addEventListener('click',()=>translatePage(button.dataset.language)));
  let savedLanguage='uk';
  try { savedLanguage=localStorage.getItem('vita-language')||'uk'; } catch {}
  const queryLanguage=new URLSearchParams(location.search).get('lang');
  translatePage(queryLanguage==='en'?'en':(queryLanguage==='uk'?'uk':savedLanguage));

})();
