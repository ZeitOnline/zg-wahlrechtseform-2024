results %>% 
  filter(Gebietsart == 'Wahlkreis') %>% 
  select(Gebietsnummer, Gebietsname) %>% 
  unique() %>% 
  left_join(survivors_districts) %>% 
  filter(is.na(Nachname)) %>% 
  select(Gebietsnummer, Gebietsname) ->
  wastelands

candidates %>% 
  filter(Gebietsname %in% wastelands$Gebietsname) %>% 
  mutate(ID = paste0(Nachname,str_sub(Vornamen,1,1),Geburtsjahr)) %>% 
  filter(CID %in% (final %>% filter(Survivor))$CID) %>% 
  select(CID,Gebietsname, Land, Partei, Nachname, Vornamen) ->
  stewards

stewards %>% 
  left_join(candidate_names) %>% 
  unique() %>% 
  mutate(Tooltip = paste0(Name,' (',Partei,')')) ->
  stewards_tooltip

wastelands %>%
  left_join(elected21, by = 'Gebietsname') %>% 
  select('Wahlkreis_Nr' = 1, 'Wahlkreis' = 2, CID) %>% 
  left_join(candidate_names) %>% 
  unique() %>% 
  left_join(final %>% select(CID, Partei), by = 'CID') %>% 
  rename('Incumbent_CID' = CID, 'Incumbent_Name' = Name, 'Incumbent_Party' = Partei) %>% 
  rowwise() %>% 
  mutate(Stewards = (stewards_tooltip %>% filter(Gebietsname == Wahlkreis))$Tooltip %>% paste(collapse = ', ')) %>% 
  mutate(
    verwaist = Stewards == '',
    Tooltip_Pt1 = paste0(
      'Der Wahlkreis wird derzeit von ',Incumbent_Name,' (',Incumbent_Party,') vertreten'
    ),
    Tooltip_Pt2 = ifelse(verwaist,' und wäre bei der Wahlrechtsreform komplett verwaist.',paste0('; nach der Reform verblieben ',Stewards,' über die Liste im Bundestag.')),
    Tooltip_Pt2 = ifelse(!(str_detect(Tooltip_Pt2,',')),Tooltip_Pt2 %>% str_replace('verblieben','verbliebe'),Tooltip_Pt2),
    Tooltip = paste0(Tooltip_Pt1,Tooltip_Pt2) %>% str_replace_all('GRÜNE','Grüne') %>% str_replace_all('DIE LINKE','Linke')
  ) %>% 
  select(Wahlkreis_Nr, Wahlkreis, verwaist, Tooltip) %>% 
  write_clip()

# Export overview for comparison with other groups
wastelands %>%
  left_join(elected21, by = 'Gebietsname') %>% 
  select('Wahlkreis_Nr' = 1, 'Wahlkreis' = 2, CID) %>% 
  left_join(candidate_names) %>% 
  unique() %>% 
  left_join(final %>% select(CID, Partei), by = 'CID') %>% 
  rename('Incumbent_CID' = CID, 'Incumbent_Name' = Name, 'Incumbent_Party' = Partei) %>% 
  rowwise() %>% 
  mutate(Stewards = (stewards_tooltip %>% filter(Gebietsname == Wahlkreis))$Tooltip %>% paste(collapse = ', ')) %>% 
  left_join((stewards %>% select(Gebietsname, Land) %>% unique()), by = c('Wahlkreis' = 'Gebietsname')) %>% 
  select(Land, Wahlkreis_Nr, Wahlkreis, Incumbent_Name, Incumbent_Party, 'Ersatz' = Stewards) %>% 
  mutate(verwaist = Ersatz == '') %>% 
  arrange(verwaist, Land) %>% 
  write_clip()