import {useState} from 'react';
import Checkbox from './index.jsx';

export default {
  title: 'Components/Checkbox',
  component: Checkbox,
};

export const Default = () => {
  const [checked, setChecked] = useState(false);

  return <Checkbox checked={checked} onChange={setChecked} label="Erklärung" />;
};

export const Disabled = () => {
  return <Checkbox checked disabled label="Erklärung" />;
};
