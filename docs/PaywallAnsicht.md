# Paywall Ansicht erstellen

Diese Anleitung führt dich durch alle Schritte, die du tun musst, um von deiner App eine reduzierte Version zu erstellen, die User:innen gezeigt wird, die kein Abo haben.

## Embeds im Code anlegen

Du kannst entscheiden, ob du dein bestehendes Embed ausbauen möchtest, sodass es sowohl als Header-Embed als auch vollständig ausgeführt werden kann (Variante 2) oder du baust nochmal eine neues Header-Embed, die dann den einzigen Zweck hat, bei User:innen ohne Abo gezeigt zu werden (Variante 1).

### Variante 1: Ein neues, separates Header-Embed

Hinterleg in deiner Projekt-index **src/apps/…/index.jsx** ein zusätzliches Embed:

```javascript
  viviEmbeds: [
    {
      name: 'paywall-header',
      props: [viviParameterTypes.isTruncatedByPaywall()],
    },
    …
  ],
```

Das Embed erhält den Boolean `isTruncatedByPaywall` als react prop: Der Wert ist `true`, wenn die User:in kein Abo hat und `false` wenn sie eingeloggt ist.

In diesem Embed renderst du dann z.B. die `<Paywall />` Komponente, welche geblurrte Bilder zeigt mit einer Aufforderung drauf, ein Abo abzuschließen ([Beispiel](https://friedbert-preview.zeit.de/wissen/2024-01/nutzung-meere-fischerei-oelfrachter-transportschiffe?paywall=paid)):

```javascript
import Paywall from 'core/components/Paywall';

import imgMobile from 'src/static/images/paywall/mobile.png';
import imgDesktop from 'src/static/images/paywall/desktop.png';
import imgMobileDark from 'src/static/images/paywall/mobile-dark.png';
import imgDesktopDark from 'src/static/images/paywall/desktop-dark.png';

function App({viviEmbedName, isTruncatedByPaywall}) {
  if (viviEmbedName === 'paywall-header') {
    return (
      <Paywall
        isTruncatedByPaywall={isTruncatedByPaywall}
        imgMobile={imgMobile}
        imgDesktop={imgDesktop}
        imgMobileDark={imgMobileDark}
        imgDesktopDark={imgDesktopDark}
      />
    );
  }

  // andere Embeds ...

  return null;
}
```

Um es lokal zu testen, füg dieses Embed in deiner Page **src/apps/…/pages/index.jsx** als Header-Embed ein, z.B.:

```jsx
<ArticleArbeitTemplate header={<ViviEmbed name="paywall-header" />} />
```

Wenn du eigenen Code schreibst und nicht die `<Paywall />` Komponente benutzt, vergiss nicht: Das Embed soll nur rendern, wenn jemand kein Abo hat. Füg also in deinem Code z.B. folgendes ein:

```jsx
if (!isTruncatedByPaywall) return null;
```

Wenn du nun [localhost:3000/?paywall=paid](http://localhost:3000/?paywall=paid) öffnest, siehst du die Ansicht einer nicht-zahlenden User:in.

### Variante 2: Bestehendes Embed zusätzlich als Header-Embed nutzen

Füg in deiner Projekt-index **src/apps/…/index.jsx** bei deinem Embed die folgenden Vivi Parameter hinzu:

```js
viviEmbeds: [
  {
    name: 'dein-bestehendes-embed',
    props: [
      viviParameterTypes.isTruncatedByPaywall(),
      viviParameterTypes.oneOf({
        name: 'display',
        label: 'Zeige',
        options: [
          {label: 'Header', propValue: 'header'},
          {label: 'Ganzer Artikel', propValue: 'main'},
        ],
      }),
    ],
  },
];
```

Füg in deiner Page **src/apps/…/pages/index.jsx** beide Embeds hinzu – im Template oben das Header-Pembed und im Inhalt das vollständige:

```jsx
<ArticleArbeitTemplate
  header={<ViviEmbed name="dein-bestehendes-embed" display="header" />}
>
  <ViviEmbed name="dein-bestehendes-embed" display="main" />
</ArticleArbeitTemplate>
```

In deinem Code kannst du dann z.B. den Code ausgeben, der nur aus aus einem reduzierten Teil deiner App besteht:

```jsx
if (display === 'header' && isTruncatedByPaywall)
  return <MyCode reducedVersion={true} />;
// else
return <MyCode reducedVersion={false} />;
```

Wenn du nun [localhost:3000/?paywall=paid](http://localhost:3000/?paywall=paid) öffnest, siehst du die Ansicht einer nicht-zahlenden User:in.

PS: Lokal wird auch das restliche CSS deiner App geladen. Aber nur lokal, nicht auf production.

## In Vivi einbauen

Nun musst du das Heder-Embed natürlich auch in Vivi entsprechend hinterlegen. Dazu muss dein Artikel ein **Visual Article** sein: [Mehr dazu](?path=/docs/docs-visual-article--docs). Wenn dies der Fall ist, siehst du über dem Artikel-Inhalt folgendes grünes Feld:

![](../images/vivi-header-slot.png)

1. Klick nun in der rechten Seitenleiste auf **Struktur** und dort auf den Reiter **Header**.
2. Zieh das Element `Embed-Link` auf den grünen Kasten.
3. Das folgende Textfeld sollte direkt darunter erscheinen – falls nicht, mach einen Refresh.

![](../images/vivi-header-embed-link.png)

4. Geh in der rechten Seitenleiste zurück auf **Inhalte**.
5. Such dein Header-Embed und zieh es auf das erschienene Textfeld. Nun sollte das Embed im Header erscheinen.
6. Die Properties des Embeds sind nach einem Reload der Vivi-Seite zugänglich.
