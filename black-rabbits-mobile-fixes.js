/* VITA SYSTEM / BLACK RABBITS — wrapper-only responsive corrections.
   The 6 MB game file, its mechanics and desktop scene are not edited. */
(()=>{
'use strict';
const frame=document.querySelector('#br-game-frame');
if(!frame)return;
function correctGameLayout(){
  let doc;
  try{doc=frame.contentDocument;}catch(_){return;}
  if(!doc||!doc.head||doc.getElementById('vita-rabbits-mobile-fix-style'))return;
  const arena=doc.querySelector('#arenaWrap');
  const canvas=doc.querySelector('#scene');
  const toast=doc.querySelector('#toast');
  if(!arena||!canvas||!toast)return;
  const style=doc.createElement('style');
  style.id='vita-rabbits-mobile-fix-style';
  style.textContent=`
  /* A 1000x560 canvas must stay 1000:560. Mobile keeps the taller frame
     but shows letterbox space instead of squashing circles and doorways. */
  @media (max-width:500px){
    #arenaWrap{aspect-ratio:1000/760!important;
      background:radial-gradient(ellipse at 50% 50%,#21102d 0%,#12091d 60%,#08060d 100%)!important}
    #arenaWrap #scene{
      position:absolute!important;top:50%!important;left:0!important;
      width:100%!important;height:auto!important;aspect-ratio:1000/560!important;
      transform:translateY(-50%)!important;object-fit:contain!important;
    }
  }
  /* Status updates belong below, never on top of moving targets. */
  #vitaGameStatusOutside{
    min-height:58px;display:flex;align-items:center;justify-content:center;
    padding:10px 8px 5px;margin:3px auto 1px;width:100%;
    position:relative;pointer-events:none;
  }
  #vitaGameStatusOutside #toast{
    position:static!important;top:auto!important;left:auto!important;
    bottom:auto!important;transform:none!important;
    max-width:96%!important;width:max-content;white-space:normal!important;
    line-height:1.3!important;font-size:clamp(11px,2.5vw,14px)!important;
    padding:9px 14px!important;
  }
  `;
  doc.head.appendChild(style);
  const status=doc.createElement('div');
  status.id='vitaGameStatusOutside';
  arena.insertAdjacentElement('afterend',status);
  status.appendChild(toast);
}
frame.addEventListener('load',correctGameLayout);
if(frame.contentDocument?.readyState==='complete')correctGameLayout();
})();
