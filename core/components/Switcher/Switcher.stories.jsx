import {useState} from 'react';
import Switcher from './index.jsx';

export default {
  title: 'Components/Switcher',
  component: Switcher,
};

export const Default = () => {
  const options = [
    {label: 'Eins', id: 1},
    {label: 'Zwo', id: 2},
    {label: 'Drei', id: 3},
    {label: 'Vier', id: 4},
  ];

  const [active, setActive] = useState(options[0]?.id);

  return <Switcher options={options} active={active} onChange={setActive} />;
};

export const WithColors = () => {
  const optionsWithColors = [
    {label: 'Eins', id: 1, background: '#FFB3CB', color: 'red'},
    {label: 'Zwo', id: 2, background: '#CCEEFF', color: 'blue'},
    {label: 'Drei', id: 3, background: '#C6FFC4', color: 'darkgreen'},
    {label: 'Vier', id: 4, background: '#FFF5D6', color: 'brown'},
  ];

  const [active, setActive] = useState(optionsWithColors[0]?.id);

  return (
    <Switcher
      options={optionsWithColors}
      active={active}
      onChange={setActive}
    />
  );
};

export const Small = () => {
  const options = [
    {label: 'Eins', id: 1},
    {label: 'Zwo', id: 2},
    {label: 'Drei', id: 3},
    {label: 'Vier', id: 4},
  ];

  const [active, setActive] = useState(options[0]?.id);

  return (
    <Switcher options={options} active={active} onChange={setActive} small />
  );
};

export const WithSomeDisabled = () => {
  const options = [
    {label: 'Eins', id: 1},
    {label: 'Zwo', id: 2},
    {label: 'Drei', id: 3, disabled: true},
    {label: 'Vier', id: 4, disabled: true},
  ];

  const [active, setActive] = useState(options[0]?.id);

  return <Switcher options={options} active={active} onChange={setActive} />;
};
