results %>% 
  filter(Gebietsart == 'Wahlkreis', Stimme == 1) %>% 
  group_by(Gebietsnummer) %>% 
  filter(Stimmen == max(Stimmen, na.rm = T)) %>% 
  ungroup() %>% 
  rename('Land_Nr' = UegGebietsnummer) %>% 
  group_by(Partei, Land_Nr) %>% 
  mutate(Rang = rank(desc(Prozent))) %>% 
  ungroup() %>% 
  left_join(laenderliste) %>% 
  select(Land_Nr, Land, Gebietsnummer, Gebietsname, Partei, Prozent, Rang) %>% 
  left_join(state_seats) %>% 
  filter(Rang <= Sitze) ->
  district_seats
