import {useMemo} from 'react';
import {extent} from 'd3-array';
import {scaleLinear, scaleTime} from 'd3-scale';
import PropTypes from 'prop-types';

import {ChartContext} from './hooks.js';
import {getXGetter, getYGetter} from './utils.js';
import useSize from 'core/hooks/useSize.js';

function Chart({
  data: chartData,
  x,
  y,
  xExtent: customXExtent,
  yExtent: customYExtent,
  xScale: customXScale,
  yScale: customYScale,
  children,
  width: customWidth,
  height: customHeight,
  margin: customMargin,
  nice = false,
  className,
  style,
  id,
}) {
  const margin = useMemo(() => {
    return {
      top: 3,
      bottom: 3,
      left: 3,
      right: 3,
      ...customMargin,
    };
  }, [customMargin]);
  const [useSizeRef, measuredDimensions, node] = useSize();

  const dimensions = useMemo(() => {
    return {
      width: customWidth || measuredDimensions.width,
      height: customHeight || measuredDimensions.height,
    };
  }, [customHeight, customWidth, measuredDimensions]);

  const data = useMemo(
    () => (chartData && chartData.length ? chartData : []),
    [chartData],
  );

  const xGetter = useMemo(() => getXGetter(data, x), [data, x]);
  const yGetter = useMemo(() => getYGetter(data, y), [data, y]);

  const scales = useMemo(() => {
    let xScale = customXScale;
    let yScale = customYScale;

    if (!xScale) {
      xScale = scaleTime();
      let xExtent = (customXExtent || []).slice();
      if (xExtent.length < 2 || xExtent.includes(null)) {
        extent(data, xGetter).forEach((d, index) => {
          if (
            xExtent[index] === null ||
            typeof xExtent[index] === 'undefined'
          ) {
            xExtent[index] = d;
          }
        });
      }
      xScale.domain(xExtent);
    }

    if (!yScale) {
      yScale = scaleLinear();
      let yExtent = (customYExtent || [0]).slice();
      if (
        (yExtent.length < 2 || yExtent.includes(null)) &&
        data &&
        data.length
      ) {
        extent(data, yGetter).forEach((d, index) => {
          if (
            yExtent[index] === null ||
            typeof yExtent[index] === 'undefined'
          ) {
            yExtent[index] = d;
          }
        });
      }
      if (yExtent.length === 2 && !yExtent.includes(null)) {
        yScale.domain(yExtent);
      }
    }

    if (dimensions.width) {
      xScale.range([margin.left, dimensions.width - margin.right]);
    }
    if (dimensions.height) {
      yScale.range([dimensions.height - margin.bottom, margin.top]);
    }
    yScale.nice(nice);

    return {
      xScale,
      yScale,
    };
  }, [
    data,
    dimensions,
    customXExtent,
    customYExtent,
    customXScale,
    customYScale,
    margin,
    nice,
    xGetter,
    yGetter,
  ]);

  const contextValue = useMemo(() => {
    return {
      data,
      dimensions,
      margin,
      node,
      x: xGetter,
      y: yGetter,
      ...scales,
      id,
    };
  }, [data, dimensions, scales, margin, node, xGetter, yGetter, id]);

  return (
    <div {...{style, className}} ref={useSizeRef}>
      <ChartContext.Provider value={contextValue}>
        {children}
      </ChartContext.Provider>
    </div>
  );
}

Chart.propTypes = {
  data: PropTypes.array,
  x: PropTypes.func,
  y: PropTypes.func,
  xExtent: PropTypes.array,
  yExtent: PropTypes.array,
  xScale: PropTypes.func,
  yScale: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  width: PropTypes.number,
  height: PropTypes.number,
  margin: PropTypes.shape({
    top: PropTypes.number,
    bottom: PropTypes.number,
    left: PropTypes.number,
    right: PropTypes.number,
  }),
  nice: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
  id: PropTypes.string,
};

export default Chart;
