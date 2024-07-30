import {useMemo, memo} from 'react';
import {line, area, curveLinear, curveMonotoneX} from 'd3-shape';
import cx from 'classnames';

import {useChart} from './hooks.js';
import cn from './Line.module.scss';
import FormattedNumber from 'core/components/FormattedNumber';

function Line({
  data: customData,
  className,
  x: customX,
  y: customY,
  smooth = true,
  curveInterpolator = null,
  filter = null,
  showArea = false,
  classNameArea,
  showCircle = false,
  circleRadius = 3,
  classNameCircle,
  showPathLastValue = false,
  showLastValue = false,
  prefixLastValue = '',
  unitLabel = '',
  classNameLastValue = null,
  style = {},
  formatLastValue = '',
}) {
  const {xScale, yScale, x, y, data: defaultData} = useChart();

  const data = useMemo(() => {
    let finalData = customData || defaultData;
    if (filter) {
      finalData = finalData.filter(filter);
    }
    return finalData;
  }, [customData, defaultData, filter]);

  const linePath = useMemo(() => {
    if (!data || !xScale || !yScale) {
      return null;
    }

    const xGetter = customX || x;
    const yGetter = customY || y;

    return line()
      .defined((d) => yGetter(d) !== null)
      .x((d) => xScale(xGetter(d)))
      .y((d) => yScale(yGetter(d)))
      .curve(
        curveInterpolator
          ? curveInterpolator
          : smooth
          ? curveMonotoneX
          : curveLinear,
      )(data);
  }, [data, xScale, yScale, x, y, customX, customY, smooth, curveInterpolator]);

  const areaPath = useMemo(() => {
    if (!data || !xScale || !yScale || !showArea) {
      return null;
    }

    const xGetter = customX || x;
    const yGetter = customY || y;

    return area()
      .x((d) => xScale(xGetter(d)))
      .y0(yScale(0))
      .y1((d) => yScale(yGetter(d)))
      .curve(smooth ? curveMonotoneX : curveLinear)(data);
  }, [data, xScale, yScale, x, y, customX, customY, smooth, showArea]);

  const circlePosition = useMemo(() => {
    if (!data || !xScale || !yScale || !showCircle) {
      return null;
    }

    const xGetter = customX || x;
    const yGetter = customY || y;
    const lastDataPoint = data[data.length - 1];

    return {
      x: xScale(xGetter(lastDataPoint)),
      y: yScale(yGetter(lastDataPoint)),
    };
  }, [data, showCircle, xScale, yScale, customX, customY, x, y]);

  const lastValue = useMemo(() => {
    if (!showLastValue) {
      return null;
    }

    const xGetter = customX || x;
    const yGetter = customY || y;

    const lastDataPoint = data[data.length - 1];
    const lastYValue = yGetter(lastDataPoint);
    const xPos = xScale(xGetter(lastDataPoint));
    const yPos = yScale(lastYValue);
    const classes = cx(cn.lastValue, classNameLastValue);
    const lastValueLinePath = `M${xPos} -5 L${xPos} ${yPos}`;

    return (
      <g transform={`translate(${xPos},${yPos})`}>
        <text
          x={6}
          y={0}
          dy="0.32em"
          textAnchor="start"
          className={classes}
          data-x-role="outline"
        >
          {prefixLastValue} &thinsp;
          <FormattedNumber number={lastYValue} format={formatLastValue} />
          &thinsp;{unitLabel}
        </text>
        <text x={6} y={0} dy="0.32em" textAnchor="start" className={classes}>
          {prefixLastValue} &thinsp;
          <FormattedNumber number={lastYValue} format={formatLastValue} />
          &thinsp;{unitLabel}
        </text>
        {showPathLastValue && (
          <path className={cn.lastValueLine} d={lastValueLinePath} />
        )}
      </g>
    );
  }, [
    showLastValue,
    customX,
    x,
    customY,
    y,
    data,
    xScale,
    yScale,
    classNameLastValue,
    prefixLastValue,
    formatLastValue,
    unitLabel,
    showPathLastValue,
  ]);

  return (
    <>
      {showArea && <path d={areaPath} className={cx(cn.area, classNameArea)} />}
      <path d={linePath} className={cx(cn.line, className)} style={style} />
      {showCircle && circlePosition && (
        <circle
          cx={circlePosition.x}
          cy={circlePosition.y}
          r={circleRadius}
          className={classNameCircle}
        />
      )}
      {lastValue}
    </>
  );
}

export default memo(Line);
