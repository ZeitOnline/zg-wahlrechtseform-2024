# 🙋🏼‍♀️ Willkommen in unserem Storybook

Hier dokumentieren wir unseren Frontend-Code und sammeln auch nicht Frontend-bezogene Anleitungen und Tipps.

## Wie dokumentiere ich etwas?

### 📃 Einfaches Markdown

Wenn du etwas bescheiben möchtest – ein HowTo oder eine Anleitung, die nicht mit Frontend-Code zusammenhängt, dann erstell im Ordner `docs` eine neue Datei, die auf **\*.md** endet und hau in die Tasten. ⌨️

PS: Wenn du lokal eine neue Datei **\*.md** Datei erstellst, während Storybook bereits läuft, führ ein Mal `npm run build:stories` aus, dann erscheint sie.

### 🤓 Code innerhalb Markdown: MDX

Wenn du Javascript innerhalb deines Markdowns ausführen möchtest, so kannst du eine **\*.stories.mdx** Datei erstellen. Darin kannst du diverse Dinge im portieren und in einer Mischung aus einfachem Markdown und Code-Regionen beschreiben. Mehr über dieses Format findest du in der [offiziellen Doku](https://storybook.js.org/docs/writing-docs/mdx).

```md
import {Meta} from '@storybook/blocks';

<Meta
  title="Wissen/Thema 123"
  parameters={{previewTabs: {canvas: {hidden: true}}}}
/>
```

### 🚀 React-Komponenten

Wenn du eine Komponente beschreiben möchtest, schreib eine sogenannte Story dafür. Du findest [mehr Infos über Storys auf der Storybook-Website](https://storybook.js.org/docs/react/writing-stories/introduction). Es stehen sowohl MDX als auch JSX zur Verfügung. Letzteres ist intuitiver in der Handhabung. Beginn am besten mit einer Story `Default`, die deine Komponente in ihrer "Standard-Anwendung" zeigt:

```js
import Button from './index';

export default {
  title: 'Components/Button',
  component: Button,
};

export const Default = () => {
  return <Button>Content</Button>;
};
```
