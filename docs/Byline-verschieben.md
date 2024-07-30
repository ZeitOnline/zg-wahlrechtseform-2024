# Byline verschieben

Die Byline kann man einerseits lokal im pages Ordner verschieben – parallel muss man sie aber auch in Vivi mittels eines Pembeds verschieben.

## Lokal im pages Ordner

`import {BylineSnippet} from 'core/components/VisualArticle'`

Importier diese Komponente und füg sie in deinem JSX Code ein, an der Stelle, wo du die Byline gerne zeigen möchtest. Zusätzlich kannst du über `className` als Prop noch zusätzliche Styles hinterlegen. (Die Stile sind dann aber nur lokal sichtbar.)

## In Vivi

Platzier folgendes Vivi Embed an die Stelle im Artikel, wo du die Byline gerne zeigen möchtest: [byline-verschieben](https://vivi.zeit.de/repository/pembeds/byline-verschieben/) genutzt werden. Über einen Parameter können zwei verschiedene Styles ausgewählt werden. Der Code des Embeds liegt im (zg-pembed-visual-article)[https://github.com/ZeitOnline/zg-pembed-visual-article] Repository.
