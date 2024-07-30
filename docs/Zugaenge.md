# Zugänge

Als Mitglied von Daten und Visualisierungen benötigst Zugang zu folgenden Tools und Plattformen:

### Admin-Rechte auf deinem Gerät

Zuständig im Team: **Julius Tröger**

Dies kann nur die ZON-IT (zurzeit André Ritter) einrichten. Man muss ein Ticket erstellen [im IT-Ticket-System](https://zeit.freshservice.com/support/home). Das Aktivieren der Admin-Rechte dauert nur einige Sekunden, aber der Prozess bis dahin kann länger dauern.

Wenn du diese hast, wirf einen Blick auf die Seite [Software](?path=/docs/docs-software--docs) und installier die Tools, mit denen du arbeiten wirst.

### Trello

Zuständig im Team: **Julius Tröger**

Registriere dich bei [Atlassian/Trello](https://id.atlassian.com/signup?application=trello) und bitte danach Julius, dich zu den aktuellen Boards einzuladen.

### Datawrapper

Zuständig im Team: **Julius Tröger**

Erstell mit deiner zeit.de-Adresse einen neuen Account und lass dich von Julius Team Zeit Online hinzufügen.

### Microsoft Teams

Zuständig im Team: **Benja Zehr**

Lass dich von jemandem zum Team **Grafik Online/Print** hinzufügen.

### 1Password

- Installiere 1Password über den Zeit IT App Store oben rechts im Mac OS Menu.
- Beantrage über [VDOK](http://zeitit.zeit.de/vdok/) einen Account, dazu wird deine zeit.de-Adresse benutzt.
- Schreib <supportanfrage@zeit.de> ein E-Mail und bitte, dass dich jemand zum Firmenweiten Vault "ZON Allgemeine Passwörter" einlädt.
- Lass dich zusätzlich von jemandem aus dem Team in den Vault "ZON Daten&Visualisierung" einladen.

### Figma

Zuständig im Team: **Julius Tröger**

[Registriere dich bei Figma](https://www.figma.com/signup) mit deiner zeit.de-Adresse.

Bitte Julius, Paul oder Benja, dich zum Team Zeit Online einzuladen.

### Cytric (Spesen)

Schreib eine E-Mail an <reisekostenabrechnung@zeit.de> und bitte um eine Erstellung eines neuen Accounts.

### Dropbox

Wird durch Onedrive abgelöst.

~~Zuständig im Team: **Julius Tröger**~~

~~[Registriere dich bei Dropbox](https://www.dropbox.com/register) mit deiner zeit.de-Adresse.~~

~~Bitte Julius, Paul oder Benja, dich zum **Team Daten_Visualisierung** einzuladen.~~

### Sharepoint / OneDrive

Zuständig im Team: **Benja Zehr**

Bitte Benja oder jemand anderen, dich zum [Team Grafik Online/Print](https://zeitverlagsgruppe.sharepoint.com/sites/GrafikOnlinePrint) einzuladen.

Installier die [OneDrive App](https://support.microsoft.com/de-de/office/synchronisieren-von-dateien-mit-onedrive-unter-macos-d11b9f29-00bb-4172-be39-997da46f913f#ID0EFP) auf deinem Mac, steuere [diese Seite an](https://zeitverlagsgruppe.sharepoint.com/sites/GrafikOnlinePrint/Freigegebene%20Dokumente/Forms/AllItems.aspx) und klick auf **Verknüpfung zu OneDrive hinzufügen**.

Anschließend sollten die Ordner **General** und **Projekte** auch im OneDrive-Ordner auf deinem Mac sichtbar sein und du kannst darin Dinge ablegen und von dort auslesen. (dafür musst du sie über Rechtsklick **Immer auf diesem Gerät behalten**).

### Team-Kalender

Zuständig im Team: **Paul Blickle**

Bitte Paul, dich in Outlook hinzuzufügen, sodass du die Person **Daten und Visualisierungen** in deinem Kalender siehst.

### Zoom-Links

Zuständig im Team: **Julius Tröger**\
Zuständig außerhalb Teams: **Amelio Tornincasa**, **Alexandra Müller**

Per Outlook werden wir von der Assistenz zur 9:30-Uhr und 14:00-Uhr-Konferenz eingeladen. Falls das nicht geschieht, melde dich bei Amelio.

Zusätzlich gibt es Team-Interne Daily- und Weekly-Termine, welche in unserem [Team-Zoom](https://zoom.us/j/99282791925?pwd=V3hldXpjOWc5anhaZlRDWStOU0ovZz09) stattfinden. Lass dich von Alexandra Müller dort hinzufügen.

[Registriere dich bei Zoom](https://zoom.us/signup) mit deiner zeit.de-Adresse (optional) oder gib einfach unregistriert deinen Vor- und Nachnamen in Zoom an (nicht optional).

### Adobe Creative Cloud

Zuständig im Team: **Julius Tröger**

Müsste automatisch vorinstalliert sein von der IT.

Als Login dient die zeit.de-Adresse.

### Github

Zuständig im Team: **Julius Tröger**\
Zuständig außerhalb Teams: **Ron Drongowski**

Falls du noch keinen Github-Account hast, [leg einen an](https://github.com/signup).

Schick Julius deinen Github-Usernamen mit der Bitte, dich zur Organisation [ZeitOnline](https://github.com/ZeitOnline) einzuladen und ebenfalls ins Team [Datenjournalismus](https://github.com/orgs/ZeitOnline/teams/datenjournalismus) hinzuzufügen.

### Looker

Zuständig im Team: **Julius Tröger**

Frag Julius, ob er dich zu unserem [Dashboard](https://zeitverlag.cloud.looker.com/dashboards/434) hinzufügen kann.

### Airtable

Slack-Channel: **#airtable-support**

Sobald zu Zugang brauchst zu Airtable (womöglich nie), frag im oben erwähnten Slack-Kanal, ob man dich mit deiner E-Mail-Adresse hinzufügen kann.

## 🤓 Nerd-Teil

Die folgenden Tools braucht man erst, wenn man Frontend-Code deployen können muss.

### Server, Deployment, SSH-Key

Zuständig im Team: **David Schach**

Jede Person braucht einen SSH-Key. Der Public Key wird auf dem Server `infographics.zeit.de` in `~/.ssh/authorized_keys` eingetragen. Das kann bei uns jede:r tun, die:der dort schon Zugang hat.

Falls noch nicht getan: Erstell einen eigenen SSH-Key anhand dieser [Anleitung](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent).

Zur Verbindung zu `infographics.zeit.de` fügt noch folgendes Schnipsel zu eurer lokalen SSH-Konfig hinzu, die hier liegt: `~/.ssh/config` (Datei hat keine Endung, eventuell müsst ihr sie noch erstellen).

```
Host *
  UseKeychain yes
  AddKeysToAgent yes

Host infographics.zeit.de
	User infographics
```

### Google Cloud Services

Zuständig im Team: **David Schach**\
Zuständig außerhalb Teams: **Stephan Scheying**\
Slack-Kanal: `#team-ops`

Bitte um Zugriff für deine apps.zeit.de-Adresse im Slack-Kanal oder notfalls direkt bei Stephan.

### Zscaler (ehem. VPN) für Deployment

Um Projekte deployen zu können, musst du via Zscaler verbunden sein. Dieses sollte auf deinem Computer vorinstalliert sein. Falls nicht, melde dich bei der Assistenz.

### Datenbanken etc.

Zuständig im Team: **David Schach**\
Slack-Kanal: `#team-ops`

Die Zugangsdaten sind in einem [Vault](https://vault.ops.zeit.de) zu finden. Das OPS-Team von der Zeit IT (Stephan Scheying und Norman Stetter) kann dir da Zugang verschaffen. Wenn sich die zwei nicht melden, gibt es sonst noch den Channel [daten-visualisierung-er-engineering](https://zeitonline.slack.com/archives/GAP3LBEMR).

Authentifizierungs-Methode ist **OIDC** (Role kannst du leer lassen). Benutzername und Passwort sind dieselben wie bei der VPN Verbindung (i.d.R. dein Nachname und dein selbstgewähltes Zeit Passwort)

- **Heroku** – einige alte Apps laufen noch bei Heroku. Zugang ist im 1Password.
- **MongoDB** - Zugang auch im 1Password, hier läuft der Meinungslocator.
