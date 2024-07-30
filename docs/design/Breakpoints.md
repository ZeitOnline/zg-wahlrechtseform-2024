# Breakpoints

Wir versuchen immer, **zuerst die mobilen Styles zu definieren,** und dann Styles für breitere Screens hinzuzufügen.

Es gibt mehrere Breakpoints, die teils von ZON übernommen sind:

```css
$break-modern-phone: 360px;
$break-large-phone: 390px;
$break-phablet: 520px; /* von ZON */
$break-tablet: 768px; /* von ZON */
$break-desktop: 980px; /* von ZON */
```

Wenn für ein Projekt besser passend, sollten wir aber sehr gerne eigene bzw. zusätzliche definieren.

Für die Breakpoints gibt es noch zwei Helferlein. `respond-min` ist nur ein Shortcut für die bekannte MediaQuery. `respond-max` zieht 0.00001 vom übergebenem Wert ab, so dass das passiert, was man möchte.

```css
/* gerne benutzen */
@include respond-min($break-tablet-small) {
  background: yellow;
}

/* möglichst vermeiden */
@include respond-max($break-tablet-small) {
  background: red;
}
```
