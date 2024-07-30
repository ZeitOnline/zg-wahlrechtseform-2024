/*
Can’t have any exports here or hot reloading might break
*/

import {zonReactApp} from 'starterkit';
import App from './App';

zonReactApp({
  App,
  viviEmbeds: [
    {
      name: '0307-hoflaeden-map',
      props: [],
      viviThirdPartyVendors: ['mapbox'],
    },
  ],
});

export default App;
