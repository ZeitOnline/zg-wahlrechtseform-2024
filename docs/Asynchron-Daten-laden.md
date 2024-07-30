# Asynchron Daten laden

Kleine Dateien können direkt oben in der Datei importiert werden. JSON wie CSV Files werden von vite korrekt importiert und können direkt verwendet werden:

```
import dataset from './data.csv';
```

Das sollte man aber nur mit Dateien machen, die einige wenige kb groß sind. Alles andere sollte man asynchron nachladen.

## JSON

Wenn du den Namen deiner Datei weißt und diese einfach im Projektverzeichnis liegt, kannst du den Pfad zur Datei importieren, indem du `?url` an den Import dranhängst:

```js
import dataUrl from './data.json?url';
```

Die URL kann man dann wiederum `fetchen` z.B. über den Hook `useCachedFetch`:

```js
const {response: data} = useCachedFetch(dataUrl);
```

## CSV/TSV

Wenn du CSV asanchron laden möchtest, kannst du dafür den Hook `useDsv` verwenden, der als drittes Argument nach `url` und `options` (welche es an `useFetch` weiterreicht) eine Funktion `parseFn` entgegennimmt, in welcher du die Spalten in die korrekten Datentypen verwandeln kannst:

```js
const cityData = useDsv(cityDataUrl, opts, (d) => ({...d, a: toNumber(d.a)}));
```

## TopoJSON

Um eine TopoJSON-Datei direkt als GeoJSON mit allen Meshes etc. zu erhalten, benutz gerne den Hook `useTopoJSON`, dieser gibt dir anhand einer URL direkt die folgenden Dinge zurück:

```
{
  key: topoKey,
  topoJson,
  feature: parsedTopoJson,
  features: parsedTopoJson?.features,
  mesh: topoMesh,
  interiorMesh: topoInteriorMesh,
  outline: topoOutline,
  fullOutline,
  bounds: topoBounds,
}
```

@TODO: noch besser beschreiben, was die einzelnen Felder sind.

## Einzelne Bilder laden

Wenn du einzelne Bilder einbinden möchtest, kannst du dies ebenfalls über einen einfach import lösen:

```
import imageUrl from './image.jpg';
...
<img src={imageUrl} />
```

Die URL wird von vite mit einem Hash versehen.

## Bilder oder Dateien mit einem dynamischen Pfad laden

Bilder, aber auch CSVs und JSONs werden im CDN unlimitiert gecacht. Deshalb ist es wichtig, dass unsere Pfade einen Hash beinhalten, sodass wir neue Versionen der Bilder/Dateien ausliefern können. Für Dateien die explizit importiert werden, ergänzt Vite (unser Build-Tool) automatisch einen Hash im Dateinamen. Bei Dateien die mit einem dynamischen Pfad, also ein Pfad der auf einer Variable basiert, geladen werden ist es ein bisschen komplizierter. Bei dynamischen Pfaden musst du folgendes beachten:

### 1. Glob import

Beste Variante, wenn man dynamische Pfade braucht: [Glob-Import](https://vitejs.dev/guide/features.html#glob-import). Alles wird gehasht, Caching ist kein Problem, die Dateien werden mit den normalen Vite-Loadern geladen usw.

```jsx
const crests = import.meta.glob('src/data/crests/*', {
  as: 'url',
  eager: true,
});
```

Im Code dann

```jsx
<img src={crests[`/src/data/crests/${crest}`]} alt="" />
```

### 2. Speicherort innerhalb von `src/public`

In Ausnahmefällen: Leg einen Unterordner in `src/public` an, z.B.: **src/public/meine-vielen-bilder**
Dateien die im Public-Ordner liegen werden unverändert während des deployments hochgeladen.

Bedenke: Dateien werden auf dem Server gecached, d.h. wenn sie sich ändern, wird das niemand mitbekommen. Außer, sie kriegen einen neuen Namen. (Was bei )

Darin legst du folgende Dinge ab:

1. Einen Unterordner mit einem Hash im Namen, z.B.: **imgs.1234**
2. Eine Datei **meta.json** mit folgendem Inhalt:\
   `{ folder: "meine-vielen-bilder/imgs.1234" }`

### 3. Die getCachedDirUrl-Funktion

Je nach Umgebung sehen die Pfade etwas unterschiedlich aus, folgende Funktion (liegt auch in **src/utils**) berücksichtigt das:

```
function getCachedDirUrl(metaData) {
  const publicUrl = __PUBLIC_URL__;
  const isProd = import.meta.env.PROD;
  const isSSR = import.meta.env.SSR;

  return isProd || isSSR
    ? `${publicUrl}${metaData.folder}`
    : `http://${window.location.host}/${metaData.folder}`;
}
```

#### Der Ladeprozess selbst

Da wo du nun deine Bilder rendern möchtest, mach nun folgendes:

```
import metaData from 'src/public/meine-vielen-bilder/meta.json';
...
const dirUrl = getCachedDirUrl(metaData);
...
<img src={`${dirUrl}/${variable}.jpg`} />
```

Wobei `variable` der gewünschte Dateiname ist. Als Dateiname kannst du nun also IDs oder z.B. Städtenamen verwenden.

🤓 Dieser Ablauf funktioniert auch mit JSON, CSV etc. Dateien. Die resultierenden URLs musst du danach wieder klassisch `fetch`en.

### Alternative Variante

Vite beschreibt in ihren [Docs](https://vitejs.dev/guide/assets.html#new-url-url-import-meta-url) noch folgenden Weg:

```
function getImageUrl(name) {
  if (isSSR) return 'path/to/placeholder.png';
  return new URL(`./images/${name}.png`, import.meta.url).href;
}
...
<img src={getImageUrl(city)} />;
```

Dies funktioniert nur:

1. Mit relativen Pfaden: `src/static/…` geht z.B. nicht
2. Nicht im `src/public` Ordner
3. Im Client (beim Server Side Rendering kann dieser Code nicht ausgeführt werden).
