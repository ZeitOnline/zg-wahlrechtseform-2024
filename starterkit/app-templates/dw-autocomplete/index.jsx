/*
Can’t have any exports here or hot reloading might break
*/

import {zonReactApp, viviParameterTypes} from 'starterkit';
import App from './App';

zonReactApp({
  App,
  viviEmbeds: [
    {
      name: 'datawrapper-autocomplete-<%chartId%>',
      props: [
        viviParameterTypes.static({
          name: 'display',
          value: 'dw-autocomplete',
        }),
        viviParameterTypes.string({
          name: `initialChartId`,
          label: `ID des initialen DW-Charts`,
        }),
        viviParameterTypes.string({
          name: `searchBarPlaceholder`,
          label: `Platzhalter für die Suchleiste`,
        }),
      ],
    },
  ],
});

export default App;
