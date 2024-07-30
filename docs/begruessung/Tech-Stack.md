# Wie kommen unsere Visualisierungen in die Artikel?

Wir nutzen Stand Januar 2023:

- React.js als Frontend-Library
- Vite als Code Bundler
- SCSS mit CSS Modules für’s Styling
- [Google Cloud Storage](https://console.cloud.google.com/storage/browser/assets-interactive;tab=objects?prefix=&forceOnObjectsSortingFiltering=false) als Speicherort
- Fastly als CDN
- Ein selbst geschriebenes [Static Site Rendering](https://github.com/ZeitOnline/zg-starterkit/blob/main/starterkit/render/index.js)
- Eine selbst geschriebene [Vivi API](https://github.com/ZeitOnline/zg-vivi-api)

## Wichtige Begriffe

**Starterkit**: Dieses [Github-Repo](https://github.com/ZeitOnline/zg-starterkit) ist die Grundlage jeden Code-Projekts. Wenn wir ein neues Repository für ein Projekt erstellen, nutzen wir es als Startpunkt. Deshalb entwickeln wir es laufend weiter.

**App**: Jedes Projekt kann aus einer oder mehreren Apps bestehen. Jede App beinhaltet ein oder mehrere Vivi Embed(s). [Mehr dazu](?path=/docs/starterkit-apps-und-pages--docs)

**Vivi Embed**: Ein Embed ist ein Paket aus HTML, CSS und Javascript Code, welches sich ein:e Redakteur:in per Drag & Drop in einen Artikel „reinziehen“ kann. Der Code stammt von uns und beinhaltet die Visualisierung oder einzelne Teile/Schritte davon.

**Pembed**: Kurz für parametrisierbares Embed, was bedeutet, dass es ein Embed ist, für welches Redakteur:innen nach dem „Reinziehen“ noch zusätzliche Informationen angeben kann, die wir dann im Code nutzen können. Diese heißen Vivi Parameter.

**Vivi Parameter**: Die Parameter werden in der zentralen `apps/…/index.jsx` als Typen definiert und tauchen in Vivi selbst dann als Inputs auf: als Freitextfelder, Selects oder Checkboxen. [Mehr dazu](?path=/docs/starterkit-vivi-parameter--docs)

**Page**: Eine App beinhaltet meist eine nur eine Page, welche du unter **…/pages/index.jsx** findest. Darin müssen alle Embeds referenziert werden, um sie lokal während dem Entwickeln sehen zu können. Diese Pages werden nicht veröffentlicht, sondern sind nur die lokale Ansicht eines „Test-Artikels“. [Mehr dazu](?path=/docs/starterkit-apps-und-pages--docs)

**Template**: Weil diese Pages aussehen sollen wie ein echter Zeit-Artikel, haben wir Artikel-Templates, die eine Kopie des HTMLs und CSSs von der Zeit-Website sind. (Z.B. Arbeit-Template für Schriftart/Farben des Ressorts Arbeit.) [Mehr dazu](?path=/docs/starterkit-templates--docs)

**App-Template**: Für Setups, die wir regelmäßig brauchen, kann man ein App-Template anlegen. Das Template besteht aus einer App, einer Page und allen nötigen Embeds, die beispielhaft bereits miteinander verknüpft und vorbereitet sind. [Mehr dazu](?path=/docs/starterkit-app-templates--docs)

**Wizard**: Dies ist das Tool, mit welchem du diese App-Templates als Vorlage für deine App nehmen kannst. Der Wizard wird automatisch geöffnet, wenn keine App vorhanden ist. Du erreichst ihn danach unter [localhost:3000/wizard](http://localhost:3000/wizard).

**Paywall-Header**: So bezeichnen wir eine App, welche man in Vivi in den Header-Bereich zieht. Diese App wird ausgeführt, wenn keine zahlende User:in eingeloggt ist. Dort versuchen wir User:innen zu überzeugen, ein Probe-Abo abzuschließen, indem wir einen Sneak Peak auf unsere Visualisierung bieten. [Mehr dazu](?path=/docs/docs-paywall-ansicht--docs)

**Visual-Article**: Normale Zeit-Artikel sind stark standardisiert und bieten uns zu wenig Möglichkeiten, daraus auszubrechen. Deshalb hat man uns eine Vorlage erstellt, die Visual Article heißt. Nutzen wir diese für einen Artikel, können wir vollbreite Elemente zeigen, wo sonst nur der Titel stünde. [Mehr dazu](?path=/docs/docs-visual-article--docs)

**Token**: Design Tokens sind die kleinste Einheit eines Design-Systems. Sie beschreiben je eine Eigenschaft wie z.B. eine Farbe oder eine Abstand-Größe und können über Variablen in Figma und SCSS eingesetzt werden. [Mehr dazu](?path=/docs/design-design-tokens--docs)

**Byline**: So nennen wir die Liste der Autor:innen eines Stücks. Erfassen tut man die in Vivi, aber oft verschieben wir sie an eine andere Stelle als sie standarmäßig ist (unter dem Lead). [Mehr dazu](?path=/docs/docs-byline-verschieben--docs)
