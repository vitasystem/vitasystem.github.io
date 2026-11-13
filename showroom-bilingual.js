/* VITA SYSTEM — bilingual layer for the music showroom catalog and 7 song pages.
   Preserves DOM markup, existing audio controls, artwork, purchase modal and mobile menu.
   Ukrainian song titles intentionally stay in their official original spelling. */
(() => {
  'use strict';
  const config = window.VITA_SHOWROOM_TRANSLATIONS;
  if (!config || !Array.isArray(config.shared)) return;
  const page = location.pathname.split('/').pop();
  const pagePairs = config.maps && config.maps[page];
  if (!pagePairs) return;
  const dictionary = Object.assign(Object.create(null), Object.fromEntries(config.shared), Object.fromEntries(pagePairs));
  const officialTitle = document.title;
  const officialDescription = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
  const originalText = new WeakMap(), originalAttr = new WeakMap();
  const storageKey = 'vita-language';
  const valid = s => s === 'uk' || s === 'en';
  const stored = () => { try { return localStorage.getItem(storageKey); } catch { return null; } };
  const norm = s => String(s).replace(/\s+/g,' ').trim();
  let language = 'uk';
  const songName = {
    'song-trasa-224.html':'Траса 224',
    'song-ne-kolyshnii.html':'Не-Колишній',
    'song-hto-vypustyv-sobak.html':'Хто випустив собак?',
    'song-sribni-doshi.html':'Срібні Дощі',
    'song-terakotovyi-slon.html':'Теракотовий Слон',
    'song-tsukerkovyi-dyler.html':'Цукерковий ДилеR',
    'song-vanilni-mosty.html':'Ванільні Мости'
  }[page] || '';
  const englishTitle = songName ? ('VITA — ' + songName + ' | Music Showroom, Preview & Lyrics') : 'VITA MUSIC SHOWROOMS — VITA’s Music Worlds';
  const englishDescription = songName
    ? ('Explore VITA’s «' + songName + '»: visual music showroom, audio preview, English lyrics and MP3 purchase for $1 via Instagram.')
    : 'Explore VITA MUSIC SHOWROOMS: eight immersive song worlds, visuals, lyrics and links to every VITA single.';

  function lookup(source) {
    const value = norm(source);
    if (Object.prototype.hasOwnProperty.call(dictionary,value)) return dictionary[value];
    let match;
    if ((match = value.match(/^Відкрити шоурум «(.+)»$/))) return 'Open the «' + match[1] + '» showroom';
    if ((match = value.match(/^Музичний диск «(.+)»$/))) return 'Music record for «' + match[1] + '»';
    if ((match = value.match(/^Відкрити або закрити повний текст пісні (.+)$/))) return 'Expand or collapse the full lyrics of ' + match[1];
    if ((match = value.match(/^Переглянути інформацію про текст пісні «(.+)»$/))) return 'Open the lyrics of «' + match[1] + '»';
    if ((match = value.match(/^Візуальний світ пісні (.+)$/))) return 'Visual world of song ' + match[1];
    if ((match = value.match(/^Увійти в шоурум (.+)$/))) return 'Enter the showroom for ' + match[1];
    if ((match = value.match(/^Плеєр ВІТИ — (.+)$/))) return 'VITA player — ' + match[1];
    if ((match = value.match(/^Музичний плеєр ВІТИ — (.+)$/))) return 'VITA music player — ' + match[1];
    if ((match = value.match(/^ВІТА — (.+)$/))) return 'VITA — ' + match[1];
    if ((match = value.match(/^ВІТА \/ (.+)$/))) return 'VITA / ' + match[1];
    return undefined;
  }

  const switchMarkup = '<div class="vita-showroom-lang" role="group" aria-label="Мова сайту"><button type="button" data-showroom-lang="uk" aria-label="Українська" aria-pressed="true">УКР</button><span aria-hidden="true">/</span><button type="button" data-showroom-lang="en" aria-label="Англійська" aria-pressed="false">ENG</button></div>';

  function control() {
    const head = document.querySelector('header.site-head,header.site-header');
    if (!head) return;
    if (!head.querySelector(':scope > .vita-showroom-lang')) head.insertAdjacentHTML('beforeend',switchMarkup);
    const menu = head.querySelector('.vita-showroom-mobile-menu-panel');
    if (menu && !menu.querySelector('.vita-showroom-lang')) menu.insertAdjacentHTML('beforeend',switchMarkup);
  }
  function syncControls() {
    document.querySelectorAll('.vita-showroom-lang').forEach(group => {
      group.setAttribute('aria-label', language === 'en' ? 'Site language' : 'Мова сайту');
      group.querySelectorAll('button[data-showroom-lang]').forEach(b => b.setAttribute('aria-pressed',String(b.dataset.showroomLang === language)));
    });
  }
  function text(node) {
    if (node.nodeType !== Node.TEXT_NODE || !node.nodeValue || !node.nodeValue.trim()) return;
    const host = node.parentElement;
    if (!host || host.closest('script,style,noscript,.vita-showroom-lang')) return;
    let previous = originalText.get(node);
    if (previous && node.nodeValue !== previous.uk && node.nodeValue !== previous.en) {
      originalText.delete(node); previous = undefined; // player or catalog changed this dynamic label
    }
    if (language === 'uk') {
      if (previous && node.nodeValue !== previous.uk) node.nodeValue = previous.uk;
      return;
    }
    const source = previous ? previous.uk : node.nodeValue;
    const translated = lookup(source);
    if (translated == null) return;
    const next = source.match(/^\s*/)[0] + translated + source.match(/\s*$/)[0];
    if (node.nodeValue !== next) {
      originalText.set(node,{uk:source,en:next});
      node.nodeValue = next;
    }
  }
  function attribute(el) {
    if (el.nodeType !== Node.ELEMENT_NODE || el.closest('.vita-showroom-lang')) return;
    for (const key of ['aria-label','title','alt','placeholder']) {
      const val = el.getAttribute(key);
      if (val === null || !val) continue;
      let old = originalAttr.get(el)?.get(key);
      if (old && val !== old.uk && val !== old.en) old = undefined;
      if (language === 'uk') {
        if (old && val !== old.uk) el.setAttribute(key,old.uk);
        continue;
      }
      const source = old ? old.uk : val;
      const translated = lookup(source);
      if (translated == null || source === translated) continue;
      let props = originalAttr.get(el);
      if (!props) { props = new Map();originalAttr.set(el,props); }
      props.set(key,{uk:source,en:translated});
      if (val !== translated) el.setAttribute(key,translated);
    }
  }
  function rewriteLinks(root=document) {
    const anchors = root.querySelectorAll ? root.querySelectorAll('a[href]') : [];
    anchors.forEach(link => {
      const href=link.getAttribute('href');
      if (!href || href.startsWith('#') || link.hasAttribute('download')) return;
      let url;
      try { url = new URL(href,location.href); } catch { return; }
      if (url.origin !== location.origin || !(/\.html$/i.test(url.pathname) || url.pathname.endsWith('/'))) return;
      url.searchParams.set('lang',language);
      const next=url.pathname+url.search+url.hash;
      if (href !== next) link.setAttribute('href',next);
    });
  }
  function scan(root) {
    if (!root) return;
    if (root.nodeType === Node.TEXT_NODE){ text(root); return; }
    if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_NODE) return;
    if (root.nodeType === Node.ELEMENT_NODE && root.matches('script,style,noscript')) return;
    if (root.nodeType === Node.ELEMENT_NODE) attribute(root);
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    let current;
    while ((current=walker.nextNode())) text(current);
    if (root.querySelectorAll) root.querySelectorAll('[aria-label],[title],[alt],[placeholder]').forEach(attribute);
  }
  function metadata() {
    document.title = language === 'en' ? englishTitle : officialTitle;
    const description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute('content',language === 'en' ? englishDescription : officialDescription);
  }
  let watching = false;
  const observer = new MutationObserver(records => {
    observer.disconnect(); watching = false;
    try {
      let needMenu = false;
      for (const r of records) {
        if (r.type === 'characterData') text(r.target);
        else if (r.type === 'childList') {
          r.addedNodes.forEach(scan);
          needMenu = true;
        } else if (r.type === 'attributes') attribute(r.target);
      }
      if (needMenu) control();
      rewriteLinks();
      syncControls();
    } finally { watch(); }
  });
  function watch() {
    if (watching) return;
    observer.observe(document.body, {subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['href','aria-label','alt','title','placeholder']});
    watching=true;
  }
  function apply(next, updateUrl) {
    language=valid(next) ? next : 'uk';
    observer.disconnect(); watching=false;
    try {
      document.documentElement.lang=language;
      try {localStorage.setItem(storageKey,language)} catch {}
      control();
      scan(document.body);
      rewriteLinks();
      syncControls();
      metadata();
      if (updateUrl) {
        const url=new URL(location.href);
        url.searchParams.set('lang',language);
        if (url.href !== location.href) history.replaceState(history.state,'',url);
      }
    } finally { watch(); }
  }
  function init() {
    control();
    const urlLanguage = new URLSearchParams(location.search).get('lang');
    apply(valid(urlLanguage) ? urlLanguage : (valid(stored()) ? stored() : 'uk'),false);
    document.addEventListener('click',e=>{
      const b=e.target.closest('[data-showroom-lang]');
      if (b && valid(b.dataset.showroomLang)) apply(b.dataset.showroomLang,true);
    });
    addEventListener('pageshow',e=>{if(e.persisted)apply(valid(stored())?stored():language,false)});
    addEventListener('popstate',()=>{const lang=new URLSearchParams(location.search).get('lang');apply(valid(lang)?lang:language,false)});
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();