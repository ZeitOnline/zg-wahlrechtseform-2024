# Source:
# https://bundeswahlleiter.de/bundestagswahlen/2021/ergebnisse/opendata.html#39734920-0eaf-4633-8858-ae792d5d610b
'data/btw21_kerg2.csv' %>% 
  read_csv2(skip = 9) ->
  results_raw

results_raw %>% 
  filter(Gruppenart == 'Partei') %>% 
  select(Gebietsart, Gebietsnummer, Gebietsname, UegGebietsnummer, Gruppenname, Stimme, Anzahl, Prozent) %>% 
  rename('Partei' = Gruppenname, 'Stimmen' = Anzahl) ->
  results

'data/btw21_gewaehlte_utf8/btw21_gewaehlte-fortschreibung_utf8.csv' %>% read_csv2(skip = 8) %>% 
  filter(WahltagGewaehlt == 'X') %>%
  rename('Partei' = Gruppenname) %>%  
  mutate(
    ErsterVorname = Vornamen %>% str_remove(' .*'),
    CID = paste0(Nachname,ErsterVorname,Partei) %>% str_remove_all(' ')) %>% 
  select(CID, Nachname, Vornamen, Geburtsjahr, Geschlecht, Gebietsart, Gebietsnummer, Gebietsname, Partei) ->
  elected21