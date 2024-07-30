# Wie positioniere ich den Titel über/in meiner App

Regelmäßig positionieren wir den Titel und Lead direkt auf oder neben einer Visualisierung (wie z.B. [hier](https://www.sueddeutsche.de/projekte/artikel/politik/krieg-in-der-ukraine-zerstoerung-von-mariupol-e008044/) oder [hier](https://www.zeit.de/arbeit/2022-09/gemeinde-gehalt-deutschland-vergleich-daten-entwicklung)).

Dafür muss man einige wenige CSS Regeln hinterlegen, die sicherstellen, dass dies gelingt und dass aber auch die Navigation weiterhin korrekt funktioniert:

```css
.article-header {
  background: none !important;
  position: absolute;
  z-index: 1; /* oder höher, aber unter 999 */
  -webkit-transform: translate3d(0, 0, 0);
}
```

Falls die die Laufrichtung der Text-Elemente verändert werden soll, sprich folgende CSS Klassen an:

```css
.article-heading,
.byline,
.metadata,
.summary {
  text-align: center;
}
```

Falls die Geschichte hinter der Bezahlschranke ist, musst du eventuell noch folgendes hinzufügen, um sicherzustellen, dass das Z+ Element dargestellt wird:

```css
.zplus-badge {
  display: block;
}
```
