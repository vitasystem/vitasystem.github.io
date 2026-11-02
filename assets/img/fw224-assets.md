# FW224 — Fatal Witch

Dedicated page: fatal-witch.html, fw224.css and fw224.js. Existing homepage and fatal-witch.js are preserved.

- fw224-storm.webp: supplied stels-vita(1).jpg, compressed without changing its composition.
- fw224-ukraine.svg: a decorative botanical map. Boundary from https://github.com/johan/world.geo.json/blob/master/countries/UKR.geo.json (Natural Earth public-domain data); includes Crimea in the single Ukraine polygon. Flowers and trees are original procedural vector artwork. No other country is depicted.
- fw224-tryzub.svg: silver treatment of the Ukrainian trident. Public-domain source geometry: https://commons.wikimedia.org/wiki/File:Coat_of_Arms_of_Ukraine.svg, simplified vector by Andrew Pertsev, 2022, based on Vasyl Krychevsky’s design. The shield is omitted; the trident geometry is preserved and mirrored as in the source.

The browser game uses original canvas-drawn fictional machines and a stylized heroine. Its opponents are mechanical insects and unmanned fantasy ships. Use heroine() / bug() / ship() for a later sprite replacement; retain collision radii and drawing anchors. No personal photographs are used for the heroine.

The exact map outline is independent of the floral decoration. Preserve Crimea when replacing it.

The 12-target scene supports pointer/touch aiming, an auto-aim fire button, Space, A/D or arrow movement, a seven-second shield recharge, pause, replay and autonomous watch mode. Sound effects are synthesized locally only after the visitor enables sound. Animation sleeps offscreen and when the page is hidden. Reduced-motion mode removes decorative CSS motion; the game remains opt-in.

The song audio and music video have not been supplied. Their page slots clearly indicate that they are forthcoming. To add audio, set src on audio[data-fw-track] in fatal-witch.html; the player is then shown automatically. Replace the marked video slot with the real clip when ready. Game sound effects are not the song.

All page copy, controls, alt text and canvas labels support Ukrainian and English through data-fw attributes, coordinated with the existing shared site-language.js.
