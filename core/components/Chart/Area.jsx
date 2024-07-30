import {useMemo, memo} from 'react';
import {area, curveLinear, curveMonotoneX} from 'd3-shape';
import cx from 'classnames';

import {useChart} from './hooks.js';
import cn from './Area.module.scss';

function Area({
  data: customData,
  className,
  x: customX,
  y: customY,
  y0: customY0,
  y1: customY1,
  smooth = true,
  filter = null,
}) {
  const {xScale, yScale, x, y: y0, data: defaultData} = useChart();

  const data = useMemo(() => {
    let finalData = customData || defaultData;
    if (filter) {
      finalData = finalData.filter(filter);
    }
    return finalData;
  }, [customData, defaultData, filter]);

  const areaPath = useMemo(() => {
    if (!data || !xScale || !yScale) {
      return null;
    }

    const y1 = () => yScale.domain()[0];

    const xGetter = customX || x;
    const y0Getter = customY0 || customY || y0;
    const y1Getter = customY1 || y1;

    return area()
      .x((d) => xScale(xGetter(d)))
      .y0((d) => yScale(y0Getter(d)))
      .y1((d) => yScale(y1Getter(d)))
      .curve(smooth ? curveMonotoneX : curveLinear)(data);
  }, [
    data,
    xScale,
    yScale,
    customX,
    x,
    customY0,
    customY,
    y0,
    customY1,
    smooth,
  ]);

  return <path d={areaPath} className={cx(cn.area, className)} />;
}

export default memo(Area);
