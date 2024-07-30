# Meinungslocator

Der Meinungslocator besteht aus zwei Teilen: dem Frontend ([Vivi](https://vivi.zeit.de/repository/administratives/embeds/2023/meinungslocator/zg-meinungslocator/)/
[Github](https://github.com/ZeitOnline/zg-meinungslocator)) und dem Backend ([Hasura](https://hasura-admin.prod.zg.zon.zeit.de/meinungslocator/console/)/[Github](https://github.com/ZeitOnline/zg-meinungslocator-backend)).
Das Embed lässt sich relativ fein konfigurieren, mit Annotations, Achsenbeschriftungen, Farben etc.
Diese Einstellungen sind grundsätzlich optional, mit einer Ausnahme: Jedes Projekt muss in vivi mit einer eindeutigen
Projektkennung (`Projekt-ID`) versehen werden. Alle Daten, die über das Embed gesammelt werden,
werden in die Datenbank geschrieben und lassen sich über die `Projekt-ID`. Deshalb ist es wichtig, dass die Kennung eindeutig ist und nicht für mehrere
Projekte verwendet wird. Am besten deshalb vor den sprechenden Projektnamen noch Jahr und Monat setzen, z.B.: `2021-09-umfrage-impfpflicht`.

## Fall 1: Meinungslocator ohne identifizierbare Nutzer\*innen

Wenn wir den Meinungslocator "nur" nutzen wollen, um ein Stimmungsbild unserer Leser\*innen abzuholen,
genügt es, das Meinungslocator-Embed in einem Artikel einzusetzen und die `Projekt-ID` zu setzen. Anpassungen im Backend
sind nicht notwendig.

## Fall 2: Meinungslocator mit identifizierbaren Nutzer\*innen

Wenn wir ein Stimmungsbild einer bestimmten Personengruppe (z.B. Bundestagsabgeordnete) abgreifen wollen,
müssen wir diese Nutzer\*innen identifizieren. Dafür nutzen wir JWTs (JSON Web Tokens), die wir im Backend generieren und
in der Datenbank speichern müssen.

Schritt 1: Klont das Backend und legt im Ordner `tokens/import` eine csv-Datei unter eurem Projekt-Namen an.
Wichtig: Die Projektkennung muss dieselbe sein, die ihre später im Embed verwenden wollt. Der Name der Datei ist für den Import
entscheidend, folgt also dem Schema `PROJEKTID.csv`. In der Datei müssen mindestens die Spalten `projectId`, `id` und `tag`enthalten sein.
Die Spalte `description` ist optional. `id` kann eine Zahl oder Buchstabenfolge, muss aber eindeutig sein. `tag` ist der Name der Gruppe
und wird später im Frontend genutzt, um die Tokens entsprechend einzufärben (z.B. nach Parteizugehörigkeit).

Schritt 2: `npm run add-tokens PROJECTID` ausführen. Das Script importiert die Tokens in die Datenbank und generiert
eine Export-csv in `tokens/export`. Dort findet ihr in der Spalte `jwt`die Tokens, mit denen sich die Nutzer\*innen
im Frontend identifizieren.

Schritt 3: Um eine authentifiziertes Votum abzugeben, muss an die Url der Seite, auf der der Meinungslocator eingebunden
ist, nur ein Token aus `tokens/export` angehängt werden. Dafür nutzen wir einen einfachen Url-Parameter: `....zeit.de?token=HIERSTEHTDERTOKEN`.
