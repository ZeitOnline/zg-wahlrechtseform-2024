# R: Mit `walk` und `map` mächtige Transformationen vornehmen

Wenn du bisher immer eine `for`-Loop schreibst, um mit allen Elementen eines Vektors oder eines Tibbles etwas anzustellen, bist du hier richtig. Das geht nämlich eleganter.

## Eingesetzte Technologien / Packages

### R

- [Tidyverse](https://www.tidyverse.org/packages/): Kein R ohne Tidyverse
- [purrr](https://purrr.tidyverse.org/): Beide Funktionen, die im Zentrum stehen, stammen aus diesem Package
- [rvest](https://rvest.tidyverse.org/): Als Beispiel werden wir eine Textdatei scrapen, dafür arbeiten wir mit `httr` und `rvest`
- [glue](https://glue.tidyverse.org/): Setzt Strings zusammen (Ein bisschen wie `paste0` aber viel cooler)

#### Wichtigste Funktionen

- `walk` und `map_dfr`: Um über Vektoren/Listen zu iterieren
- `pwalk` und `pmap_dfr`: Um über Tibbles zu iterieren

## Vorbereitungen

Kurze Begriffserklärung: Ich rede gelegentlich von **Tibbles**, das sind aber auch nur **Data Frames** mit ein paar Hadley-Wickhamschen-Extras ([Mehr dazu](https://tibble.tidyverse.org/)).

## Code

### Primitives Beispiel

Dank `map_dfr` können wir über einen Vektor oder eine Liste iterieren und das Resultat direkt in ein Tibble speichern. Ein maximal einfaches Beispiel anhand des global verfügbaren Vektors `LETTERS`, der einfach die 26 Buchstaben des Alphabets beinhaltet:

```r
search <- glue(
  "Zum Beispiel können wir für jeden Buchstaben des Alphabets zählen, wie oft ",
  "er in einem Text vorkommt und das Resultat direkt in ein Tibble speichern. ",
  "Das machen wir nun."
) %>% str_to_upper()

occurrences <- LETTERS %>%
  # dfr steht hier für "Data Frame Rowwise" und bedeutet, dass das Resultat
  # dieser Funktion ein Data Frame sein wird, welches Zeile für Zeile zusammen-
  # gebunden wird - früher hätten wir dafür rbind verwendet
  map_dfr(function(current_letter) {
    print(glue("searching for {current_letter} now…"))
    # Die Tibbles, die wir returnen können aus mehreren Zeilen bestehen
    # Sie müssen nicht einmal notwendigerweise alle dieselben Spalten haben
    return(tibble(
      "letter" = current_letter,
      "n" = str_count(search, current_letter)
    ))
  })
```

### Realitätsnäheres Beispiel

Wir werden alle Links aus dieser HTML-Datei in ein Tibble speichern:

[https://opendata.dwd.de/weather/nwp/icon-eu/grib/00/t_2m/](https://opendata.dwd.de/weather/nwp/icon-eu/grib/00/t_2m/)

```r
# Wir erstellen eine neue Variable und iterieren über einen einfachen Vektor
dwd_files_to_download <- c("icon-eu", "icon-d2") %>%
  map_dfr(function(current_directory) {
    # Weil wir nett sind und die Server schonen möchten: 1 Sekunde warten
    Sys.sleep(1)
    # Mit glue setzen wir die vollständige URL zusammen, die wir scrapen möchten
    url <- glue("https://opendata.dwd.de/weather/nwp/{current_directory}/grib/00/t_2m/")
    # Dank einigen schlauen prints können wir mitverfolgen wie weit wir sind
    print(glue("will request {url}"))
    # Hier findet der HTTP-Request statt, das kann dann immer bisschen dauern
    GET(url) %>%
      content("text", encoding = "UTF-8") %>%
      read_html() %>%
      # Alle Links auf der Seite in einer Liste zusammenführen
      html_nodes("a") %>%
      # Aus den Link die URL rausholen (über das Attribut href)
      html_attr("href") %>%
      # Liste in Tibble umwandeln
      as_tibble() %>%
      # Erste Spalte in url umbenennen (as_tibble nennt das immer "value")
      rename(filename = 1) %>%
      # Eintrag löschen, der nur aus zwei Punkten besteht ("Zurück Ordner")
      filter(!str_detect(filename, "\\.\\.\\/")) %>%
      mutate(# Um wieder eine vollständige URL zu erhalten, müssen wir noch das
        # Verzeichnis vornedransetzen, in dem die Datei liegt
        url = glue("{url}{filename}"),
        # Hier kann man beliebige weitere dplyr Dinge anstellen
        unit = "t_2m")
  }) %>%
  # Auch an dieser Stelle kann man ganz einfach noch weitere dplyr-Befehle
  # auf das gesamte Tibble anwenden, zum Beispiel Einträge filtern
  filter(str_detect(url, "regular.lat.lon"))
```

Danach iterieren wir über die Liste von Dateinamen und speichern sie lokal ab.

```r
dwd_files_to_download %>%
  # Um zu reinen Übungszwecken nicht zu viele Requests abzusenden, iterieren
  # wir nur über die ersten fünf Zeilen
  slice(1:5) %>%
  # Mittels row_number kann man einen Iterierungs-Index hinzufügen
  mutate(index = row_number()) %>%
  # walk gibt im Gegensatz zu map nichts zurück. Das p vor walk sorgt hier
  # dafür, dass wir über Data Frames iterieren können und nicht nur über Listen
  pwalk(function(...) {
    # This is where the magic happens: Über die drei Punkte speichern wir alle
    # Spalten aus der Zeile, über die wir gerade iterieren in ein neues Tibble
    current <- tibble(...)
    # Wir möchten unsere Dateien im Ordner "DWData" speichern. Vorsicht:
    # Diesen müssen wir von Hand vorher erstellen, sonst gibt's einen Fehler
    current_destination <- glue("DWDdata/{current$filename}")
    # Wir laden die Datei nur herunter, wenn sie noch nicht existiert lokal
    if (!file.exists(current_destination)) {
      # Weil wir nett sind und die Server schonen möchten: 1 Sekunde warten
      Sys.sleep(1)
      # An glue können wir auch temporäre Variablen (hier: i und n) übergeben,
      # die noch nicht existieren und auch nachher nicht gespeichert werden
      print(glue(
        "{i}/{n} will download {current$filename}",
        i = current$index,
        n = nrow(dwd_files_to_download)
      ))
      # Nun wird die Datei tatsächlich auf unser System gespeichert
      download.file(current$url,
                    current_destination, quiet = TRUE)
    }
  })
```

### Zusätzliches Beispiel (weil echt praktisch)

Mehrere Excel-Files in ein langes Dataframe einlesen.

```r
data_from_multiple_files <- list.files(
  "path/to/my/data/files",
  pattern = "\\.xlsx$",
  full.names = TRUE
) %>%
  map_dfr(function(current_filename) {
    read_xslx(current_filename)
  })
```

## Warum nicht einfach `for` Loops?

Klar, man kann die oben gesehenen Dinge alle auch in einer guten alten Schleife machen.

### Vorteile gegenüber loops

- Wir benötigen keine temporären Variablen, die dann im global scope liegen bleiben
- Wir können das Resultat direkt in eine Variable schreiben, anstatt diese fortlaufend zu füllen
- Man kann die Funktion in `quietly` packen, um weniger Konsolen-Outputs lesen zu müssen oder in `possibly` um einen Fallback-Value zu retournieren. Das Skript bricht dann nicht ab, wenn etwas schief geht. ([Mehr dazu](https://purrr.tidyverse.org/reference/safely.html))
- Man könnte die Funktion in einer Variable speichern und auf mehrere Vektoren/Tibbles anwenden.

### Nachteile gegenüber Loops

- Die Performance von `map_dfr` ist eindeutig schlechter, sobald es um sehr viele Zeilen geht, dies liegt daran, dass z.B. in der 500.000-sten Iteration ein neues Tibble mit 500.001 Zeilen erstellt wird und jenes mit 500.000 Zeilen wird entsorgt.
- Es kann etwas schwieriger sein, die Iterationen zu debuggen. Wenn etwas in der 200-sten Ausführung schief geht, muss man erst mal herausfinden, welcher Eintrag das Problem verursacht und wieso. Dabei kann es helfen, Einfach kurz eine Variable z.B. `current_directory` zu erstellen, ihr einen festen Wert zu geben und die Zeilen manuell auszuführen.
