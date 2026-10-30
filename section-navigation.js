(() => {
const routes={music:'music.html',about:'about-vita.html',gallery:'gallery.html',contact:'contacts.html'};
const page=document.body.dataset.sectionPage;
const titles={uk:{music:'Музика',about:'Про Віту',gallery:'Галерея',contact:'Контакти'},en:{music:'Music',about:'About VITA',gallery:'Gallery',contact:'Contacts'}};
const copy={uk:{title:'Контакти',intro:'Для преси та радіостанцій',copy:'З питань співпраці пишіть ВІТІ в соціальних мережах.',write:'Написати',open:'Перейти'},en:{title:'Contacts',intro:'For press and radio stations',copy:'For collaboration inquiries, contact VITA on social media.',write:'Message',open:'Visit'}};
const update=()=>{
const lang=document.documentElement.lang==='en'?'en':'uk';
document.querySelectorAll('[data-nav]').forEach(a=>{
const key=a.dataset.nav;
if(routes[key])a.setAttribute('href',routes[key]+'?lang='+lang);
if(page&&key==='home')a.setAttribute('href','index.html?lang='+lang+'#top');
if(page&&key===page)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');
});
if(!page)return;
document.title=titles[lang][page]+' — '+(lang==='uk'?'ВІТА':'VITA');
const heading=document.querySelector('[data-section-title]');if(heading)heading.textContent=titles[lang][page];
document.querySelectorAll('[data-section-text]').forEach(el=>{el.textContent=copy[lang][el.dataset.sectionText]});
};
update();
new MutationObserver(update).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
})();
