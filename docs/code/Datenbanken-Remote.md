# Arbeiten mit Remote Datenbanken

Wir können selber keine Datenbanken anlegen. Dies macht das OPS-Team der Zeit IT. Diese legen auch die dazugehörigen SSL Zertifikate an.

### Authentifizierung

Um dich mit der Prod- und Stating-Datenbank zu verbinden, benötigst du SSL Zertifikate. Pro Umgebung sind das 3 Dateien: zwei `*.crt` Dateien und eine `.*key` Datei. Wie du diese erstellen kannst, liest du [hier](?path=/docs/docs-software--docs#ssl-zertifkate-fur-datenbanken).

### Mit DBeaver verbinden

Öffne DBeaver und leg eine neue Verbindung an. Wähle **Postgres** als Verbindungstyp.

Such deine Datenbank im Vault, diese sollte für dich angelegt worden sein:

- [Devel](https://vault.ops.zeit.de/ui/vault/secrets/zon%2Fv1/list/gcp/zeit-interactive/cloudsql/instances/interactive-devel-pg13/databases/)
- [Staging](https://vault.ops.zeit.de/ui/vault/secrets/zon%2Fv1/list/gcp/zeit-interactive/cloudsql/instances/staging-422a481a/databases/)
- [Production](https://vault.ops.zeit.de/ui/vault/secrets/zon%2Fv1/list/gcp/zeit-interactive/cloudsql/instances/production-c8abfabf/databases/)

Im Tab **Allgemein** gibst du die Informationen ein:

| Feld              | Wert |
| --- | --- |
| Host | Vault Feld `host`  |
| Port | 5432 |
| Authentifizierung | Database Native |
| Datenbank | Vault Feld `name` |
| Benutzername | Vault Feld `user`  |
| Passwort | Vault Feld `password` |


Im Tab **SSL** aktivierst du den Haken **Verwende SSL**.

| Feld | Wert |
| --- | --- |
| CA-Zertifkate | pfad-zu-deiner/server._umgebung_.key |
| Klient-Zertifikate | pfad-zu-deiner/client._umgebung_.crt |
| Klient-Zertifikatsschlüssel | pfad-zu-deiner/client._umgebung_.pk8 |

Unter **Erweitert** wähle als SSL-Modus `require` aus.

### Hasura Endpoints

Die Endpunkte für die Datenbanken, welche die Zeit IT betreibt, sind die folgenden:

- `https://hsr.prod.zg.zon.zeit.de/…datenbankname…/v1/graphql `
- `https://hsr.staging.zg.zon.zeit.de/…datenbankname…/v1/graphql `

Und die Hasura Konsole kann eingesehen werden über:

- https://hasura-admin.prod.zg.zon.zeit.de/…datenbankname…/console
- https://hasura-admin.staging.zg.zon.zeit.de/…datenbankname…/console

Hier sollten aber von Hand keine Änderungen an den Metadaten vorgenommen werden, da sonst die Schemata divergieren könnten.

Das Admin-Secret zu deiner Datenbank findest du hier pro Umgebung:

- [Staging](https://vault.ops.zeit.de/ui/vault/secrets/zon%2Fv1/list/gcp/zeit-interactive/hasura/staging/)
- [Production](https://vault.ops.zeit.de/ui/vault/secrets/zon%2Fv1/list/gcp/zeit-interactive/hasura/production/)

TODO: erklären wie Schema updaten