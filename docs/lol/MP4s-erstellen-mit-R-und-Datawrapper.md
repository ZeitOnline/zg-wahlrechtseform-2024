# MP4s erstellen mit R und Datawrapper

Wir speichern mit R eine Datawrapper Grafik mit unterschiedlichen Datenständen als PNG ab und verbinden diese zu einem MP4-Video.

## Eingesetzte Technologien / Packages

### R

- [Tidyverse](https://www.tidyverse.org/packages/): Kein R ohne Tidyverse
- [DatawRappr](https://github.com/munichrocker/DatawRappr): Lässt uns die Datawrapper-API aus R ansteuern
- [av](https://ropensci.org/blog/2018/10/06/av-release/): ffmpeg-Bindings für R (erstellt MP4 aus PNGs)

### Datawrapper

Datawrapper ersetzt quasi `ggplot` als Charting-Library. Dies hat den Vorteil, dass man von Hand eine Grafik initial erstellen und perfektionieren kann (Farben, Annotationen, …) und diese dann aus R mit Daten befüllen kann.

## Vorbereitungen

Für diese Übung arbeiten wir mit Gas-Speicher-Daten `df_agsi_units` und erstellen pro Tag ein PNG.

### Datawrapper-Grafik von Hand initial erstellen

Lade die Daten von einem beliebigen Tag bei Datawrapper hoch und gestalte die Grafik nach deinen Vorstellungen (Farben, Annotationen, etc.).

Die Grafik aus unserem Beispiel findest du [hier](https://app.datawrapper.de/chart/pUNPd/visualize#refine).

### API-Zugriff auf Datawrapper erstellen

Datawrappr benötigt einen Zugangs-Token – diesen erstellst du mit deinem Datawrapper-Account. Ein Mal erstellt, kannst du ihn in verschiedenen Skripts wiederverwenden. Wenn du noch keinen Zugangs-Token hast, kannst du auf dieser Seite einen erstellen:

[https://app.datawrapper.de/account/api-tokens](https://app.datawrapper.de/account/api-tokens)

Bei den Bereichen (scopes) musst du im Minimum bei **Chart** `read` und `write` aktivieren. Aktiviere zusätzlich den scope **User** `read`. Daraufhin kopierst du den Schlüssel und speicherst ihn in eine R Variable mit dem Namen `DW_API_KEY`, z.B. in deiner `config.R`.

Noch sauberer wäre es, den Schlüssel in eine `.env` oder `.Renviron` zu speichern ([Mehr dazu](https://github.com/munichrocker/DatawRappr#setting-up-the-api-key).

Um zu testen, ob du erfolgreich authentifiziert bist, kannst du folgendes ausführen:

```r
dw_test_key(DW_API_KEY)
```

## Code

Der vollständige Code kann in der Datei [animate_storage_units.R](https://github.com/ZeitOnline/zg-energiepreise-tracker/blob/main/analysis/src/produce/animate_storage_units.R) gefunden werden. Im folgenden jedoch die entscheidenden Zeilen Code – mit Kommentaren versehen:

```r
# Wir speichern die ID des erstellten Charts als Variable
DW_CHART_ID <- 'pUNPd'

# Dies ist unser Gesamtdatensatz. Das Prinzip funktioniert mit jedem tibble, hier lesen
# wir die Gas-Speicher-Daten aus der Datenbank (Zugänge müssen eingerichtet werden)
df_agsi_units <- 'gas_storage_units' %>%
  paste0('SELECT * FROM ',.,';') %>%
  dbGetQuery(conn = con) %>%
  as_tibble() %>%
  filter(type == 'Storage Facility')

# Nun loopen wir über alle Daten zwischen dem 1. Januar 2022 und dem 8. September 2022.
# Dies kann mehrere Minuten dauern!
for (Date in c(ymd('2022-01-01'):ymd('2022-08-09'))){
  # Wir filtern aus unserem Gesamtdatensatz die Werte für den gewünschten Tag heraus
  df_agsi_units %>%
    filter(date == Date) %>%
    select(id, name, percent_full, volume) %>%
    # Um die Kreise von links nach rechts in einem Scatterplot zu positionieren
    # sortieren wir sie nach `id` und fügen dann eine neue Spalte `pos` mit der Zeilenzahl hinzu
    arrange(id) %>%
    rowid_to_column('pos') %>%
    # Pro Trick: Wir nutzen `&nbsp;` und `&nbsp;&nbsp;` als Spaltennamen, um zu erreichen, dass in
    # Datawrapper keine Achsen beschriftet werden, dies tun wir von Hand mittels Annotationen
    rename('Name' = name, '&nbsp;&nbsp;' = percent_full, 'Speichervolumen' = volume, '&nbsp;' = pos) %>%
    # Mit diesem Befehl laden wir nun diese Daten in unser Datawrapper-Chart (Schritt 1 sozusagen)
    # Wir benutzen immer dasselbe Chart, überschreiben einfach laufend die Daten
    dw_data_to_chart(chart_id = DW_CHART_ID, api_key = DW_API_KEY)

  # Nun schreiben wir das dargestellte Datum in den Titel unserer Datawrapper-Grafik
  dw_edit_chart(
    title = Date %>% as_date() %>% format(format  = '%d.&nbsp;%B&nbsp;%Y'),
    chart_id = DW_CHART_ID, api_key = DW_API_KEY
  )

  # Um das Bild gleich als PNG speichern zu können, müssen wir den Chart publizieren (Schritt 4 sozusagen)
  dw_publish_chart(chart_id = DW_CHART_ID, api_key = DW_API_KEY, return_urls = F)

  # Nun laden wir die Grafik als PNG Bild herunter, die Pixelmaße können hier frei gewählt werden
  dw_export_chart(
    type = 'png', width = '800', height = '450', plain = F,
    chart_id = DW_CHART_ID, api_key = DW_API_KEY) %>%
    # Als Dateiname verwenden wir ebenfalls das Datum, dies garantiert, dass sie anschliessend
    # in der korrekten Reihenfolge zu einem Video zusammengefügt werden können
    image_write(path = paste0('img/gas-storage/',as_date(Date),'.png'))
}

# Wenn der Loop erfolgreich durchgelaufen ist, können wir nun alle PNGs im entsprechenden Ordner
# als Vektor einlesen und an die Funktion aus dem `av` package übergeben. `framerate` gibt
# an, wie viele PNGs pro Sekunde dargestellt werden sollen (fps)
list.files('img/gas-storage', full.names = TRUE) %>%
  av::av_encode_video('img/gasstorage.mp4', framerate = 10)
```

Et voilà, das resultierende Video liegt nun im Ordner `img` und kann weiter geteilt werden
