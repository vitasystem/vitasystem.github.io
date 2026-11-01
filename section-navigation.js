(() => {
const routes={music:'music.html',about:'about-vita.html',gallery:'gallery.html',contact:'contacts.html'};
const page=document.body.dataset.sectionPage;
const titles={uk:{music:'Музика',about:'Про Віту',gallery:'Галерея',contact:'Контакти'},en:{music:'Music',about:'About VITA',gallery:'Gallery',contact:'Contacts'}};
const copy={uk:{title:'Контакти',intro:'Для преси та радіостанцій',copy:'З питань співпраці пишіть ВІТІ в соціальних мережах.',write:'Написати',open:'Перейти'},en:{title:'Contacts',intro:'For press and radio stations',copy:'For collaboration inquiries, contact VITA on social media.',write:'Message',open:'Visit'}};

const ensureSecretFileLink=()=>{
const nav=document.querySelector('.about-page-links');
if(!nav)return;
let link=nav.querySelector('.about-page-link-secret');
if(!link){
link=document.createElement('a');
link.className='about-page-link about-page-link-secret';
link.innerHTML='<span>07</span><b></b><i aria-hidden="true">↗</i>';
nav.appendChild(link);
}
if(!document.getElementById('secret-file-link-style')){
const style=document.createElement('style');
style.id='secret-file-link-style';
style.textContent='.about-page-link-secret{grid-column:1 / -1;justify-self:center;width:calc(50% - 6px)}@media(max-width:760px){.about-page-link-secret{width:100%}}';
document.head.appendChild(style);
}
const lang=document.documentElement.lang==='en'?'en':'uk';
link.href='secret-file-224.html?lang='+lang;
link.querySelector('b').textContent=lang==='en'?'Frequency 224 — Secret File':'Частота 224 — Секретний Файл';
link.setAttribute('aria-label',lang==='en'?'Open Frequency 224 — Secret File':'Відкрити Частота 224 — Секретний Файл');
};

const update=()=>{
const lang=document.documentElement.lang==='en'?'en':'uk';
document.querySelectorAll('[data-nav]').forEach(a=>{
const key=a.dataset.nav;
if(routes[key])a.setAttribute('href',routes[key]+'?lang='+lang);
if(page&&key==='home')a.setAttribute('href','index.html?lang='+lang+'#top');
if(page&&key===page)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');
});
ensureSecretFileLink();
if(!page)return;
document.title=titles[lang][page]+' — '+(lang==='uk'?'ВІТА':'VITA');
const heading=document.querySelector('[data-section-title]');if(heading)heading.textContent=titles[lang][page];
document.querySelectorAll('[data-section-text]').forEach(el=>{el.textContent=copy[lang][el.dataset.sectionText]});
};
update();
new MutationObserver(update).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
})();
