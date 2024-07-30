import {useContext} from 'react';

import rawHtml from './raw/hp.html?raw';

import {replaceComments} from './utils.js';
import {ViviContext} from './FakeViviProvider.jsx';

function CpTemplate({aufmacher, knopf, miau, disablePaywallFooter = true}) {
  let viviContextValue = useContext(ViviContext);
  viviContextValue = {...viviContextValue, paywall: false, pagetype: 'cp'};

  let newHtml = replaceComments({
    html: rawHtml,
    slots: {
      aufmacher: aufmacher ? (
        <ViviContext.Provider value={viviContextValue}>
          {aufmacher}
        </ViviContext.Provider>
      ) : null,
      knopf: knopf ? (
        <ViviContext.Provider value={viviContextValue}>
          {knopf}
        </ViviContext.Provider>
      ) : null,
      miau: miau ? (
        <ViviContext.Provider value={viviContextValue}>
          {miau}
        </ViviContext.Provider>
      ) : null,
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
    />
  );
}

export default CpTemplate;
