import {useState} from 'react';
import Stepper from './index.jsx';

export default {
  title: 'Components/Stepper',
  component: Stepper,
};

export const Default = () => {
  const [value, setValue] = useState(1);

  return <Stepper value={value} onChange={setValue} min={0} />;
};

export const WithSuffix = () => {
  const [value, setValue] = useState(1);

  return (
    <Stepper
      value={value}
      onChange={setValue}
      min={0}
      suffix={{singular: ' Kind', plural: ' Kinder'}}
      style={{width: '180px'}}
    />
  );
};

export const Disabled = () => {
  const [value, setValue] = useState(1);

  return <Stepper value={value} onChange={setValue} disabled />;
};

export const Small = () => {
  const [value, setValue] = useState(1);

  return <Stepper value={value} onChange={setValue} small />;
};

export const WithDecimals = () => {
  const [value, setValue] = useState(1);

  return (
    <Stepper
      value={value}
      onChange={setValue}
      step={0.1}
      style={{width: '7.5em'}}
      numberFormat=".1f"
    />
  );
};
