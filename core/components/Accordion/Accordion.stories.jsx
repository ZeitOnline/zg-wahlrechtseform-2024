import {useMemo, useState} from 'react';
import Accordion from './index.jsx';

export default {
  title: 'Components/Accordion',
  component: Accordion,
};

export const Default = () => {
  const options = useMemo(
    () => [
      {
        id: 'first',
        title: 'Bundesland Berlin',
        icon: (
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Coat_of_arms_of_Berlin.svg/80px-Coat_of_arms_of_Berlin.svg.png"
            alt=""
          />
        ),
        children: <div>Hier kann man weitere Dinge darstellen</div>,
      },
      {
        id: 'second',
        title: 'Bundesland Brandenburg',
        icon: (
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/DEU_Brandenburg_COA.svg/80px-DEU_Brandenburg_COA.svg.png"
            alt=""
          />
        ),
        children: <div>Hier kann man weitere Dinge darstellen</div>,
      },
      {
        id: 'third',
        title: 'Nordrhein-Westfalen',
        icon: (
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Coat_of_arms_of_North_Rhine-Westphalia.svg/80px-Coat_of_arms_of_North_Rhine-Westphalia.svg.png"
            alt=""
          />
        ),
        children: <div>Hier kann man weitere Dinge darstellen</div>,
      },
    ],
    [],
  );

  const [selected, setSelected] = useState(options[0]);

  return (
    <div className="article__item">
      <Accordion
        options={options}
        selected={selected}
        setSelected={setSelected}
      />
    </div>
  );
};
