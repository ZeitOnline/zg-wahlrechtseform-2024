# NetCDFs: Arbeiten mit R, Qgis und Python

Das folgende Wissen ist nicht über jeden Zweifel erhaben, sondern lediglich das Produkt eines [kleines Projekts](https://github.com/ZeitOnline/zg-thwaites-2022) wo zwei `.nc` Files die Datengrundlage bildeten.

## Was sind `.nc` / `.cdf` Files?

NetCDFs begegnen uns vermutlich meistens in einem geografischen Kontext, sprich: **als Karten**. Vereinfacht kann man sagen, dass sie **mehrere Raster-Dateien** beinhalten. Die Raster haben in der Regel `x` und `y` Koordinaten und dann diverse weitere Datenpunkte.

Jedes einzelne Raster könnte man auch z.B. als GeoTif abspeichern. NetCDFs sind in der Summe aber kleiner (weil komprimiert).

Was sehr toll ist: Zur Datei insgesamt und zu jeder einzelnen Ebene gibt es **Metadaten**. Darin stehen dann z.B. Einheit, Zeitbezug oder sonstige Beschreibungen.

Einzelne Ebenen können auch ein Datum als **zusätzliche Dimension** haben. Also z.B. dasselbe zu verschiedenen Zeitpunkten zeigen.

## Arbeiten mit R

### Eingesetzte Packages

- [ncdf4](https://cran.r-project.org/web/packages/ncdf4/index.html): Bildet die Grundlage für andere Packages und hat einige nützliche Hilfsfunktionen
- [raster](https://rspatial.org/raster/pkg/index.html): Nutzen wir zum Lesen von `.nc` Dateien. Plus: ist unverzichtbar für alle Raster-Operationen
- [terra](https://rspatial.org/pkg/index.html): Bietet einige nützliche Funktionen zum Bearbeiten von Rastern

### Einige wichtige Funktionen

- `nc_open`: Zeigt alle Ebenen und Metadaten einer NetCDF Datei
- `raster`: Liest ein spezifisches Raster aus der NetCDF Datei
- `calc`: Wendet eine Funktion auf alle Datenpunkte in einem Raster an
- `crop`: Beschneidet ein Raster mittels einer Bounding box
- `aggregate`: Reduziert die Auflösung eines Rasters (macht die Bearbeitung danach schneller)
- `extract`: Liest von einer `x,y`-Koordinate den dazugehörigen Wert aus einem Raster
- `as.data.frame(xy = TRUE)`: Wandelt ein Raster in ein Dataframe um, welches dann in ggplot geplottet werden kann
- `projectRaster`: Transformiert das Raster vom einen ins andere Koordinatensystem (`CRS`)
- `writeRaster`: Exportiert ein Raster (z.B. als GeoTif)

### Code Beispiele

#### Metadaten lesen

```r
nc_open(glue("{ONEDRIVE_FOLDER}/ANT_G1920V01_GroundedIceHeight.nc"))
```

Den Rückgabewert dieser Zeile analysieren wir von Hand und erfahren so, wie die Ebene (`varname`) heißt, die wir lesen möchten und ob diese eine weitere Dimension (z.B. Zeit) besitzt (`band`):

#### Einzelne Ebene als Raster einlesen

```r
dh_1992_raster <-
  raster(
    glue("{ONEDRIVE_FOLDER}/ANT_G1920V01_GroundedIceHeight.nc"),
    # Hier gibt man den Ebenenamen an
    varname = "dh",
    # Hier wählt man einen Zeitpunkt / zusätzliche Dimension
    band = 86
  )
```

#### Mathematische Operationen

Mit Rastern kann man diverse Rechnungen anstellen. Zwei Raster zu addieren oder zu subtrahieren geht ganz einfach so:

```r
raster_add <- raster_eins + raster_zwei
raster_subtr <- raster_eins - raster_zwei
```

Mittels `calc` kann man eine Funktion auf alle Datenpunkte anwenden, zum Beispiel alle durch die Variable `anzahl_jahre` dividieren:

```r
raster %>%
	calc(function(x) { x / anzahl_jahre })
```

#### ggplot

Das `terra` Package bietet eine `rasterVis` Plot Funktion und auch das Raster Package hat eine `plot` Funktion. Da ich persönlich aber am liebsten mit `ggplot` arbeite, hier kurz die Anleitung dafür.

Man muss dazu nämlich das Raster immer in ein Data Frame umwandeln und kann dann `geom_raster` benutzen.
Es empfiehlt sich, während dem Arbeiten nur aggregierte Data Frames zu plotten (wegen der Rechenzeit):

```r
thickness_aggregated_df <- thickness %>%
	aggregate(4) %>%
  as.data.frame(xy = TRUE) %>%
  rename(value = 3)

ggplot() +
  geom_raster(
    data = thickness_aggregated_df,
    aes(x = x, y = y, fill = value)
  ) +
  scale_fill_viridis_c(option = "B") +
  # Macht, dass das Seitenverhältnis korrekt ist und das Bild nicht verzogen
  coord_fixed() +
  theme_void()
```

## Arbeiten mit Qgis

Qgis kann richtig gut mit NetCDFs umgehen. Man zieh sie effektiv einfach ins Projekt und es öffnet sich automatisch ein Dialog, in dem man angibt, welche Ebene man als Raster-Bild laden möchte.

Ist eine Ebene **mehrdimensional** (z.B. mehrere Zeitpunkte) wird es etwas komplizierter. Qgis beginnt dann standardmäßig die RGB-Kanäle Rot, Grün und Blau mit drei ersten Datumsständen zu zeichnen (Multiband color). Das ist in der Regel nicht sinnvoll. Im **Layer Styling** kann man dies auf z.B. "Singleband pseudocolor" wechseln und dann das gewünschte Datumsband auswählen.

### Arbeitsprozess beschleunigen

Hochauflösende Raster können lange Rechenzeiten mit sich bringen. Es kann sich daher lohnen, jene Ebenen, mit denen man gerade arbeitet, als **GeoTif** zu exportieren. Unter **Resolution** kann man im Exportprozess dann die Auflösung reduzieren.

Zentrale Schaltstelle danach ist das Panel **Layer Styling**. Dieses sollte man sich in groß (z.B. in der rechten Spalte) darstellen, dann ist das Einstellen der Darstellung relativ intuitiv.

Sollte sich die `.nc` Datei verändern, während man Qgis offen hat, dann einfach das **Projekt speichern und neu öffnen**. Erst dann werden die Daten neu geladen.

### Arbeiten in Python

Da ich nicht fit bin in Python, kann kann ich dazu nicht all zu viel sagen. Valentin Peter hat 2022 ein [Python Skript](https://github.com/ZeitOnline/zg-duerre-2022/blob/main/data-processing/netcdf_to_csv.py) geschrieben, welches einen spezifischen Datumsstand aus einem NetCDF extrahiert und als CSV abspeichert.

Ansonsten gibt es auch für Python ein [NetCDF4-Package](https://unidata.github.io/netcdf4-python/). Damit kann man bestimmt all die oben beschriebenen Dinge ebenfalls ausführen.
