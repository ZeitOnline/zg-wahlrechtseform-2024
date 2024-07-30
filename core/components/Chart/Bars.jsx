import {useMemo, memo} from 'react';
import cx from 'classnames';

import {useChart} from './hooks.js';
import cn from './Bars.module.scss';
import {scaleBand} from 'd3-scale';

function Bar({
  data: customData,
  highlight,
  highlightClass,
  incompleteClass,
  style,
  className,
  minHeight = 0,
  x: customX,
  y: customY,
  y0: customY0,
  y1: customY1,
  padding = 0.1,
  width = null,
  filter = null,
  height: customHeight = null,
}) {
  const {xScale, yScale, x, y: y0, data: defaultData} = useChart();
  const data = useMemo(() => {
    let finalData = customData || defaultData;
    if (filter) {
      finalData = finalData.filter(filter);
    }
    return finalData;
  }, [customData, defaultData, filter]);

  const y1 = () => yScale.domain()[0];

  const xGetter = customX || x;
  const y0Getter = customY0 || customY || y0;
  const y1Getter = customY1 || y1;

  const {finalScale, finalWidth, xOffset} = useMemo(() => {
    if (width) {
      return {
        finalScale: xScale,
        finalWidth: width,
        xOffset: width >= 2 ? width * -0.5 : 0,
      };
    } else {
      let finalScale = scaleBand()
        .domain(data.map((d) => xGetter(d)))
        .range(xScale.range())
        .paddingInner(padding);

      return {
        finalScale,
        finalWidth: finalScale.bandwidth(),
        xOffset: 0,
      };
    }
  }, [data, padding, width, xGetter, xScale]);

  const bars = data.map((d, index) => {
    const isHighlight =
      new Date(highlight).setHours(0, 0, 0, 0) ===
      new Date(d.date).setHours(0, 0, 0, 0);
    // const isMinHeight = minHeight === 1 && y0Getter(d) === 0;
    const y = yScale(y0Getter(d));
    const y1 = yScale(y1Getter(d));
    const height = Math.max(customHeight || y1 - y, minHeight);

    return (
      <rect
        style={style}
        className={cx(cn.bar, className, {
          [highlightClass]: isHighlight,
          [incompleteClass]: d.incomplete,
        })}
        fillOpacity={typeof d.fillOpacity !== 'undefined' ? d.fillOpacity : 1}
        height={height}
        width={finalWidth}
        x={finalScale(xGetter(d)) + xOffset}
        y={height === minHeight ? y - minHeight : y}
        key={index}
        mask={d.mask}
      />
    );
  });

  return <g>{bars}</g>;
}

export default memo(Bar);
