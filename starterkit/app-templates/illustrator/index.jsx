/*
Can’t have any exports here or hot reloading might break
*/

import {zonReactApp} from 'starterkit';
import App from './App';

zonReactApp({
  App,
  viviEmbeds: [
    {
      name: 'PROJECT-embed',
      excludeJS: true,
      excludeStyles: true,
      props: [],
    },
  ],
});

export default App;
