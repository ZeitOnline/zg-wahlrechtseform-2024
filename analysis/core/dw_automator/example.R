#### Packages und DW Automator laden ####
source("packages.R")
source("core/dw_automator/lib.R")

#### Skript-Ordner in Variable speichern ####
SCRIPT_PATH <- this.dir()

#### 0. Bereite deine Daten und das Vorlagen-Chart vor ####
# Beispiel-Datensatz einlesen
df <- read_csv(glue("{SCRIPT_PATH}/example.csv"))

# Filter die Daten so, dass du nur noch z.B. ein Bundesland hast.
# Kopiere Daten für Vorlagen-Chart in die Zwischenablage.
df %>%
  filter(name == "Baden-Württemberg") %>%
  select(-category, -name) %>%
  write_clip()

#### 1. Erstellen der Chartklone aus dem Vorlagen-Chart ####
mapping <- create_all_clones(
  # Strings, zum Filtern der Daten, z.B. unique(df$land)
  child_ids = unique(df$name),
  # ID des Ordners zum ablegen: Findest du in der URL in DW
  folder_id = "166690",
  # ID des Vorlagen Charts: Findest du ebenfalls in der URL
  template_chart_id = "XnLzN"
)

#### 2. Stile der Vorlage auf die Klone übertragen ####
update_all_clones_style(
  mapping,
  # Ein Template-String, der mittels glue interpretiert wird
  headline_function = \(config) glue("Klon: {config$child_id}")
)

#### 3. Daten auf alle Klone übertragen ####
update_all_clones_data(mapping, df, function(data, config) {
  data %>%
    filter(name == config$child_id) %>%
    return()
})

#### 4. Alle Klone veröffentlichen ####
publish_all_clones(mapping)

#### Falls nötig: JSON für Autocomplete exportieren ####
export_mapping_autocomplete(mapping)

#### Falls nötig: Klone löschen ####
# delete_all_clones(mapping, delete_file = TRUE)

#### Nerd-Chapter ####
# Alle Funktionen geben immer die mappings zurück, sie können also aneinander
# in einer Pipe geschrieben werden:
# create_all_clones(
#   child_ids = unique(df$name),
#   folder_id = "166690",
#   template_chart_id = "XnLzN"
# ) %>%
#   update_all_clones_style(
#     headline_function = \(config) glue("Klon: {config$child_id}")
#   ) %>%
#   update_all_clones_data(df, function(data, config) {
#     data %>%
#       filter(name == config$child_id) %>%
#       return()
#   }) %>%
#   publish_all_clones() %>%
#   export_mapping_autocomplete() %>%
#   delete_all_clones()
