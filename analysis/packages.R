needs <- function(..., from_github = FALSE, quiet = TRUE) {
  packages_list <- sapply(substitute(list(...))[-1], as.character)
  if (from_github) packages_list <- append(packages_list, "devtools", after = 0)
  installed_packages <- lapply(packages_list, function(package_name) {
    short_name <- sub(".*?\\/", "", package_name)
    if (!short_name %in% installed.packages()[, "Package"]) {
      if (from_github) {
        devtools::install_github(package_name, quiet = quiet)
      } else {
        install.packages(package_name, repos = "https://cloud.r-project.org/")
      }
    }
    suppressWarnings(suppressMessages(
      library(short_name, character.only = TRUE)
    ))
  })
  if (quiet) {
    invisible()
  } else {
    return(paste("Installed", paste0(packages_list, collapse = ", ")))
  }
}

#### Karten ####
needs(
  sf,
  geojsonio,
  rmapshaper
)

#### Tidyverse ####
needs(
  tidyverse,
  purrr,
  readr,
  readxl,
  dplyr,
  glue,
  scales,
  magrittr,
  ggplot2,
  jsonlite,
  modelr
)

#### Datawrapper ####
needs("munichrocker/DatawRappr", from_github = TRUE)

### Webscraping
needs(rvest)

### Excel lesen und schreiben ####
needs(readxl)
# needs(writexl)

### Zwischenablage ####
needs(clipr)

#### Datenbanken ####
# needs(RPostgreSQL)

#### Weiteres ####
needs(
  dotenv, # environment variables
  tictoc, # Schreibt in die Konsole wie lange Skripte brauchen
  crayon, # Kann Konsolen-Output bunt einfärben
  clipr, # Kann Dinge direkt in die Zwischenablage kopieren
  this.path, # Kann den Ordner des laufenden R-Skripts eruieren
  classInt, # Kann jenks etc. berechnen
  digest # kann Hashes berechnen
)
