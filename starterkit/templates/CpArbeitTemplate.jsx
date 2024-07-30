import {useContext} from 'react';

import rawHtml from './raw/cp-arbeit.html?raw';

import {replaceComments} from './utils.js';
import {ViviContext} from './FakeViviProvider.jsx';

function CpArbeitTemplate({
  aufmacher,
  knopf,
  duo,
  disablePaywallFooter = true,
}) {
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
      duo: duo ? (
        <ViviContext.Provider value={viviContextValue}>
          {duo}
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

export default CpArbeitTemplate;
