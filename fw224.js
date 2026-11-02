(() => {
  'use strict';
  const $=s=>document.querySelector(s), lang=()=>document.documentElement.lang==='en'?'en':'uk';
  const say=(uk,en)=>lang()==='en'?en:uk, reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let wingsOpen=false,sound=false,audioContext=null,game=null;
  const wings=$('[data-fw-wings]'),soundButton=$('[data-fw-sound]');
  function sync(){
    const en=lang()==='en';
    document.querySelectorAll('[data-fw-uk][data-fw-en]').forEach(e=>{const value=e.dataset[en?'fwEn':'fwUk'];if(e.textContent!==value)e.textContent=value;});
    document.querySelectorAll('[data-fw-alt-uk]').forEach(e=>e.alt=e.dataset[en?'fwAltEn':'fwAltUk']);
    document.querySelectorAll('[data-fw-aria-uk]').forEach(e=>e.setAttribute('aria-label',e.dataset[en?'fwAriaEn':'fwAriaUk']));
    document.querySelectorAll('[data-language]').forEach(e=>e.setAttribute('aria-pressed',String(e.dataset.language===lang())));
    document.title=en?'Fatal Witch — VITA FW224':'Фатальна Відьма — ВІТА FW224';
    document.querySelector('meta[name="description"]').content=en?'VITA FW224 — Fatal Witch. A flowering Ukraine beneath silver wings. An interactive music story about protecting life.':'ВІТА FW224 — Фатальна Відьма. Квітуча Україна під срібними крилами. Інтерактивна музична історія про захист життя.';
    wings.firstElementChild.textContent=wingsOpen?say('Крила розкриті','Wings are open'):say('Розкрити крила','Open the wings');
    soundButton.textContent=sound?say('Звук: увімкнено','Sound: on'):say('Звук: вимкнено','Sound: off');
    if(game)game.labels();
  }
  new MutationObserver(sync).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  document.querySelectorAll('[data-language]').forEach(e=>e.addEventListener('click',()=>queueMicrotask(sync)));
  addEventListener('pageshow',()=>queueMicrotask(sync));
  wings.addEventListener('click',()=>{wingsOpen=!wingsOpen;document.body.classList.toggle('fw-wings-open',wingsOpen);wings.setAttribute('aria-pressed',String(wingsOpen));sync();});
  function tone(kind){
    if(!sound||!audioContext||audioContext.state!=='running')return;
    const t=audioContext.currentTime,osc=audioContext.createOscillator(),gain=audioContext.createGain();
    osc.type=kind==='shot'?'triangle':'sawtooth';
    osc.frequency.setValueAtTime(kind==='shot'?420:95,t);osc.frequency.exponentialRampToValueAtTime(kind==='shot'?95:28,t+.16);
    gain.gain.setValueAtTime(.0001,t);gain.gain.exponentialRampToValueAtTime(kind==='shot'?.035:.055,t+.008);gain.gain.exponentialRampToValueAtTime(.0001,t+.2);
    osc.connect(gain);gain.connect(audioContext.destination);osc.start(t);osc.stop(t+.22);
  }
  soundButton.addEventListener('click',async()=>{sound=!sound;if(sound){try{audioContext??=new(window.AudioContext||window.webkitAudioContext)();await audioContext.resume();}catch{sound=false;}}soundButton.setAttribute('aria-pressed',String(sound));sync();});
  const scenes=[...document.querySelectorAll('.fw-atmosphere')],visibleScenes=new Set();
  const sceneObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)visibleScenes.add(e.target);else visibleScenes.delete(e.target);e.target.classList.toggle('fw-inview',e.isIntersecting&&!document.hidden);}),{rootMargin:'100px'});
  scenes.forEach(e=>sceneObserver.observe(e));

  // Canvas oceans use one bounded loop and sleep outside the viewport.
  const oceans=[...document.querySelectorAll('.fw-ocean')].map(canvas=>({canvas,ctx:canvas.getContext('2d'),visible:false,w:0,h:0}));
  let oceanFrame=0,lastOcean=0;
  function sizeOcean(o){const r=o.canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,1.5);o.w=Math.max(1,r.width);o.h=Math.max(1,r.height);o.canvas.width=Math.round(o.w*d);o.canvas.height=Math.round(o.h*d);o.ctx.setTransform(d,0,0,d,0,0);}
  function paintOcean(o,time){const c=o.ctx,w=o.w,h=o.h,t=reduced?0:time*.00016;c.clearRect(0,0,w,h);const g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,'#0a1116');g.addColorStop(.6,'#18252c');g.addColorStop(1,'#0a1218');c.fillStyle=g;c.fillRect(0,0,w,h);
    for(let row=0;row<34;row++){const z=row/34,y=h*.2+z*z*h*.8;c.beginPath();for(let x=-20;x<w+20;x+=12){const yy=y+Math.sin(x*.014+t*3+row*.7)*(2+z*9)+Math.sin(x*.038-t*2+row)*(1+z*3);if(x===-20)c.moveTo(x,yy);else c.lineTo(x,yy);}c.strokeStyle=`rgba(166,190,199,${.025+z*.075})`;c.lineWidth=.5+z*.8;c.stroke();}
    for(let i=0;i<25;i++){const z=(i*.137)%1,x=(i*167.3+Math.sin(t+i)*20)%w,y=h*.3+z*z*h*.65;c.fillStyle=`rgba(190,210,212,${.03+Math.sin(t*3+i)*.025})`;c.fillRect(x,y,8+z*22,.7);}
  }
  function oceanLoop(time){oceanFrame=0;if(document.hidden)return;if(time-lastOcean>45){oceans.filter(o=>o.visible).forEach(o=>paintOcean(o,time));lastOcean=time;}if(!reduced&&oceans.some(o=>o.visible))oceanFrame=requestAnimationFrame(oceanLoop);}
  function wakeOcean(){if(!oceanFrame&&!document.hidden&&oceans.some(o=>o.visible))oceanFrame=requestAnimationFrame(oceanLoop);}
  const oceanObserver=new IntersectionObserver(entries=>{entries.forEach(e=>{const o=oceans.find(o=>o.canvas===e.target);o.visible=e.isIntersecting;if(o.visible){sizeOcean(o);paintOcean(o,performance.now());}});wakeOcean();},{rootMargin:'80px'});
  oceans.forEach(o=>{sizeOcean(o);paintOcean(o,0);oceanObserver.observe(o.canvas);});

  const canvas=$('#fw-game'),ctx=canvas.getContext('2d'),shell=$('[data-fw-game]');
  const startButton=$('[data-fw-start]'),cover=$('.fw-game-cover'),result=$('.fw-game-result'),hud=$('.fw-game-hud'),pauseCover=$('.fw-pause-cover');
  const fireButton=$('[data-fw-fire]'),shieldButton=$('[data-fw-shield]'),pauseButton=$('[data-fw-pause]'),score=$('[data-fw-score]'),status=$('[data-fw-status]');
  let W=1200,H=680,raf=0,previous=0,onScreen=false,mode='idle',paused=false,demo=false,elapsed=0,kills=0,spawned=0,nextSpawn=0,lastShot=-1,shieldUntil=0,shieldFlash=0;
  let enemies=[],bullets=[],particles=[],smoke=[],pointer={x:750,y:250},playerX=190,keys=new Set(),movingUntil=0,enemyId=0;
  const stars=Array.from({length:65},(_,i)=>({x:((i*347.17)%1200)/1200,y:((i*83.31)%500)/680,r:i%5===0?1.2:.65}));
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
  function segmentDistance(px,py,x1,y1,x2,y2){const dx=x2-x1,dy=y2-y1,d=dx*dx+dy*dy;const t=d?clamp(((px-x1)*dx+(py-y1)*dy)/d,0,1):0;return Math.hypot(px-x1-t*dx,py-y1-t*dy);}
  function resizeGame(){const r=canvas.getBoundingClientRect();const oldW=W,oldH=H;W=r.width<600?760:1200;H=Math.round(W*r.height/r.width);const d=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.round(r.width*d);canvas.height=Math.round(r.height*d);ctx.setTransform(canvas.width/W,0,0,canvas.height/H,0,0);playerX=clamp(playerX/oldW*W,80,W*.44);enemies.forEach(e=>{e.x=e.x/oldW*W;e.baseY=e.baseY/oldH*H;});bullets=[];pointer={x:W*.7,y:H*.35};draw();}
  function labels(){pauseButton.textContent=paused?say('Продовжити','Resume'):say('Пауза','Pause');shieldButton.textContent=elapsed<shieldUntil?say('Крила відновлюються','Wings recharging'):say('Крила FW224','FW224 wings');score.textContent=`${String(kills).padStart(2,'0')} / 12`;if(mode==='playing')status.textContent=demo?say('Режим спостереження. FW224 захищає небо.','Watch mode. FW224 protects the sky.'):say('Сигнал активний. Очисти небо від 12 машин рою.','Signal active. Clear 12 swarm machines from the sky.');else if(mode==='won')status.textContent=say('Небо вільне. Усі 12 машин рою зупинені.','The sky is clear. All 12 swarm machines have been stopped.');}
  function controls(){const active=mode==='playing';fireButton.disabled=!active||paused;shieldButton.disabled=!active||paused||elapsed<shieldUntil;pauseButton.disabled=!active;labels();}
  function begin(auto){mode='playing';paused=false;demo=auto;elapsed=0;kills=0;spawned=0;nextSpawn=.1;lastShot=-1;shieldUntil=0;shieldFlash=0;enemies=[];bullets=[];particles=[];smoke=[];keys.clear();playerX=W*.18;cover.hidden=true;result.hidden=true;hud.hidden=false;pauseCover.hidden=true;document.body.classList.remove('fw-victory');controls();if(!auto)canvas.focus({preventScroll:true});wake();}
  function spawn(){const i=spawned++;enemies.push({id:++enemyId,x:W*(.66+(i%3)*.11),y:0,baseY:H*(.15+(i%4)*.115),phase:i*2.4,r:i%5===4?46:34,ship:i%5===4,hp:1,vx:-22-(i%3)*8});}
  function origin(){return{x:playerX+37,y:H*.86-122};}
  function fire(auto=false){if(mode!=='playing'||paused||elapsed-lastShot<.23)return;const from=origin();let target=null;if(auto||demo){target=[...enemies].sort((a,b)=>a.x-b.x)[0];if(!target)return;}else target=enemies.find(e=>Math.hypot(e.x-pointer.x,e.y-pointer.y)<e.r+35);const to=target??pointer,angle=Math.atan2(to.y-from.y,to.x-from.x);bullets.push({x:from.x,y:from.y,vx:Math.cos(angle)*850,vy:Math.sin(angle)*850,target:target?.id,life:2.8});lastShot=elapsed;movingUntil=elapsed+.3;tone('shot');}
  function explode(e){for(let i=0;i<22;i++){const a=i*.91,v=45+(i*37)%160;particles.push({x:e.x,y:e.y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,life:.6+(i%4)*.12,max:1,color:i%3?'#d39d66':'#deece6',r:i%3?2:4});}smoke.push({x:e.x,y:e.y,r:15,life:1.1});tone('hit');kills++;e.dead=true;score.textContent=`${String(kills).padStart(2,'0')} / 12`;if(kills===12)win();}
  function win(){mode='won';result.hidden=false;hud.hidden=true;pauseCover.hidden=true;document.body.classList.add('fw-victory','fw-wings-open');wingsOpen=true;wings.setAttribute('aria-pressed','true');keys.clear();controls();sync();}
  function shield(){if(mode!=='playing'||paused||elapsed<shieldUntil)return;shieldUntil=elapsed+7;shieldFlash=1.3;enemies.forEach(e=>{if(!e.dead)explode(e);});enemies=enemies.filter(e=>!e.dead);controls();}
  function togglePause(){if(mode!=='playing')return;paused=!paused;keys.clear();pauseCover.hidden=!paused;controls();if(!paused)wake();}
  function update(dt){elapsed+=dt;shieldFlash=Math.max(0,shieldFlash-dt);if(elapsed>=nextSpawn&&spawned<12){spawn();nextSpawn=elapsed+1.15;}if(keys.has('a')||keys.has('ArrowLeft')){playerX=Math.max(75,playerX-dt*170);movingUntil=elapsed+.12;}if(keys.has('d')||keys.has('ArrowRight')){playerX=Math.min(W*.44,playerX+dt*170);movingUntil=elapsed+.12;}if(keys.has(' '))fire(true);if(demo)fire(true);
    enemies.forEach(e=>{e.x+=e.vx*dt;e.y=e.baseY+Math.sin(elapsed*1.25+e.phase)*22;if(e.x<W*.38)e.vx=Math.abs(e.vx);if(e.x>W*.9)e.vx=-Math.abs(e.vx);});
    for(const b of bullets){const oldX=b.x,oldY=b.y;if(b.target){const e=enemies.find(e=>e.id===b.target&&!e.dead);if(e){const a=Math.atan2(e.y-b.y,e.x-b.x);b.vx=Math.cos(a)*850;b.vy=Math.sin(a)*850;}}b.x+=b.vx*dt;b.y+=b.vy*dt;b.life-=dt;const hit=enemies.find(e=>!e.dead&&segmentDistance(e.x,e.y,oldX,oldY,b.x,b.y)<e.r+5);if(hit){b.life=0;explode(hit);}}
    enemies=enemies.filter(e=>!e.dead);bullets=bullets.filter(b=>b.life>0&&b.x>-50&&b.x<W+50&&b.y>-50&&b.y<H+50);
    particles.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=110*dt;p.life-=dt;});particles=particles.filter(p=>p.life>0);smoke.forEach(p=>{p.r+=dt*36;p.y-=dt*24;p.life-=dt;});smoke=smoke.filter(p=>p.life>0);if(mode==='playing'&&shieldButton.disabled&&elapsed>=shieldUntil&&!paused)shieldButton.disabled=false;
  }
  function line(points,stroke,width=1){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke();}
  function bug(e){ctx.save();ctx.translate(e.x,e.y);const s=e.r/34;ctx.scale(s,s);const flap=reduced?0:Math.sin(elapsed*17+e.phase)*9;
    ctx.strokeStyle='#58636c';ctx.lineWidth=2;for(let side of[-1,1])for(let i=0;i<3;i++)line([[side*19,-12+i*12],[side*(34+i*3),-20+i*17],[side*(45+i*4),-12+i*19]],'#73828a',2);
    ctx.fillStyle='#8fa6ad27';ctx.strokeStyle='#8ca2ab6b';for(let side of[-1,1]){ctx.beginPath();ctx.ellipse(side*33,-8-flap,37,9+Math.abs(flap),side*.35,0,Math.PI*2);ctx.fill();ctx.stroke();}
    const metal=ctx.createLinearGradient(-25,0,25,0);metal.addColorStop(0,'#172127');metal.addColorStop(.43,'#73818a');metal.addColorStop(.52,'#2b3942');metal.addColorStop(1,'#0a1015');ctx.fillStyle=metal;ctx.beginPath();ctx.ellipse(0,0,23,34,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#a2abb2';ctx.lineWidth=1;ctx.stroke();
    ctx.save();ctx.beginPath();ctx.ellipse(0,0,22,33,0,0,Math.PI*2);ctx.clip();for(let i=-2;i<3;i++){ctx.fillStyle='#b9793c';ctx.fillRect(-26,i*14,52,5);}ctx.restore();line([[0,-30],[0,31]],'#111b21',3);ctx.fillStyle='#132029';ctx.beginPath();ctx.ellipse(0,-29,16,12,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#e5ab65';ctx.shadowColor='#e59a38';ctx.shadowBlur=10;ctx.fillRect(-10,-34,6,3);ctx.fillRect(4,-34,6,3);ctx.shadowBlur=0;line([[-8,-38],[-17,-50]],'#91a0a9',1);line([[8,-38],[17,-50]],'#91a0a9',1);ctx.restore();}
  function ship(e){ctx.save();ctx.translate(e.x,e.y);ctx.fillStyle='#18252e';ctx.strokeStyle='#8b9da5';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(-62,4);ctx.lineTo(-24,-13);ctx.lineTo(-9,-28);ctx.lineTo(15,-28);ctx.lineTo(30,-10);ctx.lineTo(62,4);ctx.lineTo(35,20);ctx.lineTo(-38,20);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#c28140';ctx.fillRect(-37,10,74,3);ctx.fillStyle='#76a6b4';ctx.fillRect(-8,-20,23,9);for(let x=-30;x<40;x+=18){ctx.fillStyle='#d5a064';ctx.fillRect(x,23,6,3);}ctx.restore();}
  function heroine(){const x=playerX,y=H*.86,t=elapsed*10,run=mode==='playing'&&(elapsed<movingUntil||demo);ctx.save();ctx.translate(x,y);const scale=W<900?1.1:1.05;ctx.scale(scale,scale);ctx.translate(0,run?Math.sin(t*2)*2:0);
    ctx.fillStyle='#040b0f80';ctx.beginPath();ctx.ellipse(5,10,55,8,0,0,Math.PI*2);ctx.fill();
    // Boots and articulated legs; a silver-edged coat and blonde silhouette.
    const stride=run?Math.sin(t)*19:7;line([[-8,-66],[-15-stride*.6,-36],[-20+stride,0]],'#0a1015',17);line([[10,-66],[19+stride*.5,-37],[30-stride,0]],'#111b20',17);line([[-7,-65],[-14-stride*.6,-36],[-19+stride,-3]],'#75888d',1.5);line([[11,-66],[20+stride*.5,-37],[31-stride,-3]],'#75888d',1.5);line([[-25+stride,1],[-9+stride,1]],'#c7d4d7',5);line([[25-stride,1],[43-stride,1]],'#c7d4d7',5);
    ctx.fillStyle='#0c161b';ctx.beginPath();ctx.moveTo(-19,-131);ctx.lineTo(19,-131);ctx.lineTo(23,-72);ctx.lineTo(36,-47);ctx.lineTo(0,-57);ctx.lineTo(-30,-48);ctx.lineTo(-17,-78);ctx.closePath();ctx.fill();line([[-18,-126],[-15,-77],[-27,-51]],'#9bb1b4',2);line([[17,-127],[20,-76],[32,-51]],'#9bb1b4',2);line([[-17,-88],[21,-88]],'#bac9c8',4);
    ctx.fillStyle='#c8d2cc';ctx.fillRect(-5,-143,11,15);ctx.beginPath();ctx.ellipse(0,-154,13,18,-.06,0,Math.PI*2);ctx.fill();ctx.fillStyle='#a6a698';ctx.beginPath();ctx.moveTo(-12,-167);ctx.bezierCurveTo(-28,-150,-18,-129,-35,-110);ctx.bezierCurveTo(-8,-119,-7,-140,-8,-149);ctx.lineTo(10,-162);ctx.bezierCurveTo(20,-151,7,-132,18,-115);ctx.bezierCurveTo(27,-144,18,-172,1,-175);ctx.closePath();ctx.fill();line([[-11,-163],[-15,-138],[-28,-115]],'#e2e0ce',2);ctx.fillStyle='#27414c';ctx.fillRect(5,-158,5,2);
    const from=origin(),aim=enemies.length&&demo?enemies[0]:pointer,angle=clamp(Math.atan2(aim.y-from.y,aim.x-from.x),-1.35,.2);line([[-15,-125],[7,-111],[37,-126]],'#b5c5c7',9);line([[16,-124],[26,-111],[51,-129]],'#7f999f',9);ctx.save();ctx.translate(34,-124);ctx.rotate(angle);ctx.fillStyle='#1c2b33';ctx.strokeStyle='#abc3c8';ctx.lineWidth=1;ctx.fillRect(-13,-10,72,20);ctx.strokeRect(-13,-10,72,20);ctx.fillStyle='#91a9ad';ctx.fillRect(57,-12,9,24);ctx.fillStyle='#121f27';ctx.fillRect(5,10,8,14);ctx.fillStyle='#8caeae';ctx.fillRect(34,-15,12,4);ctx.restore();ctx.restore();}
  function draw(){if(!ctx)return;ctx.clearRect(0,0,W,H);const bg=ctx.createLinearGradient(0,0,0,H);bg.addColorStop(0,'#0a1722');bg.addColorStop(.62,mode==='won'?'#28413a':'#1b2930');bg.addColorStop(1,'#091513');ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
    for(const st of stars){ctx.fillStyle='#d9e6eb77';ctx.beginPath();ctx.arc(st.x*W,st.y*H,st.r,0,Math.PI*2);ctx.fill();}
    const moon=ctx.createRadialGradient(W*.22,H*.23,0,W*.22,H*.23,W*.28);moon.addColorStop(0,'#a9c5d11b');moon.addColorStop(1,'#a9c5d100');ctx.fillStyle=moon;ctx.fillRect(0,0,W,H*.8);
    for(let i=0;i<6;i++){ctx.fillStyle=`rgba(8,17,22,${.1+i*.035})`;ctx.beginPath();ctx.moveTo(0,H);for(let x=0;x<=W+20;x+=25)ctx.lineTo(x,H*(.7+i*.025)+Math.sin(x*.008+i*2)*20);ctx.lineTo(W,H);ctx.fill();}
    for(let i=0;i<70;i++){const x=(i*123.7)%W,y=H*.88+(i%7)*H*.016;line([[x,y],[x-4,y-13-(i%4)*4]],'#52766a',1);if(mode==='won'||i%5===0){ctx.fillStyle=i%3?'#aebfa7':'#d4b6c1';ctx.beginPath();ctx.arc(x-4,y-14-(i%4)*4,2+(i%2),0,Math.PI*2);ctx.fill();}}
    if(mode==='idle'){for(let i=0;i<3;i++)bug({x:W*(.62+i*.12),y:H*(.29+i*.1),r:32,phase:i});}else enemies.forEach(e=>e.ship?ship(e):bug(e));
    smoke.forEach(p=>{ctx.fillStyle=`rgba(7,12,16,${Math.max(0,p.life)*.6})`;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();});
    bullets.forEach(b=>{ctx.save();ctx.strokeStyle='#c8f4e5';ctx.shadowColor='#addecf';ctx.shadowBlur=reduced?0:12;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(b.x,b.y);ctx.lineTo(b.x-b.vx*.022,b.y-b.vy*.022);ctx.stroke();ctx.restore();});
    particles.forEach(p=>{ctx.globalAlpha=Math.max(0,p.life);ctx.fillStyle=p.color;ctx.fillRect(p.x,p.y,p.r,p.r);});ctx.globalAlpha=1;heroine();
    if(shieldFlash>0){ctx.save();ctx.globalAlpha=Math.min(.55,shieldFlash*.5);line([[W*.04,H*.42],[W*.4,H*.25],[W*.5,H*.08],[W*.6,H*.25],[W*.96,H*.42]],'#d2e9e2',14);ctx.restore();}
    if(mode==='playing'&&!demo){ctx.strokeStyle='#c5dcd277';ctx.lineWidth=1;ctx.beginPath();ctx.arc(pointer.x,pointer.y,13,0,Math.PI*2);ctx.moveTo(pointer.x-20,pointer.y);ctx.lineTo(pointer.x-8,pointer.y);ctx.moveTo(pointer.x+8,pointer.y);ctx.lineTo(pointer.x+20,pointer.y);ctx.moveTo(pointer.x,pointer.y-20);ctx.lineTo(pointer.x,pointer.y-8);ctx.stroke();}
  }
  function tick(time){raf=0;if(document.hidden||!onScreen||paused||mode!=='playing'){previous=0;return;}let remaining=previous?Math.min((time-previous)/1000,.25):.016;previous=time;while(remaining>0&&mode==='playing'){const step=Math.min(remaining,1/60);update(step);remaining-=step;}draw();if(mode==='playing')raf=requestAnimationFrame(tick);}
  function wake(){if(!raf&&!document.hidden&&onScreen&&!paused&&mode==='playing'){previous=0;raf=requestAnimationFrame(tick);}}
  new IntersectionObserver(entries=>{onScreen=entries[0].isIntersecting;if(onScreen)wake();else keys.clear();},{threshold:.08}).observe(canvas);
  canvas.addEventListener('pointermove',e=>{const r=canvas.getBoundingClientRect();pointer={x:(e.clientX-r.left)/r.width*W,y:(e.clientY-r.top)/r.height*H};});
  canvas.addEventListener('pointerdown',e=>{if(mode!=='playing')return;const r=canvas.getBoundingClientRect();pointer={x:(e.clientX-r.left)/r.width*W,y:(e.clientY-r.top)/r.height*H};canvas.focus({preventScroll:true});fire(false);});
  canvas.addEventListener('keydown',e=>{if([' ','ArrowLeft','ArrowRight','a','d','A','D','p','P','Escape'].includes(e.key)){e.preventDefault();if(e.key==='p'||e.key==='P'||e.key==='Escape'){if(!e.repeat)togglePause();}else{keys.add(e.key.length===1?e.key.toLowerCase():e.key);if(e.key===' '&&!e.repeat)fire(true);}}});
  canvas.addEventListener('keyup',e=>keys.delete(e.key.length===1?e.key.toLowerCase():e.key));canvas.addEventListener('blur',()=>keys.clear());
  startButton.addEventListener('click',()=>begin(false));$('[data-fw-demo]').addEventListener('click',()=>begin(true));$('[data-fw-again]').addEventListener('click',()=>begin(false));fireButton.addEventListener('click',()=>fire(true));shieldButton.addEventListener('click',shield);pauseButton.addEventListener('click',togglePause);
  document.addEventListener('visibilitychange',()=>{scenes.forEach(e=>e.classList.toggle('fw-inview',visibleScenes.has(e)&&!document.hidden));keys.clear();if(!document.hidden){wake();wakeOcean();}});
  let resizeTimer;addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{oceans.forEach(o=>{sizeOcean(o);paintOcean(o,performance.now());});resizeGame();wake();},160);});
  // Add the finished recording at this URL later; no missing audio request is made now.
  const recording=$('[data-fw-track]');if(recording.getAttribute('src')){recording.hidden=false;$('[data-fw-track-note]').hidden=true;}
  game={labels};resizeGame();sync();
})();
