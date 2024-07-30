# Productivity-LOL

Eine Sammlung von Tipps, Tricks und Tools, die uns den Alltag erleichtern.

### Online-Tools

| Beschreibung                    | Url                                                                                          |
| :------------------------------ | :------------------------------------------------------------------------------------------- |
| JSON in CSV umwandeln           | [https://konklone.io/json/](https://konklone.io/json/)                                       |
| Bounding-Boxen erstellen        | [https://boundingbox.klokantech.com/](https://boundingbox.klokantech.com/)                   |
| GeoJSON - TopoJSON Konversion   | [http://jeffpaine.github.io/geojson-topojson/](http://jeffpaine.github.io/geojson-topojson/) |
| Mathe-Suchmaschine              | [https://www.wolframalpha.com/](https://www.wolframalpha.com/)                               |
| RSS Feeds als E-Mail abonnieren | [https://blogtrottr.com/](https://blogtrottr.com/)                                           |

WolframAlpha kann z.B. Formeln nach x auflösen oder Einheiten konvertieren.

### Software

| Beschreibung                             | Url                                                                                                                                                                 |
| :--------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Zwischenablage-History                   | [CopyClip](https://apps.apple.com/de/app/copyclip-clipboard-history/id595191960) oder [Flycut](http://itunes.apple.com/us/app/flycut-clipboard-manager/id442160987) |
| Fenster links/rechts andocken            | [Magnet](https://apps.apple.com/de/app/magnet/id441258766)                                                                                                          |
| Dateien/Ordner im Terminal/Editor öffnen | [OpenInTerminal](https://github.com/Ji4n1ng/OpenInTerminal)                                                                                                         |
| AI-Programmier-Helferchen (10$/Mt.)      | [Github Copilot](https://github.com/features/copilot)                                                                                                               |

### Command Line Tools

| Beschreibung             | Url                                                                     |
| :----------------------- | :---------------------------------------------------------------------- |
| Autocomplete für Konsole | [zsh-autosuggestions](https://github.com/zsh-users/zsh-autosuggestions) |

#### Geodaten-Konversion

`ogr2ogr` ([Dokumentation](https://gdal.org/programs/ogr2ogr.html)), ist Teil von GDAL (`brew install gdal`).

Beispiel Transformation in anderes Koordinatensystem:

```bash
ogr2ogr -f "ESRI Shapefile" wgs84.shp original.shp -s_srs EPSG:3068 -t_srs EPSG:4326 -lco ENCODING=UTF-8
```

#### Komma durch Punkt ersetzen in Datei (sehr schnell)

```bash
perl -p -i -e 's/,/./g' election_data.csv
```

### Bookmarklets

Mehr dazu auf der Seite [Bookmarklets](/?path=/docs/bookmarklets--page).

### Nützliche Regular Expressions

| Beschreibung                   | Code                |
| :----------------------------- | :------------------ | --------- |
| Lat/Long Koordinaten finden    | `\-?\d+(\.\d+)`     |
| Alles zwischen `x` und `y`     | `x((.               | \n)\*?)y` |
| Zeilen, die `ingen` beinhalten | `^.*ingen.*$`       |
| ISO-Daten                      | `\d{4}-\d{2}-\d{2}` |

### VS Code Extensions

### Bash-Aliase

Für Terminal-Befehle, die man öfter ausführt, kann man Abkürzungen anlegen. Editiere dazu die Profil-Datei deiner Konsole (z.B. `subl ~/.zshrc`) und füg zum Beisipel folgende Zeilen ein, um effizienter mit git zu arbeiten:

```bash
alias gs='git status '
alias gb='git branch '
alias ga='git add '
alias gc='git commit -m '
alias gam='git add . && git commit -m '
alias gamend='git add . && git commit --amend '
alias gd='git diff'
alias gco='git checkout '
alias gr='git pull --rebase'
alias gp='git pull --rebase && git push'
alias gcl='git clone '
alias gl='git log --one-line'
alias garc='git add . && git rebase --continue'

function gamp() {
    git add .
    git commit -a -m "$1"
    git push
}
```

Oder folgende, um NPM Befehle in Projekten schneller auszuführen:

```bash
alias ns='npm start'
alias ni='npm install'
alias nb='npm run build'
alias nbs='npm run build:staging'
alias nds='npm run deploy:static'
alias ndss='npm run deploy:static:staging'
alias ndv='npm run deploy:vivi'
alias ndvs='npm run deploy:vivi:staging'
alias np='npm run publish'
alias nps='npm run publish:staging'
```

Oder um dich mit unserem Server zu verbinden:

```bash
alias infographics='ssh infographics@infographics.zeit.de'
```

### Tasten-Kombinationen

#### Trello

In Trello kann man vieles mit einem Buchstaben erledigen. Einige nützliche:

| Taste     | Funktion                                                             |
| :-------- | :------------------------------------------------------------------- |
| `Q`       | **Filter**: Zeige nur Karten, die mir zugewiesen sind                |
| `C`       | **Archivieren** (Karte unter dem Maus-Cursor)                        |
| `N`       | **Neue Karte** hinzufügen (An Position des Maus-Cursors)             |
| `M`       | **Mitglied** zuweisen (Karte unter dem Maus-Cursor)                  |
| Leertaste | **Sich selbst** zuweisen (Karte unter dem Maus-Cursor)               |
| `2`       | **Label 2** "to be discussed" zuweisen (Karte unter dem Maus-Cursor) |
| `T`       | **Titel** bearbeiten (Karte unter dem Maus-Cursor)                   |
| `?`       | Alle weiteren Tastenbelegungen anzeigen                              |

### Allerlei

- Ein Google **Spreadsheet** im Browser **anheften** und darin viele Tabellenblätter für kurze Berechnungen führen
- In der **Slack**-Navigation links **Sections** machen und Konversationen gruppieren in z.B. aktuelle Projekte.
- Nach Rechtsklick mehrere Dateien im Mac **Finder** gleichzeitig systematisch **umbenennen**.
- In **Slack Umfragen** machen, auf die Menschen mittels Emoji Reactions abstimmen können.
- Tabellen mit `clipr` **aus R kopieren** und z.B. in Spreadsheets einfügen und umgekehrt.
- In VS Code mit Command `⌘` + `D` weitere Vorkommen eines Wortes selektieren und alle **gleichzeitig bearbeiten**. (Multiple Cursors)
- Prozentrechnen:
  - Wie viel sind x Prozent von y? `x` ÷ `y` × `100`
  - Wie hoch ist die prozentuale Veränderung von x nach? (`x` ÷ `y` - `1`) × `100`

### VS Code User Snippets

Wenn du Textschnippsel immer wieder schreibst, kannst du sie selber über eine Abkürzung verfügbar machen. Du findest diese Funktion, wenn du im Menu unter **Code** im Punkt **Preferences** ansteuerst: **Configure User Snippets**.

Hier die User Snippets von Benja als Inspiration:

#### SCSS

```js
{
  "Empty Sass Module File (scss)": {
    "prefix": ["nsf"],
    "body": ["@import 'core/styles/base';", "", ":local {", "}"],
    "description": "Setup a new Sass File with `:local`"
  },
  "Text decoration none": {
    "prefix": ["tdn"],
    "body": ["text-decoration: none;"],
    "description": "Do not underline"
  },
  "Text decoration underline": {
    "prefix": ["tdu"],
    "body": ["text-decoration: underline;"],
    "description": "Underline text"
  },
  "Text align left": {
    "prefix": ["tal"],
    "body": ["text-align: left;"],
    "description": "Left text"
  },
  "Text align center": {
    "prefix": ["tac"],
    "body": ["text-align: center;"],
    "description": "Center text"
  },
  "Text align right": {
    "prefix": ["tar"],
    "body": ["text-align: right;"],
    "description": "Right text"
  },
  "Text transform uppercase": {
    "prefix": ["ttu"],
    "body": ["text-transform: uppercase;"],
    "description": "Make text uppercase"
  },
  "Transform translateX -50%": {
    "prefix": ["ttx"],
    "body": ["transform: translateX(-50%);"],
    "description": "Translate element horizontally 50% up"
  },
  "Transform translateY -50%": {
    "prefix": ["tty"],
    "body": ["transform: translateY(-50%);"],
    "description": "Translate element vertically 50% left"
  },
  "Covering after element": {
    "prefix": ["apa"],
    "body": [
      "  position: relative;",
      "  &:after {",
      "    content: '';",
      "    position: absolute;",
      "    top: 0;",
      "    right: 0;",
      "    bottom: 0;",
      "    left: 0;",
      "  }"
    ],
    "description": "Insert a after element that covers the full area of the current element"
  },
  "Button reset": {
    "prefix": ["rbn"],
    "body": [
      "appearance: none;",
      "cursor: pointer;",
      "border: none;",
      "margin: 0;",
      "padding: 0;",
      "width: auto;",
      "overflow: visible;",
      "background: transparent;",
      "color: inherit;",
      "font: inherit;",
      "line-height: normal;",
      "font-smoothing: inherit;",
      "text-align: inherit;"
    ],
    "description": "Insert all style definitions needed to unstyle a HTML button"
  },
  "Hide if smaller than": {
    "prefix": ["his"],
    "body": ["max-width: max(0px, calc((100% - 50px) * 999));"],
    "description": "Insert a line of css that hides an element if the width is below a certain threshold"
  },
  "Include mixin blurry-bg": {
    "prefix": ["inblur"],
    "body": ["@include blurry-bg;"],
    "description": "Sass `mixin` from Zeit Online"
  },
  "Include mixin box-shadow": {
    "prefix": ["inshadow"],
    "body": ["@include box-shadow;"],
    "description": "Sass `mixin` from Zeit Online"
  },
  "Include mixin dark-mode": {
    "prefix": ["indark"],
    "body": ["@include dark-mode {}"],
    "description": "Sass `mixin` from Zeit Online"
  },
  "Include mixin font-sans-m": {
    "prefix": ["infontm"],
    "body": ["@include font-sans-m;"],
    "description": "Sass `mixin` from Zeit Online"
  },
  "Include mixin font-sans-s": {
    "prefix": ["infonts"],
    "body": ["@include font-sans-s;"],
    "description": "Sass `mixin` from Zeit Online"
  },
  "Include mixin font-sans-responsive-l": {
    "prefix": ["infontlr"],
    "body": ["@include font-sans-responsive-l;"],
    "description": "Sass `mixin` from Zeit Online"
  },
  "Include mixin font-sans-responsive-m": {
    "prefix": ["infontmr"],
    "body": ["@include font-sans-responsive-m;"],
    "description": "Sass `mixin` from Zeit Online"
  },
  "Include mixin font-sans-responsive-s": {
    "prefix": ["infontsr"],
    "body": ["@include font-sans-responsive-s;"],
    "description": "Sass `mixin` from Zeit Online"
  },
  "Include mixin font-sans-responsive-xs": {
    "prefix": ["infontxsr"],
    "body": ["@include font-sans-responsive-xs;"],
    "description": "Sass `mixin` from Zeit Online"
  },
  "Include mixin hover": {
    "prefix": ["inh"],
    "body": ["@include hover {}"],
    "description": "Sass `mixin` from Zeit Online"
  },
  "Include mixin inputStyle": {
    "prefix": ["inis"],
    "body": ["@include inputStyle;"],
    "description": "Sass `mixin` from Zeit Online"
  },
  "Include mixin padded": {
    "prefix": ["inpd"],
    "body": ["@include padded;"],
    "description": "Sass `mixin` from Zeit Online"
  },
  "Include mixin unpadded": {
    "prefix": ["inupd"],
    "body": ["@include unpadded;"],
    "description": "Sass `mixin` from Zeit Online"
  },
  "Include mixin respond-max phablet": {
    "prefix": ["inphabmax"],
    "body": ["@include respond-max($$break-phablet) {}"],
    "description": "Sass `mixin` from Zeit Online"
  },
  "Include mixin respond-max tablet": {
    "prefix": ["intabmax"],
    "body": ["@include respond-max($$break-tablet) {}"],
    "description": "Sass `mixin` from Zeit Online"
  },
  "Include mixin respond-max tablet small": {
    "prefix": ["intabsmax"],
    "body": ["@include respond-max($$break-tablet-small) {}"],
    "description": "Sass `mixin` from Zeit Online"
  },
  "Include mixin respond-min phablet": {
    "prefix": ["inphabmin"],
    "body": ["@include respond-min($$break-phablet) {}"],
    "description": "Sass `mixin` from Zeit Online"
  },
  "Include mixin respond-min tablet-min": {
    "prefix": ["intabmin"],
    "body": ["@include respond-min($$break-tablet) {}"],
    "description": "Sass `mixin` from Zeit Online"
  },
  "Include mixin respond-min tablet-small": {
    "prefix": ["intabsmin"],
    "body": ["@include respond-min($$break-tablet-small) {}"],
    "description": "Sass `mixin` from Zeit Online"
  },
  "Include mixin tabular-nums": {
    "prefix": ["intabnums"],
    "body": ["@include tabular-nums;"],
    "description": "Sass `mixin` from Zeit Online"
  },
  "Use the primary color": {
    "prefix": ["cprim"],
    "body": ["color: var(--duv-color-text-primary);"],
    "description": "Insert css definition with the primary color"
  },
  "Use the primary background color": {
    "prefix": ["bgprim"],
    "body": ["background-color: var(--duv-color-background-primary);"],
    "description": "Insert css definition with the primary background color"
  },
  "Use the primary border color": {
    "prefix": ["bprim"],
    "body": ["border-color: var(--duv-color-border-primary);"],
    "description": "Insert css definition with the primary border color"
  }
}
```

#### JSX

```js
{
  "Import cx from classNames": {
    "prefix": ["ix", "icx"],
    "body": ["import cx from 'classnames';"],
    "description": "Import `cx` from classnames."
  },
  "Import cn from Sass module": {
    "prefix": ["icn"],
    "body": ["import cn from './$TM_FILENAME_BASE.module.scss';"],
    "description": "Import SCSS File with same name."
  },
  "Module classname": {
    "prefix": ["cnn"],
    "body": ["className={cn.${1:wrapper}}"],
    "description": "Add JSX Attribute `className` from module."
  },
  "Import useBreakpoint": {
    "prefix": ["iub"],
    "body": ["import useBreakpoint from 'core/hooks/useBreakpoint';"],
    "description": "Import `useBreakpoint` from core."
  },
  "Import useIsDarkMode": {
    "prefix": ["iudm"],
    "body": ["import useIsDarkMode from 'core/hooks/useIsDarkMode';"],
    "description": "Import `useIsDarkMode` from core."
  },
  "Import useCachedFetch": {
    "prefix": ["iucf"],
    "body": ["import useCachedFetch from 'core/hooks/useCachedFetch';"],
    "description": "Import `useCachedFetch` from hooks."
  },
  "Import useIsSSR": {
    "prefix": ["iussr"],
    "body": ["import useIsSSR from 'core/hooks/useIsSSR';"],
    "description": "Import `useIsSSR` from hooks."
  },
  "Import range from d3 array": {
    "prefix": ["ira"],
    "body": ["import { range } from 'd3-array';"],
    "description": "Import range from d3 array."
  },
  "Import max from d3 array": {
    "prefix": ["ima"],
    "body": ["import { max } from 'd3-array';"],
    "description": "Import max from d3 array."
  },
  "Create const isSSR": {
    "prefix": ["cissr"],
    "body": ["const isSSR = useIsSSR();"],
    "description": "Create `isSSR` by using hook `useIsSSR`."
  },
  "Create const forceUpdate": {
    "prefix": ["cifu"],
    "body": ["const [_, forceUpdate] = useReducer((x) => x + 1, 0);"],
    "description": "Create `forceUpdate` by using hook `useReducer`."
  },
  "Create const isTabletMin": {
    "prefix": ["citm"],
    "body": ["const isTabletMin = useBreakpoint('tablet', 'min');"],
    "description": "Create `isTabletMin` by using hook `useBreakpoint`."
  },
  "Create const isDarkMode": {
    "prefix": ["cidm"],
    "body": ["const isDarkMode = useIsDarkMode();"],
    "description": "Create `isDarkMode` by using hook `useIsDarkMode`."
  },
  "Create state hovered and setHovered": {
    "prefix": ["hsh"],
    "body": ["const [hovered, setHovered] = useState(null);"],
    "description": "Create `hovered` and `setHovered` by using hook `useState`."
  },
  "Create state clicked and setClicked": {
    "prefix": ["csc"],
    "body": ["const [clicked, setClicked] = useState(null);"],
    "description": "Create `clicked` and `setClicked` by using hook `useState`."
  },
  "Create pivot (wider)": {
    "prefix": ["cpw"],
    "body": [
      "const data = tidy(",
      "  longData,",
      "  pivotWider({",
      "    namesFrom: 'key',",
      "    valuesFrom: 'value',",
      "  })",
      ");"
    ],
    "description": "Create const `data` by using `pivotWider` from tidyjs."
  },
  "Create pivot (longer)": {
    "prefix": ["cpl"],
    "body": [
      "const data = tidy(",
      "  wideData,",
      "  pivotLonger({",
      "    cols: ['one', 'two', 'three'],",
      "    namesTo: 'key',",
      "    valuesTo: 'value',",
      "  })",
      ");"
    ],
    "description": "Create const `data` by using `pivotLonger` from tidyjs."
  },
  "Template String": {
    "prefix": ["ts"],
    "body": ["`${}`"],
    "description": "Create a template string"
  },
  "Transform Translate String": {
    "prefix": ["tt"],
    "body": ["transform={`translate(${}, ${})`}"],
    "description": "Create a JSX transform attr with translate string"
  },
  "Create const bounds with bounding client rect": {
    "prefix": ["cb"],
    "body": ["const bounds = ref.current.getBoundingClientRect();"],
    "description": "Create a const bounds for the ref `ref` using `getBoundingClientRect()`"
  },
  "Create an ordinal scale with empty domain and range": {
    "prefix": ["scord"],
    "body": ["const colorScale = scaleOrdinal().domain([]).range([]);"],
    "description": "Create a const colorScale using `scaleOrdinal()`"
  },
  "Create useCallback const": {
    "prefix": ["uc"],
    "body": ["const ${1:Name} = useCallback(() => {}, []);"],
    "description": "Create a const using useCallback`"
  },
  "Create useMemo const": {
    "prefix": ["um"],
    "body": ["const ${1:data} = useMemo(() => {}, []);"],
    "description": "Create a const using useMemo`"
  },
  "Create useEffect console log": {
    "prefix": ["uel"],
    "body": ["useEffect(() => { console.log(${1:Name}) }, [${1:Name}]);"],
    "description": "Create a useEffect hook that logs a variable when it changes`"
  }
}
```
