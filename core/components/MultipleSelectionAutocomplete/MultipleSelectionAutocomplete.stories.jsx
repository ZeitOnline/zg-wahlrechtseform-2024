import {useMemo, useState} from 'react';

import MultipleSelectionAutocomplete from './index.jsx';

export default {
  title: 'Components/MultipleSelectionAutocomplete',
  component: MultipleSelectionAutocomplete,
  // parameters: {actions: {argTypesRegex: '^on.*'}},
};

export const Default = () => {
  const [result, setResult] = useState(null);
  const data = useMemo(
    () => [
      {
        label: 'Apples',
        itemLabel: 'BeautifulApples',
        value: 'apples',
        data: {name: 'Apples'},
      },
      {
        label: 'Bananas',
        itemLabel: 'BeautifulBananas',
        value: 'bananas',
        data: {name: 'Bananas'},
      },
      {
        label: 'Cherries',
        itemLabel: 'BeautifulCherries',
        value: 'cherries',
        data: {name: 'Cherries'},
      },
    ],
    [],
  );

  return (
    <MultipleSelectionAutocomplete
      data={data}
      onChange={setResult}
      initiallySelectedValues={['apples']}
    />
  );
};
