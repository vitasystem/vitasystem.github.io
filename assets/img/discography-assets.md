# VITA Discography image slots

Each release cover has its own replaceable file. Replace the WebP at the same path (square format, preferably 1200×1200 or larger) to update both its gallery card and the flying-cover animation. Text labels remain independent of artwork.

The first three covers are intentional temporary mismatches, approved by the site owner. No release dates have been invented.

| File | Label on site | Current artwork |
| --- | --- | --- |
| discography-cover-01.webp | Теракотовий Слон | Не-Колишній |
| discography-cover-02.webp | На Площі Сонця | Нічний Париж |
| discography-cover-03.webp | Траса 224 | Система ВІТА |
| discography-cover-04.webp | Хто Випустив Собак? | Хто Випустив Собак? |
| discography-cover-05.webp | Leroy | Leroy |
| discography-cover-06.webp | 500 Років Тисячі Планет | 500 Років Тисячі Планет |
| discography-cover-07.webp | Принцеса з Іншої Планети | Принцеса з Іншої Планети |
| discography-cover-08.webp | Стрьомна Паті | Стрьомна Паті |
| discography-cover-09.webp | ДилеR | ДилеR |

The three silver CDs on the homepage are CSS artwork. To replace them with transparent disc PNGs later, set `--dg-cd-art: url("assets/img/your-disc.png")` on each `.dg-featured-N`. The disc rotation is separate from its fixed caption. Keep the disc artwork centered in a square transparent image.

`discography-mist.webp` is the textured fallback for the animated fog. The main fog uses a procedural animated WebGL texture, with a moving-image fallback when WebGL is unavailable. Effects pause offscreen and when the tab is hidden; reduced-motion mode keeps a static composition.
