# Illustrator: Dark-Mode automatisieren

Dies ist das Kurzprotokoll eines Gesprächs mit [Ferdinand Kuchlmayr](https://twitter.com/ferdicoucou), Ressortleiter Grafik und Interactive vom Spiegel.

### Vorbereitungen

Der Spiegel macht seine Grafiken in bis zu **4 Größen** (von klein über Tablet und Desktop bis "opulent").

Sie haben deshalb ein Skript geschrieben, das **Kopien von allen Zeichenflächen** erstellt. Dem Skript zugrunde liegt eine Javascript-Datei – ein Illustrator-Skript. Mehr über diese Skriptsprache in den offiziellen Docs von Adobe:

[https://ai-scripting.docsforadobe.dev/](https://ai-scripting.docsforadobe.dev/)

Diese greift auf eine fixe **JSON Datei zu**, die ein Color-Mapping beinhaltet. So werden die Farben ersetzt.

Es werden **nur Farben ersetzt**, die in diesem JSON vorkommen oder sehr nah dran sind. Um die Ähnlichkeit von Farben zu berechnen nutzen Sie den [DeltaE-Algorithmus](
Mehr dazu: [http://zschuessler.github.io/DeltaE/learn/](http://zschuessler.github.io/DeltaE/learn/)). Dieser ist relativ langsam, weshalb ihr Skript teilweise sehr lange läuft.

Diese Herangehensweise hat den Vorteil, dass sie auch bei **komplexeren Grafiken und mit Karten** funktioniert. Würde man schlicht jede Farbe mittels eines Algorithmus "umkehren", würden auch Grafiken und Karten "invertiert", was nicht gewünscht ist.

## Ablauf

Auch sie legen **pro Breakpoint eine Zeichenfläche** an und arbeiten erst einmal auf Weiß.

Um Dinge einzufärben greifen sie auf **vorbereitete Füllfarben** und Textfarben zurück.

Ihr Skript heißt `darklord.js`. Wenn dieses ausgeführt wird, **dupliziert es jede Zeichenfläche** und ersetzt dann darin die Farben mittels der oben beschriebenen Logik.

Um das Skript **konfigurieren** zu können, haben sie sich dieselbe Logik wie `ai2html` zunutze gemacht: ein Textfeld, in das man die Konfiguration reinschreibt.

Im Anschluss führen sie ebenfalls `ai2html` aus. Pro Tip: Dieses generiert auch ein jpg **Thumbnail**. Das benutzen sie in ihren internen Systemen als Anzeigebild.

Ihre Version von `ai2html` haben sie erweitert: Sie kann zusätzlich direkt einige **Media Queries oder Script Tags** in das HTML injizieren. Diese sorgen dafür, dass je nach Bildschirmbreite das korrekte Bild ausgeliefert wird.

## Was noch nicht funktioniert

### Ebenen gehen verloren

Im Moment werden auch keine Ebenen rekonstruiert, sondern es werden alle Elemente "flach" dupliziert und auf einer einzigen Ebene eingefügt. Das ist im Moment bei Masken ein Problem.

### Freie Farben

Wenn man mit anderen Farben als der Palette aus dem Styleguide arbeitet, werden diese Farben nicht angefasst – man muss den Dark Mode also dann von Hand einfärben.

### Füllfarbe/Textfarben gehen verloren

Die resultierenden Elemente haben dann schlichte Hex-Werte als Füll-/Textfarbe und nicht die vorbereiteten Illustrator-Farbvariablen.

### Farbverläufe

Können nicht automatisch konvertiert werden.
