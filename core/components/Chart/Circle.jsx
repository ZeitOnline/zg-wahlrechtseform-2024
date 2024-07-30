import {memo} from 'react';

import {useChart} from './hooks.js';

function Circle({x, y, r, className, style = {}}) {
  const {xScale, yScale} = useChart();

  return (
    <circle
      cx={xScale(x)}
      cy={yScale(y)}
      r={r}
      style={style}
      className={className}
    />
  );
}

export default memo(Circle);
