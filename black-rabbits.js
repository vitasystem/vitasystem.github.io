(()=>{
'use strict';
const portal=document.querySelector('#black-rabbit-portal'),room=document.querySelector('#black-rabbit-room'),root=portal||room;
if(!root)return;
const $=s=>root.querySelector(s),$$=s=>[...root.querySelectorAll(s)];
const en=new URLSearchParams(location.search).get('lang')==='en',lang=en?'en':'uk';
const tr=(uk,eng)=>en?eng:uk;
const key='vita-black-rabbits-collection-v2';
let found=[],toastTimer,lanternTimer,revealTimer;
try{const data=JSON.parse(localStorage.getItem(key)||'{}');found=Array.isArray(data.found)?[...new Set(data.found.filter(n=>Number.isInteger(n)&&n>=0&&n<5))]:[];}catch{}
// A browser Back navigation may restore the unlocked portal from memory.
window.addEventListener('pageshow',event=>{
 if(!event.persisted)return;
 let saved=[];
 try{const data=JSON.parse(localStorage.getItem(key)||'{}');saved=Array.isArray(data.found)?data.found:[];}catch{}
 if(saved.length!==found.length || saved.some(n=>!found.includes(n)))location.reload();
});
const names=en?['Flower','Peach','Watermelon','Bicycle','Moped']:['Квітка','Персик','Кавун','Велосипед','Мопед'];
const goals=[5,5,10,15,20,24];
const rooms=en?[
 ['Pleasure','Pleasure.','A little silence. A little music. And a feeling that you have arrived exactly where you should be.'],
 ['Black rabbits','Your five accomplices.','Flower, peach, watermelon, bicycle and moped. Everyone has a different character. This is where their story begins.'],
 ['Midnight','After midnight.','A night mission is taking shape behind these doors.'],
 ['No rules','Sicily is waiting.','A future racing adventure in VITA’s world.'],
 ['The other side','Beyond the familiar.','Another door, another secret.'],
 ['Secret 224','You found them all.','The final discovery is still being written.']
]:[
 ['Насолода','Насолода.','Трохи тиші. Трохи музики. І відчуття, що ти опинився саме там, де потрібно.'],
 ['Чорні кролики','П’ятеро спільників.','Квітка, персик, кавун, велосипед і мопед. У кожного свій характер. Тут починається їхня історія.'],
 ['Опівніч','Після опівночі.','За цими дверима народжується нічна місія.'],
 ['Без правил','Сицилія чекає.','Місце для майбутньої гоночної пригоди у світі Віти.'],
 ['Інший бік','За межею звичного.','Ще одні двері. Ще одна таємниця.'],
 ['Секрет 224','Ти знайшов усіх.','Історія головного відкриття ще пишеться.']
];
function save(){try{localStorage.setItem(key,JSON.stringify({found}));}catch{}}
function toast(msg){const e=$('#br-toast');if(!e)return;clearTimeout(toastTimer);e.textContent=msg;e.classList.add('visible');toastTimer=setTimeout(()=>e.classList.remove('visible'),4200);}
function sprites(){const frames=[[15,420],[455,380],[835,444],[1274,426],[1715,438]];$$('.rabbit-sprite').forEach(e=>{const i=Math.max(0,Math.min(4,Math.round(parseFloat(e.style.getPropertyValue('--pos')||'0')/25))),[x,w]=frames[i];e.style.setProperty('--sheet-width',(2172/w*100)+'%');e.style.setProperty('--sheet-x',(x/(2172-w)*100)+'%');});}
function translateStatic(){if(!en)return;
 const pairs={
 'ДОСТУП ОБМЕЖЕНО':'ACCESS RESTRICTED','ТИ ЗАЙШОВ ТРОХИ ДАЛІ, НІЖ ПЛАНУВАВ.':'YOU WENT A LITTLE FURTHER THAN YOU PLANNED.',
 'Деякі двері':'Some doors','відкриваються':'open','не всім.':'only to a few.','Знайди чорних кроликів. Вони знають шлях.':'Find the black rabbits. They know the way.',
 'Тут починається':'This is where','інша сторона':'the other side','її світу.':'of her world begins.','КРОЛИКИ НЕ ВИДАЮТЬ СЕКРЕТІВ.':'RABBITS KEEP THEIR SECRETS.','АЛЕ ІНОДІ — КЛЮЧІ.':'SOMETIMES THEY GIVE YOU KEYS.',
 'НАТИСНИ':'CLICK','НА МЕНЕ':'ME','НУ ДАВАЙ. ЩО СТАНЕТЬСЯ?':'GO ON. WHAT COULD HAPPEN?',
 'НАЩО':'WHY DID','НАТИСНУВ???':'YOU CLICK???','Віта просила нічого не чіпати…':'VITA asked you not to touch anything…','Я БІЛЬШЕ НЕ БУДУ':'I WON’T DO IT AGAIN',
 'Тепер ти':'Now you are','всередині.':'inside.','УВІЙТИ ДО КІМНАТИ':'ENTER THE ROOM','ПЕРША П’ЯТІРКА / КЛЮЧІ ДО КІМНАТИ':'THE FIRST FIVE / KEYS TO THE ROOM',
 'ПЕРШИЙ ЕТАП':'FIRST STAGE','Знайди п’ятьох чорних кроликів на різних сторінках сайту.':'The five black rabbits are nearby. Click each one to fill its outline and open the doors.',
 'Знайди чорних кроликів на сайті. Натисни на кожного, щоб його силует з’явився тут. Після п’ятої знахідки двері відчиняться.':'Find the black rabbits across the site. Click each one to fill its outline here. After the fifth find, the doors will open.',
 'ТИ МЕНЕ БАЧИШ?':'CAN YOU SEE ME?','ПЕРСИК НЕ ВІДДАМ.':'THE PEACH IS MINE.','Я ТУТ НІ ДО ЧОГО.':'I HAD NOTHING TO DO WITH IT.','ДОЖЕНЕШ?':'CATCH ME?','ПОЇХАЛИ ДО ВІТИ.':'LET’S GO TO VITA.',
 'ТЕСТОВА КІМНАТА / VITA 224':'TEST ROOM / VITA 224','П’ять кроликів. Один вхід. Далі — більше.':'Five rabbits. One entrance. More to come.',
 'Спочатку — п’ятеро спільників.':'First, find your five accomplices.','Знайди п’ятьох чорних кроликів на сторінках сайту.':'Find five black rabbits across the site.',
 'ТЕСТОВИЙ ПРОСТІР · НОВІ ІСТОРІЇ З’ЯВЛЯТЬСЯ ЗГОДОМ':'TEST SPACE · NEW STORIES ARE COMING',
 'Обурений чорний кролик свариться':'An angry black rabbit complains','Срібні ланцюги та замок із кролячою замковою щілиною':'Silver chains and a lock with a rabbit keyhole',
 'Місця для п’ятьох кроликів':'Outlines for five rabbits','Перевірити замок':'Check the lock','Натисни на мене — ліхтар':'Click me — lantern','Позначки відкриттів':'Discovery milestones','Розділи таємної кімнати':'Secret room menu'
 };
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;while(n=walker.nextNode()){const text=n.textContent.trim();if(pairs[text])n.textContent=n.textContent.replace(text,pairs[text]);}
 $$('[aria-label],[alt]').forEach(e=>['aria-label','alt'].forEach(a=>{if(pairs[e.getAttribute(a)])e.setAttribute(a,pairs[e.getAttribute(a)]);}));
 if(room){document.documentElement.lang='en';document.title='BLACK RABBITS: UNCENSORED — VITA SYSTEM';$('[data-br-room-heading]').innerHTML='VITA has <em>secrets.</em>';}
}
translateStatic();
if(portal){
 $('.rabbit-slots').innerHTML=names.map((n,i)=>`<div class="rabbit-slot" data-slot="${i}" role="img"><svg class="slot-outline" viewBox="0 0 60 100" aria-hidden="true"><path d="M19 50C7 34 2 8 10 5C19 1 27 31 29 37C35 8 44 1 48 6C56 14 45 41 39 50C52 58 50 79 42 84C53 97 39 99 32 93C25 100 9 98 18 84C7 76 8 58 19 50Z"/></svg><span class="rabbit-sprite" style="--pos:${i*25}%" aria-hidden="true"></span><span class="slot-no">0${i+1}</span></div>`).join('');
 function render(){const count=found.length,open=count===5;
  $$('[data-find]').forEach((b,i)=>{const yes=found.includes(i);b.closest('.rabbit-hide').classList.toggle('found',yes);b.disabled=yes;b.setAttribute('aria-label',tr('Знайти кролика: ','Find rabbit: ')+names[i]);});
  $$('.rabbit-slot').forEach((e,i)=>{e.classList.toggle('filled',found.includes(i));e.setAttribute('aria-label',names[i]+': '+tr(found.includes(i)?'знайдений':'ще не знайдений',found.includes(i)?'found':'not found'));});
  $('#br-collection-count').textContent=String(count).padStart(2,'0')+' / 05';
  $('#br-door-space').classList.toggle('open',open);$('#br-key-art').classList.toggle('active',open);
  $('#br-enter-room').disabled=!open;$('#br-enter-room').textContent=open?tr('УВІЙТИ ДО КІМНАТИ ↗','ENTER THE ROOM ↗'):tr('ДВЕРІ ЗАЧИНЕНІ','DOORS LOCKED');
  $('#br-door-status').textContent=open?tr('П’ятеро разом. Гра BLACK RABBITS чекає.','All five together. BLACK RABBITS is waiting.'):tr(`Знайдено ${count} з 5. Двері відчиняться, коли збереш усіх.`,`Found ${count} of 5. Collect them all to open the doors.`);
  $('.status-dot').textContent=open?tr('ДВЕРІ ВІДЧИНЕНІ','DOORS OPEN'):tr('ДОСТУП ОБМЕЖЕНО','ACCESS RESTRICTED');
  $$('[data-milestone]').forEach(b=>{const n=Number(b.dataset.milestone),yes=count>=n;b.classList.toggle('unlocked',yes);b.setAttribute('aria-label',tr(`${n} кроликів: ${yes?'відкрито':'зачинено'}`,`${n} rabbits: ${yes?'unlocked':'locked'}`));});sprites();
 }
 function rattle(){const lock=$('#br-lock');lock.classList.remove('rattle');void lock.offsetWidth;lock.classList.add('rattle');}
 function enter(){if(found.length<5){rattle();toast(tr('Збери п’ятьох кроликів. Віта поки не відчиняє.','Collect five rabbits. VITA isn’t opening yet.'));return;}location.href='black-rabbits.html?lang='+lang;}
 $$('[data-find]').forEach(b=>b.addEventListener('click',()=>{const i=Number(b.dataset.find);if(found.includes(i))return;found.push(i);save();render();rattle();toast(found.length===5?tr('П’ятеро разом. Ланцюги більше не тримають ці двері.','All five together. The chains can no longer hold these doors.'):tr(`${names[i]} — у команді. Знайдено ${found.length} з 5.`,`${names[i]} is on the team. Found ${found.length} of 5.`));}));
 $('#br-lock').addEventListener('click',enter);$('#br-enter-room').addEventListener('click',enter);$('#br-inside-enter').addEventListener('click',enter);
 $$('[data-milestone]').forEach(b=>b.addEventListener('click',()=>toast(tr('Знайдено '+found.length+' із 5 кроликів.','Found '+found.length+' of 5 rabbits.'))));
 $('#br-lantern').addEventListener('click',()=>{const stage=$('#br-stage');if(stage.classList.contains('lantern-breaking'))return;clearTimeout(lanternTimer);clearTimeout(revealTimer);stage.classList.add('lantern-breaking');$('#br-lantern').setAttribute('aria-disabled','true');stage.classList.remove('rant-active');portal.classList.remove('br-rant');revealTimer=setTimeout(()=>{stage.classList.add('rant-active');portal.classList.add('br-rant');},650);lanternTimer=setTimeout(()=>{stage.classList.remove('lantern-breaking');$('#br-lantern').setAttribute('aria-disabled','false');},6200);});
 $('#br-dismiss-rant').addEventListener('click',()=>{$('#br-stage').classList.remove('rant-active');portal.classList.remove('br-rant');});
 let frame=0;const still=matchMedia('(prefers-reduced-motion: reduce)').matches;
 function scroll(){frame=0;const box=$('#br-lantern').getBoundingClientRect(),h=innerHeight,p=Math.max(0,Math.min(1,(h-box.top)/(h*.8)));$('#br-lantern').style.setProperty('--lantern-scale',still?'1.1':String(.78+p*.68));$('#br-lantern').classList.toggle('tempting',box.top<h*.95&&box.bottom>-80);$('#br-lock').style.setProperty('--chain-scale',String(still?1.05:1+p*.11));$('#br-lock').style.setProperty('--chain-peak',String(still?1.05:1.035+p*.11));$('#br-door-space').style.setProperty('--word-scale',String(still?1:.96+p*.08));$('#br-door-space').style.setProperty('--word-peak',String(still?1:1.05+p*.08));}
 function queue(){if(!frame)frame=requestAnimationFrame(scroll);}addEventListener('scroll',queue,{passive:true});addEventListener('resize',queue);scroll();
 let visible=false;function motion(){portal.classList.toggle('br-paused',document.hidden||!visible);}
 if('IntersectionObserver'in window)new IntersectionObserver(es=>{visible=es[0].isIntersecting;motion();}).observe(portal);else visible=true;
 document.addEventListener('visibilitychange',motion);motion();render();
}
if(room){
 $$('[data-br-back]').forEach(a=>{a.href='index.html?lang='+lang+'#black-rabbit-portal';a.textContent=tr('← ДО ДВЕРЕЙ','← BACK TO THE DOORS');});const language=$('[data-br-lang]');language.href='?lang='+(en?'uk':'en');language.textContent=en?'УКР':'ENG';
 $('#br-locked').hidden=found.length===5;$('#br-unlocked').hidden=found.length<5;
 if(found.length===5){$('.room-menu').innerHTML=rooms.map((r,i)=>`<button type="button" data-room="${i}" aria-disabled="${goals[i]>5}"><span>0${i+1} / ${goals[i]} ${tr('КРОЛИКІВ','RABBITS')} ${goals[i]>5?'· 🔒':''}</span><strong>${r[0]}</strong></button>`).join('');
 function select(i){if(goals[i]>found.length){toast(tr(`Цей розділ відкриється після ${goals[i]} кроликів. Нові схованки з’являться згодом.`,`This section unlocks at ${goals[i]} rabbits. More hiding places are coming.`));return;}
 $('#br-room-content-title').textContent=rooms[i][1];$('#br-room-copy').textContent=rooms[i][2];$('#br-room-kicker').textContent='0'+(i+1)+' / '+tr('ПЕРШЕ ВІДКРИТТЯ','FIRST DISCOVERY');$('.room-rabbit').style.setProperty('--pos',i*25+'%');$$('[data-room]').forEach(b=>b.setAttribute('aria-current',String(Number(b.dataset.room)===i)));sprites();}
 $$('[data-room]').forEach(b=>b.addEventListener('click',()=>select(Number(b.dataset.room))));$('#br-all-count').textContent=tr('05 / 24 КРОЛИКИ','05 / 24 RABBITS');select(0);}
}
})();
