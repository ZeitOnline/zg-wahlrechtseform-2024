# Praktische SF (Simple Feature) Snippets

#### Dataframe/CSV in Simple Features Punkte umwandeln

```r
csv_coord_data %>%
  st_as_sf(coords = c(x = "lng", y = "lat"), crs = 4326)
```

#### Simple Features Punkte in Dataframe/CSV umwandeln

```r
sf_points %>%
  mutate(lng = st_coordinates(.)[, 1],
         lat = st_coordinates(.)[, 2]) %>%
  st_drop_geometry()
```

#### Text in Bounds verwandeln

```r
"34.9741,31.8612,35.452,32.2198" %>%
  str_split(",", simplify = TRUE) %>%
  as.numeric() %>%
  set_names(c("xmin", "ymin", "xmax", "ymax")) %>%
  st_bbox(crs = 4326) -> custom_bounds
```

#### Bounds in anderes CRS transformieren

```r
bounds_4326 %>%
  st_as_sfc() %>%
  st_transform(3857) %>%
  st_bbox() -> bonds_3857
```

#### Ggplot mit Bounds

```r
ggplot() +
  coord_sf(
    xlim = c(bounds$xmin, bounds$xmax),
    ylim = c(bounds$ymin, bounds$ymax),
    expand = FALSE
  )
```

#### Von Multipolygonen nur den größten Polygon behalten

```r
sf_object %<>%
  st_cast("POLYGON") %>%
  mutate(area = st_area(geometry)) %>%
  group_by(AGS) %>%
  top_n(1, area) %>%
  st_make_valid()
```
