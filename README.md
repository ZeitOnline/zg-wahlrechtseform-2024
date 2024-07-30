# Quellen und Methodik

### Methodik

Beschreibe in ein paar Sätzen, welche Daten du wie verarbeitet hast und vervollständige die untenstehende Tabelle. Für den Ordner **analysis/data** kannst du dir eine Tabelle mittels `make generate_readme_for_data` generieren lassen.

### Quellen

| Datei | Inhalt | Quelle |
| --- | --- | --- |
| example.csv | z.B. Anzahl Autos pro Bundesland | z.B. Destatis |
| **Dropbox** |||
| large_example.shp | z.B. Geometrien aller Gemeinden | z.B. BKG |

# ZON Starter Vite

Unser Starterkit mit [react](https://reactjs.org/) + [vitejs](https://vitejs.dev/).

## 🏁 Starten

### 🧳 Was braucht man?

- Eine aktuelle Version von [Node](https://nodejs.org/en/) (siehe `.nvmrc`). Sie kann z. B. mit [nvm](https://github.com/nvm-sh/nvm) installiert werden. nvm ist auch praktisch, um verschiedene Versionen zu verwalten.
- Einen Texteditor, idealerweise mit [editorconfig](https://editorconfig.org) und [prettier](https://prettier.io) (»Formatieren beim Speichern« aktivieren).

### 🚀 Wie geht’s los?

1. `npm i` installiert alle Abhängigkeiten.
2. `npm start` startet das Projekt, ein Browserfenster öffnet sich automatisch.
3. Im [Wizard](http://localhost:3000/wizard) lassen sich neue Apps anlegen und Einstellungen zum Deployment vornehmen.
4. Coden (z. B. in `src/apps/index/App/index.jsx`).
5. `npm run publish` veröffentlicht alles.
6. Nun lassen sich die Embeds in Vivi finden und dort in Artikel ziehen.

Alle Befehle, wenn nicht anders angegeben, direkt im Projektordner ausführen, nicht in einem Unterordner.

Fürs Deployment braucht es ein paar Einstellungen und Accounts, siehe das Storybook unter [Onboarding](http://localhost:8000/?path=/story/wissen-onboarding--page).

Mehr Befehle finden sich im Storybook unter [Starterkit/Befehle](http://localhost:8000/?path=/story/starterkit-befehle--page).

### 🍾 Deployen

Bitte versucht beim Deployen, den `APPS=` env param zu benutzen. Dann wird wirklich nur die App deployed und nix kaputt gemacht, das nicht getestet wurde.

Per default ist APPS=index

- `APPS=index,nochEineApp npm run publish` buildet alles und deployed es
- `APPS=index,nochEineApp npm run publish:staging` das gleiche, aber für staging

## 😻 Dokumentation

Im Starterkit ist auch stets [storybook](https://storybook.js.org/) integriert. Man kann es über das folgende npm Skript laufen lassen:

```bash:no-line-numbers
npm run storybook
```

Es ist erreichbar unter <http://localhost:8000/>.

## Known errors

```
ERR_UNSUPPORTED_ESM_URL_SCHEME
```

Wenn du diese Fehlermeldung siehst, benutzt du die falsche Node Version. Benutz am besten `nvm` zum Wechseln (mehr zur Installation im Kapitel Software). Mit `nvm use` wählt `nvm` die Node Version aus, die für das aktuelle Projekt vorgesehen ist.

```
MODULE_NOT_FOUND
```

Lass einfach nochmal `npm i` (die Installation der npm-Packages) laufen. Jemand anderes hat vermutlich ein Package hinzugefügt, das dir im Moment noch fehlt.

```
EADDRINUSE
```

Du hast irgendwo noch ein zweites Terminal, was bereits eine andere Applikation lokal ausführt (und den Port blockiert). Beende jenen Prozess und versuche es nochmal. Auf Mac kannst du z.B. die Prozesse, die den Port 3000 blockieren beenden mit: `kill -9 $(lsof -ti:3000)`.

```
gsutil module 'sys' has no attribute 'maxint'
```

Kann beim Deployment auftreten. Führ folgenden Befehl aus – er sollte das Problem (mindestens für eine Weile) beheben: `pip3 install -U crcmod`

## NPM Scripts

Hier eine kurze Zusammenfassung aller Skripte die in der `package.json`-Datei definiert sind:

- `npm start` - startet den lokalen Vite-Entwicklungsservers
- `npm copy:content:from:vivi` - kopiert den Inhalt eines Friedbert-Artikels in die pages/index.jsx ([Mehr](?path=/docs/docs-vivi--docs#artikel-inhalt-von-vivi-friedbert-kopieren-und-lokal-testen))
- `npm copy:content:to:vivi` - das Gegenstück, welches die pages/index.jsx als Vivi XML in die Zwischenablage kopiert ([Mehr](?path=/docs/docs-vivi--docs#lokalen-inhalt-als-vivi-xml-kopieren-und-in-vivi-einfugen))
- `npm run build` - führt `build:node`, `build:client` und `build:embeds` aus
- `npm run build:node` - führt den fürs SSR (server side rendering) benötigten Vite-build aus mit Node.js als Target (schreibt in `dist/node`)
- `npm run build:client` - führt den Vite-build aus der an die Clients ausgeliefert wird (schreibt in `dist/client`)
- `npm run build:embeds` - erzeugt die Vivi-Embeds inkl. Pembed-Definitionen, rendert die Apps (SSR) und erzeugt StaticIncludes z.B. wenn wir mehrere Artikel zu einem Thema veröffentlichen (schreibt in `dist/vivi` und `dist/static-html`)
- `npm run build:templates` - aktualisiert die lokalen Artikel-Templates (schreibt in `startertkit/templates/raw`), dazu müssen die Templates vorrübergehend in Vivi veröffentlicht werden
- `npm run build:maptiles` - ???
- `npm run build:storybook` - ???
- `npm run build:tokens` - erzeugt auf Basis der in Figma definierten Design Tokens verschiedene CSS- und SCSS-Dateien (schreibt in `core/styles`)
- `npm run map:create-tiles` - ???
- `npm run deploy` - führt `deploy:static` und `deploy:vivi` aus
- `npm run deploy:static` - synct alle statischen Dateien (u.a. das JS-Bundle, CSS-Dateien, die Dateien aus `src/public`...) in den Google Cloud Storage (GCS)
- `npm run deploy:vivi` - erstellt oder akualisiert die Vivi-Embeds (`dist/vivi`) mithilfe der Vivi-API
- `npm run publish` - äquivalent zu `npm run deploy`, zusätzlich wird vorher noch `npm run build` ausgeführt
- `npm run publish:staging` - äquivalent zu `npm run publish` aber mit den Staging-Instanzen als Target (Staging Ordner im GCS, Vivi-Staging)
- `npm run storybook` - startet den lokalen Storybook-Servers

## Start of old readme

### 🗺 Maptiles

[Siehe das Maptiles-Readme](maptiles/Readme.md)

### Commands

Please use the `APPS=` env param to only build and deploy the thing you’re actually working on. This way, you won’t accidentally break something else and deploy that without noticing.

APPS defaults to index, so for single-use repos you don’t have to use the APPS env param.

- `APPS=index npm run start` launches local dev version
- `APPS=index npm run publish` builds public version, uploads to vivi
- `APPS=index npm run publish:staging` same but for staging

You can use the `APPS` env variable to control which parts of the project are built. If you work on the dashboard, you’d use `APPS=index npm …`.

HTML files are accessible under http://localhost:5173/APPNAME/index.html etc.

### Packages, libraries, etc.

We use React. Switch to Preact if you want something smaller.

If possible, don’t include whole libraries, but just the packages you need, e.g. `d3-shape` instead of `d3`.
