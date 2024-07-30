import {useState} from 'react';
import Select from './index.jsx';

export default {
  title: 'Components/Select',
  component: Select,
};

const bundeslaender = [
  {label: 'Ganz Deutschland'},
  {label: 'Baden-Württemberg'},
  {label: 'Bayern'},
  {label: 'Berlin'},
  {label: 'Brandenburg'},
  {label: 'Bremen'},
  {label: 'Hamburg'},
  {label: 'Hessen'},
  {label: 'Mecklenburg-Vorpommern'},
  {label: 'Niedersachsen'},
  {label: 'Nordrhein-Westfalen'},
  {label: 'Rheinland-Pfalz'},
  {label: 'Saarland'},
  {label: 'Sachsen-Anhalt'},
  {label: 'Sachsen'},
  {label: 'Schleswig-Holstein'},
  {label: 'Thüringen'},
];

export const Default = () => {
  const [bundesland, setBundesland] = useState(null);

  return (
    <Select
      options={bundeslaender}
      selected={bundesland}
      onSelect={setBundesland}
      placeholder="Bitte wählen Sie…"
    />
  );
};

export const WithResetValue = () => {
  const [bundesland, setBundesland] = useState(bundeslaender[0]);

  return (
    <Select
      options={bundeslaender}
      selected={bundesland}
      resetValue={bundeslaender[0]}
      onSelect={setBundesland}
    />
  );
};
