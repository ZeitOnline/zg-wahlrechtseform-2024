load_dot_env(".env.shared")
load_dot_env("~/.duv/config.env")

#### Onedrive Pfad (jede Person muss eine ~/.duv/config.env erstellen und den Unterordner) ####
ONEDRIVE_FOLDER <- file.path(Sys.getenv("ONEDRIVE_PATH"), Sys.getenv("ONEDRIVE_SUBFOLDER"))
DROPBOX_FOLDER <- file.path(Sys.getenv("DROPBOX_PATH"), Sys.getenv("DROPBOX_SUBFOLDER"))

slugify <- function(str) {
  str %>%
    str_to_lower() %>%
    str_replace_all("\\|", "_") %>%
    str_replace_all(c("ö" = "o|e", "ü" = "u|e", "ä" = "a|e", "ß" = "s|s", "(€|¶)" = "")) %>%
    str_replace_all(" ", "_") %>%
    iconv(from = "UTF-8", to = "ASCII//TRANSLIT") %>%
    str_replace_all("[^0-9a-zA-Z\\|\\s_]", "") %>%
    str_replace_all("_+", "_")
}

unslugify <- function(str) {
  str %>%
    str_replace_all(c("o\\|e" = "ö", "u\\|e" = "ü", "a\\|e" = "ä", "s\\|s" = "ß")) %>%
    str_replace_all("_", " ") %>%
    str_to_title()
}

# Creates a folder in the src/public folder to store data that should not be
# cached in the client. It will use a uuid and store an accompanying json file
get_public_folder <- function(filename, subfolder = NULL, override = TRUE) {
  cache_breaker <- sha1(paste(filename, Sys.time())) %>% str_sub(1, 7)
  public_folder <- file.path("..", "src", "public")
  destination <- ifelse(
    is.null(subfolder), public_folder, file.path(public_folder, subfolder)
  )
  dir.create(destination, FALSE, TRUE)
  existing_folders <- list.dirs(destination, full.names = TRUE) %>%
    keep(\(path) str_detect(basename(path), glue("^{filename}-")))

  if (override || length(existing_folders) == 0) {
    # delete old folders
    existing_folders %>%
      # but not current one
      keep(\(path) basename(path) != glue("{filename}-{cache_breaker}")) %>%
      walk(\(path) unlink(path, recursive = TRUE))

    # delete old json
    unlink(file.path(destination, glue("{filename}.json")))

    # create folder with cache breaker
    cache_breaking_name <- glue("{filename}-{cache_breaker}")
    sub_destination <- file.path(destination, cache_breaking_name)

    dir.create(sub_destination,
      showWarnings = FALSE,
      recursive = TRUE
    )

    # write new json
    write_json(
      list(folder = ifelse(
        is.null(subfolder),
        cache_breaking_name,
        file.path(subfolder, cache_breaking_name)
      )),
      file.path(destination, glue("{filename}.json")),
      auto_unbox = TRUE
    )
  } else {
    # return the name of the first (and hopefully only) existing folder
    sub_destination <- existing_folders %>%
      first()
  }

  return(sub_destination)
}

format_number <- function(number, digits = 0, show_plus = FALSE, ...) {
  paste0("%.", digits, "f") -> sprint_format
  sprint_format %>% sprintf(number) -> formatted_number
  if_else(show_plus & number > 0, "+", "") %>%
    paste0(
      format(
        formatted_number %>% as.numeric(),
        big.mark = ".",
        decimal.mark = ",",
        nsmall = digits,
        scientific = FALSE,
        ...
      ) %>% str_replace(",0+$", "") %>% str_trim()
    )
}

format_percent <- function(num, suffix = " %", ...) {
  format_number(num * 100, ...) %>% paste0(suffix)
}

format_word_number <- function(num, short = FALSE, suffix = "", ...) {
  case_when(
    num > 1e9 ~ glue("{format_number(num / 1e9, digits = 1)} Milliarden"),
    num > 1e6 ~ glue("{format_number(num / 1e6, digits = 1)} Millionen"),
    num > 1e3 ~ glue("{format_number(num / 1e3)} Tausend"),
    TRUE ~ format_number(num, ...)
  ) -> result
  if (short) {
    result %<>%
      str_replace_all("Millionen", "Mio.") %>%
      str_replace_all("Milliarden", "Mrd.") %>%
      str_replace_all("Tausend", "Tsd.")
  }
  result %>% paste0(suffix)
}

geojson_write <- function(x, path, ...) {
  quietly(geojsonio::geojson_write)(x, file = path, ...)
  invisible(NULL)
}

topojson_write <- function(x, path, ...) {
  quietly(geojsonio::topojson_write)(x, file = path, ...)
  invisible(NULL)
}

tic <- function(msg, ...) {
  msg %>% print()
  tictoc::tic(msg, ...)
}
