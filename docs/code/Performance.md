# Performance

## Hydration

Wenn man einen Component in `<Suspense>` packt, wird er lazy hydrated. So kann man wichtige Components etwas mehr Priorität verschaffen.

```jsx
<WichtigerComponent />
<Suspense>
  <UnwichtigerComponent />
</Suspense>
```

Erklärung: [SSR-Performance mit Suspense](https://github.com/reactwg/react-18/discussions/37)

## Lazy loading

### Später als den Rest laden

Wenn Sachen unwichtiger sind, kann man sie auch einfach lazy loaden. Das macht das Javascript, das direkt am Anfang geladen wird, kleiner.

```jsx
import {lazy, Suspense} from 'react';

import Header from './Parts/Header';
const Später = lazy(() => import('./Parts/Später'));

function App() {
  let content = null;

  if (display === 'header') {
    content = <Header />;
  } else if (display === 'part-1') {
    content = (
      <Suspense>
        <Später />
      </Suspense>
    );
  }

  return content;
}

export default App;
```

### Erst im Viewport laden

Wenn Sachen erst geladen werden sollen, wenn sie sichtbar werden, kann man das über `React.lazy` und `Suspense` machen. Ein Beispiel:

```jsx
import {Suspense, lazy, useRef} from 'react';

import useWasVisible from 'core/hooks/useWasVisible.js';

const EmbedWeiterUntenInDerSeite = lazy(() =>
  import('./EmbedWeiterUntenInDerSeite.jsx'),
);

const wasVisibleOptions = {
  rootMargin: '50% 0% 50% 0%',
};

function MeineAppLazyWrapper() {
  const containerRef = useRef(null);
  const isVisible = useWasVisible(containerRef, wasVisibleOptions);
  const content = isVisible ? <EmbedWeiterUntenInDerSeite /> : null;

  return (
    <div className={cx(cn.container, 'x-teaser-standard')} ref={containerRef}>
      <Suspense fallback={<div className={cn.placeholder} />}>
        {content}
      </Suspense>
    </div>
  );
}
```
