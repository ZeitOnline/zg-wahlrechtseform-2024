# Verbindung zu Postgres (Produktion)

Um sich mit der produktiven Postgres-Datenbank zu verbinden, muss man folgende Schritte tätigen.

## ⚒ Vorbereitungen

### Software

#### Postgres-Client

Es können alle gängigen Postgres-Clients benutzt werden. Einer, der gratis ist und den viele von uns benutzen ist **DBeaver**.

[DBeaver herunterladen](https://dbeaver.io/download/)

### Zugangsberechtigungen

Die Credentials und nötigen Keys für die Verbindung erhälst du in folgenden Zeit-Vaults:

[https://vault.ops.zeit.de/ui/vault/secrets/zon%2Fv1/show/gcp/zeit-interactive/cloudsql/instances/production-c8abfabf/databases/energiemonitor](https://vault.ops.zeit.de/ui/vault/secrets/zon%2Fv1/show/gcp/zeit-interactive/cloudsql/instances/production-c8abfabf/databases/energiemonitor)

[https://vault.ops.zeit.de/ui/vault/secrets/zon%2Fv1/show/gcp/zeit-interactive/cloudsql/instances/production-c8abfabf/instance-credentials](https://vault.ops.zeit.de/ui/vault/secrets/zon%2Fv1/show/gcp/zeit-interactive/cloudsql/instances/production-c8abfabf/instance-credentials)

Das OPS-Team von der Zeit IT (Stephan Scheying und Norman Stetter) kann dir da Zugang verschaffen. Wenn sich die zwei nicht melden, gibt es sonst noch den Channel [daten-visualisierung-er-engineering](https://zeitonline.slack.com/archives/GAP3LBEMR).

Authentifizierungs-Methode ist **OIDC** (Role kannst du leer lassen). Benutzername und Passwort sind dieselben wie bei der VPN Verbindung (i.d.R. dein Nachname und dein selbstgewähltes Zeit Passwort)

#### Dateien anlegen

Kopier aus dem Vault z.b. für die devel Datenbank den Inhalt der Felder `client_ca_cert_cert` und `client_ca_cert_private_key` und speichere sie in den folgenden 2 Dateien an einem von dir gewählten Ort auf deinem Computer ab:

- `client_ca_cert_cert` -> `client.devel.crt`
  - `echo "paste_secret_here" >> client.devel.crt`
- `client_ca_cert_cert` -> `client.devel.key`
  - - `echo "paste_secret_here" >> client.devel.key`

Der Inhalt der drei Dateien sollte über mehrere Zeilen gehen. Falls dies nicht der Fall ist, dann befinden sich im Text noch folgende Zeileumbrüche: `\n`. Ersetze alle durch einen echten Zeilenumbruch.

### VPN

Um dich mit der Datenbank zu verbinden, musst du im VPN sein.

## ⚙️ Verbindung einrichten

Öffne DBeaver und leg eine neue Verbindung an. Wähle **Postgres** als Verbindungstyp.

Im Tab **Allgemein** gibst du folgende Informationen ein (du findest diese auch im Vault):

| Feld              | Wert                    |
| ----------------- | ----------------------- |
| Host              | Vault Feld `private_ip` |
| Port              | 5432                    |
| Authentifizierung | Database Native         |
| Datenbank         | Vault Feld `name`       |
| Benutzername      | Vault Feld `user`       |
| Passwort          | Vault Feld `password`   |

Im Tab **SSL** aktivierst du den Haken **Verwende SSL**.

| Feld                        | Wert                                   |
| --------------------------- | -------------------------------------- |
| Klient-Zertifikate          | pfad-zu-deiner/client.devel.crt        |
| Klient-Zertifikatsschlüssel | pfad-zu-deiner/client.devel.key        |

Unter **Erweitert** wähle als SSL-Modus `require` aus!

## 🚀 Verbinden

Teste deine Verbindung und speichere sie anschließend ab – an sich sollte jetzt alles klappen.

## ⚠️ Mögliche Fehlermeldungen

### PgjdbcHostnameVerifier`

```
The hostname … could not be verified by hostnameverifier PgjdbcHostnameVerifier.
```

Lösung: Mach einen Rechtsklick auf die Verbindung und editiere sie über **Bearbeiten Verbindung**. Setz den SSL-Modus im Tab **SSL** auf `require`.
