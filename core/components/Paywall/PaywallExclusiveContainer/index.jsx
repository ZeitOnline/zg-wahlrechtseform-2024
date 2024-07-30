import cx from 'classnames';

import cn from './index.module.scss';
import ZPlus from 'src/static/images/zplus.svg?react';

function PaywallExclusiveContainer({className}) {
  return (
    <div className={cx(cn.exclusiveContainer, className)}>
      <div className={cn.zPlusBadge}>
        <ZPlus />
      </div>
      <span className={cn.exclusiveText}>Exklusiv für Abonnenten</span>
    </div>
  );
}

export default PaywallExclusiveContainer;
