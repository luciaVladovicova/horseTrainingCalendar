# Inštalácia lokálnej aplikácie

Aplikácia nepotrebuje účet ani databázový server. Záznamy ukladá iba do úložiska prehliadača na danom zariadení.

## Publikovanie

PWA musí byť dostupná cez HTTPS. Projekt môžeš bezplatne publikovať napríklad cez GitHub Pages, Netlify alebo Cloudflare Pages. Dvojklik na `index.html` (`file://`) nestačí, pretože service worker tam nefunguje.

## Android

1. Otvor publikovanú adresu v Chrome.
2. Stlač tlačidlo **Nainštalovať aplikáciu**, ak sa zobrazí, alebo otvor menu Chrome.
3. Vyber **Nainštalovať aplikáciu** alebo **Pridať na plochu**.

## iPhone alebo iPad

1. Otvor publikovanú adresu v Safari.
2. Stlač **Zdieľať**.
3. Vyber **Pridať na plochu**.

## Zálohovanie

Tlačidlo **Záloha údajov** uloží všetky záznamy do súboru JSON. Súbor si odlož mimo aplikácie. Tlačidlom **Obnoviť zo zálohy** ho môžeš načítať na rovnakom alebo inom zariadení.

Odinštalovanie aplikácie, vymazanie údajov Safari/Chrome alebo reset zariadenia môže lokálne záznamy odstrániť. Bez cloudovej databázy sa záznamy medzi telefónom a počítačom nesynchronizujú automaticky.

## Používanie offline

Pri prvom otvorení potrebuješ internet. Počkaj na zelené hlásenie **Aplikácia je pripravená offline vrátane PDF exportu**. Potom môžeš aplikáciu zavrieť a znovu otvoriť aj bez pripojenia. Offline funguje kalendár, pridávanie a úprava udalostí, filtre, PDF export aj záloha a obnova zo súboru dostupného v zariadení.

Na aktualizáciu aplikácie sa pripoj na internet a otvor ju. Po dokončení aktualizácie aplikáciu zavri a znovu otvor. Aktualizácia nemení uložené záznamy.

Pri publikovaní nahraj aj priečinok `vendor` s knižnicou `jspdf.umd.min.js`. Knižnica a slovenské písmo sú súčasťou aplikácie, export nevyužíva externý server. Pri ďalších zmenách aplikácie zvýš verziu `CACHE` v `sw.js`, aby sa obnovili súbory uložené offline.
