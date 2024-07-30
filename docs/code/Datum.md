# Datum

Ein paar Sachen zum Thema Datum in Javascript/Datenbanken.

## Das wichtigste

- **Nennt es bitte immer `date` oder `datetime`.** Das macht Sinn, und Achsen usw. gehen als default davon aus. (Außer es ist sowas wie `startDatetime`/`endDatetime`. Aber auch dann überlegen, weil Achsen-Defaults usw.)
- Wenn es ein Datum ist, braucht es **keine Uhrzeit.**
- Generell in Arrays/Tabellen/Views immer **umgekehrt chronologisch** sortieren, damit man die neuesten Daten ganz einfach mit `meinArray[0]` (bzw. der entsprechenden Datenbank-Query) bekommen kann.
- Immer nach **ISO 8601 formatieren.** Passiert meistens automatisch. `YYYY-MM-DD → 2004-07-11` bzw. `YYYY-MM-DDThh:mm:ssZ → 2007-12-24T18:21Z` (das Z bedeutet UTC, eventuell anpassen).
- Daten immer **parsen, wenn sie geladen werden** (Store, GraphQL, …), nicht erst im Chart oder so. Sonst dupliziert man Code und macht alles langsamer.

## Noch mehr

- Wenn man Daten zu Strings macht, geht teilweise die Zeitzone verloren. Daher nicht als keys in Objekten verwenden, **gerne aber als Keys in einer `Map`.**

```js
// ✅ richtig
const dataByDate = new Map();
for (const {date, value} of data) {
  dataByDate.set(date, value);
}

// ❌ nicht so gut
// (auch ein Formatieren des Datums als ISO-String kann schon Probleme bringen)
const obj = {};
for (const {date, value} of data) {
  obj[date] = value;
}
```
