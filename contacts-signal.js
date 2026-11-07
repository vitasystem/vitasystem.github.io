(()=>{
 const page=document.querySelector('.ct-page');if(!page)return;
 const root=document.documentElement;
 function translate(){
  const en=root.lang==='en';
  page.querySelectorAll('[data-c-uk]').forEach(e=>{const value=en?e.dataset.cEn:e.dataset.cUk;if(e.textContent!==value)e.textContent=value;});
  page.querySelectorAll('[data-c-alt-uk]').forEach(e=>{const value=en?e.dataset.cAltEn:e.dataset.cAltUk;if(e.alt!==value)e.alt=value;});
  const meta=document.querySelector('meta[name="description"]');
  const description=en?'Official VITA contacts: Spotify, Instagram, YouTube, Facebook and TikTok. Get in touch for press, radio and collaborations.':'Офіційні контакти ВІТИ: Spotify, Instagram, YouTube, Facebook і TikTok. Зв’язок для преси, радіостанцій та співпраці.';
  if(meta&&meta.content!==description)meta.content=description;
 }
 new MutationObserver(translate).observe(root,{attributes:true,attributeFilter:['lang']});translate();
 const hero=page.querySelector('.ct-hero');let onscreen=true;
 function motion(){page.classList.toggle('ct-motion-still',!onscreen||document.hidden);}
 if('IntersectionObserver' in window)new IntersectionObserver(entries=>{onscreen=entries[0].isIntersecting;motion();}).observe(hero);
 document.addEventListener('visibilitychange',motion);motion();
})();
