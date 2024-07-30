import Paywall from 'core/components/Paywall';
import imgMobile from 'src/static/images/paywall/mobile.png';
import imgDesktop from 'src/static/images/paywall/desktop.png';
import imgMobileDark from 'src/static/images/paywall/mobile-dark.png';
import imgDesktopDark from 'src/static/images/paywall/desktop-dark.png';
import Howto from 'core/components/Howto';
import config from './config';
import Map from './Map';

const App = ({viviEmbedName, isTruncatedByPaywall}) => {
  if (viviEmbedName === 'paywall-header') {
    return (
      <Paywall
        isTruncatedByPaywall={isTruncatedByPaywall}
        imgMobile={imgMobile}
        imgDesktop={imgDesktop}
        imgMobileDark={imgMobileDark}
        imgDesktopDark={imgDesktopDark}
      />
    );
  }
  return (
    <>
      {' '}
      <Howto>
        <p>This is our interactive map component.</p>
        <ol>
          <li>
            Put a geojson file into <code>maptiles/projects/shortname</code>{' '}
          </li>
          <li>
            Run <code>npm run map:create-tiles</code>
          </li>
          <li>
            Customise the config file in this folder (<code>config.js</code>)
          </li>
        </ol>
      </Howto>
      <Map fullwidth={true} config={config} />
    </>
  );
};

export default App;
