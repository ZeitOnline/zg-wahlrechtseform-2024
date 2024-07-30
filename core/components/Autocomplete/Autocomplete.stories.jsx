import {useMemo, useState} from 'react';

import Autocomplete from './index.jsx';

export default {
  title: 'Components/Autocomplete',
  component: Autocomplete,
  // parameters: {actions: {argTypesRegex: '^on.*'}},
};

export const Default = () => {
  const [result, setResult] = useState(null);
  const data = useMemo(
    () => [
      {label: 'Apples', value: 'Apples', data: {name: 'Apples'}},
      {label: 'Bananas', value: 'Bananas', data: {name: 'Bananas'}},
      {label: 'Cherries', value: 'Cherries', data: {name: 'Cherries'}},
    ],
    [],
  );

  return <Autocomplete data={data} onChange={setResult} selected={result} />;
};
