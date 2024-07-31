# https://cran.r-project.org/web/packages/electoral/readme/README.html

if (grundmandatsklausel){
  results %>% 
    filter(Gebietsart == 'Bund', Stimme == 2) %>% View
    filter(Prozent >= 5 | Partei == 'DIE LINKE') ->
    results_bund
} else {
  results %>% 
    filter(Gebietsart == 'Bund', Stimme == 2) %>% 
    filter(Prozent >= 5) ->
    results_bund
}


tibble(
  Partei = results_bund$Partei,
  Sitze = (seats(votes = results_bund$Stimmen, parties = results_bund$Partei, n_seats = new_parl_size - 1, method = 'mod-saint-lague'))$SEATS
) ->
  total_seats

results %>% 
  filter(Gebietsart == 'Land', Stimme == 2) %>% 
  filter(Partei %in% total_seats$Partei) %>% 
  rename('Land' = Gebietsname) ->
  results_laender
  
tibble('Partei' = character(), 'Land' = character(), 'Sitze' = integer()) -> state_seats

for(partei in total_seats$Partei){
  tibble(
    Partei = partei,
    Land = (results_laender %>% filter(Partei == partei))$Land,
    Sitze = seats(
      votes = (results_laender %>% filter(Partei == partei))$Stimmen,
      parties = (results_laender %>% filter(Partei == partei))$Land, 
      n_seats = (total_seats %>% filter(Partei == partei) %>% pull()),
      method = 'mod-saint-lague')$SEATS
  ) %>% 
    rbind(state_seats) ->
    state_seats
}

results %>% 
  filter(Gebietsart == 'Land') %>% select('Land_Nr' = Gebietsnummer, 'Land' = Gebietsname) %>% unique() ->
  laenderliste