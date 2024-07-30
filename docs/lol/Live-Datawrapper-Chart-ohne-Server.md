# Live-Datawrapper Grafiken aus einer Public API erstellen

Wir bauen eine Datawrapper-Grafik, die sich laufend aktualisiert, ohne dass wir dafür einen Server oder einen cronjob benötigen. Bedingung dafür ist eine öffentlich verfügbare JSON Datenquelle.

# Anleitung in der Datawrapper Adacemy

Hier werden nur noch Dinge erkärt, die nicht bereits in [dieser Anleitung](https://academy.datawrapper.de/article/316-live-update-chart-with-json) stehen, welche uns als Vorlage für unsere Grafik dient.

## Eingesetzte Technologien / Packages

### Google Sheets / Apps Scripts

Das Herunterladen und parsen der Daten geschieht in einem [Google Apps Script](https://www.google.com/script/start/).

### Datawrapper

Bei Datawrapper hinterlegen wir ganz normal einfach ein Google Sheet als Datenquelle. Was leider nicht geht: Irgendwo hinschreiben, wann die Daten zuletzt aktualisiert wurden. 🥲

## Ablauf

Wir benutzen als Test-Objekt diese JSON Datei: `"https://interaktiv.morgenpost.de/data/corona/rki-variants.json"` (hehe ja wir klauen jetzt einfach mal bei der Konkurrenz, diese Datei könnte in Zukunft natürlich auch irgendwann gelöscht werden).

### Datawrapper-Vorlage kopieren

1. Wir folgen der Anleitung und legen ein eigenes Duplikat in unserer Google Drive ab.
2. Wir leeren den Inhalt des Tabellenblatts und benennen es bei Bedarf um.
3. Danach gehen wir im Menu unter **Erweiterungen** in die **Apps Scripts** und fügen die obige URL ein, da wo steht `const url = "…"` (Zeile 4)
4. Falls du das Tabellenblatt umbenannt hast, kopier den Namen genutzt hast, in den `sheetName` (Zeile 5).

### "Für dieses Projekt ist Ihre Erlaubnis zum Dateizugriff erforderlich."

Klick erstmals auf **Ausführen**. In der Regel wirst du diesem App Script die Berechtigung auf das dazugehörige Sheet geben müssen. Klick auf **Berechtigungen überprüfen** und wähl dein Google Konto aus (bzw. am besten nutzt du das mit vorname.nachname@zeit.de).

### "Google hat diese App nicht überprüft"

Wenn du in eine Fehlermeldung läufst, die so 👆🏼 lautet, dann klick unten auf **Erweitert** und dann auf **"ImportJSON öffnen (unsicher)"** und klick dort auf **Zulassen**.

### Scrape! 🚀

Nun sollte alles funktionieren und du kannst das Script **Ausführen** und dir das Resultat in Google Spreadsheets ansehen.

### Link-Freigabe aktivieren

Vergiss nicht, die Berechtigungen auf das Spreadsheet auf "Jede(r) mit dem Link" zu stellen, sonst kann Datawrapper den Inhalt nicht abgreifen.

### "Cronjob" einrichten

Apps Scripts kann man z.B. ein Mal die Stunde laufen lassen – konfiguriere den Ausführungs-Intervall nach deinen Bedürfnissen (mehr dazu in der Anleitung oben oder in der dazugehörigen [Google Doku](https://developers.google.com/apps-script/guides/triggers/installable)).

### Optional: `select` or `filter` Datenverarbeitung

Nun kannst du alle Daten direkt zu Datawrapper weiterfließen lassen, indem du dort ein neues Chart oder eine Karte anlegst.

Oder aber du machst noch eine Datenverarbeitung direkt in Google Sheets.

### Optional: Filtern im Code

Filter lassen sich auch in Javascript schreiben. Dann werden die entsprechenden Dinge gar nicht erst ins Spreadsheet geschrieben. Pack hierfür die Zeile, die mit `sheet.getRange` beginnt beispielsweise in folgende `if` Bedingung:

```js
if (data[i][17] === "normal" || data[i][17] === "low" || i === 0) {
  sheet.getRange…
}
```

Dies führt dazu, dass nur noch Zeilen erzeugt werden, wo in der 17. Spalte den Wert `"normal"` oder `"low"` haben. Vergiss `|| i === 0` nicht, sonst wird auch die erste Zeile nicht geschrieben, aber die brauchen wir, weil sie den Tabellenkopf (Spaltennamen) bildet.

#### Pivot-Tabelle

Beispielsweise kannst du eine Pivot-Tabelle auf einem separaten Tabellenblatt anlegen und darin eine Auswahl von Spalten und Zeilen treffen, wie du es möchtest. Lass dich gerne von [diesem Beispiel](https://docs.google.com/spreadsheets/d/1OHuI_8sP9FwY2GnhXW79LiPRW1ORZom3-8W8PROaNiA/edit#gid=1827858977) hier inspirieren.

In diesem Schritt lassen sich auch gut Spalten umbenennen – der Originaldatensatz wird nicht verändert und die Pivot-Tabelle aktualisiert sich automatisch wenn neue Daten gescraped werden.

#### "Looking for the other data table?"

Wenn du eine Karte anlegst in Datawrapper, musst du beim Daten-Import auf "Looking for the other data table?" klicken und dann ev. noch auf **Zurück**. Danach gelangst du in die Ansicht, wo du das Google Spreadsheet als Quelle angeben kannst.

Ebenfalls kann es passieren, dass du nach dem ersten Einfügen der Google URL in eine leere Ansicht gelangst. Dann lade einfach die Seite neu (Refresh).

## Echter Beispiel-Workflow

⚠️ Vorsicht, diese Karte ist live im Einsatz. Editiere sie nicht leichtsinnig.

[https://docs.google.com/spreadsheets/d/1Mgl3XOkj8M0a4B5cPwUPPorTpBJasAVCiUNbwAnAsYA/edit#gid=1839795903](https://docs.google.com/spreadsheets/d/1Mgl3XOkj8M0a4B5cPwUPPorTpBJasAVCiUNbwAnAsYA/edit#gid=1839795903)

[https://script.google.com/home/projects/1_EzLBEr1CkXOpleAW5IbNzRGV0qa3FCqiqhRWida6tsgkEJ_Rp4FE2IO/edit](https://script.google.com/home/projects/1_EzLBEr1CkXOpleAW5IbNzRGV0qa3FCqiqhRWida6tsgkEJ_Rp4FE2IO/edit)

[https://app.datawrapper.de/map/bXnlM/visualize#annotate](https://app.datawrapper.de/map/bXnlM/visualize#annotate)
