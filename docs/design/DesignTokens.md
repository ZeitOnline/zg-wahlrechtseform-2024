# Design Tokens

Wir bauen unsere Variablen basierend auf dem [Category-Type-Item-Schema](https://amzn.github.io/style-dictionary/#/tokens?id=category-type-item) (CTI) auf.

Alle unsere Variablen leben im Dokument [Design Tokens and Library](https://www.figma.com/file/0irmKru0Pdg2iLMJjjcPLL/Design-Tokens-and-Library?node-id=1344%3A1048). Um sie zu editieren, klick auf eine leere Fläche und geh auf das Icon mit den zwei Reglern rechts in der Sidebar im Punkt **Local variables**.

Wenn du dabei **auf eine bestehende Variable zurückgreifen** möchtest, kannst du dies tun, indem du auf das Farbquadrat klickst und darin in den Tab **Libraries** wechselst und nach der Variable suchst, die du referenzieren willst. Bei Zahl-Variablen ist es noch einfacher, da ist diese Suche über das Sechseck-Icon erreichbar.

## Tokens ändern oder hinzufügen

1. Mach deine Änderungen direkt in Figma in den **Local Variables**
2. Starte das Plugin [Variables Import Export](https://www.figma.com/community/plugin/1254848311152928301)
3. Führ darin den Befehl **Export Variables** aus
4. Ein Popup öffnet sich, bestätige durch Klick auf den großen Button
5. Selektier und kopier den kompletten Inhalt mit **⌘+A** und **⌘+C**
6. Füg den Inhalt in Sublime oder Code ein und such nach `duv.Dark.tokens.json` – diese Zeile trennt light von dark
7. Kopier das Objekt darüber in **core/styles/tokens/light.json** und das Objekt darunter in **core/styles/tokens/dark.json**
8. Führ `npm run build:tokens` aus, um die Änderungen von der JSON-Datei in die Sass-Dateien zu übernehmen.
