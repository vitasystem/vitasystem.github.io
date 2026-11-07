(()=>{
 const root=document.documentElement;
 const archive=document.querySelector('.v-chronicle');if(!archive)return;
 const quotes=[{"tag": ["ПОЧАТОК", "BEGINNING"], "uk": "Я — ВІТА. І це тільки початок моєї історії, яку вже неможливо стерти з пам’яті.", "en": "I am VITA. And this is only the beginning of a story that can no longer be erased from memory.", "source": ["ІЗ ЗАПИСОК / ТОЧКА НЕПОВЕРНЕННЯ", "FROM HER NOTES / THE POINT OF NO RETURN"]}, {"tag": ["СВОБОДА", "FREEDOM"], "uk": "Свобода — це я.", "en": "Freedom is me.", "source": ["КОД ВІТИ / 06", "VITA’S CODE / 06"]}, {"tag": ["МУЗИКА", "MUSIC"], "uk": "Я артистка. Я не повинна вимірювати себе алгоритмом.", "en": "I am an artist. I should not measure myself by an algorithm.", "source": ["ІЗ ІНТЕРВ’Ю ВІТИ", "FROM VITA’S INTERVIEW"]}, {"tag": ["ЮПІТЕР", "JUPITER"], "uk": "Наступна зупинка — планета Юпітер. Я б зійшла.", "en": "Next stop — planet Jupiter. I’d get off.", "source": ["ІЗ ЗАПИСОК / ПЛАНЕТА ЮПІТЕР", "FROM HER NOTES / PLANET JUPITER"]}, {"tag": ["МАЙБУТНЄ", "THE FUTURE"], "uk": "Майбутнє — це я.", "en": "The future is me.", "source": ["КОД ВІТИ / 09", "VITA’S CODE / 09"]}];let voiceIndex=0;
 const tabs=[...archive.querySelectorAll('[data-note]')];
 const panels=[...archive.querySelectorAll('.ch-note-panel')];
 function chooseNote(index,focus=false){tabs.forEach((button,i)=>{button.setAttribute('aria-selected',String(i===index));button.tabIndex=i===index?0:-1;panels[i].hidden=i!==index;});if(focus)tabs[index].focus();}
 tabs.forEach((button,i)=>{button.addEventListener('click',()=>chooseNote(i));button.addEventListener('keydown',event=>{let next=i;if(event.key==='ArrowDown'||event.key==='ArrowRight')next=(i+1)%tabs.length;else if(event.key==='ArrowUp'||event.key==='ArrowLeft')next=(i+tabs.length-1)%tabs.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=tabs.length-1;else return;event.preventDefault();chooseNote(next,true);});});
 const voiceButtons=[...archive.querySelectorAll('[data-voice]')];
 function renderVoice(){const en=root.lang==='en';const q=quotes[voiceIndex];archive.querySelector('#ch-current-quote').textContent=en?q.en:q.uk;archive.querySelector('#ch-voice-source').textContent=q.source[en?1:0];voiceButtons.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===voiceIndex)));}
 voiceButtons.forEach((button,i)=>button.addEventListener('click',()=>{voiceIndex=i;renderVoice();}));
 const silhouette=archive.querySelector('.ch-orbit-photo');const reveal=silhouette.querySelector('button');reveal.addEventListener('click',()=>{const lit=silhouette.classList.toggle('is-lit');reveal.setAttribute('aria-pressed',String(lit));});
 function translate(){const en=root.lang==='en';archive.querySelectorAll('[data-a-uk]').forEach(e=>{const text=en?e.dataset.aEn:e.dataset.aUk;if(e.textContent!==text)e.textContent=text;});archive.querySelectorAll('[data-a-label-uk]').forEach(e=>e.setAttribute('aria-label',en?e.dataset.aLabelEn:e.dataset.aLabelUk));archive.querySelectorAll('[data-a-alt-uk]').forEach(e=>e.alt=en?e.dataset.aAltEn:e.dataset.aAltUk);renderVoice();archive.querySelectorAll('a[href]').forEach(a=>{const raw=a.getAttribute('href');if(!raw||raw.startsWith('#'))return;try{const url=new URL(raw,location.href);if(url.origin!==location.origin)return;url.searchParams.set('lang',en?'en':'uk');a.href=url.href;}catch{}});}
 new MutationObserver(translate).observe(root,{attributes:true,attributeFilter:['lang']});translate();
})();

(()=>{const archive=document.querySelector('.v-chronicle');if(!archive)return;
const rail=archive.querySelector('.ch-filmstrip'),dialog=archive.querySelector('.ch-lightbox'),photo=dialog.querySelector('.ch-lightbox-image'),count=dialog.querySelector('.ch-lightbox-count');
const frames=[...archive.querySelectorAll('[data-frame]')];let current=0,oldOverflow='';
function render(){const source=frames[current].querySelector('img');photo.src=source.src;photo.alt=source.alt;count.textContent=String(current+1).padStart(2,'0')+' / '+frames.length;}
frames.forEach((button,i)=>button.addEventListener('click',()=>{current=i;render();oldOverflow=document.documentElement.style.overflow;dialog.showModal();document.documentElement.style.overflow='hidden';}));
dialog.querySelector('[data-photo-close]').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>document.documentElement.style.overflow=oldOverflow);
function step(n){current=(current+n+frames.length)%frames.length;render();}
dialog.querySelectorAll('[data-photo-step]').forEach(b=>b.addEventListener('click',()=>step(Number(b.dataset.photoStep))));
dialog.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();step(e.key==='ArrowRight'?1:-1);}});
dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
archive.querySelectorAll('[data-film-step]').forEach(b=>b.addEventListener('click',()=>rail.scrollBy({left:Number(b.dataset.filmStep)*rail.clientWidth*.82,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'})));
new MutationObserver(()=>{if(dialog.open)render();}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
})();
