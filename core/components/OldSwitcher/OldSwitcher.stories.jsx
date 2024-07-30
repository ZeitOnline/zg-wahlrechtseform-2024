import {useState} from 'react';
import OldSwitcher from './index.jsx';

export default {
  title: 'Components/OldSwitcher',
  component: OldSwitcher,
};

const options = [
  {label: 'Eins', id: 1},
  {label: 'Zwo', id: 2},
  {label: 'Drei', id: 3},
  {label: 'Vier', id: 4},
];

export const Default = () => {
  const [active, setActive] = useState(options[0]?.id);

  return <OldSwitcher options={options} active={active} onChange={setActive} />;
};

const optionsWithColors = [
  {label: 'Eins', id: 1, background: '#FFB3CB', color: '#222'},
  {label: 'Zwo', id: 2, background: '#CCEEFF', color: '#222'},
  {label: 'Drei', id: 3, background: '#C6FFC4', color: '#222'},
  {label: 'Vier', id: 4, background: '#FFF5D6', color: '#222'},
];

export const WithColors = () => {
  const [active, setActive] = useState(options[0]?.id);

  return (
    <OldSwitcher
      options={optionsWithColors}
      active={active}
      onChange={setActive}
    />
  );
};

export const Small = () => {
  const [active, setActive] = useState(options[0]?.id);

  return (
    <OldSwitcher options={options} active={active} onChange={setActive} small />
  );
};
