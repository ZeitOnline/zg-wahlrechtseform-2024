district_seats %>% 
  group_by(Land, Partei) %>% 
  filter(Rang == max(Rang)) %>% 
  ungroup() %>% 
  select(Land, Partei,'Wahlkreissitze' = Rang) ->
  states_districts

state_seats %>% 
  left_join(states_districts) %>% 
  mutate(
    Wahlkreissitze = ifelse(is.na(Wahlkreissitze),0,Wahlkreissitze),
    Listensitze = Sitze - Wahlkreissitze
  ) ->
  seats