# Neuen Videoscroller aufsetzen

Wenn du einen Videoscroller bauen musst, starte am besten mit dem app-template "Scrollbares Video". Kopier dir dann außerdem folgende zwei NPM Scripts in die package.json:

```json
"new:videos:to:stills": "node starterkit/scripts/videos-to-stills.mjs",
"all:videos:to:stills": "node starterkit/scripts/videos-to-stills.mjs --delete-existing",
```

Das [Node Skript](starterkit/scripts/videos-to-stills.mjs) wird die Videos, die du unter **./videos** ablegst in Einzelframes konvertieren und unter **src/public/videostills** ablegen. Erstelle die beiden Ordner mittels:

```bash
mkdir videos && mkdir src/public/videostills
```

Wenn deine Video-Dateien größer sind als 100MB, füg `videos/` zur **.gitignore** hinzu. Für die Konvertierung solltest du auf deinem Rechner ffmpeg und ImageMagick installiert haben:

```bash
brew install ffmpeg
brew install imagemagick
```

Sowie die dazugehörigen node-Bindings:

```bash
npm install gm ffmpeg-static fluent-ffmpeg
```

Das Skript wird dir für jedes Video ein kleines Objekt in die Konsole loggen, welches du anschließend in die Config kopieren musst. Die config selbst erstellst du am besten mittels des Wizards. Es gibt dafür das App-Template „Scrollbares Video“.

Wenn deine App index heißt, liegt die Config dann unter **src/apps/index/config.js**. Füg das JSON da ein wo jetzt das Objekt mit `test` ist und entferne die Anführungszeichen beim Feld `meta` und für den korrekten Import oben hinzu.

Pass anschließend die **…/pages/index.jsx** an, indem du den gewünschten Identifier dort einfügst.
