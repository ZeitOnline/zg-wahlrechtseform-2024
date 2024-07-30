# Vivi-Parameter

Wenn du z.B. in `src/apps/deinName/index.jsx` einen Vivi Parameter namens `paragraph` definiert hast:

```jsx
{
  name: 'pembed-deiner-app',
	props: [
		viviParameterTypes.text({
		  name: `paragraph`, // must not contain dashes
		  label: `Textblock`,
		  escape: false,
		}),
		viviParameterTypes.integer({
		  name: `opacity`,
		  label: `Opazität`,
		  min: 0,
		  max: 100,
		}),
	]
}
```

Dann kannst du in `src/apps/deinName/pages/index.jsx` einen Parameter mit demselben Namen und einem lokalen fake-Wert an `<ViviEmbed … />` übergeben:

```jsx
<ViviEmbed
  name="pembed-deiner-app"
  paragraph="Lorem ipsum dolor sit."
  opacity="50"
/>
```

⚠️ **Vorsicht**: Übergib hier **immer einen String**, auch wenn du den Parameter als `integer` angelegt hast. Die Parameter werden nämlich als `data` Attribute ins HTML geschrieben und das sind immer Strings.

Das heißt auch: **Konvertiere Parameter selber** noch in den von dir gewünschten Datentyp wenn du sie in deiner React App ausliest:

```jsx
function ({ paragraph, opacity }) {
	return (
		<p style={{ opacity: +opacity }}>
			{paragraph}
		</p>
	);
}
```

## Typen

Auf Github kannst du [alle Details zu den Parameter-Typen](https://github.com/ZeitOnline/zg-starterkit/blob/main/starterkit/vivi/parameter-types.md) nachlesen, aber hier vielleicht kurz die wichtigsten drei:

#### Kurzes Freitextfeld

Gut, z.B. um Redakteur:innen zu erlauben, über eine Grafik einen Titel zu setzen.

```jsx
viviParameterTypes.text({
  name: `title`,
  label: `Titel`,
});
```

#### Selects

Gut, z.B. zwischen den Schritten eines Scrollies wählen zu lassen.

```jsx
viviParameterTypes.oneOf({
  name: `waypointId`,
  label: `Schritt`,
  options: [
    {label: 'Schritt eins', propValue: 'step-one'},
    {label: 'Schritt zwei', propValue: 'step-two'},
  ],
});
```

#### Checkboxen

Gut, z.B. um etwas darzustellen oder auszublenden:

```jsx
viviParameterTypes.boolean({
  name: 'collapsed',
  label: 'Eingeklappt',
  defaultValue: false,
});
```

In einem LOL hat uns Julian mal ganz viele Beispiele von Parametern gezeigt: [Repo mit vielen **Beispielen und Fallen** der Vivi-Parameter](https://github.com/ZeitOnline/zg-lol-2022-10-20).
