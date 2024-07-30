# Tiles

In order to create the tiles you need to install tippecanoe via:

```bash
brew install tippecanoe
```

You can then create the tiles:

```bash
npm run build:maptiles
```

## Projects

If you want to create tiles for a different projects you need to create a new folder under `maptiles/your-project-name`, put a `data.geojson` file in it and run:

```bash
npm run build:maptiles
```

To use the tiles you can import `src/maptiles/your-project-name.json` which contains the hash of the folder. You can use that to construct the URL to the maptiles.

```js
import metaData from 'src/maptiles/gehaelter-karte.json';

const publicUrl = __PUBLIC_URL__;
const isProd = import.meta.env.PROD;
const isSSR = import.meta.env.SSR;

const mapTilesUrl =
    isProd || isSSR
      ? `${publicUrl}maptiles/${metaData.path}`
      : `http://${window.location.host}/maptiles/${metaData.path}`,
```
