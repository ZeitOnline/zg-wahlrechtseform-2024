# Fehlende Daten in R imputieren für Datawrapper

Datawrapper kann leider keine Linien nebeneinander zeichnen, wenn diese nicht dieselben X-Werte haben. Das Resultat [sieht sonst nämlich so aus](https://datawrapper.dwcdn.net/JWpJ5/1/) – die einzelnen Datenpunkte werden nicht korrekt verbunden. Deshalb berechnen wir in R Zwischenwerte. Einziger Nachteil: Tooltips kann man so nicht mehr zeigen.

## Eingesetzte Technologien / Packages

### R

- [Tidyverse](https://www.tidyverse.org/packages/): Kein R ohne Tidyverse
- [imputeTS](https://steffenmoritz.github.io/imputeTS/reference/imputeTS-package.html): Berechnet die Zwischenwerte

### Datawrapper

Wenn man die Grafik in d3 baut, besteht das Problem nicht. Aber wenn man sie in Datawrapper bauen möchte, dann weiterlesen.

## Vorbereitungen

Der gesamte Code liegt in folgendem Repo:

[https://github.com/ZeitOnline/zg-ampelversary](https://github.com/ZeitOnline/zg-ampelversary)

### Die Daten

Wir möchten die Zustimmungswerte der vier Merkel-Regierungen mit jener von Scholz vergleichen. Doch wenn wir die Daten in das für Datawrapper benötigte breite Datenformat bringen, entstehen zahlreiche `NA`s:

| Day | Merkel IV | Merkel III | Merkel II | Merkel I | Scholz |
| --: | --------: | ---------: | --------: | -------: | -----: |
|  30 |        18 |         NA |        20 |       NA |     NA |
|  44 |        28 |         NA |        19 |       NA |     NA |
|  65 |        37 |         NA |        NA |       NA |     21 |
|  86 |        35 |         NA |        NA |       NA |     NA |
| 107 |         5 |         NA |        NA |       NA |     NA |
| 121 |         6 |         NA |       -11 |       NA |     48 |
| 149 |         8 |         NA |       -22 |       NA |     NA |
| 170 |         7 |         53 |        NA |       NA |     NA |
| 184 |        15 |         NA |        NA |       NA |     NA |
| 198 |        -5 |         NA |        NA |       NA |     NA |

## Code

Als Grundlage für die gleich folgenden Berechnungen brauchen wir erst einmal ein Tibble im langen Datenformat, welches schlicht alle Tage für alle Koalitionen beinhaltet.

Dafür gibt es die hilfreiche Funktion `expand_grid` aus dem `tidyr` Package. Man übergibt ihr mehrere Vektoren (mit einem Spaltennamen) und sie erstellt dann ein langes Tibble mit allen daraus resultierenden möglichen Kombinationen:

```r
expand_grid(
  Day = c(1:max(df_approval$Day)),
  Cabinet = unique(df_approval$Cabinet)
)
```

Ergibt dann eine Tabelle, deren erste Einträge so aussehen:

| Day | Cabinet    |
| --: | :--------- |
|   1 | Merkel IV  |
|   1 | Merkel III |
|   1 | Merkel II  |
|   1 | Merkel I   |
|   1 | Scholz     |
|   2 | Merkel IV  |
|   2 | Merkel III |
|   2 | Merkel II  |
|   2 | Merkel I   |
|   2 | Scholz     |

[Über die nächsten Zeilen](https://github.com/ZeitOnline/zg-ampelversary/blob/main/main.R#L29-L36) werden nun die Werte dazugejoint, sodass wir nun die `na_interpolation` aus dem `imputeTS` Package laufen lassen können. Das Resultat sieht dann so aus:

| Day | Cabinet   | Raw |   Smooth |
| --: | :-------- | --: | -------: |
|  17 | Merkel I  |  48 | 48.00000 |
|  18 | Merkel I  |  NA | 46.54628 |
|  19 | Merkel I  |  NA | 45.15429 |
| ... |           |     |          |
|  28 | Merkel I  |  NA | 35.24327 |
|  29 | Merkel I  |  NA | 34.41496 |
|  30 | Merkel IV |  18 | 18.00000 |

In der Spalte Smooth sind nun interpolierte Werte, dabei stehen die folgenden drei Methoden der Interpolation zur Verfügung – `linear`, `spline` und `stine`, die folgendermaßen aussehen: [Visueller Vergleich](https://www.researchgate.net/profile/Kasim-Zor/publication/337324927/figure/fig14/AS:826531333025794@1574071834949/Missing-data-imputation-with-interpolation-methods.png).

Diese Daten bringen wir nun wieder ins wide Datenformat und laden sie zu Datawrapper hoch. Dabei behalten wir sowohl die lückenhaften `raw` Spalten wie auch die neu berechneten `smooth` Spalten.

### Letzter Schritt in Datawrapper

Der entscheidende Schritt folgt nun nämlich in [Datawrapper Schritt 3](https://app.datawrapper.de/chart/hFv18/visualize#refine).

Dort blenden wir nun die lückenhaften Linien mittels einer **Linienstärke** von 0px aus und zeigen nur noch die interpolierten Linien.

Beim Punkt **Symbole einstellen** machen wir genau das umgekehrte: Wir geben den lückenhaften Spalten einen **Kreis als Liniensymbol** und bei den Smoothen Spalten deaktivieren wir das Linensymbol.

[Das Resultat](https://app.datawrapper.de/chart/hFv18/publish): Die Kreise stammen nun von der originalen lückenhaften Datenspalte und die Linien aus unseren interpolierten Werten. 🥳📈📉
