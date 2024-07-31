'data/btw21_gewaehlte_utf8/btw21_gewaehlte-fortschreibung_utf8.csv' %>% read_csv2(skip = 8) %>% 
  rename('Partei' = Gruppenname) %>%  
  mutate(
    ErsterVorname = Vornamen %>% str_remove(' .*'),
    CID = paste0(Nachname,ErsterVorname,Partei) %>% str_remove_all(' '),
    Status = ifelse(WahltagGewaehlt == 'X','alt','neu'),
    Status = ifelse(is.na(Status),'neu',Status)) %>% 
  select(CID, Nachname, Vornamen, Geburtsjahr, Geschlecht, Gebietsart, Gebietsnummer, Gebietsname, Partei,
         'Wechselpaar' = ListennachfolgeBekanntmachungsNr, Status) %>% 
  filter(!is.na(Wechselpaar)) ->
  old_new

old_new %>% 
  select(Wechselpaar, Status, CID) %>% 
  pivot_wider(names_from = Status, values_from = CID) %>% 
  left_join(dpa_candidates %>% select('id_alt' = id, CID), by = c('alt' = 'CID')) %>% 
  left_join(dpa_candidates %>% select('id_neu' = id, CID), by = c('neu' = 'CID')) %>% 
  unique() %>% 
  arrange(Wechselpaar) %>% 
  write_csv('data/out/wechsel.csv')