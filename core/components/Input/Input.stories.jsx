import {useState} from 'react';
import Input from './index.jsx';

export default {
  title: 'Components/Input',
  component: Input,
};

export const Default = () => {
  const [value, setValue] = useState('');

  return (
    <Input value={value} onChange={(event) => setValue(event.target.value)} />
  );
};

export const Clearable = () => {
  const [value, setValue] = useState('');

  return (
    <Input
      onClear={() => setValue('')}
      value={value}
      onChange={(event) => setValue(event.target.value)}
    />
  );
};

export const ShowSearchIcon = () => {
  const [value, setValue] = useState('');

  return (
    <Input
      showSearchIcon
      value={value}
      onChange={(event) => setValue(event.target.value)}
    />
  );
};
