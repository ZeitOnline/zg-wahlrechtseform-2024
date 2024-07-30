import {useCallback, useEffect, useRef} from 'react';
import {useScrollProgress, useWaypoint} from '../ScrollProgressor/store';

function Grafik() {
  const ref = useRef(null);
  const node = useRef(null);
  const waypoint = useWaypoint();
  useScrollProgress(ref);

  const onScroll = useCallback(() => {
    // Dies ist die bevorzugte Variante, um den Scroll-Progress zu benutzen
    // Sie ist viel effizienter, weil nicht bei jedem gesrcollten Pixel gererendert wird
    node.current.innerHTML = Math.round(ref.current);
  }, [node]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [onScroll]);

  return (
    <div style={{background: 'magenta'}}>
      Von <code>useWaypoint</code> erhalte ich folgenden Inhalt zurück:
      <br />
      <br />
      <code>{JSON.stringify(waypoint, null, 2)}</code>
      <br />
      <br />
      Mein Fortschritt ist: <strong ref={node} />
    </div>
  );
}

export default Grafik;
