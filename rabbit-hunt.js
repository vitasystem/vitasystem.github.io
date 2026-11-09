/* BLACK RABBITS — five-page scavenger hunt. Isolated from site styles. */
(()=>{'use strict';
const pages={'music.html':0,'about-vita.html':1,'gallery.html':2,'radio.html':3,'discography.html':4};
const page=location.pathname.split('/').pop().toLowerCase();
if(!(page in pages))return;
const id=pages[page],key='vita-black-rabbits-collection-v1';
const params=new URLSearchParams(location.search);
const en=params.get('lang')==='en'||(!params.has('lang')&&document.documentElement.lang==='en');
const names=en?['Flower','Peach','Watermelon','Bicycle','Moped']:['Квітка','Персик','Кавун','Велосипед','Мопед'];
const frames=[[15,420],[455,380],[835,444],[1274,426],[1715,438]];
function read(){try{const f=JSON.parse(localStorage.getItem(key)||'{}').found;return Array.isArray(f)?[...new Set(f.filter(n=>Number.isInteger(n)&&n>=0&&n<5))]:[];}catch{return [];}}
const found=read();if(found.includes(id))return;
const target=document.querySelector('footer')||document.querySelector('main')||document.body;
const position=getComputedStyle(target).position;if(position==='static')target.style.position='relative';
const style=document.createElement('style');
style.textContent=`
.vita-rabbit-egg{position:absolute!important;right:clamp(20px,6vw,90px)!important;bottom:clamp(22px,5vw,70px)!important;z-index:50!important;width:75px!important;height:97px!important;background:none!important;border:0!important;padding:0!important;cursor:pointer!important;filter:drop-shadow(0 3px 10px #ad7fbb55);transition:transform .22s,filter .22s}
.vita-rabbit-egg:hover,.vita-rabbit-egg:focus-visible{transform:translateY(-8px) scale(1.06);filter:drop-shadow(0 4px 18px #b98edc)}
.vita-rabbit-egg:focus-visible{outline:2px solid #e4b4fa;outline-offset:4px;border-radius:9px}
.vita-rabbit-egg__sprite{display:block;width:100%;height:100%;background-image:url('/assets/img/black-rabbits/rabbits.webp');background-repeat:no-repeat}
.vita-rabbit-egg__hint{position:absolute;right:15%;bottom:98%;width:max-content;max-width:160px;padding:8px;background:#120a1a;color:#f5e9fa;border:1px solid #8e579f;border-radius:7px;font:600 10px/1.4 Arial,sans-serif;opacity:0;pointer-events:none;transition:opacity .2s}
.vita-rabbit-egg:hover .vita-rabbit-egg__hint,.vita-rabbit-egg:focus-visible .vita-rabbit-egg__hint{opacity:1}
.vita-rabbit-egg__notice{position:fixed;right:20px;bottom:20px;z-index:2147483646;max-width:min(350px,calc(100vw - 40px));padding:18px 20px;background:#170f21;color:#f3e5fa;border:1px solid #ad72c8;border-radius:12px;box-shadow:0 12px 45px #0009;font:13px/1.6 Arial,sans-serif}
.vita-rabbit-egg__notice a{display:inline-block;color:#e8b4ff;text-decoration:underline;margin-top:8px}
@media(max-width:600px){.vita-rabbit-egg{width:61px!important;height:82px!important;right:14px!important;bottom:18px!important}}
`;
document.head.append(style);
const btn=document.createElement('button');btn.type='button';btn.className='vita-rabbit-egg';
btn.setAttribute('aria-label',(en?'Find black rabbit: ':'Знайти чорного кролика: ')+names[id]);
const frame=frames[id],sheet=2172/frame[1]*100,x=frame[0]/(2172-frame[1])*100;
btn.innerHTML='<span class="vita-rabbit-egg__sprite" aria-hidden="true"></span><span class="vita-rabbit-egg__hint">'+(en?'Catch me!':'Знайди мене!')+'</span>';
const sprite=btn.querySelector('.vita-rabbit-egg__sprite');sprite.style.backgroundSize=sheet+'% 100%';sprite.style.backgroundPosition=x+'% center';
btn.addEventListener('click',()=>{
const collected=read();if(!collected.includes(id))collected.push(id);
try{localStorage.setItem(key,JSON.stringify({found:collected}));}catch{}
btn.remove();
const note=document.createElement('div');note.className='vita-rabbit-egg__notice';note.setAttribute('role','status');
const count=collected.length;
const copy=en?('Rabbit found: '+names[id]+'. '+count+' of 5 collected.'):('Знайдено кролика «'+names[id]+'». '+count+' із 5.');
note.textContent=copy+' ';
const link=document.createElement('a');link.href='/index.html?lang='+(en?'en':'uk')+'#black-rabbit-portal';
link.textContent=en?'Back to the secret door →':'До таємних дверей →';note.append(link);document.body.append(note);
setTimeout(()=>note.remove(),9500);
});
target.append(btn);
})();