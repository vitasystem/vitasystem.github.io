(() => {
const title=document.querySelector('#youtube-clips-title');
if(!title)return;
const update=()=>{title.textContent=document.documentElement.lang==='en'?'Music Videos':'Відеокліпи';};
update();
new MutationObserver(update).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
})();
