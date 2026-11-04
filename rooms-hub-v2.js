(()=>{
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
if(reduced.matches||!('IntersectionObserver' in window))return;
const els=document.querySelectorAll('.fade-in');
const io=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}},{rootMargin:'0px 0px 30px 0px',threshold:.04});
els.forEach(e=>io.observe(e));document.documentElement.classList.add('js-motion');
})();


(()=>{
 const lane=document.getElementById('portal-flight');if(!lane)return;
 // Match the homepage: canvas preserves dark source pixels in mobile browser night mode.
 function emblem(src){
  const canvas=document.createElement('canvas');canvas.setAttribute('aria-hidden','true');
  const image=new Image();
  image.onload=()=>{canvas.width=image.naturalWidth;canvas.height=image.naturalHeight;const ctx=canvas.getContext('2d');if(ctx)ctx.drawImage(image,0,0);};
  image.src=src;return canvas;
 }
 document.querySelectorAll('.flight-seal img').forEach(image=>{
  const draw=()=>{if(image.isConnected&&image.naturalWidth)image.replaceWith(emblem(image.getAttribute('src')));};
  if(image.complete&&image.naturalWidth)draw();else image.addEventListener('load',draw,{once:true});
 });
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 let played=false,requested=false,finished=false;
 const enter=document.querySelector('.hero-scroll');
 const go=()=>document.getElementById('rooms')?.scrollIntoView({behavior:reduce.matches?'auto':'smooth',block:'start'});
 enter?.addEventListener('click',e=>{requested=true;if(played){e.preventDefault();if(finished)go();}});
 async function play(){
  if(played)return;played=true;
  if(reduce.matches||!Element.prototype.animate){finished=true;if(requested)go();return;}
  const layer=document.createElement('div');layer.className='symbol-burst';layer.setAttribute('aria-hidden','true');document.body.append(layer);
  const assets=['assets/img/portal-atom.webp','assets/img/portal-elephant.webp'];
  const center=assets.map(src=>{const img=emblem(src);layer.append(img);return img;});
  const cleanup=()=>layer.remove();const failsafe=setTimeout(cleanup,6000);
  try{
   await Promise.all(center.map((img,i)=>img.animate([
    {transform:`translate(calc(-50% + ${i?90:-90}px), -50%) scale(.08) rotate(${i?-25:25}deg)`,opacity:0},
    {offset:.5,transform:`translate(calc(-50% + ${i?90:-90}px), -50%) scale(.95) rotate(0deg)`,opacity:1},
    {transform:`translate(calc(-50% + ${i?90:-90}px), -50%) scale(2.1) rotate(${i?12:-12}deg)`,opacity:0}
   ],{duration:1450,easing:'cubic-bezier(.18,.7,.2,1)',fill:'forwards'}).finished));
   center.forEach(img=>img.remove());
   await Promise.all(Array.from({length:20},(_,i)=>{
    const img=emblem(assets[i%2]);layer.append(img);
    const angle=i*Math.PI*2/20,dist=Math.hypot(innerWidth,innerHeight)*(.38+(i%3)*.13);
    return img.animate([
     {transform:'translate(-50%,-50%) scale(.5)',opacity:.9},
     {transform:`translate(calc(-50% + ${Math.cos(angle)*dist}px),calc(-50% + ${Math.sin(angle)*dist}px)) scale(${.12+(i%4)*.12}) rotate(${i%2?140:-140}deg)`,opacity:0}
    ],{duration:1600+(i%4)*100,easing:'cubic-bezier(.1,.65,.2,1)',fill:'forwards'}).finished;
   }));
  }catch{}finally{clearTimeout(failsafe);cleanup();finished=true;if(requested)go();}
 }
 if('IntersectionObserver' in window){const io=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){io.disconnect();play();}},{threshold:.45});io.observe(lane);}
 else enter?.addEventListener('click',play,{once:true});
})();
