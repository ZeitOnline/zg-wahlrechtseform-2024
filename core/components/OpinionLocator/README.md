# Meinungslocator

## Beispielconfig

```json
{
  "id": "testproject",
  "question": "Wie wichtig ist Ihnen <strong>Geld</strong>?",
  "minX": -100,
  "maxX": 100,
  "minXLabel": "Ich habe <strong>sehr wenig</strong> Geld",
  "maxXLabel": "Ich habe <strong>sehr viel</strong> Geld",
  "minY": -100,
  "maxY": 100,
  "minYLabel": "Geld is mir <strong>nicht wichtig</strong>",
  "maxYLabel": "Geld ist mir <strong>sehr wichtig</strong>",
  "colorX": "#00CBDB",
  "colorY": "#F76906",
  "highlights": [
    {"name": "Julius Tröger", "pos": [15, 85]},
    {"name": "Paul Blickle", "pos": [75, 25]}
  ],
  "tokenHighlights": [
    {
      "name": "Token User",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NDk0NjY5NjQsImlhdCI6MTU0OTQ2MzM2NH0.ToYf4FjQWHnB8j3-liD0i1ChrvDlDpR4m4P1md5bM5I"
    },
    {"name": "Invalid Token", "token": "abc"}
  ],
  "showHelperLines": true,
  "dragCallToAction": "Wie verorten Sie die Partei?"
}
```

## Highlights

Für die Positionen müssen Werte zwischen `0 - 100` mitgegeben werden.
Das Tool rechnet diese entsprechend um.

## Tokens

### Token Generieren

https://zg-opiniontool.herokuapp.com/tokens

Die Tokens kann man nur ein Mal verwenden. Wenn das Token abgelaufen ist, zählt die Submission als normale Submission.
Mehrere Tokens generieren:

https://zg-opiniontool.herokuapp.com/tokens?count=100

### Token per Url mitgeben:

https://zeit.de/artikel-url/?token=abcdef12345678

Wenn ein token per URL mitgegeben wird, wird dieses beim Submitten an den Server geschickt.
Wenn `tokenHighlights` in der Config angegeben ist, kann die Submission im Frontend angezeigt werden.

### Token User anzeigen:

Per Config `tokenHighlights` mitgeben:

```json
    "tokenHighlights": [
        { "name": "Token User", "token": "abcdef12345678" }
    ]

```

Vom Server wird die Position des Tokens `abcdef12345678` geholt und mit dem Namen "Token User" angezeigt.
