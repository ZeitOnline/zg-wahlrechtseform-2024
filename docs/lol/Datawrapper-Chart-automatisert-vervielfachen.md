# Anleitung zu unserem DW Automator

DW Automator ist ein Werkzeug, das dir hilft, basierend auf einer Vorlage, mehrere Datawrapper-Diagramme zu erstellen. So kannst du z.B. ein Chart für ein Bundesland anlegen und dieses für alle anderen Länder automatisiert erstellen lassen.

Zur Anleitung: Immer wenn du etwas **von Hand in Datawrapper** machen musst, kommt dieses Emoji: ✋🏼

## Vorbereitungen

✋🏼 Falls du noch keinen **API-Token** für Datawrapper hast: Erstell dir in den [Datawrapper-Einstellungen](https://app.datawrapper.de/account/api-tokens) einen. Er braucht 4 Berechtigungen:
- **read** und **write** in der Kategorie **Chart**
- **read** in der Kategorie **Theme**
- **read** in der Kategorie **Visualization**

Wenn du im **analysis** Ordner noch keine `.env` Datei hast, erstell eine anhand der Beispiel-Datei:

```
cp .env.example .env
```

Und füg deinen API-Token bei `DW_KEY=` ein und speichere ihn vielleicht noch in dein 1Password.

## Anleitung

Kopier am einfachsten den Inhalt der Vorlage `example.R` in dein Skript und für diese 4 Schritte durch.

### 0. Bereite deine Daten und das Vorlagen-Chart vor

1. Reduzier dein Data Frame auf die Spalten, die du brauchst, um dein Datawrapper-Chart zu erstellen.
2. Filter die Daten so, dass du nur noch z.B. ein Bundesland hast.
3. ✋🏼 Erstell [im Ordner Automatisierungen](https://app.datawrapper.de/archive/team/zeit/166350) ein **neues DW-Chart**
4. ✋🏼 Füg die Daten aus der Zwischenablage ein
5. ✋🏼 Gestalte es nach deinen Vorstellungen
6. ✋🏼 Leg einen **neuen Ordner** an, in welchen die Klone abgelegt werden sollen

### 1. Erstell die Chartklone aus dem Vorlagen-Chart

Die Funktion `create_all_clones` erwartet folgende 3 Argumente:

1. `child_ids` Vektor, mit **einzigartigen Strings**, welche zur Filtern der Daten genutzt werden (also z.B. die Namen der Bundesländer)
2. `folder_id` Die ID des **Datawrapper Ordners**, in dem die Klone abgelegt werden sollen (öffne den Ordner dafür in Datawrapper und kopier die Nummer aus der URL ganz hinten, z.B. `166355`)
3. `template_chat_id` Die **Datawrapper-ID** des Vorlagen-Charts, aus dem die Klone erstellt werden sollen (z.B. `XnLzN`)

Die Funktion gibt ein Data Frame `mapping` zurück mit den folgenden Spalten:
1. `child_id` Die einzigartigen Strings, siehe oben (z.B. die Ländernamen)
2. `child_chart_id` die DW-IDs der Klone
3. `template_chart_id` die DW-ID des Template-Charts

Dieses wird auch weiterhin eine wichtige Rolle spielen. Dass es nie verloren geht, wird es nebenbei in **mappings/{template_chart_id}.csv** gespeichert, denn:

🤓 Wenn für einen Template-Chart bereits Klone erstellt wurden, liest die Funktion das mapping aus der **mappings/{template_chart_id}.csv** aus und erstellt keine neuen Charts

### 2. Stile der Vorlage auf die Klone übertragen

Die Funktion `update_all_clones_style` kann 3 Argumente entgegennehmen:

1. `mapping` Das Data Frame, welches in Schritt 1 erstellt wurde und um beliebig viele weitere Spalten ergänzt wurde
2. `custom_headline` Ein Template-String, der mittels [glue](https://glue.tidyverse.org/) interpretiert wird. Um z.B. den Identifikations-String einzufügen, kann man `"{child_id}"` nutzen, aber auch alle anderen Spalten können genutzt werden
3. `custom_subline` (optional) Dasselbe für die Unterzeile der Grafik

🤓 Das Data Frame `mapping` aus dem letzten Schritt kann also um **weitere Spalten** ergänzt werden (z.B. via `left_join` etc.), die dann für den **Titel** und die **Unterzeile** genutzt werden können.

### 3. Daten auf alle Klone übertragen

Die Funktion `update_all_clones_data` benötigt 3 Argumente:

1. `mapping` Das Data Frame aus den obigen Schritten
2. `data` Den vollständigen Datensatz, aus dem die Daten für die Diagramme extrahiert werden sollen
3. `filter_function` Eine Funktion, mit der ein Teildatensatz für den jeweiligen Klon herausgefiltert und zurückgegeben wird (z.B. die Zeilen für ein Bundesland)

Diese **Filter-Funktion** wird mit 2 Argumenten aufgerufen: `data` und `config`. `data` ist der vollständige Datensatz ist und `config` bei jedem Durchlauf die eine Zeile aus dem `mapping` mit den Spalten `child_id`, `child_chart_id` und `template_chart_id`.

### 4. Alle Klone veröffentlichen

Die Funktion `publish_all_clones` benötigt nur noch ein Argument: `mapping` was dasselbe Data Frame ist wie oben.

⚠️ **Achtung**: Dies kann einige Zeit in Anspruch nehmen, etwa 4-5 Sekunden pro Diagramm. Es wäre optimal, die Funktion mit [foreach/doParallel](https://sparkbyexamples.com/r-programming/run-r-for-loop-in-parallel/?utm_content=cmp-true) zu parallelisieren.

### Falls nötig: JSON für Autocomplete exportieren

Um das Front-End-Embed zu integrieren, muss zunächst eine JSON-Datei erstellt werden. Mit dem Parameter "name" wird das Embed benannt. Nachdem die JSON-Datei exportiert wurde, kann über den Wizard einfach über den Wizard die Datawrapper Autocomplete Vorlage erstellt werden.

```r
export_mapping_autocomplete(mapping, "embed_name")
```

### Falls nötig: Klone löschen

Um alle Klone zu löschen, kann die Funktion `delete_all_clones` mit dem Argument `mapping` ausgeführt werden. Standardmäßig wird auch die mappings CSV-Datei gelöscht. Falls dies nicht gewünscht ist, kann als zweites Argument `delete_file = FALSE` übergeben werden.
