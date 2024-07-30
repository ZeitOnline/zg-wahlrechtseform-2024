import cn from './index.module.scss';
import Autocomplete from 'core/components/Autocomplete';
import {useMemo, useState} from 'react';
import useIsSSR from 'core/hooks/useIsSSR';
import Datawrapper from 'core/components/Datawrapper';
import {options} from './options';

// https://app.datawrapper.de/chart/ushGA/visualize#refine
const DW_ID = 'ushGA';

const defaultOption = {
  label: 'Deutschland',
  value: 'Deutschland',
  data: {name: 'Deutschland'},
};

function App({title, subtitle}) {
  const [result, setResult] = useState(defaultOption);
  const isSSR = useIsSSR();

  const autoCompleteOptions = useMemo(() => {
    return options.map((name) => ({
      label: name,
      value: name,
      data: {name},
    }));
  }, []);

  const onChange = (d) => {
    //////////////////////////////////////////
    // THIS IS WHERE THE MAGIC HAPPENS
    const viz = document.querySelector(
      `#datawrapper-vis-${DW_ID}>datawrapper-visualization`,
    );
    if (!viz) return;
    viz.patch('metadata.axes.column', d?.value || 'Deutschland');
    //////////////////////////////////////////

    setResult(d);
  };

  return (
    <div className={cn.container}>
      <h2 className="article__subheading article__item ">{title} </h2>
      <p className={cn.subtitle}>{subtitle}</p>
      <Autocomplete
        data={autoCompleteOptions || []}
        onChange={onChange}
        selected={result}
        placeholder="Suchen Sie nach anderen Ländern..."
        className={cn.autocomplete}
        showOptionsAtEmptyQuery={true}
      />
      {!isSSR && <Datawrapper id={DW_ID} />}
    </div>
  );
}

export default App;
