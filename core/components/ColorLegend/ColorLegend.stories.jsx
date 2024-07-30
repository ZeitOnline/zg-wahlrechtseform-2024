import {useMemo} from 'react';
import ColorLegend from './index.jsx';

export default {
  title: 'Components/ColorLegend',
  component: ColorLegend,
};

export const Default = () => {
  const colors = useMemo(
    () => [
      {value: -Infinity, color: '#90a6ca'},
      {value: 10, color: '#b6becb', label: '10'},
      {value: 12.5, color: '#c8cac8'},
      {value: 15, color: '#dbd7c2'},
      {value: 17.5, color: '#ede4b8'},
      {value: 20, color: '#ffd787', label: '20'},
      {value: 22.5, color: '#ffba6b'},
      {value: 25, color: '#fc9e53'},
      {value: 27.5, color: '#f28342'},
      {value: 30, color: '#d34f32', label: '30'},
      {value: 32.5, color: '#bf3833'},
      {value: 35, color: '#a72137'},
      {value: 37.5, color: '#8c0c3e'},
      {value: 40, color: '#470055', label: '40°C'},
    ],
    [],
  );

  return <ColorLegend {...{colors}} title="Temperatur" />;
};

export const AsGradient = () => {
  const colors = useMemo(
    () => [
      {value: -Infinity, color: '#90a6ca'},
      {value: 10, color: '#b6becb'},
      {value: 12.5, color: '#c8cac8'},
      {value: 15, color: '#dbd7c2'},
      {value: 17.5, color: '#ede4b8'},
      {value: 20, color: '#ffd787'},
      {value: 22.5, color: '#ffba6b'},
      {value: 25, color: '#fc9e53'},
      {value: 27.5, color: '#f28342'},
      {value: 30, color: '#d34f32'},
      {value: 32.5, color: '#bf3833'},
      {value: 35, color: '#a72137'},
      {value: 37.5, color: '#8c0c3e'},
      {value: 40, color: '#470055'},
    ],
    [],
  );

  return (
    <ColorLegend
      {...{colors}}
      title="Temperatur"
      asGradient
      height="0.5em"
      minLabel="10"
      maxLabel="40°C"
    />
  );
};

export const AsCircles = () => {
  const colors = useMemo(
    () => [
      {color: '#90a6ca'},
      {color: '#c8cac8'},
      {color: '#ede4b8'},
      {color: '#ffba6b'},
      {color: '#f28342'},
      {color: '#bf3833'},
      {color: '#8c0c3e'},
    ],
    [],
  );

  return (
    <ColorLegend {...{colors}} minLabel="Kalt" maxLabel="Heiß" asCircles />
  );
};
