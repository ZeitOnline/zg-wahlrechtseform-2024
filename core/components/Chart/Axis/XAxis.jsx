import {memo} from 'react';
import cx from 'classnames';

import {useChart} from '../hooks.js';
import {useTicks, figureOutTickLabel} from './utils.js';
import cn from './index.module.scss';

function XAxis({
  // can be a number, an array of values, or
  // an array of {value: <x value>, text: <displayed text>}
  ticks: customTicks = 5,
  className,
  // can be a format string or a function
  format = 'dateWithoutYear',
  label = true,
  line = true,
}) {
  const {xScale, yScale, margin} = useChart();
  const [ticks, byHand] = useTicks(customTicks, xScale);
  const tickElements = ticks.map((d, i) => {
    let showLabel = label;
    if (!byHand) {
      if (xScale(d) + margin.left < 20) {
        showLabel = false;
      }
    }

    const labelText = figureOutTickLabel(d, format, i);

    let value = Object.hasOwn(d, 'value') ? d.value : d;

    return (
      <g
        transform={`translate(${xScale(value)},0)`}
        className={cx(cn.tick, cn.x, className)}
        key={d.text ? d.text : d}
      >
        {line && <line x1={0} x2={0} y1={0} y2={5} />}
        {showLabel && <text dy="1.3em">{labelText}</text>}
      </g>
    );
  });

  if (!tickElements.length) {
    return null;
  }

  return <g transform={`translate(0, ${yScale.range()[0]})`}>{tickElements}</g>;
}

export default memo(XAxis);
