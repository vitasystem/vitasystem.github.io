(() => {
  const items=[...document.querySelectorAll('[data-concert-lightbox]')];
  const lightbox=document.querySelector('.concert-lightbox');
  if(!items.length||!lightbox) return;

  const image=lightbox.querySelector('img');
  const closeBtn=lightbox.querySelector('.concert-lightbox-close');
  const prevBtn=lightbox.querySelector('.concert-lightbox-prev');
  const nextBtn=lightbox.querySelector('.concert-lightbox-next');
  const count=lightbox.querySelector('.concert-lightbox-count');
  let index=0;
  let returnFocus=null;

  const lang=()=>document.documentElement.lang==='en'?'en':'uk';

  function syncAlt(item){
    const img=item.querySelector('img');
    if(!img) return '';
    const next=lang()==='en'?img.dataset.altEn:img.dataset.altUk;
    if(next) img.alt=next;
    return img.alt;
  }

  function render(){
    const item=items[index];
    image.src=item.getAttribute('href');
    image.alt=syncAlt(item);
    count.textContent=String(index+1).padStart(2,'0')+' / '+String(items.length).padStart(2,'0');
  }

  function openAt(nextIndex,source){
    index=(nextIndex+items.length)%items.length;
    returnFocus=source||document.activeElement;
    render();
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
    closeBtn.focus({preventScroll:true});
  }

  function close(){
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden','true');
    document.body.style.overflow='';
    image.removeAttribute('src');
    if(returnFocus&&typeof returnFocus.focus==='function') returnFocus.focus({preventScroll:true});
  }

  items.forEach((item,i)=>{
    syncAlt(item);
    item.addEventListener('click',event=>{
      if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey) return;
      event.preventDefault();
      openAt(i,item);
    });
  });

  closeBtn.addEventListener('click',close);
  prevBtn.addEventListener('click',()=>{ index=(index-1+items.length)%items.length; render(); });
  nextBtn.addEventListener('click',()=>{ index=(index+1)%items.length; render(); });
  lightbox.addEventListener('click',event=>{ if(event.target===lightbox||event.target.classList.contains('concert-lightbox-stage')) close(); });

  document.addEventListener('keydown',event=>{
    if(!lightbox.classList.contains('is-open')) return;
    if(event.key==='Escape') close();
    if(event.key==='ArrowLeft'){ index=(index-1+items.length)%items.length; render(); }
    if(event.key==='ArrowRight'){ index=(index+1)%items.length; render(); }
  });
})();
