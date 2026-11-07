/* Complete-image reveal with a bounded decode wait on mobile browsers. */
(() => {
  const root=document.documentElement, selector='img[data-gallery-image]';
  const pending=new WeakMap();
  root.classList.add('gallery-image-guard');
  const isTarget=image=>image&&image.matches&&image.matches(selector);
  function reveal(image,source){
    requestAnimationFrame(()=>{
      if((image.currentSrc||image.src)!==source){prepare(image);return;}
      image.classList.add('gallery-image-ready');
    });
  }
  function prepare(image){
    if(!isTarget(image)||!image.complete) return;
    const source=image.currentSrc||image.src;
    if(!image.naturalWidth){image.classList.add('gallery-image-ready');return;}
    if(pending.get(image)===source) return;
    pending.set(image,source);
    let decoding;
    try{decoding=typeof image.decode==='function'?image.decode():Promise.resolve();}
    catch{decoding=Promise.resolve();}
    // A loaded image must not stay hidden if a browser leaves decode() pending.
    let settled=false;
    const finish=()=>{
      if(settled) return;
      settled=true;
      clearTimeout(timer);
      if(image.complete&&image.naturalWidth) reveal(image,source);
    };
    const timer=setTimeout(finish,700);
    Promise.resolve(decoding).then(finish,finish);
  }
  document.addEventListener('load',event=>prepare(event.target),true);
  document.addEventListener('error',event=>{
    if(isTarget(event.target)) event.target.classList.add('gallery-image-ready');
  },true);
  function init(){document.querySelectorAll(selector).forEach(prepare);}
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
  window.addEventListener('pageshow',init);
})();
