district_seats %>% 
  left_join(district_candidates) %>% 
  select(-Rang,-Sitze) ->
  survivors_districts

state_candidates %>% 
  left_join(seats) %>% 
  filter(!(CID %in% survivors_districts$CID)) %>% 
  group_by(Partei, Land) %>% 
  mutate(Listenrang = rank(Listenplatz)) %>% 
  filter(Listenrang <= Listensitze) %>% 
  ungroup() %>% 
  select(CID, Partei, Land, Nachname, Vornamen, Geburtsjahr) ->
  survivors_lists

survivors_lists %>% 
  mutate(Wahlkreis = NA, Typ = 'Liste') %>% 
  rbind(survivors_districts %>% select(CID, Partei, Land, Nachname, Vornamen, Geburtsjahr, 'Wahlkreis' = Gebietsname) %>% mutate(Typ = 'Wahlkreis')) ->
  survivors