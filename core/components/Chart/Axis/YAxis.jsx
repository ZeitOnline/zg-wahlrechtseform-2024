import {memo} from 'react';
import cx from 'classnames';

import {useChart} from '../hooks.js';
import {useTicks} from './utils.js';
import {formatNumber} from 'core/components/FormattedNumber';
import cn from './index.module.scss';

function YAxis({
  ticks: customTicks = 5,
  className,
  label = true,
  line = true,
  inset = false,
  unitLabel = null,
  isFront = false,
  dy: customDy,
  hideZeroLabel = inset,
  axisLabel = null,
  shiftY = 0,
}) {
  const {xScale, yScale, margin} = useChart();
  const [ticks] = useTicks(customTicks, yScale);
  const width = Math.max(...xScale.range()) - Math.min(...xScale.range());
  const dx = inset ? null : -6;

  // Moves labels down or up.
  const dy = customDy || (inset ? '-0.25em' : '0.28em');

  const tickElements = ticks
    .sort((a, b) => a - b)
    .reverse()
    .map((d, index) => {
      return (
        <g
          transform={`translate(${shiftY}, ${yScale(d)})`}
          className={cx(cn.tick, cn.y, className, {[cn.inset]: inset})}
          key={index}
        >
          {line && <line x1={0} x2={width - shiftY} y1={0} y2={0} />}
          {label && !(hideZeroLabel && d === 0) && (
            <text className={cx({[cn.isFront]: isFront})} dx={dx} dy={dy}>
              {formatNumber(d)} {axisLabel && axisLabel}{' '}
              {index === 0 && unitLabel}
            </text>
          )}
        </g>
      );
    });

  if (!tickElements.length) {
    return null;
  }

  return <g transform={`translate(${margin.left}, 0)`}>{tickElements}</g>;
}

export default memo(YAxis);
