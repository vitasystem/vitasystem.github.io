(() => {
const cta=document.querySelector('.fatal-witch-cta');
const imageLink=document.querySelector('.fatal-witch-image-link');
if(cta){
const update=()=>{
const en=document.documentElement.lang==='en';
const href='fatal-witch.html?lang='+(en?'en':'uk');
cta.href=href;
if(imageLink){imageLink.href=href;imageLink.setAttribute('aria-label',en?'Open Fatal Witch page':'Відкрити сторінку «Фатальна Відьма»');}
cta.querySelector('.fatal-witch-cta-top').textContent=en?'Get in touch':'Вийти на зв’язок';
cta.querySelector('.fatal-witch-cta-bottom').textContent=en?'with the Fatal Witch':'з Фатальною Відьмою';
};
update();
new MutationObserver(update).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
}
if(!document.body.classList.contains('fatal-witch-page'))return;
const lang=new URLSearchParams(location.search).get('lang')||localStorage.getItem('vita-language')||'uk';
if(lang!=='en')return;
document.documentElement.lang='en';
document.title='Fatal Witch';
document.querySelector('h1').textContent='Fatal Witch';
document.querySelector('.info-home').textContent='HOME';
document.querySelector('.info-back').textContent='← BACK TO VITA';
document.querySelectorAll('a[href^="index.html"]').forEach(a=>{a.href=a.getAttribute('href').replace('index.html#','index.html?lang=en#')});
})();
