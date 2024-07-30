# zg-backend-starterkit

Dieses Repo dient als Vorlage für Backends. Erstell ein Backend-Repo mit dem Starterkit als Vorlage oder clone es dir in ein bestehendes Repo und lösche dann `.git` aus dem Ordner:

```sh
git clone git@github.com:ZeitOnline/zg-backend-starterkit.git backend;
cd backend;
rm -rf .git;
make clean;
```

Dieses Repo erlaubt es dir, das **Backend lokal laufen zu lassen** und schließlich auch zu deployen (Mehr dazu). Steuere das lokale Backend via Makefile:

#### `make install`

- Installiert die Hasura CLI via node packages
- Legt pro Umgebung eine **.env** Datei an
- Fährt Postgres und Hasura per `docker-compose` hoch
- Erstellt die Tabellen in SQL
- Initialisiert Hasura

#### `make start`

- Fährt Postgres und Hasura per `docker-compose` hoch
- Startet die Hasura Konsole

#### `make stop`

- Fährt Postgres und Hasura per `docker-compose` runter

#### `make clean`

- Fährt Postgres und Hasura per `docker-compose` runter
- Löscht dabei das Volume, wo Docker die DB gespeichert hat
- Löscht alle lokalen Dateien von Hasura (Metadaten)

### 0. Software

Folgende Software musst du installiert haben:

- **Docker Desktop** ([Download](https://docs.docker.com/desktop/install/mac-install/))\
…lässt Postgres und Hasura als Container lokal laufen
- **DBeaver** ([Download](https://dbeaver.io/download/))\
…als Postgres-Client, um in die Datenbank zu schauen

Folgende Software wird im Hintergrund verwendet:

- **Postgres**\
…als Datenbank, musst du nicht selber installieren
- **Hasura** ([Docs](https://hasura.io/docs/latest/hasura-cli/install-hasura-cli/))\
…erstellt automatisch eine GraphQL-API auf einer bestehenden Datenbank und dazugehörigen Metadaten

### 1. SQL Schema anlegen

Über die Dateien im Ordner `sql` legst du fest, nach welchem Schema deine Daten gespeichert werden sollen.

Zentraler Einstiegspunkt ist die Datei **sql/setup.sql**. Diese wiederum importiert die weiteren SQL Dateien in der korrekten Reihenfolge.

Es gibt folgende Unterordner:
- **sql/basic_tables_alterations**:\
Speicher hier SQL Funktionen und Automationen (z.B. Backup) ab
- **sql/basic_tables_setup**:\
Leg hier die Definition der Tabellen ab. Überleg dir das Schema gut, weil es mühsam ist, sie im laufenden Betrieb nochmal zu ändern
- **sql/views**:\
Nutze wo du kannst statt Tabellen Views, weil diese einfacher zu ändern sind im Nachhinein

### 2. Hasura Metadaten erstellen

Wenn du Hasura initialisierst (Teil von `make install`), verbindet sich Hasura mit der Postgres-Datenbank und schaut, welche Tabellen und Views es dort gibt:

```sh
npx hasura initialize .
```

Damit Hasura aber GraphQL Queries und Mutations für uns anlegt, müssen wir diese „Tracken“. Dies macht man über die Konsole:

```sh
npx hasura console
```

Ein Browser-Fenster öffnet sich, um eine View zu „tracken“ mach folgendes:

1. Klick oben in der Navigation auf **Data**
2. Klick links in der Sidebar auf **default** und darin auf **public**
3. Klick im Hauptfenster auf **Track** bei der View, die du über die API abfragen möchtest oder alternativ auf **Track all**
4. Klick links in der Sidebar auf deine *View* oder Table
5. Klick auf **Modify** und scroll nach unten
6. Ändere die **Spaltennamen** nach deinen Bedürfnissen (bevorzugt: `snake_case` in `camelCase` umbenennen)
5. Öffne den Reiter **Permissions**
6. Gib bei **Enter a new role** ein: `anonymous`
7. Klick auf den Haken rechts davon, ein Menu öffnet sich
8. Wähl **Without any checks** an
9. Klick auf **Toggle all**, um das Lesen aller Spalten zu erlauben
10. Bestätige mit **Save Permissions**

### 3. Daten im Frontend lesen & schreiben

Nun kann jede:r die Daten aus der Tabelle über GraphQL Queries lesen. Wenn du oben in der Navigation zurück zu **API** wechselst, kannst du dir im GraphiQL Editor dir deine erste Query zusammenklicken.

Dies ist das „bare minimum“ und und für Mutations (in Tabelle schreiben) ist es etwas komplizierter. Dies würde aber den Umfang eines einfachen Readme’s sprengen.

Wie du die Werte im Frontend aus der Datenbank liest oder sie schreibst (z.B. mittels [`urql`](https://commerce.nearform.com/open-source/urql/docs/)), liest du hier. @TODO