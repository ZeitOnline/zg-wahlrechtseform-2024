# Onedrive und Dropbox

Dateien über 100MB können nicht in Github eingecheckt werden. Wir haben deshalb für viele Projekte zusätzlich einen Ordner in unserer Onedrive oder in der Dropbox.

## Onedrive Installation

1. Installiere **Microsoft Teams (work or school)** aus dem Zeit IT Self Service
2. Deinstallier bei der Gelegenheit Microsoft Teams Classic, indem du die App aus dem Programme Ordner löschst
3. [Lad Onedrive herunter](https://www.microsoft.com/de-de/microsoft-365/onedrive/download) und installier es
4. Öffne beide Programme und authentifiziere dich wie üblich mit deiner zeit.de-Adresse
5. Klick in der **Teams App** in der Navigation links auf den dritten Punkt **Teams**
6. Siehst du dort das Team **Grafik Online/Print**? Falls nicht, bist du noch nicht Mitglied. Bitte jemandem aus dem Team, dich hinzuzufügen.
7. Klick in der Navigation links auf den Punkt **Onedrive**
8. Direkt rechts von der Navigation sollte ein Abschnitt auftauchen **Schnellzugriff**, klick dort auf **Weitere Orte…**
9. Klick im Abschnitt **Ihre Teams** auf **Grafik Online/Print**
10. Du solltest jetzt eine Ordnerstuktur sehen (Grafik Online/Print > Dokumente)
11. Klick nun oben (unter der Teams Suche) auf **Verknüpfung zu OneDrive hinzufügen**
12. Geh im Finder in deinen Onedrive Ordner, z.B. indem du oben in der Menuleiste auf das Onedrive Wölkchen klickst und dann auf **Ordner öffnen**
13. Der Ordner **Dokumente - Grafik Online_Print** sollte nach ein paar Sekunden nun hier auftauchen.

Du hast es geschafft. Die Onedrive und damit all unsere Projekte synchronisiert sich nun auf deine Festplatte. Die Files sollten aber keinen Festplattenplatz aufbrauchen, sondern erst wenn du etwas per Doppelklick öffnest oder per Rechtsklick **Immer auf diesem Gerät behalten** anwählst, wird es wirklich auf deinen Computer kopiert.

## Zugriff im Code

Um in deinem Code Dinge aus der Onedrive/Dropbox zu lesen oder darin zu schreiben, benötigst du zwei Dateien: eine `~/.duv/config.env` und eine `analysis/.env.shared`. Erstere solltest du bei deinem Onboarding erstellt haben, letztere ist bei jedem Projekt im analysis Folder.

- Da der Pfad zur Onedrive `ONEDRIVE_PATH` bei jedem Computer leicht anders aussieht, schreiben wir diesen in die **~/.duv/config.env** Datei.
- Der Unterordner innerhalb der Onedrive `ONEDRIVE_SUBFOLDER` ist dann wieder für alle der gleiche, deshalb schreiben wir diesen in die **analysis/.env.shared** Datei

### Ermitteln deiner Pfade

Falls du noch keine `~/.duv/config.env` hast, leg eine an mittels `mkdir ~/.duv` und `touch ~/.duv/config.env`.

1. Öffne die **~/.duv/config.env** mit einem Text-Editor deiner Wahl
2. Geh im Finder in deinen Onedrive Ordner, z.B. indem du oben in der Menuleiste auf das Onedrive Wölkchen klickst und dann auf **Ordner öffnen**
3. Klicke darin mit der rechten Maustaste auf den Ordner **Projekte**
4. Halte nun die `⎇` Option-Taste gedrückt
5. Klick auf **Projekte als Pfadname kopieren**
6. Füg diese nun in deine **~/.duv/config.env** Datei ein
7. Wiederhole dasselbe für den Dropbox-Ordner: **Daten und Visualisierung**

Bei mir sieht das am Ende z.B. so aus:

```bash
ONEDRIVE_PATH="/Users/dein_user/Library/CloudStorage/OneDrive-ZeitverlagGerdBuceriusGmbH&Co.KG/Dokumente - Grafik Online_Print/Projekte"
DROPBOX_PATH="/Users/dein_user/Dropbox (Daten_Visualisierung)/Daten und Visualisierung"
```

Die `analysis/.env.shared` beinhaltet dann nur noch den Rest des Pfades zu deinem Projektverzeichnis, z.B.:

```bash
ONEDRIVE_SUBFOLDER="2024/02-01 Lärmdaten"
DROPBOX_SUBFOLDER="2024/02-01 Lärmdaten"
```

### Zugriff auf die Pfad-Variablen

Allen drei Sprachen (Node, R, Python) haben ein Package namens `dotenv` mit dem man auf diese Variablen zugreifen kann

#### Javascript

```js
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config({path: `${process.env.HOME}/.duv/config.env`});
dotenv.config({path: `.env.shared`});

const onedriveFolder = path.join(
  process.env.ONEDRIVE_PATH,
  process.env.ONEDRIVE_SUBFOLDER,
);
const dropboxFolder = path.join(
  process.env.DROPBOX_PATH,
  process.env.DROPBOX_SUBFOLDER,
);

const data = fs.readFileSync(path.join(onedriveFolder, 'test.txt'), 'utf-8');
```

#### R

```r
needs(dotenv)
load_dot_env("~/.duv/config.env")
load_dot_env(".env.shared")

ONEDRIVE_FOLDER <- file.path(Sys.getenv("ONEDRIVE_PATH"), Sys.getenv("ONEDRIVE_SUBFOLDER"))
DROPBOX_FOLDER <- file.path(Sys.getenv("DROPBOX_PATH"), Sys.getenv("DROPBOX_SUBFOLDER"))

data <- read_csv(glue("{ONEDRIVE_FOLDER}/test.csv"))
```

#### Python

```python
import os
from dotenv import load_dotenv
load_dotenv(os.path.expanduser("~/.duv/config.env"))
load_dotenv(".env.shared")

onedrive_folder = os.path.join(os.getenv('ONEDRIVE_PATH'), os.getenv('ONEDRIVE_SUBFOLDER'))
dropbox_folder = os.path.join(os.getenv('DROPBOX_PATH'), os.getenv('DROPBOX_SUBFOLDER'))

data = pd.read_csv(f"{ONEDRIVE_FOLDER}/test.csv")
```

## Immer auf diesem Gerät behalten vs. Speicher freigeben

Wenn du eine **Fehlermeldung** erhältst, dass die Datei nicht gelesen werden kann, dann liegt das daran, dass die Datei nicht wirklich auf deinem Computer liegt, sondern nur online in der OneDrive/Dropbox.

💡 Behebe diesen Fehler, indem du auf dein Projektverzeichnis (z.B. 08-12 Windraeder) mit der rechten Maustaste klickst und dann aus den Punkten mit dem dem OneDrive-Logo **Immer auf diesem Gerät behalten** (ehem. Dropbox **Offline Verfügbar machen**) wählst.

Wenn du auf das OneDrive-Icon oben in der Mac Menuleiste klickst, kannst du den Status des Downloads einsehen und sehen, ob die Datei schon vollständig heruntergeladen wurde.

Wenn das Projekt abgeschlossen ist und du den Festplattenplatz wieder freiräumen möchtest, wähl stattdessen nach dem Rechtsklick **Speicher freigeben**.
