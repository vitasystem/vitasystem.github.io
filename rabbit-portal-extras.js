/* VITA SYSTEM — guards and alternate entry for the rabbit portal only */
(()=>{'use strict';
const run=()=>{
 const portal=document.getElementById('black-rabbit-portal');if(!portal)return;
 const en=new URLSearchParams(location.search).get('lang')==='en';
 const stage=document.getElementById('br-stage'),rail=portal.querySelector('.inventory-rail');
 const key='vita-black-rabbits-collection-v2';
 const style=document.createElement('style');style.textContent=`
 #black-rabbit-portal .vita-guard{position:absolute;z-index:7;width:clamp(70px,9vw,110px);height:clamp(98px,13vw,145px);padding:0;border:0;background:none;cursor:pointer;filter:drop-shadow(0 8px 16px #09030b);animation:vita-guard-float 4.8s ease-in-out infinite}
 #black-rabbit-portal .vita-guard--left{left:10%;bottom:85px}
 #black-rabbit-portal .vita-guard--right{right:13%;bottom:89px;animation-delay:-2s}
 #black-rabbit-portal .vita-guard--top{right:3%;top:310px;width:78px;height:102px;animation-delay:-3.5s}
 #black-rabbit-portal .vita-guard:hover{filter:drop-shadow(0 0 19px #b885d8)}
 #black-rabbit-portal .vita-guard__sprite{display:block;width:100%;height:100%;background-image:url('assets/img/black-rabbits/rabbits.webp');background-repeat:no-repeat}
 #black-rabbit-portal .vita-guard__speech{display:none;position:absolute;left:50%;bottom:96%;transform:translateX(-50%);width:200px;padding:12px;color:#f9e5ff;background:#190b21f2;border:1px solid #ae7ac2;font:700 11px/1.55 Arial,sans-serif;text-align:center;box-shadow:0 6px 25px #000c}
 #black-rabbit-portal .vita-guard.speaking .vita-guard__speech{display:block}
 #black-rabbit-portal .vita-secret{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:10px;padding:10px 0 22px}
 #black-rabbit-portal .vita-secret input{width:min(220px,55vw);padding:12px;background:#100817;color:#f3e5ff;border:1px solid #886595;border-radius:2px}
 #black-rabbit-portal .vita-secret button{padding:12px 17px;background:#4b215d;color:white;border:1px solid #b888d1;font:700 11px Arial,sans-serif}
 #black-rabbit-portal .vita-secret>small{width:100%;text-align:center;color:#af8dbc;font:11px/1.7 Arial,sans-serif}
 @keyframes vita-guard-float{0%,100%{translate:0 0}50%{translate:0 -7px}}
 @media(max-width:600px){#black-rabbit-portal .vita-guard--left{left:0;bottom:140px}#black-rabbit-portal .vita-guard--right{right:0;bottom:140px}#black-rabbit-portal .vita-guard--top{right:0;top:215px;width:52px;height:79px}#black-rabbit-portal .vita-guard__speech{width:140px;font-size:10px}}
 @media(prefers-reduced-motion:reduce){#black-rabbit-portal .vita-guard{animation:none}}
 `;document.head.append(style);
 const frames=[[15,420],[455,380],[835,444],[1274,426],[1715,438]];
 const lines=en?[
  'Not me! I am the guard! Go search the site!',
  'Who let the dogs out? Go find another rabbit!',
  'Damn, I am just chilling here!',
  'What the...? Don’t touch me!'
 ]:[
  'Не той! Я вартовий! Іди на сайт і шукай!',
  'Хто випустив собак? Іди на сайт, шукай іншого!',
  'Трясця, я тут чилю!',
  'Шо за…? Не чіпай!!'
 ];
 [[1,'left'],[3,'right'],[4,'top']].forEach(([id,pos],guardIndex)=>{
  const b=document.createElement('button');b.type='button';b.className='vita-guard vita-guard--'+pos;b.setAttribute('aria-label',en?'Rabbit guard':'Кролик-вартовий');
  const [x,w]=frames[id];const scale=2172/w*100,offset=x/(2172-w)*100;
  b.innerHTML='<span class="vita-guard__sprite" style="background-size:'+scale+'% 100%;background-position:'+offset+'% center"></span><span class="vita-guard__speech" role="status"></span>';
  let clicks=0;
  b.addEventListener('click',()=>{
   stage.querySelectorAll('.vita-guard').forEach(g=>{if(g!==b)g.classList.remove('speaking');});
   b.querySelector('.vita-guard__speech').textContent=lines[(guardIndex+clicks)%lines.length];
   clicks++;
   b.classList.add('speaking');setTimeout(()=>b.classList.remove('speaking'),2800);
  });
  stage.append(b);
 });
 if(rail){const old=[...rail.querySelectorAll('[data-milestone]')];old.forEach((b,i)=>{if(i>=5){b.remove();return;}const n=i+1;b.dataset.milestone=String(n);b.textContent=String(n).padStart(2,'0');b.setAttribute('aria-label',(en?'Rabbit ':'Кролик ')+n);});const found=(()=>{try{return JSON.parse(localStorage.getItem(key)||'{}').found||[];}catch{return [];}})();old.slice(0,5).forEach((b,i)=>b.classList.toggle('unlocked',found.length>i));}
 const form=document.createElement('form');form.className='vita-secret';form.innerHTML='<input type="password" name="code" autocomplete="off" aria-label="'+(en?'Secret password':'Таємний пароль')+'" placeholder="'+(en?'Secret password':'Таємний пароль')+'"><button type="submit">'+(en?'OPEN':'ВІДЧИНИТИ')+'</button><small>'+(en?'Collect five rabbits or enter the secret password.':'Збери 5 кроликів або введи таємний пароль.')+'</small>';
 portal.querySelector('.collection')?.append(form);
 form.addEventListener('submit',e=>{e.preventDefault();const code=new FormData(form).get('code').toString().trim().toUpperCase();if(code==='VITA224'){try{localStorage.setItem(key,JSON.stringify({found:[0,1,2,3,4]}));}catch{}location.reload();}else{form.querySelector('small').textContent=en?'Wrong password. The guards are watching.':'Неправильний пароль! Вартові все бачать.';}});
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
})();