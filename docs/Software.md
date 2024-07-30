# Wie setzte ich ein Mac OS Gerät für die Arbeit auf?

Erster Schritt: Besorge dir Admin-Rechte von der ZON-IT. Das Aktivieren der Admin-Rechte dauert nur einige Sekunden, aber der Prozess bis dahin kann länger dauern. Man muss ein [Ticket erstellen](https://zeit.freshservice.com/support/home).

Für diverse von diesen Tools musst du freigeschaltet werden. Hier eine [Übersicht](?path=/docs/docs-zug%C3%A4nge--docs).

## Command Line Tools (Terminal)

David Schach hat im November 2022 ein neues Gerät erhalten und folgende Schritte ausgeführt, um es einzurichten.
Du entscheidest natürlich selbst wie du deinen Rechner einrichtest. Wichtig ist, dass folgende Programme laufen: [nvm](https://github.com/nvm-sh/nvm), [homebrew](https://brew.sh/#install), [git](https://github.com/git-guides/install-git), [gsutil](https://cloud.google.com/cli), Python und R.

Mit `su - a-[nachname]` wechselst du zu deinem Admin und mit `su - [nachname]` zu deinem normalen Account.

Sofern nicht anders angegeben alle Befehle mit dem normalen Account ausführen:

1. Bei beiden Accounts von Bash auf Z-Shell wechseln: `chsh -s /bin/zsh`
2. **Github/Git** einrichten
   - 2.1. SSH Key generieren und zu Github Account hinzufügen (siehe Abschnitt [Git/Github im Terminal](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent))
   - 2.2. Testweise eines unserer Projekte klonen (dabei wirst du aufgefordert die Developer-Tools zu installieren)
3. **Homebrew** installieren
   - 3.1 auf Admin-Account wechseln (`su - a-[nachname]`) und [brew](https://brew.sh/) installieren
   - 3.2 bei beiden Accounts brew zum Pfad hinzufügen (Befehle dazu werden am Ende der Brew Installation angezeigt)
4. **NVM** installieren
   - 4.1 mit Admin Account: `brew install nvm`, wieder zum normalen Account wechseln
   - 4.2 .nvm Anlegen und .zshrc anpassen (Anleitung steht am Ende der Installation)
   - 4.3 Neuste Node Version installieren `nvm install --lts`
   - Achtung: Wenn du ältere Versionen als Node v16 benutzen möchtest, musst du die so Installieren:
     - `softwareupdate --install-rosetta` (wenn es noch nicht installiert ist)
     - `arch -x86_64 zsh`
     - `nvm install v12.22.1 --shared-zlib` (Version anpassen)
     - `exit`
5. **pyenv** installieren (Python Versions Manager)
   - 5.1. `brew install pyenv` oder [Anleitung](https://github.com/pyenv/pyenv?tab=readme-ov-file#getting-pyenv) folgen.
   - 5.2. pyenv-Shims in deinem Terminal hinterlegen, für ZSH:
     - `echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.zshrc`
     - `echo '[[ -d $PYENV_ROOT/bin ]] && export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.zshrc`
     - `echo 'eval "$(pyenv init -)"' >> ~/.zshrc`\
       bzw. für andere Terminals [siehe Anleitung](https://github.com/pyenv/pyenv?tab=readme-ov-file#set-up-your-shell-environment-for-pyenv).
6. **Google Cloud Storage** tools installieren
   - 6.1. mit Admin Account: `brew install google-cloud-sdk`, wieder zum normalen Account wechseln
   - 6.2. `echo 'source "/opt/homebrew/Caskroom/google-cloud-sdk/latest/google-cloud-sdk/path.zsh.inc"' >> ~/.zshrc`
   - 6.3. `echo 'source "/opt/homebrew/Caskroom/google-cloud-sdk/latest/google-cloud-sdk/completion.zsh.inc"' >> ~/.zshrc`
   - 6.4. Anmelden mit: `gcloud init`
     - Mit xxx.yyy@apps.zeit.de einloggen
     - Cloud project to use: zeit-interactive oder gar keins, auch keins anlegen
     - set default Compute Region and Zone: nein
   - 6.5. pip3 install -U crcmod
7. Optional: **Java** installieren
   - Mit normalem Account `brew install openjdk`
   - Folgendes zur .zshrc hinzufügen: `export JAVA_HOME="$(brew --prefix openjdk)/libexec/openjdk.jdk/Contents/Home"`

Du kannst überprüfen, ob's geklappt hat, indem du folgende Befehle im Terminal einzeln ausführst:

```bash
zsh --version
git --version
brew --version
nvm --version
pyenv --version
gsutil --version
java --version
```

Nach jedem Befehl sollte das Terminal eine Versionsnummer zurückliefern.

## Onedrive

Installier die [Onedrive-Software](https://www.microsoft.com/en-us/microsoft-365/onedrive/download) auf deinem Computer. Die Onedrive (und davor Dropbox) dient uns als Ablage für Dateien über 100MB, die wir nicht in git einchecken können.

## Deine DUV .env

Jede Person hat auf ihrem Rechner eine `.env` Datei mit einigen Variablen, die sich bei jeder Person unterscheiden. Erstell diese wiefolgt:

```bash
mkdir ~/.duv
subl ~/.duv/config.env
```

Darin kannst du z.B. steuern ob und welcher Browser sich beim Entwickeln öffnet:

```bash
STARTERKIT_OPEN_IN_BROWSER=false
STARTERKIT_BROWSER="firefox"
```

Leg hier auch den lokalen Pfad zu deiner Onedrive (früher Dropbox) ab. [Folge dieser Anleitung hier](?path=/docs/docs-onedrive-und-dropbox--docs#ermitteln-deiner-pfade), um die Pfade auf deinem Computer zu ermitteln:

```bash
ONEDRIVE_PATH="/Users/dein_user/Library/CloudStorage/OneDrive-ZeitverlagGerdBuceriusGmbH&Co.KG/Dokumente - Grafik Online_Print/Projekte"
DROPBOX_PATH="/Users/dein_user/Daten_Visualisierung Dropbox/Daten und Visualisierung"
```

## SSL-Zertifkate für Datenbanken

Um dich mit der Prod- und Stating-Datenbank zu verbinden, benötigst du SSL Zertifikate. Pro Umgebung sind das 3 Dateien: zwei *.crt Dateien und eine .*key Datei.

Diesen Abschnitt musst du nur bzw. erst durchführen, wenn du mit einer Datenbank arbeiten musst.

Du kannst diese folgendermaßen anlegen, du musst dies nur ein Mal pro Gerät machen:

```sh
mkdir ~/.duv/cloudsql_credentials;
touch ~/.duv/cloudsql_credentials/client.production.crt;
touch ~/.duv/cloudsql_credentials/client.production.key;
touch ~/.duv/cloudsql_credentials/server.production.crt;
touch ~/.duv/cloudsql_credentials/client.staging.crt;
touch ~/.duv/cloudsql_credentials/client.staging.key;
touch ~/.duv/cloudsql_credentials/server.staging.crt;
touch ~/.duv/cloudsql_credentials/client.devel.crt;
touch ~/.duv/cloudsql_credentials/client.devel.key;
touch ~/.duv/cloudsql_credentials/server.devel.crt;
chmod 600 ~/.duv/cloudsql_credentials/client.production.key;
chmod 600 ~/.duv/cloudsql_credentials/client.staging.key;
chmod 600 ~/.duv/cloudsql_credentials/client.devel.key;
open ~/.duv/cloudsql_credentials;
```

Anschließend kopierst du aus den folgenden Vaults jeweils den Inhalt aus  `client_ca_cert_cert` in die `*.crt` Datei und den Inhalt aus ` client_ca_cert_private_key ` in die `*.key` Datei:

- [Devel Umgebung](https://vault.ops.zeit.de/ui/vault/secrets/zon%2Fv1/show/gcp/zeit-interactive/cloudsql/instances/interactive-devel-pg13/instance-credentials)
- [Staging Umgebung](https://vault.ops.zeit.de/ui/vault/secrets/zon%2Fv1/show/gcp/zeit-interactive/cloudsql/instances/staging-422a481a/instance-credentials)
- [Prod Umgebung](https://vault.ops.zeit.de/ui/vault/secrets/zon%2Fv1/show/gcp/zeit-interactive/cloudsql/instances/production-c8abfabf/instance-credentials)

Falls du noch keinen Zugriff auf den Vault hast, kann dir das OPS-Team von der Zeit IT (Stephan Scheying und Norman Stetter) diesen vergeben. Frag sie privat auf Slack an oder nutz dafür den Channel `#daten-visualisierung-er-engineering`.

Login-Authentifizierungs-Methode ist **OIDC** (Role kannst du leer lassen). Danach erfolgt das Login wie üblich via Microsoft.

##### Für DBeaver: Konvertierung in pk8

Um dich mit DBeaver mit den Datenbanken zu verbinden, musst du die keys noch in `*.pk8` umwandeln:

```sh
openssl pkcs8 -topk8 -inform PEM -outform DER -in client.production.key -out client.production.pk8 -nocrypt;
openssl pkcs8 -topk8 -inform PEM -outform DER -in client.staging.key -out client.staging.pk8 -nocrypt;
openssl pkcs8 -topk8 -inform PEM -outform DER -in client.devel.key -out client.devel.pk8 -nocrypt;
```


## Qgis

[Qgis herunterladen](https://www.qgis.org/de/site/forusers/download.html) und installieren.

## Arbeiten mit `R`

- Installiere [RStudio Desktop](https://www.rstudio.com/products/rstudio/download/#download)
- Installiere [GDAL Complete](http://www.kyngchaos.com/software/archive/gdal-complete/) in der aktuellsten Version

Öffne RStudio und installiere `rgdal`, `rgeos`, `terra` und `stars` mittels den folgenden Befehlen:

```r
install.packages('rgdal', repos="https://cloud.r-project.org/", type = "binary", configure.args=c(
    '--with-gdal-config=/Library/Frameworks/GDAL.framework/Programs/gdal-config',
    '--with-proj-include=/Library/Frameworks/PROJ.framework/Headers',
    '--with-proj-lib=/Library/Frameworks/PROJ.framework/Versions/7/unix/lib'))

install.packages('rgeos', repos="https://cloud.r-project.org/", type = "binary", configure.args=c(
    '--with-gdal-config=/Library/Frameworks/GDAL.framework/Programs/gdal-config',
    '--with-proj-include=/Library/Frameworks/PROJ.framework/Headers',
    '--with-proj-lib=/Library/Frameworks/PROJ.framework/Versions/7/unix/lib'))

install.packages('terra', repos="https://cloud.r-project.org/", type = "binary", configure.args=c(
    '--with-gdal-config=/Library/Frameworks/GDAL.framework/Programs/gdal-config',
    '--with-proj-include=/Library/Frameworks/PROJ.framework/Headers',
    '--with-proj-lib=/Library/Frameworks/PROJ.framework/Versions/7/unix/lib'))

install.packages('stars', repos="https://cloud.r-project.org/", type = "binary", configure.args=c(
    '--with-gdal-config=/Library/Frameworks/GDAL.framework/Programs/gdal-config',
    '--with-proj-include=/Library/Frameworks/PROJ.framework/Headers',
    '--with-proj-lib=/Library/Frameworks/PROJ.framework/Versions/7/unix/lib'))
```

#### Wechseln der R-Version

Falls du eines Tages eine neue R-Version brauchst, lade dir [hier](https://cran.r-project.org/bin/macosx/) die pkg Installationsdatei und installiere sie.

Mithilfe des Programms [RSwitch](https://rud.is/rswitch/guide/) kannst du anschließend zwischen den R Versionen wechseln.

## Arbeiten mit Frontend-Code

Wir arbeiten alle in der Entwicklungsumgebung [VS Code](https://code.visualstudio.com/download). Installier diese auf deinem Computer.

Clone dir z.B. das [zg-starterkit](https://github.com/ZeitOnline/zg-starterkit) und öffne es in VS Code.

Du solltest nun über ein kleines Popup-Fenster darauf hingewiesen werden, dass dieser Workspace einige Erweiterungen empfiehlt. **Installier diese alle**, indem du den Dialog bestätigst.

Lies [hier mehr über unser Setup](?path=/docs/begr%C3%BCssung-tech-stack--docs) und wie wir Frontend-Code an unsere Leser:innen bringen.

### Node

Wir hinterlegen in der Datei `.nvmrc` jeweils, mit welcher Node Version das Projekt ausgeführt werden sollte. Wenn du die Anleitung oben befolgt hast, kannst du über `nvm install` und `nvm use` stets mit der korrekten Node Version arbeiten.

## Arbeiten mit Design Mockups / Teaserbilder

Installiere [Figma](https://www.figma.com/downloads/) oder benutze es alternativ im Browser.
