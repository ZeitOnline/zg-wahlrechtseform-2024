import cx from 'classnames';

import cn from './index.module.scss';

function Howto({children, className}) {
  return <div className={cx(cn.howto, className)}>{children}</div>;
}

export default Howto;
