# Redigieren von Datawrapper-Grafiken

Alle Datawrapper-Grafiken, die auf zeit.de veröffentlicht werden, fallen in unseren Verantwortungsbereich. Wir entscheiden final, wie aussehen. Mittels eines 4-Augen-Prinzips und der folgenden Checkliste, sorgen wir dafür, dass alle Grafiken demselben Qualitätsstandard entsprechen.

## Ablauf

Alle externen Anfragen müssen über den Slack Kanal `#daten-und-visualisierung` kommen!

1. Die Person aus unserem Team, die sich der Aufgabe annimmt, setzt auf den Slack-Post das Augen **Emoji** 👀 sodass klar ist, wer sich darum kümmert
2. Die Zusammenarbeit zwischen DuV-Mitglied und Redakteur:in findet im Optimalfall im **Thread** unter dem Slack-Post statt, sodass andere später mitlesen können
3. Wenn das DuV-Mitglied mit einer ersten Version fertig ist, postet dieses im Channel `#daten` **Screenshots** der Grafik in 360px Breite und **Links** zum Editieren und bittet um eine Redigatur, auch genannt „Bügeln“
4. Die Person, welche die Grafiken redigieren wird, setzt wiederum das Augen **Emoji** 👀 auf diesen Post, sodass sich nicht mehrere Personen an die Arbeit machen
5. Natürlich darf die Person auch im Channel `#daten` nochmal das ganze Team auffordern, ihre **Meinung** zu einem Thema abzugeben
6. Wenn diese Person große Änderungen vornimmt, spricht sie dies mit der Person, die die Grafik gemacht hat und mit der Redakteur:in ab – im Optimalfall wieder im **Thread** unter dem Originalpost
7. Auch **Titel und Unterzeile** müssen in diesem Dreieck festgelegt und eingetragen werden
8. Wenn die Grafik fertig überarbeitet ist, kann man unter die beiden Threads einen **Haken** ✅ setzen

## Worauf achten wir?

### 🖼 Insgesamt

- Wurde die **bestmögliche Darstellungsform** für die gewünschte Aussage gewählt?
- Ist die **Höhe** der Grafik angemessen? (Richtwert: 500px)
- Ist die **Quelle** angegeben?
- Ist die Quelle **seriös**?
- Kann das so **stimmen**?
- Sieht die Grafik gut aus bei **360px Breite**? (Wichtigste Größe, mittleres Preset in der Datawrapper-Vorschau)
- Funktionieren die Grafiken auch auf kleineren Screens (**mobil**) und auf größeren? (**Desktop**)?
- Fängt die **y-Achse** bei Null an? (Ausnahme: Liniendiagramm z.B. bei indexierten Werten)
- Sind die **Skalenstriche** bei der x-Achse aktiviert? (Tick lines)

### 🎨 Farben

- **Grau** ist die wichtigste Farben in Charts, sagt man: Gibt es Dinge, die man grau machen kann, um einzelne Elemente mittels Farbe hervorheben zu können? (z.B. frühere Jahre grau)
- Wird die korrekte Art von Farbskala verwendet? (**kategorische**, unterscheidbare Farben für Gruppen, **sequentielle** für aufsteigende Werte, **divergierende** für auseinandergehende Werte?)
- Ist der Einsatz der Farben **sinnvoll**? Oft wird es klarer, wenn man weniger Farben verwendet.
- Sind die Farben **ausreichend unterscheidbar**?
- Auch für Personen mit **Farbsehschwäche**? (v.a. rot/grün)
- Funktionieren die Farben sowohl im hellen wie auch im **dunklen Modus**?
- Stellen die Kategorien **Energieträger** dar? Oder **Corona**-Daten? Wenn ja: Nutz die entsprechenden vorbereiteten Farben.
- Kann man in die Beschreibung noch eine oder mehrere **Farben integrieren**? (siehe Beispiel unterhalb, [Colorpicker/converter](https://fffuel.co/cccolor/))

##### Wort farbig hinterlegt

```
<strong style="color:#ffffff; background:#b2006b; padding: 2px 4px 1px 4px; border-radius: 3px; -webkit-box-decoration-break: clone; box-decoration-break: clone;">Text</strong>
```

##### Wort unterstrichen (Linien)

```
<span style="text-decoration: underline; text-decoration-color:#DAB200; text-underline-offset: 3px; text-decoration-thickness: 2.5px;">Für den Bau genehmigt</span>
```

##### Kreis (Punkte auf Karte)

```
<span style="color: #208e9f; display: inline-block; transform: scale(2) translateY(-0.1em); margin: 0 0.2em;">●</span>
```

##### Quadrat (Farblegende nachbauen)

```
<span style="color: #208e9f; display: inline-block; transform: scale(1.15) translateY(-0.1em); margin: 0 0.2em;">◼︎</span>
```

##### Stroke (Umriss mit in Deckkraft reduzierter Fläche)

```
<span style="display: inline-block; height: 0.7em; width: 0.7em; border-radius: 50%; border: 1px solid #f97b24; background-color: rgba(255, 187, 0, 0.1); transform: translate(-1%, 5%);"></span>
```

##### Schraffur (Karten)

```
<span style="display: inline-block; width: 1em; height: 1em; background: repeating-linear-gradient(-45deg, transparent, #26966177 10%, transparent 15%);"></span>
```

PS: Dies funktioniert auch mit unseren CSS Variablen.

##### 🌚 Dark Mode

Wenn man zwei verschiedene Stile für Light- und Dark-Mode braucht, kann man diese einzeln ein- und ausblenden mithilfe der Datawrapper-Klassen `class="hide-in-dark"` und `class="hide-in-light"`.

Wenn man möchte, dass die Grafik **immer dunkel** ausgeliefert wird, muss man in Datawrapper Schritt 3 im Tab **Layout** den Toggle "Automatischer Dunkelmodus" auf aus stellen und dann beim Einbetten der Grafik hinten an die URL `?dark=true` ranhängen. Mehr dazu in der [Datawrapper Academy](https://academy.datawrapper.de/article/357-dark-mode-in-embedded-datawrapper-visualizations).

Außerdem gibt es den Parameter `?dark=true&transparent=true`, welches die **Hintergrundfarbe** auch im Dark-Mode deaktiviert, also **transparent** macht.

Befinden sich die dunklen Grafiken in einem Vivi-Datawrapper-Switcher, muss man dies noch einmal anders machen: @TODO

### 📝 Text

- Sind Titel, Beschreibung und Unterzeile **verständlich und fehlerfrei**?
- Können die Texte noch **gekürzt** werden? (Titel max. 2-zeilig, Unterzeile max. 3-zeilig)
- Ist erkennbar, was die Daten zeigen und in welcher **Maßeinheit**?
- Sind Titel und Beschreibung **sprechend**? Helfen sie zu erkennen, worauf es in der Grafik ankommt? Oft ist es gut, im Titel die **Hauptaussage** herauszugreifen, und dann in der Beschreibung darauf einzugehen, **welche Daten** zu sehen sind.
- Sind die **Farb-Labels** verständlich und fehlerfrei?
- Wird konsequent das Komma `,` als **Dezimalstelle** und der Punkt `.` als **Tausender**-Trennzeichen verwendet?
- Werden die korrekten und so wenig verschiedene **Einheiten** wie möglich verwendet? (`%` und `€` innerhalb der Grafik, "Prozent" und "Euro" in Texten, Abkürzungen wie "Mrd." immer mit Punkt)
- Sind zwischen Zahl und Einheit `%`/`€` überall ein **Leerzeichen**? (z.B. die korrekte Art, eine Prozentzahl zu formatieren in einem Tooltip ist `{{ FORMAT(share, "0.00 %") }}`)
- Sind die **Abkürzungen** korrekt? (`Mrd.`, `Mio.`, `Tsd.`, `%-Pkt.`)
- Sind die Werte im **Tooltip** gut formatiert? (z.B. Monate/Jahre)
- Läßt sich das Tooltip noch **aufhübschen**, z.B. durch eine Tabelle oder eine große Zahl? (Hier die [Anleitung für alle möglichen Formatierungen](https://academy.datawrapper.de/article/237-i-want-to-change-how-my-data-appears-in-tooltips))
- Kann man noch eine **Annotation** (swoopy) hinzufügen, um die Verständlichkeit zu verbessern?
- Haben die Annotation einen **Textumriss**? (Verbessert Lesbarkeit)
- Kann man noch einen Abschnitt hervorheben (z.B. mit einem **Range**)?
- Sind die **Achsen-Ticks** stimmig? (Nicht zu viele, nicht zu wenige)

Wenn du einen noch längeren Text hast, auf den du absolut nicht verzichten kannst, kannst du ihn hinter einem Aufklapper verstecken mittels:

```
<details>
<summary style="cursor: pointer;">Methodik</summary> Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
</details>
```

### 📍 Locator-Maps

- Sind alle relevanten Geografien **angeschrieben**?
- Werden die **vorbereiteten Stile** genutzt? _Circle_ für Orte, _Water_ für Gewässer, _Place Name_ für Regionen
- Kann man noch eine **Inset-Map** hinzufügen? ([Anleitung](https://academy.datawrapper.de/article/302-how-to-add-custom-inset-maps))
- Ist der optimale **Kartenstil** gewählt? (_Maritime_ wenn es um Gewässer geht, _Earth_ wenn Wälder eine Rolle spielen, _Light_ ansonsten)
- Kann noch ein **Maßstab** dargestellt werden?
- Macht es womöglich Sinn, die **Beschriftung** generell abzuschalten und die relevanten Geografien selbst anzuschreiben?

### 📈 Liniendiagramme

- Werden **Linien** direkt angeschrieben und nicht nur über eine Farblegende? (Entweder über Annotationen oder über Labels rechts)
- Werden **dünne** Linienstärken verwendet?
- Kann man noch einen **Kreis** ans Ende des Kreises setzen?
- Muss die Interpolation linear sein oder könnte sie nicht **kurvig** sein?
- Ist der Durchschnitt/Gesamtwert in **Schwarz**?
- Falls die **y-Achse** nicht bei Null beginnt: Könnte sie es nicht doch? Oder kann man hinschreiben, dass sie gekürzt ist?

## Wie krieg ich das Ding in Vivi?

Siehe [Vivi Wissen](/?path=/docs/wissen-vivi--page)
