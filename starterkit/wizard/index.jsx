/*
Can’t have any exports here or hot reloading might break
*/

import {zonReactApp, loadJSON} from 'starterkit';
import App from './App';

zonReactApp({
  App,
  staticIncludes: {},
  getPropsForStaticIncludes: async () => {
    const starterkitConfig = await loadJSON(
      'http://localhost:3000/api/wizard/starterkit-config',
    );

    return {
      configData: {starterkitConfig},
    };
  },
});

export default App;
