# Georeferenzieren mit QGis

🖼 Stell dir vor, du hast ein Bild mit einer Karte. Möchtest nun genauer wissen, was auf der Welt dieser Kartenausschnitt zeigt.

🕵🏼‍♀️ Qgis hilft dir dabei, das Bild anhand einiger Punkte zu **georeferenzieren**, sodass du nachher zu jedem Pixel eine Lat-Long-Koordinate haben kannst.

🤓 Wenn du Teile des Bildes "nachzeichnest" kannst du das Resultat davon z.B. als **Shapefile** oder **Geojson** abspeichern und in anderen Tools nutzen (z.B. Datawrapper-Karte).

## Eingesetzte Technologien / Packages

### QGis

Am einfachsten machst du dir das Leben, wenn du eine Basemap nutzt, auf der du Orte anklicken kannst. Nutze deshalb:

- **QuickMapServices**: Zeigt uns eine OpenStreetMap im Hintergrund an ([Anleitung](https://andre-walter.de/geografisches/qgis/qgis-grundlagen-openstreetmap-als-hintergrundkarte-2240/)).
- **OSM Place Search**: Durchsucht Open Street Map nach Ortsnamen ([Anleitung](https://anitagraser.com/2013/12/29/address-finders-in-qgis-osm-place-search-vs-osmsearch/)).
- **Spline Plugin**: Ermöglicht es, Bezier-Kurven zu zeichnen statt eckige Linien.

Optional: Ein Plugin namens [Freehand raster georeferencer](https://gvellut.github.io/FreehandRasterGeoreferencer/) gibt es – damit könnte man das Bild von Hand skalieren, drehen und zerren. Der Weg über das Standard-QGis-Georeferenzier-Tool ist aber besser.

## Vorbereitungen

Falls deine Karte als **PDF** vorliegt, ist dies an sich nicht problematisch, aber es ist meist trotzdem einfacher, das PDF nochmal als **PNG** abzuspeichern.

🤖 Wenn du in der Zukunft planst, dasselbe Bild (bzw. Updates davon) immer wieder in QGis zu laden, dann **beschneide das Bild nicht von Hand**, weil das nicht reproduzierbar ist.

Optional: Trag in einer **Tabelle** die **Koordinaten** von einigen Punkten auf deiner Karte zusammen.

Du findest die Übungsdateien zu diesem LOL im [Dropbox-Ordner](https://www.dropbox.com/sh/pf2kobb7xq9iocu/AAA8-yZbvlKOdP52C5EonRDoa?dl=0).

## Ablauf

Öffne QGis und blende z.B. **OSM Standard** als Basemap ein ([Anleitung](https://andre-walter.de/geografisches/qgis/qgis-grundlagen-openstreetmap-als-hintergrundkarte-2240/)).

1. Starte über das Menu **Layer** den Dialog **Georeferenzierung**.
2. Starte **Raster öffnen** über das erste Icon oben links (Plus mit Schachbrett) oder über **Datei**.
3. Wähl im Finder deine Bilddatei mit deiner Karte. Das Bild sollte auftauchen.
4. Wähle **Punkt hinzufügen** über das Icon mit dem gelben kleinen Quadrat oder über **Bearbeiten**.
5. Zoom über das Scrollrad nah ans Bild ran und **setze einen ersten Punkt** an einem Ort, den du gut identifizieren kannst. (Städte, Kreuzungen etc.)
6. Ein Dialog öffnet sich. Klick nun auf den Button **Aus Kartenansicht** oder füg hier die vorbereiteten Koordinaten ein.
7. Der Referenzierungsdialog springt zur Seite und du siehst deine Basemap. Zoome zu dem Ort, den du vorhin auf dem Bild geklickt hattest und **klick dort auf die Karte, wo dieser Punkt liegt**.
8. Bestätige mit **OK**.
9. Wiederhole dies, bis du **mindestens drei Punkte** hast, die du als Referenz nutzen möchtest. Im besten Fall liegen diese auf dem Bild **weit auseinander** in verschiedenen Ecken.
10. Öffne nun die **Transformationseinstellungen** über das große gelbe Zahnrad im Referenzierungsdialog.
11. Wähl als Transformationstyp **Polynomial 1** ([Mehr dazu](https://ltb.itc.utwente.nl/page/498/concept/81586)).
12. Wähl eine **Ausgabedatei** (GeoTif) in deinem gewünschten Ordner.
13. Wähl **Nächster Nachbar** als Abtastmethode.
14. Wähl **LZW** als Kompression.
15. Bestätige mit **OK**.
16. Klick auf den **Play-Knopf**, um die Referenzierung durchzuführen.
17. Schließe den Dialog und **speichere die Passpunkte** in denselben Ordner wie das Bild liegt.

🔎 Wenn du den gewünschten Ort auf der Basemap nicht sofort findest, nutze das Plugin **OSM Place Search** um Orte anhand ihres Namens zu finden und direkt hinzuzuoomen.

🤓 Wenn du einen Punkt auf deinem Bild nachträglich **verschieben** möchtest, kannst du dies über das Icon mit dem blauen Quadrat tun (Passpunkt verschieben) oder diesen mit dem roten Icon (Punkt löschen) oder unten in der Tabelle durch Rechtsklick **entfernen**.

### Nachkontrolle

Das GeoTif sollte nun als Ebene hinzugefügt worden sein. Hurra!

Im Referenzierungsdialog unten rechts siehst du den **Mittlerer Fehler**. Dies ist ein Maß, das angibt, wie weit deine Punkte im Schnitt verschoben wurden durch die Referenzierung. Kleinere Werte sind besser.

Such auf der Karte nach administrativen oder natürlichen **Grenzen**, an denen du ablesen kannst, ob die Referenzierung geglückt ist.

🤓 Durch Doppelklick auf die Ebene kannst du unter **Transparenz** die Deckkraft reduzieren um die Basemap und das Bild noch besser vergleichen zu können.

Wenn du nicht zufrieden bist, kannst du nochmal bei Schritt 1 oben beginnen. Wenn du die Passpunkte als Datei gespeichert hast, werden diese wieder geladen und du kannst **nachbessern**.

### Was nun?

Womöglich möchtest du jetzt etwas auf deinem Bild nachzeichnen und es so vektorisieren. Zum Beispiel eine Linie nachzeichnen, um sie als GeoJSON zu speichern.

1. Klicke hierfür unter **Layer** und **Layer erstellen** auf **Neuer Shapedatei-Layer**.
2. Wähle einen Dateinamen in einem Ordner deiner Wahl.
3. Als **Geometrietyp** musst du dich zwischen Punkten, Linien und Polygonen entscheiden.
4. Erstelle diesen nun mit **OK**.
5. Klick rechts auf deine neue Ebene und wähle **Bearbeitungsstatus umschalten**.
6. Öffne unter **Bearbeiten** das Werkzeug **Linienobjekt hinzufügen**, um eckige Linien zu zeichnen.
7. Wenn du fertig bist, wähle wieder **Bearbeitungsstatus umschalten** und speichere deine Änderungen so in der Datei ab.

Wenn du kurvige Linien zeichnen musst, benutze dafür **Digitize Splines**. Das Icon wird durch die Plugin-Installation des **Spline Plugin** hinzugefügt (blaue kurvige Linie).
