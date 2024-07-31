'data/candidates_clean.csv' %>% read_csv() %>% 
  select(Gebietsart, Gebietsnummer, Gebietsname, Listenplatz, Land, Partei, Nachname, Vornamen, Geburtsjahr) %>% 
  mutate(
    ErsterVorname = Vornamen %>% str_remove(' .*'),
    CID = paste0(Nachname,ErsterVorname,Partei) %>% str_remove_all(' ')) ->
  candidates

candidates %>% 
  filter(Gebietsart == 'Wahlkreis') %>% 
  mutate(Gebietsnummer = Gebietsnummer %>% str_pad(width = 3, side = 'left', pad = '0')) %>% 
  select(CID, Gebietsnummer, Gebietsname, Partei, Nachname, Vornamen, Geburtsjahr) ->
  district_candidates

candidates %>% 
  filter(Gebietsart == 'Land') %>% 
  select(CID, 'Land_Nr' = Gebietsnummer, 'Land' = Gebietsname, Partei, Listenplatz, Nachname, Vornamen, Geburtsjahr) ->
  state_candidates

'data/dpa/candidates.json' %>% fromJSON() ->
  dpa_candidates_raw

dpa_candidates_raw$persons %>% 
  select(id, first_name, middle_name, last_name, birthdate) %>% 
  as_tibble() %>% 
  mutate(birthyear = birthdate %>% str_sub(1,4),
         birthyear = ifelse(birthyear == 'N/A',NA,birthyear)) %>% 
  left_join(dpa_candidates_raw$candidates, by = c('id' = 'person_id')) %>% 
  left_join(dpa_candidates_raw$parties %>% select(id, abbreviation), by = c('party' = 'id')) %>% 
  select(id,last_name,first_name, middle_name, 'party' = abbreviation) %>% 
  mutate(CID = paste0(last_name, first_name, party) %>% str_remove_all(' ')) %>% 
  left_join('data/dpa/missing_matches.csv' %>% read_csv()) %>%
  mutate(CID = ifelse(!is.na(CID_repair),CID_repair,CID)) ->
  dpa_candidates

rm(dpa_candidates_raw)

'data/candidates_zon.csv' %>% 
  read_csv() %>% 
  mutate(Name = paste0(firstName,' ',lastName)) %>% 
  rename('id' = person_id) %>% 
  left_join(dpa_candidates %>% select(id, CID)) %>% 
  select(CID, Name) ->
  candidate_names