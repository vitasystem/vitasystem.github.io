(() => {
  'use strict';
  const body=document.body;
  const language=()=>document.documentElement.lang==='en'?'en':'uk';
  const say=(uk,en)=>language()==='en'?en:uk;
  const photos=JSON.parse(document.getElementById('pt-photo-data').textContent);
  const findPhoto=id=>photos.find(p=>p.id===Number(id));
  const order=[11,12,6,9,8,0,3,13,4,1,2,5,7,15];
  const slides=[12,11,6,9];
  let slide=0,viewed=null,dense=false,gateOpen=false;
  const menu=document.getElementById('pt-menu'),menuButton=document.querySelector('.pt-menu-toggle');
  const fogButton=document.querySelector('[data-pt-fog-toggle]'),fogStatus=document.querySelector('.pt-fog-status');
  const gateButton=document.querySelector('[data-pt-gate-toggle]'),garden=document.querySelector('.pt-garden-stage');
  const audio=document.querySelector('.pt-audio-panel audio'),play=document.querySelector('[data-pt-play]'),audioPanel=document.querySelector('.pt-audio-panel');
  const viewer=document.querySelector('.pt-viewer'),viewerPhoto=viewer.querySelector('img'),viewerCaption=viewer.querySelector('p');

  function syncFog(){
    body.classList.toggle('pt-fog-thick',dense);
    fogButton.setAttribute('aria-pressed',String(dense));
    fogButton.firstElementChild.textContent=dense?say('Трохи прояснити','Clear things up a little'):say('Напустити туману','Let the fog roll in');
    fogStatus.textContent=dense?say('Видимість: загадкова.','Visibility: mysterious.'):'';
  }
  function syncGate(){
    garden.classList.toggle('pt-gate-open',gateOpen);
    gateButton.setAttribute('aria-pressed',String(gateOpen));
    gateButton.firstElementChild.textContent=gateOpen?say('Закрити фіртку','Close the garden gate'):say('Хто випустив собак?','Who let the dogs out?');
    document.querySelector('[data-pt-garden-state]').textContent=gateOpen?say('Фіртка відкрита. Хаос на городі.','The gate is open. Chaos in the garden.'):say('Фіртку ще можна зачинити.','There’s still time to close the gate.');
    document.querySelector('[data-pt-gate-status]').textContent=gateOpen?say('Woof-woof. Питань стало більше.','Woof-woof. Now there are even more questions.'):say('Натисни. Ро́ман теж хоче знати.','Go on. Róman wants to know too.');
  }
  function syncSlide(){
    const p=findPhoto(slides[slide]),image=document.querySelector('.pt-current-conversation');
    if(!image.src.endsWith(p.src))image.src=p.src;
    image.alt=language()==='en'?p.en:p.uk;
    image.width=p.width;image.height=p.height;
    document.querySelector('[data-pt-conversation-photo]').dataset.ptPhoto=String(p.id);
    document.querySelector('[data-pt-slide-count]').textContent=`${String(slide+1).padStart(2,'0')} / 04`;
  }
  function syncAudio(){
    const playing=!audio.paused;
    play.setAttribute('aria-pressed',String(playing));
    play.querySelector('.pt-play-icon').textContent=playing?'Ⅱ':'▶';
    document.querySelector('[data-pt-audio-label]').textContent=playing?say('Пауза','Pause'):say('Слухати трек','Play the track');
  }
  function syncViewer(){
    if(viewed===null)return;
    const p=findPhoto(viewed);viewerPhoto.src=p.src;viewerPhoto.alt=language()==='en'?p.en:p.uk;
    viewerCaption.textContent=`${String(order.indexOf(viewed)+1).padStart(2,'0')} / ${order.length} — ${language()==='en'?p.en:p.uk}`;
  }
  function localize(){
    const en=language()==='en';
    document.querySelectorAll('[data-pt-uk][data-pt-en]').forEach(el=>{const text=el.dataset[en?'ptEn':'ptUk'];if(el.textContent!==text)el.textContent=text;});
    document.querySelectorAll('[data-pt-aria-uk]').forEach(el=>el.setAttribute('aria-label',el.dataset[en?'ptAriaEn':'ptAriaUk']));
    document.querySelectorAll('[data-pt-alt-uk]').forEach(el=>el.alt=el.dataset[en?'ptAltEn':'ptAltUk']);
    document.querySelectorAll('[data-language]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.language===language())));
    document.querySelector('meta[name="description"]').content=en?'Fog, a field and a purple tractor. VITA and Róman’s night conversation continues. Who actually let the dogs out?':'Туман, поле та фіолетовий трактор. Нічна розмова Віти й Ро́мана триває. Хто ж усе-таки випустив собак?';
    menuButton.setAttribute('aria-label',menu.hidden?say('Відкрити меню','Open menu'):say('Закрити меню','Close menu'));
    syncFog();syncGate();syncSlide();syncAudio();syncViewer();
  }
  new MutationObserver(localize).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  document.querySelectorAll('[data-language]').forEach(el=>el.addEventListener('click',()=>queueMicrotask(localize)));
  addEventListener('pageshow',()=>queueMicrotask(localize));
  menuButton.addEventListener('click',()=>{menu.hidden=!menu.hidden;menuButton.setAttribute('aria-expanded',String(!menu.hidden));localize();});
  function closeMenu(){menu.hidden=true;menuButton.setAttribute('aria-expanded','false');localize();}
  menu.querySelectorAll('a').forEach(el=>el.addEventListener('click',closeMenu));
  fogButton.addEventListener('click',()=>{dense=!dense;syncFog();});
  gateButton.addEventListener('click',()=>{gateOpen=!gateOpen;syncGate();});
  document.querySelector('[data-pt-slide-prev]').addEventListener('click',()=>{slide=(slide+slides.length-1)%slides.length;syncSlide();});
  document.querySelector('[data-pt-slide-next]').addEventListener('click',()=>{slide=(slide+1)%slides.length;syncSlide();});
  document.querySelectorAll('[data-pt-photo]').forEach(button=>button.addEventListener('click',()=>{
    viewed=Number(button.dataset.ptPhoto);syncViewer();viewer.showModal();
  }));
  viewer.querySelector('.pt-viewer-close').addEventListener('click',()=>viewer.close());
  const nextPhoto=direction=>{viewed=order[(order.indexOf(viewed)+direction+order.length)%order.length];syncViewer();};
  document.querySelector('[data-pt-view-prev]').addEventListener('click',()=>nextPhoto(-1));
  document.querySelector('[data-pt-view-next]').addEventListener('click',()=>nextPhoto(1));
  viewer.addEventListener('click',e=>{if(e.target===viewer){const r=viewer.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)viewer.close();}});
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape')closeMenu();
    if(viewer.open&&e.key==='ArrowRight'){e.preventDefault();nextPhoto(1);}
    if(viewer.open&&e.key==='ArrowLeft'){e.preventDefault();nextPhoto(-1);}
  });
  let touchX=null;
  viewerPhoto.addEventListener('touchstart',e=>{touchX=e.changedTouches[0].clientX;},{passive:true});
  viewerPhoto.addEventListener('touchend',e=>{if(touchX===null)return;const delta=e.changedTouches[0].clientX-touchX;if(Math.abs(delta)>55)nextPhoto(delta<0?1:-1);touchX=null;},{passive:true});
  document.querySelector('[data-pt-more]').addEventListener('click',e=>{
    document.querySelectorAll('.pt-gallery-grid .pt-shot[hidden]').forEach(el=>el.hidden=false);
    e.currentTarget.hidden=true;
  });
  play.addEventListener('click',async()=>{
    audioPanel.hidden=false;document.querySelector('[data-pt-audio-error]').hidden=true;
    if(audio.paused){try{await audio.play();}catch{document.querySelector('[data-pt-audio-error]').hidden=false;}}
    else audio.pause();
  });
  ['play','pause','ended'].forEach(event=>audio.addEventListener(event,syncAudio));
  audio.addEventListener('error',()=>{document.querySelector('[data-pt-audio-error]').hidden=false;});

  const scenes=[...document.querySelectorAll('.pt-fog-scene,.pt-tape')];
  const visible=new Set();
  const sceneObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting)visible.add(entry.target);else visible.delete(entry.target);
    entry.target.classList.toggle('pt-inview',entry.isIntersecting&&!document.hidden);
  }),{rootMargin:'80px'});
  scenes.forEach(el=>sceneObserver.observe(el));
  document.addEventListener('visibilitychange',()=>scenes.forEach(el=>el.classList.toggle('pt-inview',visible.has(el)&&!document.hidden)));
  const reveal=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add('pt-seen');reveal.unobserve(entry.target);}
  }),{threshold:.1});
  document.querySelectorAll('.pt-reveal').forEach(el=>reveal.observe(el));
  localize();body.classList.add('pt-enhanced');
})();
