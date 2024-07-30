import cx from 'classnames';
import {useContext} from 'react';

import rawFullwidthHtml from './raw/fullwidth-embed.html?raw';
import rawPaywallOverlayHtml from './raw/paywall-overlay.html?raw';
import {replaceComments} from './utils.js';
import {ViviContext} from './FakeViviProvider.jsx';

function ArticleTemplateFrame({
  children,
  title = 'ZON',
  header,
  kicker = 'Spitzmarke',
  teaser = 'Lorem ipsum dolor sit amet, consectetur adipisici elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua.',
  fullwidth = false,
  forceDark = false,
  forceLight = false,
  html = null,
  disablePaywallFooter = true,
  className,
}) {
  let viviContextValue = useContext(ViviContext);
  viviContextValue = {...viviContextValue, pagetype: 'article'};
  const {paywall} = viviContextValue;

  let fixedChildren = <>{children}</>;
  if (paywall) {
    fixedChildren = (
      <div dangerouslySetInnerHTML={{__html: rawPaywallOverlayHtml}} />
    );
  }
  if (fullwidth) {
    fixedChildren = (
      <>
        <div dangerouslySetInnerHTML={{__html: rawFullwidthHtml}} />
        {fixedChildren}
      </>
    );
  }

  let newHtml = replaceComments({
    html,
    slots: {
      content: (
        <ViviContext.Provider value={{...viviContextValue}}>
          {fixedChildren}
        </ViviContext.Provider>
      ),
      header: header ? (
        <ViviContext.Provider value={{...viviContextValue}}>
          {header}
        </ViviContext.Provider>
      ) : null,
      title,
      kicker,
      teaser,
    },
  });

  if (disablePaywallFooter) {
    newHtml = newHtml.replace(
      'window.Zeit.paywallFooter',
      '//window.Zeit.paywallFooter',
    );
  }

  return (
    <html
      dangerouslySetInnerHTML={{
        __html: newHtml,
      }}
      lang="de"
      className={cx(
        className,
        forceDark
          ? 'color-scheme-dark'
          : forceLight
          ? 'color-scheme-light'
          : undefined,
      )}
    />
  );
}

export default ArticleTemplateFrame;
