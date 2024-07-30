import cx from 'classnames';

import {useCreateStoreWithHydrationData} from './useStore';
import cn from './index.module.scss';
import Headline from 'core/components/Headline';
import Settings from './Components/Settings.jsx';
import Card, {CardContainer} from 'core/components/Card';
import Apps from './Components/Apps';
import Arrow from 'icons/arrow-right.svg?react';

function App() {
  return (
    <div className={cx(cn.container, 'x-content-column')}>
      <Headline>ZON-Starterkit</Headline>
      <ul className={cn.links}>
        <li>
          <a href="https://infographics.zeit.de/storybook/">
            <Arrow />
            Doku / Storybook
          </a>
        </li>
        <li>
          <a href="https://github.com/ZeitOnline/zg-starterkit">
            <Arrow />
            Repo
          </a>
        </li>
      </ul>

      <CardContainer tagName="ul" className={cn.cards}>
        <Card tagName="li">
          <Settings />
        </Card>
        <Card tagName="li">
          <Apps />
        </Card>
      </CardContainer>
    </div>
  );
}

function StoreWrapper({configData}) {
  useCreateStoreWithHydrationData(configData);
  return <App />;
}

export default StoreWrapper;
