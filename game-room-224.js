(() => {
  'use strict';
  const dictionary = {"ДОВЖИНА": "LENGTH", "24,4 км": "24.4 km", "ПОВОРОТИ": "TURNS", "ВИСОТА": "ELEVATION", "+760 м": "+760 m", "ЛОКАЦІЯ": "LOCATION", "Сицилія": "Sicily", "Ігрова Кімната 224 — VITA / Prototype": "Game Room 224 — VITA", "Віта за кермом гоночного симулятора": "VITA at the wheel of a racing simulator", "До кімнат Віти": "Back to VITA’s Rooms", "Навігація кімнатою": "Room navigation", "Українська": "Ukrainian", "Англійська": "English", "Відкрити меню": "Open menu", "Мобільне меню": "Mobile menu", "← Кімнати Віти": "← VITA’s Rooms", "На головну ↗": "Home ↗", "Траса 224": "Track 224", "Саундтрек": "Soundtrack", "Відео": "Video", "Галерея": "Gallery", "04 / КІМНАТИ ВІТИ · NIGHT RACING SYSTEM": "04 / VITA’S ROOMS · NIGHT RACING SYSTEM", "ІГРОВА": "GAME", "КІМНАТА": "ROOM", "Не просто гра. Нічний гоночний модуль ВІТИ: карбон, телеметрія, шини, шолом, педалі, дим, три екрани й одна команда — тиснути далі.": "More than a game. VITA’s night racing system: carbon, telemetry, tires, helmet, pedals, smoke, three screens and one command — keep pushing.", "ВХІД У РЕЖИМ 224": "ENTER MODE 224", "Нічна Сицилія в тумані": "Nighttime Sicily in the mist", "СИЦИЛІЯ": "SICILY", "Місто на пагорбі.": "A city on the hill.", "Море в тумані.": "The sea in the mist.", "Де народжується Траса 224.": "Where Track 224 begins.", "Вхід у": "Enter", "режим 224": "mode 224", "Ігрова кімната Віти з трьома екранами та симулятором": "VITA’s game room with three screens and a simulator", "Кермо симулятора 224": "Simulator steering wheel 224", "Кермо": "Steering Wheel", "Карбон, force feedback і точність кожного руху. Усе починається з керма.": "Carbon, force feedback and precision in every movement. It all starts at the wheel.", "Гоночний шолом 224": "Racing helmet 224", "Шолом": "Helmet", "Чорний хром, червоне світло й особистий код 224. Готовність до старту.": "Black chrome, red light and a personal code: 224. Ready for the start.", "Педалі гоночного симулятора": "Racing simulator pedals", "Педалі": "Pedals", "Газ / гальмо / зчеплення. Три педалі — один ритм. Відчувати трасу до останнього повороту.": "Throttle / brake / clutch. Three pedals, one rhythm. Feel the track through the very last turn.", "ШИНА": "THE TIRE", "НЕ СТОЇТЬ.": "KEEPS SPINNING.", "Червона лінія відбивається в карбоні. Дим проходить по підлозі. Швидкість починається ще до старту.": "A red line reflects in the carbon. Smoke drifts across the floor. Speed begins before the start.", "Нічна Сицилія — атмосфера Траси 224": "Nighttime Sicily — the atmosphere of Track 224", "ТРАСА": "TRACK", "Гра закінчується на моніторі — але швидкість ні. Тут цифровий cockpit стикається з реальною нічною Сицилією: серпантини, океан, гори, міста в тумані й світло, яке ріже темряву.": "The game ends at the screen — speed does not. Here, the digital cockpit meets nighttime Sicily: winding roads, the ocean, mountains, cities in the mist and light cutting through the darkness.", "«Ми —": "“We are", "спалахи світла": "flashes of light", "у темному вирі.»": "in a dark swirl.”", "Траса 224 / The Ultimate Race": "Track 224 / The Ultimate Race", "Слухати Трасу 224": "Play Track 224", "СЛУХАТИ ТРЕК": "PLAY TRACK", "ПАУЗА": "PAUSE", "Траса 224 — аудіоплеєр": "Track 224 — audio player", "«Тисни на газ! Давай!": "“Hit the gas! Come on!", "Не гальмуй — гони швидше!»": "Don’t slow down — go faster!”", "«Тут немає правил,": "“There are no rules here,", "немає ліміту.»": "no limits.”", "«Траса двісті двадцять чотири!": "“Track two hundred twenty-four!", "Ми — спалахи світла у темному вирі!»": "We are flashes of light in a dark swirl!”", "«Турбіни злітають…": "“The turbines soar…", "Час застигає…": "Time stands still…", "3… 2… 1…»": "3… 2… 1…”", "ВІТА /": "VITA /", "ВІДЕО З КІМНАТИ 224 · НЕЗАБАРОМ": "VIDEO FROM ROOM 224 · COMING SOON", "Колесо в червоному світлі": "A wheel in red light", "СВІТ": "WORLD", "КІМНАТА / ТЕХНІКА / НІЧНА ТРАСА": "ROOM / HARDWARE / NIGHT TRACK", "Симулятор Віти": "VITA’s Simulator", "Вхід у режим 224": "Enter Mode 224", "Атрибутика 224": "Gear 224", "Деталі та технології": "Details and Technology", "Ховербайки": "Hoverbikes", "Нічна траса": "Night Track", "Перегляд фото": "Photo viewer", "Закрити фото": "Close photo", "РЕЖИМ 224 УВІМКНЕНО": "MODE 224 ACTIVATED", "Не вдалося відтворити трек. Спробуй аудіоплеєр.": "Could not play the track. Try the audio player."};
  const controls = [...document.querySelectorAll('[data-language]')];
  const audio = document.getElementById('race-audio');
  const audioButton = document.querySelector('.audio-toggle');
  const audioLabel = document.querySelector('.audio-label');
  const menu = document.getElementById('mobile-menu');
  const menuButton = document.querySelector('.menu-toggle');
  const viewer = document.getElementById('photo-viewer');
  const photo = viewer.querySelector('img');
  const caption = viewer.querySelector('p');
  const message = document.querySelector('.race-message');
  const start = document.getElementById('race-start');
  const countdown = document.querySelector('.count');
  const originals = new WeakMap();
  let selectedPhoto = null, sequence = 0;
  const language = () => document.documentElement.lang === 'en' ? 'en' : 'uk';
  const translate = value => language() === 'en' ? (dictionary[value] || value) : value;

  function syncAudio() {
    const playing = !audio.paused;
    document.querySelector('.sound-console').classList.toggle('playing', playing);
    audioButton.setAttribute('aria-pressed', String(playing));
    audioButton.firstElementChild.textContent = playing ? 'Ⅱ' : '▶';
    audioLabel.textContent = translate(playing ? 'ПАУЗА' : 'СЛУХАТИ ТРЕК');
  }
  function localize() {
    const lang = language();
    const description = document.querySelector('meta[name="description"]');
    if (description) description.content = lang === 'en'
      ? 'Game Room 224 — VITA’s night racing world. The simulator, Track 224, Sicily and the soundtrack.'
      : 'Ігрова Кімната 224 — нічний гоночний світ Віти. Симулятор, Траса 224, Сицилія та саундтрек.';
    document.querySelectorAll('[data-uk][data-en]').forEach(el => {
      if (el.closest('.audio-label')) return;
      const value = el.dataset[lang];
      if (el.textContent !== value) el.textContent = value;
    });
    document.querySelectorAll('[aria-label],[alt]').forEach(el => {
      let values = originals.get(el);
      if (!values) {
        values = {};
        ['aria-label','alt'].forEach(name => {
          const value = el.getAttribute(name);
          if (value && dictionary[value]) values[name] = value;
        });
        originals.set(el, values);
      }
      Object.entries(values).forEach(([name,value]) => el.setAttribute(name, translate(value)));
    });
    controls.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.language === lang)));
    if (selectedPhoto) {
      photo.alt = translate(selectedPhoto);
      caption.textContent = translate(selectedPhoto);
    }
    if (document.body.classList.contains('race-active')) message.textContent = translate('РЕЖИМ 224 УВІМКНЕНО');
    syncAudio();
  }
  // Capture authored attribute values before the common locale observer updates them.
  document.querySelectorAll('[aria-label],[alt]').forEach(el => {
    const values={};
    ['aria-label','alt'].forEach(name => {
      const value=el.getAttribute(name);
      if (dictionary[value]) values[name]=value;
      else {const pair=Object.entries(dictionary).find(([,en])=>en===value);if(pair) values[name]=pair[0];}
    });
    originals.set(el,values);
  });
  new MutationObserver(localize).observe(document.documentElement, {attributes:true,attributeFilter:['lang']});
  controls.forEach(button => button.addEventListener('click', () => queueMicrotask(localize)));
  addEventListener('pageshow', () => queueMicrotask(localize));
  localize();

  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menu.hidden = !open;
    menuButton.setAttribute('aria-expanded', String(open));
  });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    menu.hidden=true;menuButton.setAttribute('aria-expanded','false');
  }));
  document.addEventListener('keydown', e => {
    if (e.key==='Escape') {menu.hidden=true;menuButton.setAttribute('aria-expanded','false');}
  });
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) {e.target.classList.add('on');io.unobserve(e.target);}
  }),{threshold:.12});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

  audioButton.addEventListener('click', async () => {
    if (audio.paused) {
      try {await audio.play();}
      catch {audioButton.setAttribute('title',translate('Не вдалося відтворити трек. Спробуй аудіоплеєр.'));}
    } else audio.pause();
  });
  ['play','pause','ended'].forEach(event => audio.addEventListener(event,syncAudio));

  document.querySelectorAll('[data-photo]').forEach(button => {
    button.addEventListener('click', () => {
      selectedPhoto = button.querySelector('img').getAttribute('alt');
      const pair=Object.entries(dictionary).find(([,en])=>en===selectedPhoto);
      if(pair) selectedPhoto=pair[0];
      photo.src=button.dataset.photo;
      photo.alt=translate(selectedPhoto);caption.textContent=translate(selectedPhoto);
      viewer.showModal();
    });
  });
  viewer.querySelector('.viewer-close').addEventListener('click',()=>viewer.close());
  viewer.addEventListener('click',e=>{if(e.target===viewer){const r=viewer.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)viewer.close();}});

  start.addEventListener('click', () => {
    if (start.disabled) return;
    const current = ++sequence;
    start.disabled=true;message.textContent='';
    document.body.classList.remove('race-active');
    const steps=['3','2','1','GO / 224'];
    steps.forEach((value,index)=>setTimeout(()=>{
      if(current!==sequence)return;
      countdown.textContent=value;
      if(index===steps.length-1){
        document.body.classList.add('race-active');
        message.textContent=translate('РЕЖИМ 224 УВІМКНЕНО');
        start.disabled=false;
      }
    },index*850));
  });
})();
