import cx from 'classnames';
import {useState, useEffect} from 'react';
import Autocomplete from 'core/components/Autocomplete';
import Datawrapper from 'core/components/Datawrapper';
import cn from './index.module.scss';
import dataUrl from 'src/static/dw-autocomplete/<%chartId%>.json?url';

function App({initialChartId, searchBarPlaceholder}) {
  const [result, setResult] = useState(null);
  const [dwId, setDwId] = useState(initialChartId || null);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (result) {
      setDwId(result.data.key);
    }
  }, [result]);

  useEffect(() => {
    const fetchData = async () => {
      const raw = await fetch(dataUrl);
      const rawData = await raw.json();
      const data = rawData.map((d) => ({...d, data: d.data}));
      setData(data);
      if (!initialChartId || initialChartId === '') setDwId(data.data.key);
      console.log('dwId :>> ', data.data.key);
    };
    fetchData();
  }, [initialChartId]);

  if (!data) {
    return null;
  }

  return (
    <div className={cx(cn.container, 'x-content-column')}>
      <Autocomplete
        data={data}
        onChange={setResult}
        selected={result}
        placeholder={searchBarPlaceholder}
        showOptionsAtEmptyQuery
      />
      <Datawrapper id={dwId} />
    </div>
  );
}

export default App;
