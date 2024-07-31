needs(tidyverse, electoral, rvest, DatawRappr)

datawrapper_auth(Sys.getenv('DW_KEY'), overwrite = T)

sainte_lague_verfahren <- function(stimmen, sitze) {
  res <- seats(names(stimmen), stimmen, sitze, method='mod-saint-lague')
  r <- res$SEATS
  names(r) <- res$PARTY
  r
}

sainte_lague_verfahren_old <- function(stimmen, sitze) {
  # Initialisiere die Anzahl der vergebenen Sitze für jede Partei mit 0
  sitz_vergabe <- rep(0, length(stimmen))
  # Schleife zur Vergabe der Sitze
  for (i in 1:sitze) {
    # Berechne die aktuellen Quotienten
    quotienten <- stimmen / (2 * sitz_vergabe + 1)
    # Finde die Partei mit dem höchsten Quotienten
    max_index <- which.max(quotienten)
    # Vergib einen Sitz an diese Partei
    sitz_vergabe[max_index] <- sitz_vergabe[max_index] + 1
  }
  names(sitz_vergabe) <- names(stimmen)
  return(sitz_vergabe)
}

verteilung <- function(grundmandate=T, sitze=630) {
  btw <- read_csv2('data/btw-kerg2.csv')
  direktmandate <- read_csv('data/Direktmandate_Btw21.csv') %>% 
    filter(is.na(ausgeschieden))
  
  direktmandate.je.partei <- direktmandate %>% 
    group_by(Partei) %>% 
    summarise(Anzahl=n())
  
  genug.grundmandate <- direktmandate.je.partei %>% 
    filter(Anzahl >= if(grundmandate) 3 else 10000) %>%
    pull(Partei)
  
  btw.bund <- btw %>%
    filter(
      Gebietsart == 'Bund',
      Gruppenart == 'Partei',
      Stimme == 2,
      (Prozent >= 5 |
         Gruppenname %in% genug.grundmandate |
         Gruppenname == 'SSW')
    ) %>%
    select(Gruppenname, Anzahl)
  
  btw.land <- btw %>%
    filter(
      Gebietsart == 'Land',
      Gruppenart == 'Partei',
      Stimme == 2,
      Gruppenname %in% btw.bund$Gruppenname
    ) %>%
    select(Gebietsname, Gruppenname, Anzahl)
  
  
  stimmen.bund <- btw.bund$Anzahl
  names(stimmen.bund) <- btw.bund$Gruppenname
  
  sitze.bund <- sainte_lague_verfahren(stimmen.bund, 630)
  

  sitze <- tibble()
  
  for (partei in btw.bund$Gruppenname) {
    
    partei.stimmen <- btw.land %>%
      filter(Gruppenname == partei) 
    
    stimmen.land <- partei.stimmen %>% pull(Anzahl)
    names(stimmen.land) <- partei.stimmen$Gebietsname 
    
    sitze.laender <- sainte_lague_verfahren(stimmen.land, sitze.bund[partei])
    sitze <- bind_rows(sitze, tibble(partei, land=names(sitze.laender), sitze=sitze.laender, stimmen=stimmen.land))
  }
  
  # filter candidates which ran in a wahlkreis:
  kandidaten <- read_csv('data/btw2021-kandidaten-clean.csv') %>% 
    filter(is.na(ausgeschieden))
  
  kandidaten.final <- kandidaten %>% 
    mutate(
      clean=str_remove_all(`kandidiert im/für`, '[­\\n]'),
      wahlkreis=if_else(str_detect(clean, 'Wahlkreis'), as.numeric(str_extract(clean, 'Wahlkreis (\\d+)', group=1)), NA),
      landesliste=if_else(str_detect(clean, 'Land'), str_extract(clean, 'Land ([^ ]+)', group=1), NA),
      listenplatz=if_else(str_detect(clean, 'Platz'), as.numeric(str_extract(clean, 'Platz (\\d+)', group=1)), NA)
    ) %>% 
    select(`Name, Vornamen`, `Geburts­jahr`, Partei, clean, wahlkreis, landesliste, listenplatz) 
  
  
  abgeordnete <- tibble()
  rausgeflogen <- tibble()
  
  for (partei_ in btw.bund$Gruppenname) {
    sitze.partei <- sitze %>% filter(partei == partei_)
    for (land_ in sitze.partei$land) {
      sitze.partei.land <- sitze.partei %>% filter(land == land_) %>% pull(sitze)
      
      direktmandate.partei.land <- direktmandate %>% filter(Partei == partei_ & Bundesland == land_)
      anz.direkt.ges <- nrow(direktmandate.partei.land)
      anz.direkt <- min(anz.direkt.ges, sitze.partei.land)
      
      gewaehlt <- direktmandate.partei.land %>% 
        arrange(desc(Stimmenanteil)) %>% 
        head(anz.direkt) %>% 
        mutate(Art='Direkt', Listenplatz=NA) %>% 
        select(Wahlkreisnummere, Name, Partei, Stimmenanteil, Bundesland, Listenplatz, Art)
      
      if (anz.direkt.ges > sitze.partei.land) {
        diff <- anz.direkt.ges - sitze.partei.land
        
        pech.gehabt <- direktmandate.partei.land %>% 
          arrange(desc(Stimmenanteil)) %>% 
          tail(diff) %>% 
          mutate(Art='Direkt', Listenplatz=NA) %>% 
          select(Wahlkreisnummere, Name, Partei, Stimmenanteil, Bundesland, Listenplatz, Art)
        
        rausgeflogen <- bind_rows(rausgeflogen, pech.gehabt)
        
        # print(paste0('Nicht alle ', anz.direkt.ges,' Direktmandate von ', partei_, ' in ', land_, ' können einziehen. ', diff, ' ziehen nicht ein'))
      } else {
        verbleibend <- sitze.partei.land - nrow(direktmandate.partei.land)
        # print(paste0(verbleibend, ' Abgeordnete von ', partei_,' kommen über die Landesliste hinzu'))
        
        landesliste <- kandidaten.final %>% 
          filter(landesliste==land_, Partei==partei_) %>%
          filter(!(wahlkreis %in% gewaehlt$Wahlkreisnummere)) %>% 
          arrange(listenplatz) %>%
          rename(Name=`Name, Vornamen`,
                 Bundesland=landesliste, 
                 Wahlkreisnummere=wahlkreis,
                 Listenplatz=listenplatz) %>% 
          mutate(Stimmenanteil=NA,
                 Art='Liste') %>% 
          select(Wahlkreisnummere, Name, Partei, Stimmenanteil, Bundesland, Listenplatz, Art) %>% 
          head(verbleibend)
        
        gewaehlt <- bind_rows(gewaehlt, landesliste)
      }
      
      abgeordnete <- bind_rows(abgeordnete, gewaehlt)
    }
  }
  
  abgeordnete %>% write_csv(paste0('export/bundestag-2021-neu-', if(grundmandate) 'mit' else 'ohne' ,'-grundmandatsklausel.csv'))
  rausgeflogen %>% 
    mutate(id=paste0(Name, '__', Partei)) %>% 
    filter(!(id %in% (abgeordnete %>% mutate(id=paste0(Name, '__', Partei)) %>% pull(id)))) %>% 
    select(-id) %>% 
    write_csv(paste0('export/bundestag-2021-rausgeflogen-', if(grundmandate) 'mit' else 'ohne' ,'-grundmandatsklausel.csv'))
  
  abgeordnete
} 


mit.grundmandaten <- verteilung(T, 630)
ohne.grundmandate <- verteilung(F, 630)

mit.grundmandaten %>% write_csv('export/bundestag-2021-neu-mit-grundmandatsklausel.csv')
ohne.grundmandate %>% write_csv('export/bundestag-2021-neu-ohne-grundmandatsklausel.csv')

# join character vector 
wahlkreise <- btw %>% 
  filter(Gebietsart == 'Wahlkreis') %>% 
  select(Gebietsnummer, Gebietsname) %>% 
  mutate(Gebietsnummer=as.numeric(Gebietsnummer)) %>%
  unique()


# verwaiste wahlkreise
read_csv('data/Direktmandate_Btw21.csv') %>% 
  pull(Wahlkreisnummere) %>% sort() %>% 
  tibble(Wahlkreis=.) %>% 
  left_join(mit.grundmandaten, by=c('Wahlkreis'='Wahlkreisnummere')) %>% 
  group_by(Wahlkreis) %>%
  mutate(name_tooltip=paste0(Name, ' (', Partei, ')')) %>%
  summarise(Anzahl=n(),
            empty=n() == 1 && is.na(Name),
            direkt='Direkt' %in% Art,
            kandidaten=if_else(empty, '', paste(name_tooltip, collapse = '|'))) %>% 
  left_join(wahlkreise, by=c('Wahlkreis'='Gebietsnummer')) %>%
  filter(direkt==F | empty) %>% 
  dw_data_to_chart('9QjNr')

# verwaiste wahlkreise
read_csv('data/Direktmandate_Btw21.csv') %>% 
  pull(Wahlkreisnummere) %>% sort() %>% 
  tibble(Wahlkreis=.) %>% 
  left_join(ohne.grundmandate, by=c('Wahlkreis'='Wahlkreisnummere')) %>% 
  group_by(Wahlkreis) %>%
  mutate(name_tooltip=paste0(Name, ' (', Partei, ')')) %>%
  summarise(Anzahl=n(),
            empty=n() == 1 && is.na(Name),
            direkt='Direkt' %in% Art,
            kandidaten=if_else(empty, '', paste(name_tooltip, collapse = '|'))) %>% 
  left_join(wahlkreise, by=c('Wahlkreis'='Gebietsnummer')) %>%
  filter(direkt==F | empty) %>% 
  dw_data_to_chart('fD5xl')


read_cs

all.letters <- str_to_lower(LETTERS)

kandidaten <- tibble()
for (letter in str_to_lower(LETTERS)) {
  if (letter != 'x') {
    url <- paste0('https://web.archive.org/web/20210926151300/https://www.bundeswahlleiter.de/bundestagswahlen/2021/wahlbewerber/bund-99/',letter,'.html')
    
    # read table from url
    table <- url %>%
      read_html() %>%
      html_nodes('table') %>%
      html_table(fill = TRUE) %>%
      .[[1]]
    
    kandidaten <- bind_rows(kandidaten, table)
  }
}

kandidaten %>% write_csv('~/Downloads/btw2021-kandidaten.csv')


mit.grundmandaten %>% 
  group_by(Partei) %>%
  summarise(Anzahl=n()) 

ohne.grundmandate %>% 
  group_by(Partei) %>%
  summarise(Anzahl=n()) 


abgeordnete %>% write_csv('bundestag-2021-neu-mit-grundmandatsklausel.csv')


direktmandate <- read_csv('data/Direktmandate_Btw21.csv') %>% 
  filter(is.na(ausgeschieden))