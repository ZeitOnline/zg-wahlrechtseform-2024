# How to Backend

Backend ist Postgres mit nem Hasura-GraphQL davor. Setzt #team-ops auf.

## Backend benutzen

### Im Frontend

Lesen/schreiben geht über die Hooks von urql mit Queries und Mutations. Der GraphQlProvider bekommt die URL vom Endpoint (es gibt lokal/staging/production). Da das alles POST-Requests sind, die nicht vom CDN gecached werden, benutzen wir wenn möglich die Rest-API von Hasura.

### Skripte

Bisher immer über Node-/Python-Skripte, die ne .env-Datei mit den Verbindungsparametern/Pfaden zu den Zertifikaten haben, die es braucht.

### Datenbankstruktur ändern

In hasura/sql gibt’s ne Ordnerstruktur, in der Tabellen und Views definiert werden. Da machen wir immer so viel wie möglich in Views/Materialized Views, weil man die einfach droppen und neu erstellen kann. Tabellen sind immer ein hassle mit den Migrations. Dann `ENV=staging|production sql/run.sh` (oder ENV weglassen für lokal), um die Änderungen in die Datenbank zu bekommen.

Ich prökel immer mit Postico in der Datenbank rum, und bastel mir meine Queries, die ich dann als Views speichere.

### Hasura-Config

`hasura console` ausführen, dann die Konsole benutzen um Views zu tracken und Relations usw. zu erstellen. Das wird dann in JSONs geschrieben und kann committed werden. Dann `hasura metadata apply --envfile .env.staging` usw., um die Änderungen auf Staging/Production zu bekommen.
