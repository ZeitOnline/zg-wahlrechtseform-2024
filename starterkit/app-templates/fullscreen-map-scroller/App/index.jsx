import useIsSSR from 'core/hooks/useIsSSR';

import StickyContainer from './StickyContainer';
import ScrollProgressor from './ScrollProgressor';
import Waypoint from './Waypoint';

import placeholder from 'src/static/images/placeholder.jpg?url';
import './index.module.scss';

// Deine Komponenten
import Map from './Map';
import PaywallHeader from './PaywallHeader';
import PaywallOverlay from './PaywallOverlay';
import VisualArticleSnippet from 'core/components/VisualArticle/FullwidthSnippet';

function App({display, isTruncatedByPaywall, ...props}) {
  const isSSR = useIsSSR();

  if (display === 'paywall-header') {
    return (
      <>
        <PaywallHeader {...{isTruncatedByPaywall}}>
          <PaywallOverlay
            imgMobile={placeholder}
            alt="Karte die die Temperaturanomalien auf der Welt zeigt"
          />
        </PaywallHeader>
        <VisualArticleSnippet />
      </>
    );
  }

  if (isSSR) {
    return null;
  }

  // Projekt-Spezifisch
  if (display === 'mapbox-karte') {
    return <Map />;
  }

  // Sticky, Scroll-Progressor- und Waypoint-Setup
  if (display === 'sticky-container-start') {
    return <StickyContainer {...props} />;
  }
  if (display === 'scroll-progressor-setup') {
    return <ScrollProgressor {...props} />;
  }
  if (display === 'waypoint-start') {
    return <Waypoint {...props} />;
  }

  // Alles weitere wird rein anhand von div[data-prop-display="…"] gesteuert
  return null;
}

export default App;
