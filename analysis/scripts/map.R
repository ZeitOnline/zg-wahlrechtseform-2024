# PAKETE UND ZUSATZFUNKTIONEN LADEN
source("packages.R")

# DATEN UND SHAPEFILES LADEN
d <- read_csv("data/pkwdichte.csv") %>%
  mutate(across(AGS, as.character)) %>%
  pivot_lon(matches("\\d{4}"), )

shp <- read_sf("data/2020kreise.shp")

bundesland_shp <- shp %>%
  group_by(SN_L = AGS %>% str_pad(5, "left", "0") %>% str_sub(0, 2)) %>%
  summarise()

# JENKS-KLASSEN BERECHNEN
brks <- classInt::classIntervals(d$`2021`, n = 5, style = 'jenks')$brks
brks <- c(-1, brks)
palette <- colorRampPalette(c('#fcefec', '#d77e71'))(7)

# DATEN UND SHAPEFILE MERGEN
map <- shp %>%
  left_join(d) %>%
  mutate(class = cut(`2021`, breaks = brks) %>% as.numeric()) %>%
  mutate(color = palette[class]) %>%
  mutate(color = replace_na(color, "#EFEFEF"))

ggplot(data = map) +
  geom_sf(aes(fill = color),
          color = "white",
          linewidth = 0.025) +
  scale_fill_identity(guide = "none") +
  # BUNDESLÄNDER- UND DEUTSCHLAND-GRENZE HINZUFÜGEN
  geom_sf(
    data = bundesland_shp,
    fill = NA,
    color = "#ffffff",
    linewidth = 0.33
  ) +
  theme_void() + # ACHSEN ENTFERNEN
  coord_sf(expand = FALSE)

# STATISCHE GRAFIKEN EXPORTIEREN
# ggsave(filename = "export/map.pdf", bg = "transparent")

# GEOJSON-EXPORT VORBEREITEN. GEHT NICHT IM TIDY-FORMAT. DAHER FARBEN AUS TIDY MIT STARTDATENSATZ MERGEN
export_shp <- map %>%
  select(-class, -color) %>%
  # X wieder vornedran machen, dass es dem vorherigen Format wieder entspricht
  rename_at(vars(matches("\\d{4}")), str_pad, 5, "left", "X")

# TOPOJSON DIREKT IN PROJEKTORDNER EXPORTIEREN
#geojson_write(data, group="wbz", precision = 3, file = "hamburg-2015.geo.json")
write_sf(
  export_shp,
  "../maptiles/projects/pkw-dichte/data.geojson",
  delete_dsn = TRUE
)
