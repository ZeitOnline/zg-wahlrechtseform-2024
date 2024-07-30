import cx from 'classnames';

import cn from './index.module.scss';
import Omat from './Omat';
import Howto from 'core/components/Howto';
/*
Create a Google sheet from data.tsv,
give it to the editors, make them fill it out,
copy paste into data.tsv
*/
import data from './data.tsv';

function App() {
  return (
    <>
      <Howto>
        <p>This is our o-mat component. It’s sort of like a quiz.</p>
        <ol>
          <li>Create a Google sheet from data.tsv</li>
          <li>Get someone to fill it out</li>
          <li>Copy paste into data.tsv</li>
          <li>Customise the design</li>
        </ol>
      </Howto>
      <div className={cx(cn.container, 'x-fullwidth--mobile')}>
        <Omat
          className={cn.omat}
          data={data}
          trackingId={'zg-starterkit-o-mat'}
        />
      </div>
    </>
  );
}

export default App;
