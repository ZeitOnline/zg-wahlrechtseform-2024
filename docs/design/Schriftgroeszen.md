# Schriftgrößen

Es gibt vorgefertigte Schriftgrößen, die auch gleich das richtige letter-spacing setzen. Die kann man in SCSS per `@include` benutzen.

## Empfohlen: Responsive Größen

```scss
@include font-sans-responsive-xs;
@include font-sans-responsive-s;
@include font-sans-responsive-m;
@include font-sans-responsive-l;
```

## Alternativ: Fixe Größen

Manchmal möchte man nicht, dass sich die Schriftgröße je nach Gerät ändert. Dafür gibt es die fixen Mixins. Die kann man zum Beispiel auf der Homepage benutzen. Oder wenn man die gleichen Schriftgrößen wie z. B. Artikel-Teaser oder -Datum haben möchte (die ändern sich nicht).

```scss
@include font-sans-s;
@include font-sans-m;
```
