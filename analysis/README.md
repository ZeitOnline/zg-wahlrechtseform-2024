# Analysis

- Mittels `make install` installierst du alle nötige Software.
- Mittels `make all` führst du die gesamte Analyse aus.

Die Analyse setzt sich aus einem oder mehreren Schritten zusammen (siehe [Skripte](#skripte)). Lies den Abschnitt [Neues Skript anlegen](#neues-skript-anlegen), wenn du einen Schritt hinzufügen möchtest.

## Ordner-Stuktur

* `data`: Hier werden alle benötigten Dateien (xlsx, shp, etc.) abgelegt (**Input**)
* `tmp`: Ort für Dateien, die Skripts exportieren aber **nicht ins Frontend** gehören.
* `export`: Ort für Dateien, die später **im Frontend** benötigt werden.
* `requirement.txt`: Liste aller benötigten **Python** Packages
* `packages.R`: Liste aller benötigten **R** Packages
* `package.json`: Liste aller benötigten **Node** Packages

## Regeln

Auch eine Person, die nichts vom Projekt weiß, sollte in der Lage sein, die Analyse mit `make all` durchzuführen.

### data

🗂 Pro Datenquelle legen wir einen **Unterordner** an.

Im [data](./data) Ordner legen wir Daten aus externen Quellen ab. Es bildet den **Input** für unsere Skripte.

### preprocessing


🗂 Wähl einen **sprechenden Namen** für dein Skript. Mach einen Ordner, wenn dein Skript aus mehreren Dateien besteht.

Im [preprocessing](./preprocessing) Ordner liegen alle Skripte, die **Daten transformieren** (anreichern, kombinieren, filtern). Alles, was etwas in die Ordner [tmp](./tmp) und [export](./export) speichert, gehört hier rein!

⚠️ Diese Verarbeitung der Daten muss reproduzierbar sein! Erstell deshalb **pro Arbeitschritt einen make Befehl** und füge die `make` Befehle in der richtigen Reihenfolge zu `make all` hinzu.

### analysis

Im [analysis](./analysis) Ordner speichern wir Skripte ab, die **Daten nur noch lesen** und diese analysieren und z.B. visuell darstellen. Wir erklären in Code-Kommentaren auf Deutsch, weshalb wir gewisse Schritte tun. Ansonsten ist dieser Teil nicht genauer dokumentiert.

#### tmp und export

Wähle eine Unterorder-Struktur, die zu deinem Projekt passt und wähle auch hier sprechende Namen.

## R

Starte immer, indem du die Datei **analysis.Rproj** doppelklickst. Diese setzt das working directory auf den analysis Ordner. Öffne daraufhin das gewünschte Skript über den "Files" Browser in RStudio (i.d.R. unten rechts).

Starte jedes Skript mit der folgenden Zeile, um alle Packages verfügbar zu haben:

```r
source("packages.R")
```

## Skripte

### `make new`

An dieser Stelle beschreiben wir in wenigen Worten, was dieses Skript macht.

Autor:innen: *XXX*

#### 🧶 Input

- `data/input.csv`

#### 🪢 Verarbeitung

- `scripts/yours/main.R`

#### 👚 Output

- `export/result.csv`

### Neues Skript anlegen

Wenn du ein neues Skript anlegen möchtest, erstelle einen entsprechenden Befehl im **Makefile**.

⚠️ Wichtig: Wenn du fertig bist, füg einen Abschnitt unter [Skripte](#skripte) hinzu und beschreibe, welche Dateien du erstellt oder bearbeitet hast.

#### Python

```bash
.PHONY: python_script
python_script:
	. venv/bin/activate; \
	python scripts/your-step/python_script.py; \
	deactivate
```

#### R

```bash
.PHONY: r_script
r_script:
	Rscript --vanilla -e 'source("scripts/your-step/r_script.R")'
```

#### Node

```bash
.PHONY: node_script
node_script:
	node scripts/your-step/node_script.mjs
```

### Weitere `make`  Befehle

Neben den projektspezifischen Skripten gibt es außerdem folgende Befehle:

* `make install` Installiert alle benötigten Projekte für alle 3 Umgebungen: Python, R und Node
* `make install_python`: Installiert die Python Packages
* `make install_r`: Installiert die R Packages
* `make install_node`: Installiert die Node Packages
* `make update_python`: Updated die Python Environments
* `make clean_python`: Löscht die Python Environments

## Cronjobs

Falls das Projekt einen oder mehrere Cronjobs hat, bitte hier beschreiben und außerdem hier einfügen. (TODO)
