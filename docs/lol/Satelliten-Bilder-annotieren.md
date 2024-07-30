# Satelliten-Bilder annotieren

Mit dem [Satelliten-Annotator](https://interactive.zeit.de/g/2023/zg-satellite-image-annotator/static-html/index.html) von Benja kann man Satelliten-Bilder mit World-Files und normale Bilder ohne World-Files annotieren und in Vivi einbinden, ohne etwas deployen zu müssen.

### Was sind World-Files?

[World-Files](https://en.wikipedia.org/wiki/World_file) sind kleine Textdateien, die aus sechs Zahlen bestehen. Anhand dieser Zahlen wissen Geo-Programme, wo auf der Welt das dazugehörige Bild in welcher Größe zu liegen kommt.

Das hat den Vorteil, dass man auch ganz normale Bilder wie PNGs und JPGs in QGIS reinziehen kann und damit weiterarbeiten. Bei einem PNG heißt das World-File z.B. `*.pgw`, bei einem JPG heißt es `*.jgw`. Es muss im gleichen Ordner liegen und den gleichen Datei-Namen haben. 

Umgekehrt kann man beim Bild-Export aus **QGIS** auch immer ein World-File mit-exportieren lassen. Der [Satelliten-Annotator](https://interactive.zeit.de/g/2023/zg-satellite-image-annotator/static-html/index.html) versteht diese World-File ebenfalls. 

## Bilder annotieren und in Vivi veröffentlichen

1. Öffne den [Satelliten-Annotator](https://interactive.zeit.de/g/2023/zg-satellite-image-annotator/static-html/index.html) und zieh deine Bild- und World-Datei per Drag & Drop in die App.
2. Falls du ein anderes **Koordinatensystem** als 3857 nutzt, wähl dieses aus der Liste oben links aus (3857 ist perfekt geeignet)
3. Dort kannst du auch einen **Nordpfeil**, eine **Mini-Map** und einen **Maßstab** zur Karte hinzufügen.
2. **Klick** an eine Stelle, die du annotieren möchtest. Wenn du die **Maus gedrückt** hälst und ziehst, erstellst du einen **Kreis**.
3. Links kannst du alle Infos zu jeder Annotation bearbeiten und z.B. über die Icons 📱/🖥️ die Annotation auf **Mobil oder Desktop** ausblenden.
4. Wenn du eine **Stadt** o.ä. annotieren möchtest, kannst du sie links über das **Suchfeld** (**Geocoder**) suchen und automatisch an der richten Stelle erstellen lassen.
5. Wenn du zufrieden bist, klick oben links auf den Button **Copy**. Deine Annotationen sind jetzt in deiner Zwischenablage.
6. Öffne Vivi und erstell eine **Bildergruppe**. Lad dafür das Bild hoch und wähl als Quelle „Zeit Online“ und speichere und veröffentlich es.
7. Öffne den Artikel, in dem du das Bild zeigen möchtest und zieh folgendes **Pembed** an die gewünschte Stelle: [zg-image-annotator-viewer](https://vivi.zeit.de/repository/administratives/embeds/2023/zg-satellite-image-annotator/zg-image-annotator-viewer)
8. Füg bei **Daten** den Inhalt aus deiner Zwischenablage ein.
9. Zieh die eben veröffentlichte Bildergruppe in das Feld **Bildergruppe**.

Fertig. Aktiviere wenn gewünscht die Option „vollbreit“ oder „Höhe an Bilschirm anpassen“. Letzteres ermöglicht den Einsatz in einem Scroller ähnlich wie ai2html.

Das ganze Spiel funktioniert auch mit **nicht-geografischen Bildern**. Bestätige dann einfach den Upload-Dialog mit „Ohne World-File arbeiten“.

### Bilder aus QGIS exportieren

Wenn du dich fragst, wie du überhaupt die Bilder aus QGIS rauskriegst: dafür gibt es zwei Wege.

**Der einfache Weg**:

1. Wähl für dein Projekt ein sinnvolles **Koordinatensystem**: 3857 eignet sich gut, 4326 weniger
2. Geh unter **Project** auf **Import/Export** auf **Export Map to Image**
3. Es öffnet sich ein Dialog, in dem du mittels **Draw on Canvas** den Bild-Ausschnitt direkt in die Karte malen kannst.
4. Setz die **Resolution** hoch auf 200-300 dpi
5. Achte darauf, dass der Haken **Append georeference information** aktiviert ist (zu unterst)
6. Klick auf **Save**

Ich bin nicht ganz sicher, ob der Bildausschnitt beim nächsten Export nochmal derselbe ist. Das macht diesen Weg nicht perfekt reproduzierbar, weil der Ausschnitt leicht variieren könnte.

**Der reproduzierbare Weg** beinhaltet die Arbeit mit dem Layout Manager. Dieser ist leider zu kompliziert, um ihn an dieser Stelle zu erklären. Du wirst dir dies über Youtube o.ä. selber aneignen müssen. Im Dialog **Export as Image** kannst du dann den Haken setzen bei **Generate World File**.