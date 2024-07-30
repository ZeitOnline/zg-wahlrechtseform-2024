# Windräder platzieren mit QGis

🗺 Wir haben von der Firma **Agora** die sogenannten **Potentialflächen für Windräder** erhalten. Dies sind Flächen, wo man Windräder bauen könnte.

📍 Wir möchten deshalb die **möglichen Standorte für neue Windräder** berechnen – diese können in einem **Abstand von 450m** zueinander gebaut werden.

⛔️ Allerdings nur dort, wo nicht **bereits ein Windrad** steht. Deshalb müssen wir zu diesen stets einen Mindestabstand von **3 Rotor-Blätter-Durchmessern** einhalten.

## Eingesetzte Technologien / Packages

### QGis

Folgende QGis Plugins verwenden wir. Installiere sie, falls noch nicht geschehen im Menu unter **Erweiterungen**: **Erweiterungen verwalten und installieren**.

- **QuickMapServices**: Zeigt uns eine OpenStreetMap im Hintergrund an ([Anleitung](https://andre-walter.de/geografisches/qgis/qgis-grundlagen-openstreetmap-als-hintergrundkarte-2240/)).
- **NNJoin**: Wird uns später dabei helfen, zu unseren Windrädern den jeweils nächsten Punkt aus einem Raster zu finden.
- **SAGA**: Mit diesem Plugin erstellen wir Puffer, es sollte bereits vorinstalliert sein.

## Vorbereitungen

1. Alle benötigten Dateien liegen [in diesem Dropbox-Ordner](https://www.dropbox.com/preview/Daten%20und%20Visualisierung/LOL/windraeder-platzieren-mit-qgis/). Leg ein neues Verzeichnis für dein Projekt an und **speichere sie darin ab**.
2. Leg in QGis ein **neues Projekt** an und speichere es ebenfalls in dem Verzeichnis.
3. Zieh alle `*.shp` Shape-Files vom Ordner in Qgis, sodass sie unten links unter **Layer** gelistet werden.

Alle Dateien benutzen das **CRS 25832**, welches ein metrisches Koordinatensystem ist. Das ist wichtig, weil wir später Buffer berechnen werden. Diese wären nicht perfekt rund in einem Breiten-/Längenmaß-System.

Pro Tipp: Unter **Ansicht** lass dir zusätzlich das **Bedienfenster** namens **Verarbeitungswerkzeuge** einblenden. Darin kannst du nach Befehlen suchen, was ganz praktisch ist.

## Ablauf

### 1. Vektorflächen zusammenführen

Als erstes fügen wir folgende drei Ebenen zu einer einzigen zusammen:

- agora_1000m_forest_lol.shp
- agora_1000m_lol.shp
- agora_1000m_lpa_lol.shp

Die unterschiedlichen Kategorien von Flächen, die sie beschreiben, sind für uns nicht entscheidend – wir möchten Windräder in allen dreien platzieren.

1. Unter **Vektor** > **Datenmanagement-Werkzeuge** öffne den Dialog **Vektorlayer zusammenführen**
2. Klick auf die drei Punkte rechts unter **Eingabelayer**
3. Setz einen Haken bei den **drei Ebenen**, deren Namen mit "agora" beginnt.
4. Bestätige diesen Schritt mit **OK**.
5. Klick danach auf **Starten**.
6. Ein neuer Layer namens **Zusammengeführt** sollte unten links auftauchen

Du kannst die alten drei Layer nun ausblenden (Haken entfernen) oder auch löschen.

### 2. Pufferzone um existierende Windräder erstellen

Weil wir nicht neue Windräder direkt neben bestehende bauen können, werden wir die Flächen um die bestehenden Windräder (im Layer `existing_wr_lol.shp`) **von unseren Potentialflächen abziehen**.

Um jedes Windrad brauchen wir einen Sicherheitsabstand vom dreifachen der Rotorlänge. Die Rotorlänge befindet sich bereits in der Spalte `ROD` dieser Ebene. Diese kannst du dir ansehen, indem du nach Rechtsklick auf den Layer unten links auf **Attributetabelle öffnen** gehst.

1. Such rechts in den **Verarbeitungswerkzeugen** nach **Variable distance buffer** und starte dieses per Doppelklick.
2. Wähle bei **Shapes** die Ebene `existing_wr_lol` aus.
3. Wähle bei **Buffer distance** die Spalte `ROD` aus.
4. Setze als **Scale** einen Wert von `3,00` fest.
5. **Starte** den Prozess.
6. Die Buffer werden in einem neuen Layer **Buffer** erscheinen.

Du kannst gerne reinzoomen und unten links die Ebene existing_wr_lol noch einmal per Drag-and-Drop über "Buffer" schieben und kontrollieren, ob das glaubwürdig aussieht.

Mit Lineal aus der Werkzeugleiste oben kannst du sogar nachmessen, ob der Abstand korrekt ist.

### 3. Pufferzone von Potentialflächen subtrahieren

1. Starte das Geoverarbeitungswerkzeug **Differenz**
2. Als **Eingabelayer** wählst du jenen aus, von etwas abgezogen werden soll, also den namens **Zusammengeführt**.
3. Unter **Layer überlagern** wählst du jenen aus, der abgezogen werden soll, also **Buffer**.

Dies kann etwas dauern. Doch danach hast du einen neuen Layer **Differenz** mit dem gewünschten Ergebnis.

### 4. Windräder-Gitter erzeugen

Als nächstes erstellen wir ein Gitternetz wo wir Punkte erhalten, die alle mindestens **450m** von einander **entfernt** sind. Dies ist grob der Mindestabstand für Windräder. Dafür berechnen wir ein **Gitter** aus Sechsecken und dann dafür jeweils den **Mittelpunkt**.

1. Öffne das Werkzeug **Gitter erzeugen** unter **Vektor** im Ordner **Forschungswerkzeuge**.
2. Als **Gittertyp** wählst du Hexagon (Polygon) aus.
3. Bei **Gitterausdehnung** klickst du nun auf den kleinen Pfeil rechts und unter **Aus Layer berechnen** wählst du z.B. den Layer **Zusammengeführt**.
4. Trag bei **Horizontaler-** und bei **Vertikaler Abstand** je den Wert `450` ein.
5. Vielerlei Sechsecke sollten nun zu sehen sein.
6. Unter **Vektor** und **Geometrie-Werkzeuge** starten wir nun das Tool **Zentroide**.
7. Als Eingabelayer wählen wir den Layer von vorhin namens **Gitter**.

### 5. Auswählen der Koordinaten innerhalb der Potentialflächen

Nun haben wir Punkte, die nicht nur in den Potentialflächen liegen, sondern auch dazwischen. Diese löschen wir nun.

1. Unter **Vektor** und **Datenmanagement-Werkzeuge** wählen wir dafür **Nach Position selektieren**.
2. Beim Punkt **Objekte wählen aus** geben wir unseren neuen Layer **Zentroide** an.
3. Als **Prädikat** setzen wir den Haken bei **sind innerhalb** (und nur dort).
4. Beim Layer **Durch Vergleich** wählen wir die Ebene **Differenz**.
5. Wir **Starten** den Vorgang.

Die Punkte, die wir behalten wollen, sollten nun gelb aufleuchten.

### 6. Entfernen nicht mehr benötigter Punkte

1. Wir öffnen nun die **Attributetabelle** über einen Rechtsklick auf den Layer **Zentroide** unten links.
2. Dort aktivieren wir den **Bearbeitungsmodus** über den ersten Bleistift oben links über der Tabelle.
3. Über das gelbe und weiße Dreieck **invertieren** wir danach unsere **Auswahl**.
4. Über den roten **Papierkorb** löschen wir die dazugehörigen Einträge.
5. Über denselben ersten Bleistift beenden wir den **Bearbeitungsmodus** und bestätigen mit **Save**.

Wir haben nun nur noch Punkte innerhalb der Potentialflächen. Wir sind fast am Ziel.

### 7. Information über Energiepotential aus Raster joinen

Aus einer anderen Quelle haben wir ein 1km-Raster erhalten, wie stark es wo windet und wie viel Energie man daraus erzeugen kann. Wir hätten gerne zu jeder Windrad-Position in einer neuen Spalte den Wert des am nächsten gelegenen Rasterpunkt.

1. Unter **Vektor** öffnen wir das Werkzeug **NNJoin**.
2. Als **Input Layer** wählen wir jenen mit den Windrad-Standorten (Zentroide).
3. Bei **Join Vector Layer** wählen wir **grid_energy_lol**.
4. Mit **OK** starten wir den Vorgang.

Wir haben's geschafft! 🏗🦺👷🏼 Fahrt die Bagger auf!

🌬🍃 Wenn wir in einen Blick in die Attribute-Tabelle von der neu erstellten Ebene **Zentroide_grid_energy_lol** werfen, finden wir dort zu jedem Standort nun die Energiemenge, die dort produziert werden könnte: `join_AEP_kWh_a`. Unter `distance` können wir zusätzlich sehen, wie nah dieser Standort dem nächsten Rasterpunkt war.

## Wie macht man das in R?

Falls du diese Dinge lieber im Code erledigst statt mit dem QGis-Interface, hier dieselben 7 Schritte in `R`:

```r
needs(tidyverse, sf)

grid_energy_lol <- st_read("grid_energy_lol.shp")
existing_wr_lol <- st_read("existing_wr_lol.shp")
agora_1000m_lpa_lol <- st_read("agora_1000m_lpa_lol.shp")
agora_1000m_lol <- st_read("agora_1000m_lol.shp")
agora_1000m_forest_lol <- st_read("agora_1000m_forest_lol.shp")

# 1. Vektorflächen zusammenführen
zusammengefuehrt <- bind_rows(agora_1000m_lpa_lol,
                              agora_1000m_lol,
                              agora_1000m_forest_lol)

# 2. Pufferzone um existierende Windräder erstellen
buffer <- 1:nrow(existing_wr_lol) %>%
  map_dfr(function(i) {
    existing_wr_lol[i, ] %>%
      st_buffer(dist = .$ROD * 3)
  }) %>%
  st_union()

# 3. Pufferzone von Potentialflächen subtrahieren
differenz <- st_difference(zusammengefuehrt, buffer)

# 4. Windräder-Gitter erzeugen
gitter <- st_make_grid(zusammengefuehrt,
                       450,
                       square = FALSE) %>%
  st_as_sf() %>%
  st_centroid() %>%
# 5. Auswählen der Koordinaten innerhalb der Potentialflächen
  st_join(differenz,
          join = st_within) %>%
# 6. Entfernen nicht mehr benötigter Punkte
  filter(!is.na(id)) %>%
# 7. Information über Energiepotential aus Raster joinen
  st_join(grid_energy_lol, join = st_nearest_feature)
```
