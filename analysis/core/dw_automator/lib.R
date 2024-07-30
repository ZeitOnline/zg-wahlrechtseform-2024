# Load DW key
DW_KEY <- Sys.getenv("DW_KEY")

# Not documented because private function.
create_clone <- function(id, folder_id) {
  meta <- dw_create_chart(api_key = DW_KEY, folderId = folder_id)
  
  return(tibble(child_id = id,
                child_chart_id = meta$id))
}

#' Create for each element in ids a new chart cloned from template_chart_id. These charts are stored in the dw folder with folder_id. When a mapping for the template chart was created it is read and returned.
#' @param ids A vector. It contains all the ids for each chart that should be replicated, the id should be something meaningfull like the ags of a city.
#' @param folder_id A string with the id of the folder where the charts should be stored, the id can be copied from the dw url.
#' @param template_chart_id A string. The id of the chart that should be cloned.
#' @return A tibble with the mapping for all charts which can be used for further manipulating the charts.
#' @examples mapping <- create_all_clones(
#'   ids = unique(wohnflaeche$AGS),
#'   folder_id = "143892",
#'   template_chart_id = "BhReI"
#' )
create_all_clones <-
  function(child_ids, folder_id, template_chart_id) {
    check_if_key_is_present()
    
    if (!dir.exists(glue("mappings"))) {
      dir.create(glue("mappings"))
    }
    if (file.exists(glue("mappings/{template_chart_id}.csv"))) {
      print(glue(
        "Clones of chart {template_chart_id} already exist. Skipping cloning."
      ))
      return(read_csv(glue(
        "mappings/{template_chart_id}.csv"
      )))
    } else {
      mapping <- child_ids %>%
        as.character() %>%
        map_dfr(function(id) {
          return(create_clone(id, folder_id))
        }) %>%
        mutate(template_chart_id = template_chart_id)
      write_csv(mapping,
                glue("mappings/{template_chart_id}.csv"))
      return(mapping)
    }
  }

# Not documented because private function.
update_clone_style <-
  function(template_chart_id,
           child_chart_id,
           headline,
           subline) {
    check_if_key_is_present()
    
    template_meta <-
      dw_retrieve_chart_metadata(api_key = DW_KEY, template_chart_id)
    current_chart_meta <-
      dw_retrieve_chart_metadata(api_key = DW_KEY, child_chart_id)
    
    if (!is.null(headline) & str_length(headline) > 0) {
      template_meta$content$title <- headline
    }
    if (!is.null(subline) & str_length(subline) > 0) {
      template_meta$content$metadata$describe$intro <- subline
    }
    
    dw_edit_chart(
      api_key = DW_KEY,
      chart_id = child_chart_id,
      type = template_meta$content$type,
      visualize = template_meta$content$metadata$visualize,
      describe = template_meta$content$metadata$describe,
      annotate = template_meta$content$metadata$annotate$notes,
      data = template_meta$content$metadata$data,
      title = template_meta$content$title
    )
  }

#' Update the style of all charts in a mapping.
#'
#' @param mapping A tibble with the mapping for all charts and additional columns for infos for the head/subline
#' @param headline_function A glue string. The headline that should be used for all charts with which `{name}` can be injected.
#' @param subline_function A glue string. The subline that should be used for all charts with which `{name}` can be injected.
#' @examples
#' filter_function <- function(names, config) {
#'   names %>%
#'     filter(ags8 == config$child_id) %>%
#'     pull(name_original)
#' }
#'
#' update_all_clones_style(
#'   mapping,
#'   filter_function,
#'   headline_function = \(config) glue("So viel baut {config$child_id}")
#'   subline_function = \(config) glue("Erklärung {config$child_id}")
#' )
update_all_clones_style <-
  function(mapping,
           headline_function = NULL,
           subline_function = NULL) {
    check_if_key_is_present()
    check_if_mapping_cols_present(mapping)
    for (i in seq_len(nrow(mapping))) {
      config <- mapping[i, ]
      
      update_clone_style(
        config$template_chart_id,
        config$child_chart_id,
        if (is.null(headline_function)) NULL else headline_function(config),
        if (is.null(subline_function)) NULL else subline_function(config)
      )
    }
    return (mapping)
  }

#' Update the data of all charts in a mapping.
#' @param mapping A tibble with the mapping for all charts which is created by create_all_clones.
#' @param data A tibble with the data that should be used for all charts.
#' @param filter_function A function that filters the data tibble for each sucessive chart.
#' @examples
#' update_all_clones_data(mapping, data, function(data, config) {
#'   data %>%
#'     filter(AGS == config$child_id) %>%
#'     return()
#' })
update_all_clones_data <- function(mapping, data, filter_function = NULL, visualize_function = NULL) {
  check_if_key_is_present()
  check_if_mapping_cols_present(mapping)
  
  for (i in 1:nrow(mapping)) {
    config <- mapping[i,]
    filtered_data <- filter_function(data, config)
    dw_data_to_chart(filtered_data,
                     chart_id = config$child_chart_id,
                     api_key = DW_KEY)
    
    if (!is.null(visualize_function)) {
      visualize_list <- visualize_function(data, config)
      dw_edit_chart(
        chart_id = config$child_chart_id,
        api_key = DW_KEY,
        visualize = visualize_list
      )
    }
  }
  return(mapping)
}

# TODO parralelize

#' Publish all charts in a mapping.
#' @param mapping A tibble with the mapping for all charts which is created by create_all_clones.
#' @examples publish_all_clones(mapping)
publish_all_clones <- function(mapping) {
  check_if_key_is_present()
  check_if_mapping_cols_present(mapping)
  suppress_output <- function(func) {
    sink(tempfile())
    on.exit(sink())
    func()
  }
  
  for (i in 1:nrow(mapping)) {
    config <- mapping[i,]
    suppress_output(\() {
      dw_publish_chart(
        config$child_chart_id,
        api_key = DW_KEY,
        return_object = FALSE
      )
    })
  }
  
  return(mapping)
}

#' Delete all charts in a mapping. Afterwards also remove the mapping file {template_chart_id}.csv.
#' @param template_chart_id A string with the id of the template chart.
#' @param delete_file A boolean. If TRUE the mapping file {template_chart_id}.csv will be removed.
#' @examples
#' delete_all_clones("BhReI")
delete_all_clones <- function(mapping, delete_file = TRUE) {
  check_if_key_is_present()
  check_if_mapping_cols_present(mapping)
  
  for (i in 1:nrow(mapping)) {
    config <- mapping[i,]
    dw_delete_chart(config$child_chart_id, api_key = DW_KEY)
  }
  
  if (delete_file) {
    file.remove(
      glue(
        "mappings/{template_chart_id}.csv",
        template_chart_id = mapping %>% first() %>% pull(template_chart_id)
      )
    )
  }
}

#' Create a json for the autocomplete embed for all charts in a mapping.
#' @param mapping A tibble with the mapping for all charts which is created by create_all_clones.
#' @param name A string with the name of the embed.
#' @examples
#' export_mapping_autocomplete(mapping, "So viel baut {name}")
export_mapping_autocomplete <- function(mapping, name) {
  if (!dir.exists("../src/static/dw-autocomplete")) {
    dir.create("../src/static/dw-autocomplete")
  }
  
  directory <- "../src/static/dw-autocomplete"
  filename <- mapping %>% first() %>% pull(template_chart_id)
  destination <- glue("{directory}/{filename}.json")
  print(glue("will store mappings to {destination}"))
  
  if (!dir.exists(directory))
    dir.create(directory)
  
  mapping %>%
    mutate(label = child_id, value = child_id) %>%
    rename(name = child_id, key = child_chart_id) %>%
    select(-template_chart_id) %>%
    nest(data = c(name, key)) %>%
    mutate(data = map(data, as.list)) %>%
    write_json(destination,
               pretty = TRUE,
               auto_unbox = TRUE)
}

# Check if all variables are defined.
check_if_key_is_present <- function() {
  if (is.null(DW_KEY)) {
    stop("'DW_KEY' needs to be put in the ~/duv/config.env file.")
  }
}

check_if_mapping_cols_present <- function(mapping) {
  for (col in c("child_id", "child_chart_id", "template_chart_id")) {
    if (!col %in% colnames(mapping))
      stop(glue("column {col} missing in mapping"))
  }
}
