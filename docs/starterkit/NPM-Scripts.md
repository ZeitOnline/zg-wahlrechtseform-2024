# Alle NPM Scripts

## Die wichtigsten

### npm start

Startet den Dev-Server

### npm run publish

Buildet und deployed alles

```shell
# alles deployen
npm run publish

# nur bestimmte Apps deployen
APPS=index,zweiteApp npm run publish
```

### npm run publish:staging

Buildet und deployed alles auf staging

### npm run publish:storybook

Buildet und deployed das Storybook auf infographics

### npm run storybook

Startet das Storybook (Dokumentation)

## Die hier braucht man nicht so oft

### npm run build:tokens

Generiert neue Tokens basierend auf der tokens.json

### npm run build:templates

Generiert neue lokale ZON-Templates

### npm run build:maptiles

Buildet Maptiles

## Das hier sind eher Unterbefehle, die von anderen ausgeführt werden

### npm run build

Buildet das Projekt

### npm run build:node

Buildet die Apps für node

### npm run build:client

Buildet die Apps für den Browser

### npm run build:embeds

Generiert Embeds/Statisches HTML

### npm run build:storybook

Buildet das Storybook

### npm run deploy:static

Deployed die statischen Dateien: JS, CSS, Bilder usw.

### npm run deploy:vivi

Deployed Vivi-Embeds

### npm run deploy

Deployed alles
