/*
Can’t have any exports here or hot reloading might break
*/

import {zonReactApp, viviParameterTypes} from 'starterkit';
import App from './App';

zonReactApp({
  App,
  viviEmbeds: [
    {
      name: 'paywall-header',
      props: [
        viviParameterTypes.isTruncatedByPaywall(),
        viviParameterTypes.static({name: 'display', value: 'paywall'}),
      ],
    },
    {
      name: 'projectname-embed',
      props: [],
      viviThirdPartyVendors: ['mapbox'],
    },
  ],
});

export default App;
