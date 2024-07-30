# App-Templates

Wir haben verschiedene Formate, die wir ständig wiederverwenden. Karten, O-Maten, Wahlen usw. Diese sind direkt im Starterkit integriert und können einfach wiederverwendet werden.

## App-Template erstellen

1. Komplette App in den Ordner `starterkit/app-templates/templateName` kopieren. Mittelfristig sollen die Templates konfigurierbar werden, im Moment sind sie es noch nicht.
2. Datei `starterkit/app-templates/templateName/template-config.json` erstellen, Inhalt: `{"label": "Ein sprechender Appname"}`

Das Template kann nun unter [localhost:3000/app-templates/templateName](http://localhost:3000/app-templates/templateName) angeschaut werden, während man es entwickelt.

## Search-and-Replace

Da man z.B. im Vivi-Embed-Namen oft einen eindeutigen Projekt-Kürzel angeben muss, gibt es folgendes Zusatzfeature: Wenn du folgendes Objekt in der **template-config.json** neben `label` hinzufügst`:

```js
  "inputs": [
    {
      "name": "projectId",
      "label": "Projektkürzel",
      "description": "Wird als Kürzel am Anfang der Pembed-Namen eingesetzt",
      "pattern": "[a-zA-Z0-9-]+",
      "required": true
    }
  ]
```

Erscheint im Wizard beim Nutzen dieses Templates ein Text-Eingabefeld, wo man das Kürzel des Projekts angeben kann. Im Code deines App-Templates kannst du dann den String `<%projectId%>` verwenden überall dort, wo das Kürzel dann per Suchen und Ersetzen eingefügt werden soll.
