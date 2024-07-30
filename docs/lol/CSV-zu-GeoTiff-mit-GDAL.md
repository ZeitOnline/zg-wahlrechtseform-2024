# CSVs mit lat/long mittels GDAL in GeoTiff umwandeln

_Autorin: Benja Zehr_

Folgendermaßen kann man relativ effizient mittels GDAL ein **CSV mit 23 Mio. Einträgen** verarbeiten und als **GeoTiff mit 600 Mio. Pixeln** speichern. Die Dateigröße beträgt am Ende schlanke **4,4 MB**.

Um alles zu bewerkstelligen, muss GDAL dessen Terminal-Tools `gdal_rasterize` und `ogrinfo` installiert sein. In einem VRT und einem TSCV File speichert man zusätzliche Infos ab, sodass GDAL das CSV optimal einlesen kann.

### VRT

GDAL kann CSVs direkt einlesen als Geodaten. Hierfür benötigt man lediglich eine **.vrt** Datei, welche GDAL mit den nötigen Informationen beliefert, z.B.: Wo liegt die Datei, und welche Spalten beschreiben die Koordinaten. [In der offiziellen Doku](https://gdal.org/drivers/vector/csv.html) findest du mehr darüber. Die **.vrt** Datei ist nicht kompliziert:

```xml
<OGRVRTDataSource>
    <OGRVRTLayer name="vessels">
        <SrcDataSource>vessels.csv</SrcDataSource>
        <GeometryType>wkbPoint</GeometryType>
        <LayerSRS>EPSG:4326</LayerSRS> <!-- WGS84 SRS -->
        <GeometryField encoding="PointFromColumns" x="lon" y="lat"/>
    </OGRVRTLayer>
</OGRVRTDataSource>
```

### TCSV

Wenn du GDAL 3.7 oder neuer hast, kannst du mit dem Flag `--o AUTODETECT_TYPE=YES` dafür sorgen, dass das CSV mit den korrekten Datentypen ausgelesen wird. Falls du eine ältere Version hast, erstell stattdessen eine **.tcsv** Datei. Das habe ich [hier](https://anitagraser.com/2011/03/07/how-to-specify-data-types-of-csv-columns-for-use-in-qgis/) entdeckt. In dieser Datei schreibst du einfach die Datentypen der Spalten in der richtigen Reihenfolge in eine Zeile:

```
"String","DateTime","Real","Real","Integer","String"…
```

Die Datei muss gleich heißen wie die CSV Datei und im selben Ordner liegen. QGIS versteht TSCV ebenfalls.

Um zu testen, ob dies funktioniert hat, kannst du mittels `ogrinfo` inspizieren, **wie GDAL deine Datei interpretiert**. Der folgende Befehl zeigt den ersten Eintrag der Datei. Da wo `vessels` steht, benutze den Dateinamen der CSV Datei:

```
ogrinfo points.vrt vessels -fid 1
```

Das Resultat sollte in unserem Fall so aussehen:

```
INFO: Open of `points.vrt'
      using driver `OGR_VRT' successful.

Layer name: vessels
Geometry: Point
Feature Count: 23088625
Extent: (-175.979915, -56.943766) - (179.999089, 78.100000)
…
OGRFeature(vessels):1
  scene_id (String) = S1A_IW_GRDH_1SDV_202008…6CF_8589
  timestamp (DateTime) = 2020/08/30 05:57:30+00
  lat (Real) = 56.2233805342056
  lon (Real) = 6.01732085831467
  year (Integer) = 2020
  mmsi (String) = 220135000
  matching_score (Real) = 4.32090102856425e-05
  fishing_score (Real) = 0.9513435
  length_m (Real) = 34.68705
  matched_category (String) = matched_fishing
  overpasses_2017_2021 (Integer) = 973
  POINT (6.01732085831467 56.2233805342056)
```

Wenn man dies nicht so macht, dann sind alle Daten einfach Strings.

### 🚀 Konvertierung

Um nun das CSV in ein GeoTiff zu verwandeln, brauchen wir [gdal_rasterize](https://gdal.org/programs/gdal_rasterize.html). Benutz am besten ein Makefile um den Befehl zu perfektionieren. Der Übersichtlichkeit halber habe ich alle Argumente auf eine eigene Zeile geschrieben:

```bash
fishing_tracked.tif:
	gdal_rasterize \
	-burn 1.0 \
	-where "(matched_category='matched_fishing' OR matched_category='matched_unknown') AND fishing_score >= 0.5" \
	-tr 0.009 0.009 \
	-a_nodata 0.0 \
	-ot Byte \
	-of GTiff \
	-co "COMPRESS=DEFLATE" \
	points.vrt \
	fishing_tracked.tif
```

Die Details zu allen Argumenten findest du in der [offiziellen Doku](https://gdal.org/programs/gdal_rasterize.html), die wichtigsten sind:

- `burn` gibt an, welcher Wert ins Pixel geschrieben werden soll, wenn die `where` Bedingung zutrifft
- `where` ist eine SQL-ähnliche Filter-Abfrage
- `tr` gibt die Auflösung des Bildes an (Große Werte ergeben ein grobes Bild mit wenig Pixeln)
- `ot` gibt den Datentyp an, `Byte` bedeutet 8bit
- `co` ist die Komprimierung, ohne sind’s 10GB, mit 10MB!

Et voilà, hinten kommt ein GeoTiff raus, was man bei Mapbox als Tileset hochladen oder in Gis angucken kann.

### 💡 Tipp: Sample erstellen

Es ist ganz schön mühsam, mit einem 4,5 GB CSV zu arbeiten, wenn man bei jedem Schritt unsicher ist, ob er funktioniert bzw. das Problem löst. Es ist deshalb ratsam dieselbe Datei in einer kleineren Version (Sample) zu speichern, dies kann man auf der Kommandozeile tun, indem man das File auf jede 100. Zeile reduziert:

```bash
awk 'NR % 100 == 1' vessels.csv > vessels_sample.csv
```
