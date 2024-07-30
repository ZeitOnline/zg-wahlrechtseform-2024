# Bookmarklets

Bookmarklets sind kleine Javascript-Befehle, die man per Klick auf einen Browser-Bookmark auslösen kann. Dort wo im Bookmark eigentlich der Link hinterlegt ist, fügt man das Javascript ein. Statt eine neue Seite zu öffnen, wird dann einfach das Javascript auf der aktuellen Seite ausgelöst. Falls du noch nie ein Bookmarklet angelegt hast, findest du [hier eine Anleitung für alle Browser](https://mreidsma.github.io/bookmarklets/installing.html).

## Husch

```js
javascript:var u=location.href,s=/(www|.*?friedbert-preview)\.zeit.de\/(.*)/gi,d=s.exec(u); if(d){location.href=(%27http://vivi.zeit.de/repository/%27+d[2]+%27/@@view.html%27)}else alert(%27Das ist keine Seite von www.zeit.de%27);
```

## In Friedbert öffnen

```js
javascript: var u = location.href,
  s = /www.zeit.de\/(.*)/gi,
  d = s.exec(u);
if (d) {
  location.href = 'http://friedbert-preview.zeit.de/' + d[1];
} else alert('Das ist keine Seite von www.zeit.de');
```

## Stating-Husch

```js
javascript: var u = location.href,
  s = /(www|friedbert-preview).zeit.de\/(.*)/gi,
  d = s.exec(u);
if (d) {
  location.href =
    'http://vivi.staging.zeit.de/repository/' + d[1] + '/@@view.html';
} else alert('Das ist keine Seite von www.zeit.de');
```

## Darkmode-Toggle

```js
javascript: void document.documentElement.classList.toggle('color-scheme-dark');
```

## Debugger nach 2 Sekunden

1. Inspektor öffnen
2. Bookmarklet anklicken
3. Über gewünschte Stelle auf Seite hovern (z.B. ein Tooltip!)
4. Mit Shift `⇧` Taste auch Elemente mit `pointer-events: none` erwischen

```js
javascript: (function () {
  setTimeout(function () {
    debugger;
  }, 2000);
})();
```

## Kilkaya

```js
javascript:var u=location.href, s=/www.zeit.de\/(.*)/gi, d=s.exec(u); if(d){location.href=('https://app.kilkaya.com/#/zeit.de/dashboard/pagereport?url='+u)}else%20alert('Das%20ist%20keine%20Seite%20von%20www.zeit.de');
```

## Datawrapper

Öffnet eine Datawrapper-Grafik im Editier-Modus. Das Bookmarklet kennt 2 Modi:

- Man befindet sich direkt auf einem Embed in groß (z.B. [https://datawrapper.dwcdn.net/w41a0/16189/](https://datawrapper.dwcdn.net/w41a0/16189/))\
  -> Der Chart öffnet sich direkt im Editier-Modus.
- Man befindet sich auf einer Seite mit mehreren Datawrapper-Iframes\
  -> Über jeder Datawrapper-Grafik wird ein Link eingefügt "Edit chart xyz", da klickt man nur noch drauf und zack!

Quelle: [Tamedia](https://github.com/tamedia-ddj/datawrapper-bookmarklet).

```js
javascript: if (window.location.hostname == 'datawrapper.dwcdn.net') {
  const dw_id = window.location.href
    .replace('https://datawrapper.dwcdn.net/', '')
    .split('/')[0];
  const dw_edit_url = 'https://app.datawrapper.de/chart/' + dw_id + '/publish';
  location.href = dw_edit_url;
} else {
  document
    .querySelectorAll('iframe, .datawrapper-script-embed')
    .forEach(function (el) {
      const isIframe = el.tagName === 'IFRAME';
      let dw_id, dw_edit_url;
      if (isIframe) {
        const src = el.src.toString();
        if (src.indexOf('datawrapper') >= 0) {
          dw_id = src
            .replace('https://datawrapper.dwcdn.net/', '')
            .split('/')[0];
          dw_edit_url =
            'https://app.datawrapper.de/chart/' + dw_id + '/publish';
        }
      } else {
        dw_id = el.id.replace('datawrapper-vis-', '');
        dw_edit_url = 'https://app.datawrapper.de/chart/' + dw_id + '/publish';
      }
      let a = document.createElement('a');
      a.innerText = 'Edit chart ' + dw_id;
      a.href = dw_edit_url;
      a.target = '_blank';
      el.parentNode.insertBefore(a, el);
    });
}
```

## ai2html-Debugger

Blendet nützliche Informationen über ai2html-Elemente ein

```js
javascript: (function () {
  var ai2htmlDebugStyle = document.createElement('style');
  ai2htmlDebugStyle.type = 'text/css';
  ai2htmlDebugStyle.textContent =
    '.g-artboard { overflow: visible; border: 1px solid fuchsia; } .g-content,.g-aiPointText, .g-aiAbs { border: 1px solid fuchsia; } .g-aiImg.g-aiAbs { border: none; } .g-artboard-id { color: fuchsia; font-family: sans-serif; font-size: 18px; text-align: right; position: absolute; top: 10px; right: 10px; text-shadow: 0 1px 1.5px rgba(255,255,255,0.65), 1px 0px 1.5px rgba(255,255,255,0.65), 0 -1px 1.5px rgba(255,255,255,0.65), -1px 0px 1.5px rgba(255,255,255,0.65); } .g-artboard-info { color: fuchsia; font-family: sans-serif; font-size: 12px; text-align: right; position: absolute; top: 30px; right: 10px; text-shadow: 0 1px 1.5px rgba(255,255,255,0.65), 1px 0px 1.5px rgba(255,255,255,0.65), 0 -1px 1.5px rgba(255,255,255,0.65), -1px 0px 1.5px rgba(255,255,255,0.65); } .g-pointtext-tag { position: absolute; top: -3px; left: 0; font-size: 10px; color: fuchsia;}';
  document.body.appendChild(ai2htmlDebugStyle);
  var artboards = document.querySelectorAll('.g-artboard');
  artboards.forEach((artboard) => {
    var artboardId = document.createElement('div');
    artboardId.textContent = 'ID: ' + artboard.id;
    artboardId.setAttribute('class', 'g-artboard-id');
    artboard.appendChild(artboardId);
    var minWidth = artboard.getAttribute('data-min-width');
    var maxWidth = artboard.getAttribute('data-max-width');
    var artboardInfo = document.createElement('div');
    artboardInfo.setAttribute('class', 'g-artboard-info');
    var artboardInfoText = '';
    if (minWidth) artboardInfoText += 'min width: ' + minWidth;
    if (maxWidth) artboardInfoText += ' max width: ' + maxWidth;
    artboardInfo.textContent = artboardInfoText;
    artboard.appendChild(artboardInfo);
  });
  var aiAbs = document.querySelectorAll('div.g-aiAbs');
  aiAbs.forEach((div) => {
    console.log(div);
    var graf = div.querySelector('p');
    var fontSize = window.getComputedStyle(graf).getPropertyValue('font-size');
    var lineHeight = window
      .getComputedStyle(graf)
      .getPropertyValue('line-height');
    var tag = document.createElement('div');
    tag.textContent = fontSize + ' / ' + lineHeight;
    tag.setAttribute('class', 'g-pointtext-tag');
    div.appendChild(tag);
  });
})();
```
