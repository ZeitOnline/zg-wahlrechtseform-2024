final %>% 
  mutate(Jung = Geburtsjahr > 1980) %>% 
  group_by(Survivor, Jung) %>% 
  mutate(n = n()) %>% 
  select(Survivor, Jung, n) %>% ungroup() %>% unique() %>% 
  group_by(Survivor) %>% 
  mutate(Anteil = n / sum(n)) %>% 
  group_by(Jung) %>% 
  mutate(N = sum(n)) %>% 
  ungroup() %>% mutate(Gesamtanteil = N / sum(N)*2) %>% 
  ungroup() %>% select(Survivor, Jung, Anteil, Gesamtanteil) %>% 
  arrange(Survivor, Jung)

final %>% 
  left_join(elected21 %>% select(CID, Geschlecht)) %>% 
  group_by(Survivor, Geschlecht) %>% 
  mutate(n = n()) %>% 
  select(Survivor, Geschlecht, n) %>% ungroup() %>% unique() %>% 
  group_by(Survivor) %>% 
  mutate(Anteil = n / sum(n)) %>% 
  group_by(Geschlecht) %>% 
  mutate(N = sum(n)) %>% 
  ungroup() %>% mutate(Gesamtanteil = N / sum(N)*2) %>% 
  ungroup() %>% select(Survivor, Geschlecht, Anteil, Gesamtanteil) %>% 
  arrange(Survivor, Geschlecht)