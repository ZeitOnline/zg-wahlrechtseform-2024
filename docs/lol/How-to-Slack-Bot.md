# Slack-Bots

Es gibt zwei Wege, wie man automatisch Ereignisse in Slack erhalten kann:

### Variante 1: Via E-Mail

[Offizielle Anleitung von Slack](https://slack.com/intl/de-de/help/articles/206819278-E-Mails-an-Slack-senden)

Stand heute klickt man dazu einfach in einer Konversation/Kanal oben auf den Namen und wechselt in den Reiter **Integration**, und fügt dort eine E-Mail-Integration hinzu.

Man erhält daraufhin eine etwas kryptische, aber eindeutige Slack-Mail-Adresse `@zeitonline.slack.com`, an die man Mails senden kann, die dann daraufhin in der Konversation auftauchen.

#### Crontab `MAILTO`

Eine sehr einfache Methode, das Ergebnis von Cronjobs an eine E-Mail-Adresse versendet zu bekommen, ist eine einfache `MAILTO`-Variable direkt in der `crontab` Config ([Anleitung mit Beispielen](https://www.cyberciti.biz/faq/linux-unix-crontab-change-mailto-settings/).)

```sh
MAILTO="…@zeitonline.slack.com"
```

Je nach Programmiersprache gibt es natürlich viele weitere Wege, wie man eine E-Mail versendet. Das zu erklären, würde jetzt aber den Rahmen dieser Anleitung sprengen.

### Variante 2: Incoming Webhooks

[Offizielle Anleitung von Slack](https://api.slack.com/messaging/webhooks)

Dies ist die elegantere Variante. Der Anfang ist, dass man auf [api.slack.com](https://api.slack.com/apps?new_app=1) eine neue App erstellt. Wenn du eine App unter Zeit Online erstellst, muss diese noch von einem Admin freigegeben werden.

Darin aktiviert man dann das die **Incoming Webhooks**. Öffne den Reiter mit diesem Namen und stell den Toggle darin auf **On**. Auch dafür benötigst du die Erlaubnis eines Admins – die Anfrage dafür kannst du direkt in diesem Dialog versenden.

Sobald die App Freigeschaltet ist, musst du sie noch installieren. Du erhältst einen entsprechenden Link von einem Slackbot. Dort wählst du dann **App Installieren** und wählst daraufhin den Channel, wo die Nachrichten einlaufen sollen.

🎉 Nun erhältst du die URL, an welche die POST Events gesendet werden müssen. Du kannst pro App **mehrere Webhooks** (mit jeweils einem Kanal) definieren.

⚠️ **Vorsicht**: Leider sind diese Apps mit dem:der Ersteller:in verknüpft. Nur diese Person kann die App dann im Nachhinein bearbeiten.

#### Events in den Channel senden

Am Ende des Prozesses kriegt man eine URL, an die man einen `POST` request schicken muss. Der Inhalt des Post-Requests ist die Nachricht. Das funktioniert unabhängig davon, in welcher Programmiersprache man arbeitet. In Node kann dieser mit `fetch` gesendet werden, in R macht man dies mit [httr](https://cran.r-project.org/web/packages/httr/vignettes/quickstart.html).

#### Block-Kit-Builder

Die Nachrichten können sehr raffiniert aus verschiedenen sogenannten **Blocks** gebaut werden. Dies ist nicht schwer: Bei Slack gibt es dafür [einen interaktiven Block Builder](https://app.slack.com/block-kit-builder/).

### Wann man Events auslöst

Julian hat für [im Energie-Backend](https://github.com/ZeitOnline/zg-energie-backend/tree/main/cronjobs/slackbot) ein ausgefeiltes Setup mit verschiedenen Triggern erstellt, in dem festgelegt wird, wann die Nachrichten überhaupt versendet werden.

Das Node-Skript, das ihr gerne genauer inspizieren könnt, wird alle fünf Minuten als Cronjob ausgeführt und versendet nur Nachrichten, wenn sich Daten in der Datenbank verändert haben.
