# Wie mache ich meine App Vollbreit (Full width)

Oft möchte man, dass eine Visualisierung bis ganz an den Rand geht – auch auf Desktop.

Um dies zu bewerkstelligen müssen wir an 3 Orten Hand anlegen:

## 1️⃣ Maximale Breite aufheben

Die Klasse `article-body` hat stets eine maximale Breite. Diese müssen wir aufheben. Integriere deshalb an einer Stelle in deinem Sass-Code folgendes:

```css
.article-body {
  max-width: unset !important;
}
```

## 2️⃣ Padding rückgängig machen

Die Klasse `article-body` hat außerdem ein `padding` (Mobil/Desktop unterschiedlich groß).

Gib einem React-Element (am besten das erste/äußerste) zusätzlich die Klasse `x-fullwidth`. Diese haben nicht wir erstellt, aber wir nutzen sie:

```jsx
<div className={cx(cn.wrapper, 'x-fullwidth')}>
  {/* Dein Fullwidth-Content */}
</div>
```

Sie macht das Padding des `.article-body` rückgängig mittels negativem `margin-left` und `margin-right`.

## 3️⃣ cssOnlyHeaderNoImage

Zusätzlich werden noch einige mehr CSS Stile benötigt, dass alles wieder schön aussieht. Es gibt 3 verschiedene Möglichkeiten, diese zu integrieren:

### Empfohlen: Pembed benutzen

Benutzt am besten das [visual-article-header-pembed](https://vivi.zeit.de/repository/pembeds/visual-article-header-pembed). Es muss nicht im Header sein. Lokal lässt sich das faken, indem man der Seite im `src/apps/appname/pages`-Ordner die Pro `fullwidth={true}` mitgibt. Das Pembed wird öfters aktualisiert und funktioniert hoffentlich noch lange.

```jsx
<ArticleArbeitTemplate fullwidth={true}>…</ArticleArbeitTemplate>
```

### Alternative 1: React-Component benutzen

`import {FullwidthSnippet} from 'core/components/VisualArticle'`, das einmal einbauen. Macht genau das, was im nächsten Abschnitt beschrieben ist: lädt das CSS und injected ein bisschen JS in die Seite, um den Header zu fixen.

### Alternative 2: CSS includen

Manchmal kann man das Pembed und den React-Component nicht nutzen. Zum Beispiel, weil der Artikel hinter der Paywall liegt und nur ein Embed im Header geladen wird; das soll dann von der App sein, nicht das Visual-Article-Pembed. In diesem Fall kann man folgendes CSS benutzen, um das Fullwidth-Layout ohne Bild zu bekommen. Die Datei wird bisher auch zusammen mit dem Pembed aktualisiert, das kann sich aber irgendwann auch mal ändern.

```css
@import 'https://interactive.zeit.de/pembed-visual-article/cssOnlyHeaderNoImage.css';
```

Und dann irgendwo im JS den Header klein forcen:

```jsx
const scriptContent = `
var siteHeader = document.querySelector('.header');
if (siteHeader) {
  siteHeader.classList.add('header--force-mobile');
}
`;

…

<script dangerouslySetInnerHTML={{__html: scriptContent}} />
```

## 4️⃣ Boxen wieder an Text rücken

Denn Autor:innen-Boxen oder Hinweise auf die nächste Print-Ausgabe befinden sich in den `marginalia` des Texts, also links vom Text, zumindest auf Desktop. Durch die Aufhebung der maximalen Breite des `.article-body`s rutschen auch diese Boxen an den Rand des Bildschirms, was unschön ist. Diese müssen wir deshalb zurück an den Text rücken.

Füg hierfür in deinen React-Code irgendwo noch folgenden Hook ein:

```js
import useMoveMarginalia from 'core/hooks/useMoveMarginalia';
...
useMoveMarginalia();
```
