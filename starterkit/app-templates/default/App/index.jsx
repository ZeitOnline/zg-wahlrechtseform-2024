import cx from 'classnames';

import cn from './index.module.scss';

function App() {
  return (
    <div className={cx(cn.container, 'x-content-column')}>
      <p className={cn.textPrimary}>text-primary</p>
      <p className={cn.textSecondary}>text-secondary</p>
      <p className={cn.textTertiary}>text-tertiary</p>
    </div>
  );
}

export default App;
