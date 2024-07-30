import {useMemo, useState} from 'react';
import Range from './index.jsx';

export default {
  title: 'Components/Range',
  component: Range,
};

export const Default = () => {
  const [value, setValue] = useState(5);

  return (
    <Range value={value} onChange={setValue} min={0} max={20} step={0.5} />
  );
};

export const WithTooltip = () => {
  const [value, setValue] = useState(18);

  return (
    <Range
      value={value}
      onChange={setValue}
      min={0}
      max={20}
      step={0.5}
      showTooltip
      numberFormat=".1f"
    />
  );
};

export const Colored = () => {
  const [value, setValue] = useState(5);

  return (
    <Range
      value={value}
      onChange={setValue}
      min={0}
      max={20}
      step={0.5}
      thumbColor="blue"
      trackColor="red"
      height="25px"
    />
  );
};

export const WithLowerAndUpper = () => {
  const [values, setValues] = useState([5, 10]);

  return (
    <Range
      value={values}
      onChange={setValues}
      min={0}
      max={20}
      step={0.5}
      lowerColor="green"
      upperColor="yellow"
      showTooltip
      numberFormat=".1f"
    />
  );
};

export const Disabled = () => {
  const [value, setValue] = useState(5);

  return <Range value={value} onChange={setValue} min={0} max={20} disabled />;
};

export const NonLinear = () => {
  const [index, setIndex] = useState(5);
  const [length, value] = useMemo(() => {
    const values = [1, 2, 3, 4, 5, 10, 20, 50, 100];
    return [values.length, values[index]];
  }, [index]);

  return (
    <Range
      value={index}
      onChange={setIndex}
      min={0}
      max={length - 1}
      showTooltip
      tooltipValue={value}
    />
  );
};
