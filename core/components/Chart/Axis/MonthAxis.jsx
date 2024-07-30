import {memo} from 'react';
import cx from 'classnames';

import {useChart} from '../hooks.js';
import {formatDate} from 'core/components/FormattedDateTime';
import {timeMonth} from 'd3-time';
import cn from './index.module.scss';

const shortFormatOverrides = {
  0: 'Jan',
  1: 'Feb',
  2: 'Mär',
  3: 'Apr',
  4: 'Mai',
  5: 'Jun',
  6: 'Jul',
  7: 'Aug',
  8: 'Sep',
  9: 'Okt',
  10: 'Nov',
  11: 'Dez',
};

function MonthAxis({
  className,
  // can be a format string or a function
  format = '%B',
  label = true,
  line = true,
}) {
  const {xScale, yScale} = useChart();
  let ticks = [];
  if (xScale && xScale.domain()) {
    ticks = timeMonth.range(...xScale.domain());
  }

  const tickElements = ticks.map((d, i) => {
    let showLabel = label;

    let labelText;
    if (typeof format === 'function') {
      labelText = format(d, i);
    } else if (format === 'short') {
      labelText = formatDate({datetime: d, format: '%b'});
      const month = d.getMonth();
      if (month in shortFormatOverrides) {
        labelText = shortFormatOverrides[month];
      } else {
        labelText += '.';
      }
    } else {
      labelText = formatDate({datetime: d, format});

      if (format === '%b' && labelText !== 'Mai') {
        labelText += '.';
      }
    }
    const x = xScale(d);
    let labelElement = null;
    if (showLabel) {
      let nextLabelXOffset = 0;
      if (i < ticks.length - 1) {
        nextLabelXOffset = xScale(ticks[i + 1]) - x;
      } else {
        nextLabelXOffset = 15;
        // nextLabelXOffset = (xScale(ticks[i - 1]) - x) * -0.8;
      }
      if (nextLabelXOffset > 25) {
        labelElement = (
          <text x={x + nextLabelXOffset / 2} dy="1.3em">
            {labelText}
          </text>
        );
      } else if (i % 2 === 0) {
        labelElement = (
          <text x={x + nextLabelXOffset / 2} dy="1.3em">
            {labelText}
          </text>
        );
      }
    }

    return (
      <g className={cx(cn.tick, cn.x, className)} key={d}>
        {line && <line x1={x} x2={x} y1={0} y2={5} />}
        {labelElement}
      </g>
    );
  });

  if (!tickElements.length) {
    return null;
  }

  return <g transform={`translate(0, ${yScale.range()[0]})`}>{tickElements}</g>;
}

export default memo(MonthAxis);
