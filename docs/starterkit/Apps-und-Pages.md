# Apps und Pages

## Neue App anlegen

Gehe zu [localhost:3000/wizard](http://localhost:3000/wizard) und klicke auf »Neue App«. Dort kannst du einen Namen eingeben und aus verschiedenen Vorlagen wählen, z. B. eine leere App, eine Karte, ein O-Mat usw.

## Pages

Um eine App lokal anzuschauen, braucht es eine Vorschau-Seite. Diese können im Ordner `src/apps/APPNAME/pages/dateiname.jsx` abgelegt werden und sind dann im Browser unter `http://localhost:5173/APPNAME/dateiname.html` zu erreichen. Die App `index` ist direkt zu erreichen, also `http://localhost:5173/dateiname.html`. Sie sollten ein Homepage- oder Artikel template importieren und mit einer Liste von Vivi-Embeds als default exportieren.

Die Seite kann beim Deployen als statisches HTML exportiert werden. Dazu `Page.publish = true` oder `Page.publish = "all"` setzen. `true` exportiert die Seite einmal, auch wenn es eine App mit vielen statischen IDs ist. `all` exportiert die Seite für jede ID.

Beispiel:

```jsx
import {
  ArticleArbeitTemplate,
  ViviEmbed,
  LoremIpsum,
} from 'starterkit/templates';

export function Page({id, staticData, ...props}) {
  const {name} = staticData;
  return (
    <ArticleArbeitTemplate
      kicker={`${staticData.bundesland}`}
      title={`So viel verdient man in ${name}`}
      teaser={`Exklusive Daten zeigen, wie sich die Gehälter in ${name} in den vergangenen 20 Jahren entwickelt haben. Und in welchen Nachbargemeinden mehr oder weniger verdient wird.`}
      fullwidth={true}
      disablePaywallFooter={true}
      header={<ViviEmbed display="header" />}
      {...props}
    >
      <ViviEmbed display="part-1" />
      <LoremIpsum />
      <ViviEmbed display="part-2" />
      <ViviEmbed display="part-3" />
      <LoremIpsum />
      <ViviEmbed display="byline" />
    </ArticleArbeitTemplate>
  );
}

// Seite soll beim Deployen exportiert werden
Page.publish = true;

export default Page;
```
