import useIsSSR from 'core/hooks/useIsSSR';

import StickyContainer from './StickyContainer';
import ScrollProgressor from './ScrollProgressor';
import Waypoint from './Waypoint';

// Deine Komponenten
import Grafik from './Grafik';

function App({display, ...props}) {
  const isSSR = useIsSSR();
  if (isSSR) return null;

  // Projekt-Spezifisch
  if (display === 'grafik') return <Grafik />;

  // Sticky, Scroll-Progressor- und Waypoint-Setup
  if (display === 'sticky-container-start')
    return <StickyContainer {...props} />;
  if (display === 'scroll-progressor-setup')
    return <ScrollProgressor {...props} />;
  if (display === 'waypoint-start') return <Waypoint {...props} />;

  // Alles weitere wird rein anhand von div[data-prop-display="…"] gesteuert
  return null;
}

export default App;
