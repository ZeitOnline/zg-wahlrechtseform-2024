/*
Can’t have any exports here or hot reloading might break
*/

import {zonReactApp, viviParameterTypes} from 'starterkit';
import App from './App';

zonReactApp({
  App,
  viviEmbeds: [
    {
      name: '"<%projectId%>-embed',
      props: [
        viviParameterTypes.string({
          name: `myString`,
          label: `Mein String`,
        }),
      ],
    },
  ],
});

export default App;
