# Templates

## Artikel-Templates aktualisieren

1. [starterkit/scripts/build-templates.js](../scripts/build-templates) öffnen
2. Ganz unten sind URLs von Vorlagenartikel
3. Die in Vivi öffnen, veröffentlichen
4. Script laufen lassen `npm run chore:build-templates`
5. Artikel wieder depublizieren (wichtig, sonst tauchen die überall auf!)

## Homepage-Template aktualisieren

1. [www.zeit.de](http://www.zeit.de/index) öffnen
2. Quelltext anzeigen, kopieren
3. Unsere Embeds (Dashboards, Wie geht es Ihnen heute) von Hand rauslöschen (inklusive deren CSS-/Javascript-Tags!)
4. Von Hand wieder Kommentare für Slots einbauen (siehe [raw/hp.html](altes Template), nach »slot« suchen)
5. Inhalt von `starterkit/templates/raw/hp.html` damit ersetzen

## Neues Artikel-Template anlegen

Zum Beispiel falls es ein neues Ressort gibt

1. In Vivi einen neuen Artikel anlegen, am besten im Ordner [administratives/embeds/vorlagen](https://vivi.zeit.de/repository/administratives/embeds/vorlagen), dabei Namenskonvention beachten.
2. Überschrift, Kicker usw. mit Platzhaltern ausfüllen (siehe andere Vorlagen für Details)
3. Ganz unten im [Skript](../scripts/build-templates.js) hinzufügen
4. Artikel veröffentlichen
5. Script laufen lassen `npm run chore:build-templates`
6. Artikel wieder depublizieren (wichtig, sonst taucht der überall auf!)
7. Im [Article-Component](/starterkit/templates/ArticleTemplate.jsx) einfügen

## Neues eigenes Template anlegen

Man orientiere sich z. B. am `CpTemplate` oder dem `EmptyTemplate`.

Dafür sorgen, dass ViviEmbeds korrekt funktionieren:

```jsx
let viviContextValue = useContext(ViviContext);
viviContextValue = {...viviContextValue, paywall: false, pagetype: 'custom'};

return (
  <ViviContext.Provider value={viviContextValue}>
    /* hier alles machen was ihr wollt */
  </ViviContext.Provider>
);
```
