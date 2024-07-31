source('R/config.R')

source('R/read_results.R')
source('R/read_candidates.R')

new_parl_size <- 630
grundmandatsklausel <- F

source('R/distribute_seats.R')

source('R/allocate_district_seats.R')
source('R/allocate_list_seats.R')

source('R/find_survivors.R')

source('R/analyze_wastelands.R')

elected21 %>% 
  left_join(survivors %>% mutate(Survivor = T)) %>% 
  mutate(
    Survivor = ifelse(is.na(Survivor),F,Survivor),
    Survivor = ifelse(Partei == 'SSW' & Nachname == 'Seidler',T,Survivor)) %>% 
  select(CID, Partei, Nachname, Vornamen, Geburtsjahr, 'Typ' = Gebietsart, 'Wahlkreis' = Gebietsname, Survivor) %>%
  unique() %>% 
  mutate(Typ = Typ %>% str_replace('Land','Liste')) %>% 
  left_join(dpa_candidates %>% select(CID, id)) %>% 
  unique() ->
  final

final %>% 
  filter(Survivor == T) %>% 
  arrange(Partei, Typ, Wahlkreis) %>% 
  write_clip()

final %>% 
  filter(Survivor == F) %>% 
  arrange(Partei, Typ, Wahlkreis) %>%
  write_clip()

final %>% 
  select(id,Survivor) %>%
  write_csv('data/out/id_survival_630.csv')


final %>% 
  filter(Survivor) %>% 
  mutate(N = n()) %>% 
  group_by(Partei) %>% mutate(Anteil = (n() / N * 100) %>% round(2)) %>% 
  ungroup() %>% select(Partei, Anteil) %>% unique() %>% 
  arrange(desc(Anteil)) %>% 
  write_clip()

final %>% 
  mutate(N = n()) %>% 
  group_by(Partei) %>% mutate(Anteil = (n() / N * 100) %>% round(2)) %>% 
  ungroup() %>% select(Partei, Anteil) %>% unique() %>% 
  arrange(desc(Anteil)) %>% 
  write_clip()


wastelands %>% 
  arrange(Gebietsnummer) %>% pull() %>% write_clip()