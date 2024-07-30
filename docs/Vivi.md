# Wie mache ich in Vivi …?

Eine nicht abschließende Liste von wichtigen Vivi-Arbeitsschritten

## Datawrapper-Grafik in Artikel einbinden

1. In der Artikel-Ansicht rechts auf den Reiter "Struktur" wechseln.
2. Element mit dem Namen **Easy-Embed** an die gewünschte Stelle im Artikel ziehen.
3. URL aus Datawrapper ins Feld kopieren (ohne Laufnummer und ohne `/` hinten)

## Datawrapper-Grafiken mit Switch

1. In der Artikel-Ansicht rechts im Suchfeld "datawrapper" eingeben.
2. `datawrapper-switcher-pembed` aus den Ergebnissen an die gewünschte Stelle im Artikel ziehen.
3. Pembed konfigurieren, indem man die Datawrapper IDs (z.B. `0h9Xk`) ins Feld ID kopiert und im Feld Label eine kurze Bezeichnung einfügt, die dann oberhalb der Grafik im Switcher dargestellt wird.

Falls `datawrapper-switcher-pembed` nicht in den Ergebnissen auftaucht, unter dem Suchfeld bei **Typen** "Embed" als Typ anhaken.

## Artikel-Inhalt von Vivi (Friedbert) kopieren und lokal testen

Mittels `npm run copy:content:from:vivi` kann man sich von einem gewünschten Friedbert-Artikel den Inhalt in die Zwischenablage kopieren lassen, um diesen anschließend in der **pages/index.jsx** zwischen Start und Ende des Templates einzufügen.

Dabei werden die Referenzen zu den **Pembeds durch JSX Code** (`<ViviEmbed … />`) **ersetzt**, was ermöglichen soll, dass man den 'echten' Vivi Inhalt lokal eins zu eins testen und die Apps weiter bearbeiten kann. Dieses Ersetzen funktioniert nur mit Embeds nach dem neuen System (`zonReactApp`).

Das Skript benötigt **ein aktuelles SSO-Cookie** (beginnt mit `creid=`), um zu funktionieren. Bevor man das Skript das erste Mal ausführt, muss man deshalb folgende Schritte befolgen:

1. Öffne im Browser den Netzwerk-Tab
2. Steuere die gewünschte Seite auf Friedbert an
3. Such den ersten Eintrag (Document, HTML)
4. Such unten in den Details nach den Anfrage-Kopfzeilen (Headers)
5. Und such dort den Eintrag **cookie**
6. Dann klickst du rechts auf diesen komplizierten Wert daneben und wählst Wert kopieren
7. Erstelle eine **.env** Datei im Projektverzeichnis, am einfachsten über die Konsole mittels: `cp .env.example .env`
8. Öffne sie in einem Textbearbeitungs-Programm
9. Füg nach `COOKIE='` den Wert aus der Zwischenablage ein
10. Achte auf die einfachen Anführungszeichen, sie müssen um deinen Wert herum stehen
11. Füg in die `.env` Datei nach `FRIEDBERT_URL=` die Friedbert-URL deines Artikels ein
12. Führ nun `npm run copy:vivi:content` aus

Ein JSX-Code als 1:1 Kopie des Vivi-Inhalts befindet sich jetzt in deiner Zwischenablage – falls es geklappt hat. Du solltest eine **grüne Erfolgsmeldung** sehen. Wenn du eine Fehlermeldung siehst, versuch das Problem zu lokalisieren. Es wird unter anderem die Reihenfolge der Embeds geprüft (keine zwei Starts oder Ende nacheinander).

🚀 Geh nun in die Datei **src/apps/…/pages/index.jsx** und füg sie ein zwischen dem öffnenden und dem schließenden `<template> … hier einfügen …</Template>` ein.

Speichere die Datei, du solltest nun alles genau so sehen wie es auch in Vivi ist. Das alles funktioniert womöglich nicht mit allen Vivi Elementen perfekt. Fehler gerne an Benja melden.

🤓 Das **Cookie läuft** immer wieder mal **ab**, dann einfach ein Neues in die `.env` kopieren.

## Lokalen inhalt als Vivi-XML kopieren und in Vivi einfügen

Es gibt auch ein Gegenstück dazu. Ein Skript, welches den Inhalt deiner **pages/index.jsx**  als Vivi-kompatiblen XML Quellcode in deine Zwischenablage kopiert

1. Führ `npm run copy:content:to:vivi` aus
2. Öffne den Vivi-Artikel deiner Wahl in der **Quellcode**-Ansicht
3. Füg den Code dort ein und klick unten auf **Anwenden**

Alle Texte und Vivi-Embeds, die du lokal hattest, sollten nun eins zu eins in Vivi in deinem Artikel sein. Falls noch nicht geschehen, musst du den Artikel ev. noch [zu einem Visual Article umbauen](?path=/docs/docs-visual-article--docs).

🤓 Wenn du den ganzen Artikel in Vivi ersetzen willst, dann such nach dem Start und Ende des `<division>` Tags und füg dazwischen alles ein – der Tag definiert Anfang und Ende des Inhalts.

## Friedbert-Link debuggen

Falls mal etwas nicht funktioniert, kann man prüfen, ob es eine Jinja-Fehlermeldung gibt, indem man an die URL hinten `?debug=jinja` anhängt.

## Homepage in Vivi für Testzwecke klonen

1. Geh auf [https://vivi.zeit.de/repository/index](https://vivi.zeit.de/repository/index)
2. Zieh aus der Breadcrumb-Navi oben das letzte Element in die Seitenleiste in den Bereich **Clipboard**.
3. Erstelle einen neuen Inhalt oben links in der Box in einem passenden Ressort.
4. Klick aufs Rädchen ganz oben rechts und wähle **Aus Clipboard kopieren**.
5. Wähl dort die Startseite aus.

## A-B-Testing-Cookie setzen

Gelegentlich wird etwas A-B-getestet. Das kann es schwierig machen, Probleme zu debuggen, wenn man in der falschen Gruppe landet. Als die neue Navigation eingegführt wurde, konnte man mit folgendem Cookie das Testing aktivieren:

```js
window.Zeit.cookieCreate('zon_abtest_rebrush_navigation', 'True', 365);
```
