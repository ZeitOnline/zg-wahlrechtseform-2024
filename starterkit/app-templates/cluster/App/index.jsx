import Map from './Components/Map';

import useDsv from 'core/hooks/useDsv';
import {cleanData, convertToGeoJSON} from './utils';

import config from './config.jsx';

const App = () => {
  let data = useDsv(config?.csvUrl);
  if (!data) {
    return null;
  }
  data = cleanData(data);
  if (typeof config?.cleanData === 'function') {
    data = config.cleanData(data);
  }
  data = convertToGeoJSON(data);
  return <Map data={data} config={config} />;
};

export default App;
