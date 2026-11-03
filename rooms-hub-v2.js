(()=>{
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
if(reduced.matches||!('IntersectionObserver' in window))return;
const els=document.querySelectorAll('.fade-in');
const io=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}},{rootMargin:'0px 0px 30px 0px',threshold:.04});
els.forEach(e=>io.observe(e));document.documentElement.classList.add('js-motion');
})();
