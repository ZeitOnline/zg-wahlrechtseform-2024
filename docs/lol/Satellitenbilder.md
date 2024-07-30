# Quellen für Satellitenbilder

### Kategorien

Was man wissen muss, ist, dass es zwei verschiedene Sorten Satellitenbilder gibt:

- Foto von einem bestimmten Zeitpunkt (mit Wolken)
- Median über längere Zeit (ohne Wolken)

### Dateiformate

Die wichtigsten Formate für Satellitenbilder sind:

- **PNG**\
  für nicht-georeferenzierte Bilder in reinem RGB
- **GeoTIFF**\
  für georeferenzierte Bilder mit unterschiedlichen Ebenen

Es gibt verschiedene Anbieter, bei denen man Satellitenbilder beziehen kann. Diese unterscheiden sich in der Auflösung Meter pro Pixel (Qualität) und darin wie oft (Intervall) und wie lange schon (Historie) Bilder gemacht werden.

## Empfehlung: Planet

[https://www.planet.com/](https://www.planet.com/)

- Qualität: 1px = 3m (höhere Qualität, Skysat kostet dann)
- Format: GeoTIFF
- Intervall: täglich ganze Welt!
- Zugang: 1password

Firma aus Kalifornien, die über 1000 Satelliten in Schuhkartongröße ins All geschossen hat.

**Vorsicht:** Die Registrierung ist einfach und schnell (keine Freischaltung nötig, keine langen Angaben nötig). Aber: man startet mit einem Trial und muss sich selbständig noch als Medienpartner "akkreditieren lassen". Am einfachsten deshalb Julius' Account nutzen (1Password).

Sonst allgemein sehr einfach in der Handhabung.

## Sentinel Hub (ESA)

[https://apps.sentinel-hub.com/eo-browser/](https://apps.sentinel-hub.com/eo-browser/)

- Qualität: 1px = 10m
- Intervall: Teilweise täglich (in schlechterer Qualität: MODIS)
- Format: GeoTIFF (und auch Filme)

Die machen nicht nur Fotos mit RGB, sondern auch noch Wellen in anderer Länge (Infrarot, Stickoxide, Vegetation, Trockenheit etc.). Hier eine nicht abschließende Liste:

- True Color - Visuelle Interpretation der Bodenbedeckung.
- False Color - Visuelle Interpretation der Vegetation.
- NDVI - Vegetationsindex.
- Moisture index - Feuchte-Index
- SWIR - Kurzwellen-Infrarot-Index.
- NDWI - Normalisierter Differenz-Wasser-Index.
- NDSI - Normalisierter Differenz-Schnee-Index.

### Pricing

[https://www.sentinel-hub.com/pricing/](https://www.sentinel-hub.com/pricing/)

Was man mit dem gratis Account kann:

- Download analytical data with EO Browser
- Non-commercial use

## Landsat (NASA)

[https://earthexplorer.usgs.gov/](https://earthexplorer.usgs.gov/)

- Qualität: 1px = 30m (schlecht)
- Format: GeoTIFF
- Intervall: ca. 16 Tage
- Historie: Seit 1973!

Im Moment schon in 9. Version im All. Mit Pen-Sharpening kriegt man die Auflösung ev. auf ca. 15m pro Pixel herunter.

**Vorsicht:** Aufwändiges Registrierungs-Prozedere ist nötig, um Bilder herunterzuladen.

## Google Earth Engine

[https://earthengine.google.com/](https://earthengine.google.com/)

- Intervall: Teilweise täglich!
- Historie: Seit 1984!

Die haben mehr oder weniger alle Satellitenbilder der Erde, die frei verfügbar sind, zusammengezogen.

Man kann daraus direkt per Script Videos generieren!

Zum Beispiel NO2-Werte über Wuhan zeigen wie lange der Lockdown war. Man kann daraus direkt Google Charts generieren. Diese wiederum kann man CSV/SVG laden.

**Vorsicht:** Es ist nur gratis für die nicht-kommerzionelle Nutzung und man muss sich registrieren und angeben, wofür man das Tool nutzt und auf die Freischaltung warten.

## Google Earth Studio

[https://www.google.com/intl/de/earth/studio/](https://www.google.com/intl/de/earth/studio/)

Hier kann man auch Animationen und Flüge machen ohne Code einfach über ein Webinterface.

**Vorsicht:** Es ist nur gratis für die nicht-kommerzionelle Nutzung und man muss sich registrieren und angeben, wofür man das Tool nutzt und auf die Freischaltung warten.

## Maxar (Luxus-Anbieter)

[https://www.maxar.com/](https://www.maxar.com/)

- Nicht kostenfrei erhältlich
- Qualität: 1px = 0.3m
- Format: PNG/GeoTIFF
- Intervall: nicht täglich

Maxar hat die beste Qualität aller Anbieter. Die Bilder, die man in [Google Maps](https://www.google.com/maps/@53.5553326,10.020701,624m/data=!3m1!1e3) sieht, greifen auf Maxar-Satellitenbilder zurück.

3×3 km kosten jedoch ca. 800$. Das Intervall ist unregelmäßig. Auftraggeber für die Erfassung sind oft Regierungen.

Es gibt einen Presse-Verteiler, der aktuelle Satellitenbilder für ausgewählte Regionen beinhaltet. Das sind dann aber nur PNGs.

Es könnte sich lohnen, Kontakte zu dieser Firma aufzubauen, um vielleicht dereinst kostenlos an hochauflösendes Material zu kommen.

## Satellogic

- URL: [https://satellogic.com/](https://satellogic.com/)

Diese Firma arbeitet mit Maxar zusammen. Hierüber kriegen wir dann allenfalls Maxar-Bilder in Hochauflösung und georeferenziert.
