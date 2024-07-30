import cx from 'classnames';

import {useChart} from './hooks.js';
import cn from './SVG.module.scss';

function SVG({className, children, addDimensions = true, ...rest}) {
  const {dimensions} = useChart();

  const dimensionProps = addDimensions ? dimensions : {};

  return (
    <svg className={cx(cn.container, className)} {...dimensionProps} {...rest}>
      {children}
    </svg>
  );
}

export default SVG;
