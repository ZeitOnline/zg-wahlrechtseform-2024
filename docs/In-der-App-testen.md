# In der App testen und debuggen

## Artikel veröffentlichen

Folgendermaßen kann man Artikel so veröffentlichen, dass man sie in der App ansehen kann, ohne dass sie auch von User:innen oder Google gesehen werden.

### Production (empfohlen)

Es gibt im produktiven System einen [Testartikel](https://vivi.zeit.de/repository/thomas/wahl-widget-test), der nirgends erscheint, den wir zum Testen benutzen können. Wir können darin einfache Embeds direkt einbetten oder Friedbert-Links einbauen und die dann anklicken:

1. Öffne [dieses Pembed](https://vivi.zeit.de/repository/thomas/interaktiv-links/@@view.html) in Vivi (zieh es dir ev. gleich in die Favoriten).
2. Check es aus und füg einen neuen Eintrag hinzu mit dem Friedbert-Link, den du gerne testen möchtest.
3. Klick unten links auf **Speichern**.
4. Klick oben rechts auf **Veröffentlichen**.
5. Öffne die Zeit-App und das Hamburger-Menu oben links.
6. Gib folgendes ins Suchfeld ein: **Kaiserslautern Gallier**.
7. Öffne den Artikel: "Kaiserslautern, bleib bitte provinziell"
8. Scroll bis zum **letzten Textabschnitt** im Artikel.
9. Klick auf den Link "**Gallier**" im ersten Satz.
10. Scroll nach unten, bis zum Abschnitt "**Daten und Visualisierung**". Direkt darunter findest du das Embed, welches du vorhin neu veröffentlicht hast.
11. Klick auf den darin von dir erstellten Link.

Dein Artikel sollte sich in der App öffnen und du kannst alles testen.

Falls der Link nicht auftaucht oder du ihn nochmal geändert hast, er aber noch zum alten Link führt, liegt das am Cache. Dann mach eines von diesen zwei Dingen:

- Öffne den [übergeordneten Artikel](https://vivi.zeit.de/repository/thomas/wahl-widget-test), wo das Widget drin ist und veröffentliche diesen neu (ev. musst du 2 Mal bestätigen mit "trotzdem veröffentlichen“).
- Oder öffne Slack und tipp `/fastly-purge https://www.zeit.de/thomas/wahl-widget-test` als Nachricht und sende sie ab (niemand außer du wird sie sehen).

Für den Fall, dass du etwas in der App anders darstellen musst, kannst du folgenden Boolean nutzen: `window.Zeit.isMobileApp`.

Falls du den Quellcode ansehen möchtest, kannst du bei Friedbertlinks hinten den Parameter `?app-content` anhängen ([Bsp-Link](https://friedbert-preview.zeit.de/wirtschaft/boerse/2022-06/aktienmarkt-boerse-crash-daten?app-content)).

Mehr über die Web View kannst du auch [in den ZON-IT Docs lesen](https://docs.zeit.de/friedbert/implementation/app_wrapper.html).

### Staging (weniger gut)

Alternativ kannst du alles nochmal auf Staging veröffentlichen und die App darauf umstellen:

1. Deploy deine App mittels `npm run publish:staging`.
2. Leg folgendermaßen eine Kopie deines Artikels in der Staging Umgebung von Vivi an:
   - Öffne [https://vivi.staging.zeit.de/](https://vivi.staging.zeit.de/) und erstell oben links einen neuen Artikel.
   - Wähl im Reiter **Optionen** die Vorlage **Visual Article** aus mit dem Seitenkopf **Header-Modul oben**, klick ins leere um das Dropdown zu speichern.
   - Öffne den Artikel in der Quelltext-Ansicht.
   - In einem zweiten Tab, öffne deinen echten Artikel ebenfalls in der Quelltext-Ansicht.
   - Kopier den **XML-Quelltext** vom Original in den neuen Artikel und klick unten auf „Anwenden“.
   - Geh zurück in den normalen Bearbeitungs-Modus und gib dem Dokument im Reiter **Dateinamen** eine URL.
   - Aktivier im Reiter **Workflowstatus** alle Haken außer eilig.
   - Optional: Lad das Teaserbild erneut als Bildergruppe hoch und verknüpf diese.
   - Veröffentliche den Artikel direkt.
3. Öffne die Zeit-App und öffne das Hamburger-Menu oben links.
4. Gib in die Suche `zondebug` ein und bestätige, ein Fenster sollte sich öffnen.
5. Aktivere den Toggle bei **Staging** und schließe die App.
6. Verbinde dein Smartphone mit dem Firmennetz, indem du die [ZScaler App](https://apps.apple.com/de/app/zscaler-client-connector/id1216875274) installierst und dich darin mit deinem üblichen E-Mail/Passwort einloggst.
7. Starte die App erneut und gib den Titel deines Artikels in der Suche ein.

⚠️ Wichtig Einschränkung: Mapbox-Karten und andere externe Ressourcen laden nicht richtig, weil ZScaler die https Verbindung über deren Server umleitet.

## Artikel debuggen

Nach dem Veröffentlichen eines Artikels, ist es auch möglich, diesen in der WebView der App zu debuggen – also einen Blick in die Konsole zu werfen und Fehlermeldungen zu suchen etc.

Schließ dazu dein Handy per USB am Computer an.

### iPhone

Folge der [offiziellen Anleitung](https://developer.apple.com/documentation/safari-developer-tools/inspecting-ios), die beschreibt, wie man generell Websiten auf einem per USB angeschlossenen Gerät debuggt.

Die geöffneten Artikel sollten wie jede andere Website im Safari Menu auftauchen.

### Android

1. Öffne die Zeit-App und öffne das Hamburger-Menu oben links.
2. Gib in die Suche `zondebug` ein und bestätige, ein Fenster sollte sich öffnen.
3. Tipp auf den Button unter **WebView Debug Toggle**, um das Debugging zu aktivieren.
4. Starte die App neu durch wegwischen.
5. Folge der [offiziellen Anleitung](https://developer.chrome.com/docs/devtools/remote-debugging?hl=de), die beschreibt, wie man generell Websiten auf einem per USB angeschlossenen Gerät debuggt.
