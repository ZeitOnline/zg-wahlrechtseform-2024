import {useState} from 'react';
import Toggle from './index.jsx';

export default {
  title: 'Components/Toggle',
  component: Toggle,
};

export const Default = () => {
  const [checked, setChecked] = useState(false);

  return <Toggle checked={checked} onChange={setChecked} />;
};

export const Small = () => {
  const [checked, setChecked] = useState(false);

  return <Toggle checked={checked} onChange={setChecked} small />;
};

export const Disabled = () => {
  return <Toggle disabled />;
};
