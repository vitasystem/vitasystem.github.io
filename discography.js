(() => {
  'use strict';
  const page = document.body.classList.contains('discography-page');
  const scopes = page ? [document.body] : [...document.querySelectorAll('.discography-portal')];
  if (!scopes.length) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const lang = () => document.documentElement.lang === 'en' ? 'en' : 'uk';
  const data = document.getElementById('dg-release-data');
  const releases = data ? JSON.parse(data.textContent) : [];
  let current = null;
  const audio = document.querySelector('.dg-player audio');
  const dock = document.querySelector('.dg-player');
  const viewer = document.querySelector('.dg-viewer');
  let viewed = null;
  function localize() {
    const language = lang();
    scopes.forEach(scope => {
      scope.querySelectorAll('[data-dg-uk][data-dg-en]').forEach(el => {
        const value = el.dataset[language === 'en' ? 'dgEn' : 'dgUk'];
        if (el.textContent !== value) el.textContent = value;
      });
    });
    document.querySelectorAll('[data-dg-aria-uk]').forEach(el => el.setAttribute('aria-label',el.dataset[language === 'en' ? 'dgAriaEn' : 'dgAriaUk']));
    document.querySelectorAll('[data-dg-alt-uk]').forEach(el => el.alt = el.dataset[language === 'en' ? 'dgAltEn' : 'dgAltUk']);
    if (page) {
      document.title = language === 'en' ? 'VITA Discography — Albums and Singles' : 'Дискографія ВІТИ — Альбоми та Сингли';
      document.querySelector('meta[name="description"]').content = language === 'en' ? 'VITA Discography: albums, singles, cover art and music from the VITA System.' : 'Дискографія ВІТИ: альбоми, сингли, обкладинки та музика Системи Віта.';
      document.querySelectorAll('[data-language]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.language===language)));
      const menuToggle=document.getElementById('menuToggle');
      if(menuToggle) menuToggle.setAttribute('aria-label',language==='en'?(menuToggle.getAttribute('aria-expanded')==='true'?'Close menu':'Open menu'):(menuToggle.getAttribute('aria-expanded')==='true'?'Закрити меню':'Відкрити меню'));
      if (current) document.querySelector('[data-dg-current]').textContent=language==='en'?current.en:current.title;
      if (viewed) {viewer.querySelector('img').alt=language==='en'?viewed.en:viewed.title;viewer.querySelector('p').textContent=language==='en'?viewed.en:viewed.title;}
      updatePreviewButtons();
    }
  }
  new MutationObserver(localize).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  document.querySelectorAll('[data-language]').forEach(el=>el.addEventListener('click',()=>queueMicrotask(localize)));
  addEventListener('pageshow',()=>queueMicrotask(localize));

  if (page) {
    const menu=document.getElementById('mobileMenu'),toggle=document.getElementById('menuToggle');
    const closeMenu=()=>{menu.classList.remove('open');menu.setAttribute('aria-hidden','true');toggle.setAttribute('aria-expanded','false');document.body.classList.remove('menu-open');localize();};
    toggle?.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';menu.classList.toggle('open',open);menu.setAttribute('aria-hidden',String(!open));toggle.setAttribute('aria-expanded',String(open));document.body.classList.toggle('menu-open',open);localize();});
    menu?.querySelectorAll('a').forEach(el=>el.addEventListener('click',closeMenu));
    document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
    document.querySelectorAll('[data-dg-photo]').forEach(button=>button.addEventListener('click',()=>{
      viewed=releases.find(r=>r.id===Number(button.dataset.dgPhoto));
      viewer.querySelector('img').src=viewed.image;localize();viewer.showModal();
    }));
    viewer.querySelector('.dg-viewer-close').addEventListener('click',()=>viewer.close());
    viewer.addEventListener('click',e=>{if(e.target===viewer){const r=viewer.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)viewer.close();}});
    let filter='all',expanded=false;
    const cards=[...document.querySelectorAll('[data-dg-kind]')],more=document.querySelector('[data-dg-more]');
    function filterCards() {
      const matches=cards.filter(el=>filter==='all'||el.dataset.dgKind===filter);
      cards.forEach(el=>el.hidden=!matches.includes(el)||(!expanded&&matches.indexOf(el)>=6));
      more.hidden=expanded||matches.length<=6;
      more.parentElement.hidden=more.hidden;
    }
    document.querySelectorAll('[data-dg-filter]').forEach(button=>button.addEventListener('click',()=>{
      filter=button.dataset.dgFilter;expanded=false;
      document.querySelectorAll('[data-dg-filter]').forEach(el=>el.setAttribute('aria-pressed',String(el===button)));
      filterCards();
    }));
    more.addEventListener('click',()=>{expanded=true;filterCards();});filterCards();
    document.querySelectorAll('[data-dg-play]').forEach(button=>button.addEventListener('click',async()=>{
      const selected=releases.find(r=>r.id===Number(button.dataset.dgPlay));
      if (current?.id===selected.id&&!audio.paused) {audio.pause();return;}
      if (current?.id!==selected.id) {current=selected;audio.src=selected.audio;document.querySelector('.dg-audio-error').hidden=true;}
      dock.hidden=false;localize();
      try {await audio.play();} catch {document.querySelector('.dg-audio-error').hidden=false;}
    }));
    ['play','pause','ended'].forEach(event=>audio.addEventListener(event,updatePreviewButtons));
    audio.addEventListener('error',()=>{document.querySelector('.dg-audio-error').hidden=false;});
    document.querySelector('[data-dg-close-player]').addEventListener('click',()=>{audio.pause();dock.hidden=true;});
  }
  function updatePreviewButtons() {
    if(!audio)return;
    document.querySelectorAll('[data-dg-play]').forEach(button=>{
      const selected=current?.id===Number(button.dataset.dgPlay),playing=selected&&!audio.paused;
      button.querySelector('span').textContent=playing?'Ⅱ':'▶';
      const release=releases.find(r=>r.id===Number(button.dataset.dgPlay));
      button.setAttribute('aria-label',(lang()==='en'?(playing?'Pause: ':'Listen: '):(playing?'Пауза: ':'Слухати: '))+(lang()==='en'?release.en:release.title));
      button.setAttribute('aria-pressed',String(playing));
      button.closest('.dg-release').classList.toggle('is-playing',playing);
    });
  }
  localize();

  // Independent effects are active only while their scene is visible.
  let seed=224;
  const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  const scenes=[...document.querySelectorAll('.dg-scene:has(.dg-atmosphere)')].map(root=>{
    const stars=root.querySelector('[data-dg-stars]'),fog=root.querySelector('[data-dg-fog]');
    return {root,stars,fog,ctx:stars.getContext('2d'),visible:false,width:0,height:0,flightUntil:0,particles:Array.from({length:innerWidth<700?65:125},()=>({x:random(),y:random(),r:.4+random()*1.2,t:random()*6.28,s:.35+random()*.65})),smoke:createFog(fog,root)};
  });
  const sceneObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
    const scene=scenes.find(s=>s.root===entry.target);if(!scene)return;
    scene.visible=entry.isIntersecting;scene.root.classList.toggle('dg-visible',entry.isIntersecting&&!document.hidden);if(entry.isIntersecting){resizeScene(scene);if(reduced.matches)drawScene(scene,0);}
  }),{rootMargin:'80px',threshold:0});
  scenes.forEach(s=>sceneObserver.observe(s.root));
  document.addEventListener('visibilitychange',()=>scenes.forEach(s=>s.root.classList.toggle('dg-visible',s.visible&&!document.hidden))); 
  function resizeScene(s) {
    const rect=s.root.getBoundingClientRect();s.width=rect.width;s.height=rect.height;
    const ratio=Math.min(devicePixelRatio||1,1.5);s.stars.width=Math.round(rect.width*ratio);s.stars.height=Math.round(rect.height*ratio);s.ctx?.setTransform(ratio,0,0,ratio,0,0);
    s.smoke?.resize(rect.width,rect.height);
  }
  new ResizeObserver(entries=>entries.forEach(e=>{const s=scenes.find(s=>s.root===e.target);if(s)resizeScene(s);})).observe(document.querySelector('.dg-atmosphere').parentElement);
  function drawScene(s,time) {
    const ctx=s.ctx;if(!ctx)return;const w=s.width,h=s.height;ctx.clearRect(0,0,w,h);
    const rush=s.flightUntil>time&&!reduced.matches;
    for(const p of s.particles){
      let x=p.x*w,y=p.y*h;const a=.15+.55*(.5+.5*Math.sin(time*.0006*p.s+p.t));
      ctx.fillStyle=`rgba(238,211,237,${a})`;
      if(rush){const dx=x-w*.5,dy=y-h*.55;ctx.strokeStyle=`rgba(235,159,207,${a*.5})`;ctx.lineWidth=.6;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+dx*.09,y+dy*.09);ctx.stroke();}
      ctx.beginPath();ctx.arc(x,y,p.r,0,Math.PI*2);ctx.fill();
      if(p.r>1.35){ctx.strokeStyle=`rgba(247,205,237,${a*.4})`;ctx.lineWidth=.5;ctx.beginPath();ctx.moveTo(x-4,y);ctx.lineTo(x+4,y);ctx.moveTo(x,y-4);ctx.lineTo(x,y+4);ctx.stroke();}
    }
    s.smoke?.draw(time*.001);
  }
  let last=0;
  function frame(now){requestAnimationFrame(frame);if(document.hidden||reduced.matches||now-last<66)return;last=now;scenes.filter(s=>s.visible).forEach(s=>drawScene(s,now));}
  requestAnimationFrame(frame);
  reduced.addEventListener('change',()=>{if(reduced.matches){scenes.filter(s=>s.visible).forEach(s=>drawScene(s,0));positionFlights(false);}});

  const stage=document.querySelector('.dg-flight-stage'),objects=[...document.querySelectorAll('[data-dg-fly]')];
  let flightAnimations=[];
  let flightRunId=0, flightInProgress=false, flightResizePending=false;
  let measuredStageWidth=0, measuredStageHeight=0;
  function positionFlights(animate) {
    if(!stage)return;
    const w=stage.clientWidth,h=stage.clientHeight;
    if(!w||!h)return;
    const runId=++flightRunId;
    flightAnimations.forEach(a=>a.cancel());flightAnimations=[];
    measuredStageWidth=w;measuredStageHeight=h;
    flightInProgress=Boolean(animate&&!reduced.matches);
    flightResizePending=false;
    objects.forEach((el,i)=>{
      el.classList.remove('is-orbiting');
      const x=Number(el.dataset.x)*w/100,y=Number(el.dataset.y)*h/100;
      el.style.setProperty('--dg-x',String(x));el.style.setProperty('--dg-y',String(y));
      const angle=i*31-60;
      const end=`translate(-50%,-50%) translate3d(${x}px,${y}px,0) rotate(${angle}deg)`;
      if(animate&&!reduced.matches){
        const a=el.animate([
          {transform:`translate(-50%,-50%) translate3d(${x*.06}px,${y*.06}px,-1600px) rotate(${angle-130}deg) scale(.1)`,opacity:0,offset:0},
          {transform:`translate(-50%,-50%) translate3d(${x*.13}px,${y*.13}px,320px) rotate(${angle+35}deg) scale(1.12)`,opacity:1,offset:.35},
          {transform:`translate(-50%,-50%) translate3d(${x*.4}px,${y*.4}px,110px) rotate(${angle+12}deg) scale(1)`,opacity:1,offset:.48},
          {transform:end,opacity:.88,offset:1}
        ],{duration:2450+i*32,delay:i*38,easing:'cubic-bezier(.22,.55,.22,1)',fill:'both'});
        flightAnimations.push(a);a.finished.then(()=>{a.cancel();el.classList.add('is-orbiting');}).catch(()=>{});
      }else el.classList.add('is-orbiting');
    });
    if(animate&&!reduced.matches){
      const heroScene=scenes.find(s=>s.root.classList.contains('dg-flight-hero'));if(heroScene)heroScene.flightUntil=performance.now()+3300;
      document.querySelector('.dg-flash').animate([{opacity:0},{opacity:.5,offset:.35},{opacity:0,offset:1}],{duration:850,delay:520,easing:'ease-out'});
      // The mobile address bar may fire resize during the first entrance.
      // Defer any true geometry correction until all flight animations land.
      Promise.allSettled(flightAnimations.map(a=>a.finished)).then(()=>{
        if(runId!==flightRunId)return;
        flightInProgress=false;
        if(flightResizePending){
          flightResizePending=false;
          if(Math.abs(stage.clientWidth-measuredStageWidth)>1 ||
             Math.abs(stage.clientHeight-measuredStageHeight)>1)positionFlights(false);
        }
      });
    }
  }
  addEventListener('resize',()=>{
    scenes.forEach(resizeScene);
    if(!stage)return;
    // Ignore height-only changes from expanding/collapsing mobile browser bars.
    const widthChanged=Math.abs(stage.clientWidth-measuredStageWidth)>1;
    if(!widthChanged)return;
    if(flightInProgress){flightResizePending=true;return;}
    positionFlights(false);
  },{passive:true});
  if(stage){
    // Let CSS/layout settle before starting the very first entrance.
    requestAnimationFrame(()=>requestAnimationFrame(()=>positionFlights(true)));
    document.querySelector('[data-dg-replay]').addEventListener('click',()=>positionFlights(true));
  }

  function createFog(canvas,root){
    const gl=canvas.getContext('webgl',{alpha:true,premultipliedAlpha:false,antialias:false,depth:false,powerPreference:'low-power'});
    if(!gl){root.classList.add('dg-no-webgl');root.dataset.dgFogMode='fallback-context';return null;}
    const vertex='attribute vec2 p;varying mediump vec2 uv;void main(){uv=p*.5+.5;gl_Position=vec4(p,0.,1.);}';
    const fragment=`precision mediump float;
varying mediump vec2 uv;uniform float time;uniform vec2 resolution;
float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;mat2 m=mat2(.8,-.6,.6,.8);for(int i=0;i<4;i++){v+=a*noise(p);p=m*p*2.05+vec2(7.1,3.7);a*=.5;}return v;}
void main(){
 vec2 q=uv;float aspect=resolution.x/resolution.y;vec2 p=vec2(q.x*aspect,q.y)*3.;
 float t=time*.055;vec2 flow=vec2(fbm(p*.75+vec2(t*.32,-t*.12)),fbm(p*.8+vec2(8.4,-t*.24)));
 float n=fbm(p*1.6+flow*3.4-vec2(t*.5,t*.12));
 float fine=fbm(p*3.8+flow*5.-vec2(t*.7,0.));
 float bottom=1.-smoothstep(.05,.57,q.y);float sides=pow(abs(q.x-.5)*2.,2.4)*.55;
 float wave=.15+.06*sin(q.x*7.+t*.4);float ribbon=exp(-pow((q.y-wave)*5.5,2.));
 float shape=max(bottom*.8,sides*(.3+.7*(1.-q.y)))+ribbon*.25;
 float density=smoothstep(.3,.75,n*.78+fine*.22)*shape;
 float light=smoothstep(.32,.8,n+fine*.15);
 vec3 silver=mix(vec3(.31,.29,.36),vec3(.7,.65,.73),light);
 vec3 pink=vec3(.58,.22,.4);vec3 color=mix(silver,pink,smoothstep(.45,.95,q.x)*.65);
 float alpha=min(density*.9,.55);gl_FragColor=vec4(color,alpha);
}`;
    function compile(type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){root.dataset.dgFogError=gl.getShaderInfoLog(s);gl.deleteShader(s);return null;}return s;}
    const vs=compile(gl.VERTEX_SHADER,vertex),fs=compile(gl.FRAGMENT_SHADER,fragment);
    if(!vs||!fs){root.classList.add('dg-no-webgl');return null;}
    const program=gl.createProgram();gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);
    if(!gl.getProgramParameter(program,gl.LINK_STATUS)){root.dataset.dgFogError=gl.getProgramInfoLog(program);root.classList.add('dg-no-webgl');return null;}
    root.dataset.dgFogMode='webgl';gl.useProgram(program);const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
    const pos=gl.getAttribLocation(program,'p');gl.enableVertexAttribArray(pos);gl.vertexAttribPointer(pos,2,gl.FLOAT,false,0,0);
    const time=gl.getUniformLocation(program,'time'),resolution=gl.getUniformLocation(program,'resolution');
    canvas.addEventListener('webglcontextlost',()=>root.classList.add('dg-no-webgl'));
    return {resize(w,h){const ratio=Math.min(.4,360/w);canvas.width=Math.max(1,Math.round(w*ratio));canvas.height=Math.max(1,Math.round(h*ratio));gl.viewport(0,0,canvas.width,canvas.height);gl.uniform2f(resolution,canvas.width,canvas.height);},draw(t){if(gl.isContextLost())return;gl.uniform1f(time,t);gl.drawArrays(gl.TRIANGLES,0,6);}};
  }
})();
