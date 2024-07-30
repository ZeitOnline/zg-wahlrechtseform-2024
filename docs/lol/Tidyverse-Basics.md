# Wie mache ich das in Tidy?

Eine lose Sammlung von Code-Schnippseln und ihren Tidyverse-Äquivalenten (in Vorher-Nachher-Kombos):

- [Spalte umbennenen](#spalte-umbennenen)
- [Mehrere Spalten auswählen, die ähnlich heißen](#mehrere-spalten-auswählen--die-ähnlich-heißen)
- [TSV einlesen](#tsv-einlesen)
- [CSV mit Semikolons `;` einlesen](#csv-mit-semikolons--einlesen)
- [Strings kombinieren](#strings-kombinieren)
- [Werte ersetzen](#werte-ersetzen)
- [Variable direkt überschreiben](#variable-direkt-überschreiben)
- [Zwei Tabellen mergen (wie SVERWEIS)](#zwei-tabellen-mergen-wie-sverweis)
- [Spalte hinzufügen](#spalte-hinzufügen)
- [Melt](#melt)
- [Vorkommen zählen](#vorkommen-z-hlen)
- [In einer Spalte alle `NA`s ersetzen](#in-einer-spalte-alle-nas-ersetzen)
- [Alle `NA`s in der ganzen Tabelle ersetzen](#alle-nas-in-der-ganzen-tabelle-ersetzen)
- [Spalte löschen](#spalte-löschen)
- [Shapefile einlesen](#shapefile-einlesen)
- [Shapefile schreiben](#shapefile-schreiben)
- [Spalte in Zahlen verwandeln](#spalte-in-zahlen-verwandeln)

## Spalte umbennenen

```r
colnames(d)[which(names(d) == "herkunft")] <- "ziel1"
```

⬇️

```r
d %>% rename(ziel1 = herkunft)
```

⚠️ Achtung verwirrend: Der neue Spaltenname kommt zuerst, vor das `=`.

🤓 Geht auch mit `select` wenn man gleichzeitig eine Auswahl an Spalten nur behalten möchte.

## Spalte umbennenen 2

```r
d %<>% plyr::rename(c("ags8.y" = "ags8", "ags11.y" = "ags11"))
```

⬇️

```r
d %<>% rename(ags8 = `ags8.y`, ags11 = `ags11.y`)
```

## Mehrere Spalten auswählen, die ähnlich heißen

```r
d %>% select(index, au_1, au_2, au_3, au_4, au_5, au_6)
```

⬇️

```r
d %>% select(index, starts_with("au_"))
```

🤓 Analog gibt's auch `ends_with` und `contains` u.v.m. (siehe [Docs](https://tidyselect.r-lib.org/reference/language.html)).

## TSV einlesen

```r
read.csv("file.tsv", sep="\t")
```

⬇️

```r
read_tsv("file.tsv")
```

🤓 Auch `read_csv` (mit Unterstrich) gibt's und ist besser als `read.csv` (mit Punkt).

## CSV mit Semikolons `;` einlesen

```r
read.csv(
  "infas360_Siedlungsblockdaten_2021_Nachlieferung.csv",
  sep = ";",
  stringsAsFactors = F,
  colClasses = "character"
)
```

⬇️

```r
read_delim(
  "infas360_Siedlungsblockdaten_2021_Nachlieferung.csv",
  delim = ";",
  col_types = "c"
)
```

🤓 Auch `read_csv` (mit Unterstrich) gibt's und ist besser als `read.csv` (mit Punkt).

## Strings kombinieren

```r
paste0('ags_', i)
```

⬇️

```r
glue("ags_{i}")
```

## Werte ersetzen

```r
d$zbev[which(d$zbev == 272407)] <- 113399
```

⬇️

```r
d %>% mutate(zbev = replace(zbev, zbev == 272407, 113399))
```

## Variable direkt überschreiben

```r
d <- na.omit(d)
```

⬇️

```r
d %<>% na.omit()
```

## Zwei Tabellen mergen (wie SVERWEIS)

```r
d_total <- merge(d_all, d_total, by.x = "zeitbezug", by.y = "zbez")
```

⬇️

```r
d_total <- d_all %>%
  left_join(d_total, by = c("zeitbezug" = "zbez"))
```

Dabei gilt:

- `all = FALSE` (default) wird `inner_join`
- `all.x = TRUE` wird `left_join`
- `all.y = TRUE` wird `right_join`
- `all = TRUE` wird `full_join`

🤓 Geht auch mit einem simplen `by = "zeitbezug"` wenn die Spaltennamen übereinstimmen.

🤓 Wenn dein merge `all = TRUE` hatte, dann kannst du `full_join` statt `left_join` benutzen.

## Spalte hinzufügen

```r
d_total$rel <- round(d_total$zbev.y / d_total$zbev.x * 100, 1)
```

⬇️

```r
d_total %<>% mutate(rel = round(zbev.y / zbev.x * 100, 1))
```

🤓 Mit `mutate` kann man auch bestehende Spalten bearbeiten = überschreiben.

## Melt

```r
d <-
  melt(
    d,
    id.vars = c("gem20", "zeitbezug"),
    measure.vars = c('g_zins', "g_fins")
  )
```

⬇️

```r
d %<>% pivot_longer(
  cols = c("g_zins", "g_fins"),
  names_to = "variable",
  values_to = "value"
)
```

## Vorkommen zählen

```r
table(d_siedlung$Siedlungsstruktur)
```

⬇️

```r
d_siedlung %>% count(Siedlungsstruktur)
```

## In einer Spalte alle `NA`s ersetzen

```r
datachange$einwohner_faktor[is.na(datachange$einwohner_faktor)] <- 1
```

⬇️

```r
datachange %<>% replace_na(einwohner_faktor, 1)
```

## Alle `NA`s in der ganzen Tabelle ersetzen

```r
datachange[is.na(datachange)] <- 0
```

⬇️

```r
datachange %<>% mutate_if(is.numeric, replace_na, 0)
```

## Spalte löschen

```r
Stadt_Kostat_restr$id <- NULL
```

⬇️

```r
Stadt_Kostat_restr %<>% select(-id)
```

## Shapefile einlesen

```r
shp <- readOGR(
  "shapes/infas-ortsteile/ortsteile.shp",
  stringsAsFactors = F,
  encoding = "UTF-8"
)
```

⬇️

```r
shp <- read_sf("shapes/infas-ortsteile/ortsteile.shp")
```

## Shapefile schreiben

```r
writeOGR(
  data,
  layer = "ortsteile-geocute",
  dsn = "export/value-mieten-ortsteile/ortsteile-geocute.shp",
  driver = "ESRI Shapefile",
  overwrite_layer = T
)
```

⬇️

```r
write_sf(
  data,
  "export/value-mieten-ortsteile/ortsteile-geocute.shp"
)
```

## Spalte in Zahlen verwandeln

```r
datachange$einwohner_faktor <-
    sapply(datachange$einwohner_faktor, as.numeric)
```

⬇️ Mehrere Spalten gleichzeitig:

```r
datachange %<>% mutate_at(vars(einwohner:faktor), as.numeric)
```

oder eine Spalte allein:

```r
datachange %<>% mutate(einwohner_faktor = as.numeric(einwohner_faktor))
```
