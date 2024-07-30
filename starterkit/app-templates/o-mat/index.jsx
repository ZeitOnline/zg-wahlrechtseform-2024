/*
Can’t have any exports here or hot reloading might break
*/

import {zonReactApp} from 'starterkit';
import App from './App';

zonReactApp({
  App,
  viviEmbeds: [
    {
      name: 'starterkit-o-mat',
    },
  ],
});

export default App;
