
# Client Components

Gelegentlich bringen komplexe Libraries (z.B. `react-map-gl`) das Server Side Rendering an seine Grenzen bzw. zum Abstürzen.

Die Fehlermeldung sieht oft erstmal nicht sehr aussagekräftig aus, z.B.:

```console
expected a string (for built-in components) or a class/function (for composite components) but got: object
```

## Variante `isSSR`

Gelegentlich reicht es, wenn man die Komponente, die auf dem Server Probleme macht, dort einfach nicht rendert:

```jsx
import useIsSSR from 'core/hooks/useIsSSR';
…
const isSSR = useIsSSR();
…
return (
  …
  {!isSSR && <Map />}
  …
);
```

Falls dies nicht hilft, gibt es noch die elaboriertere Variante:

## Variante Dynamische Imports

In dem Fall kann es sinnvoll sein, diesen Teil der App hinter einen so genannten [Dynamic Import](https://vite-plugin-ssr.com/dynamic-import) zu bewegen und diesen Import nur im Client stattfinden zu lassen.

Wenn du also z.B. eine React Karte in der Datei `index.jsx` hast, dann ummantele diese mit einem Wrapper, der wiefolgt aussieht:

```jsx
import {lazy, Suspense} from 'react';

const fallback = null;

function Wrapper(props) {
  if (typeof window !== 'undefined') {
    return fallback;
  }
  const ClientComponent = lazy(() => import('./index.jsx'));
  return (
    <Suspense {...{fallback}}>
      <ClientComponent {...props} />
    </Suspense>
  );
}

export default Wrapper;
```

Da wo du vorher die React Karte importiert hast, platziere nun stattdessen diesen `<Wrapper />`.
