import {
  useCallback,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';
import {useGesture} from '@use-gesture/react';
import {bisector} from 'd3-array';

import {SUPPORTS_TOUCH} from 'core/utils/env';
export const ChartContext = createContext({});

function getValueFromBandScale(scale, value) {
  const eachBand = scale.step();
  const index = Math.floor(value / eachBand);
  return scale.domain()[index];
}

export function useChart() {
  return useContext(ChartContext);
}

export function useHover() {
  const {xScale, node, data, x: xGetter} = useChart();
  const [hoverProps, setHoverProps] = useState({});

  const {bisectorData, reversed} = useMemo(() => {
    let bisectorData = data;
    let reversed = false;
    if (xGetter(data[0]) > xGetter(data[data.length - 1])) {
      bisectorData = data.slice(0).reverse();
      reversed = true;
    }

    return {bisectorData, reversed};
  }, [data, xGetter]);

  const bbox = node?.getBoundingClientRect();

  const updateTooltip = useCallback(
    (event) => {
      if (!data.length || !bbox) {
        setHoverProps({});
      }

      const screenX = event.type === 'click' ? event.x : event.xy[0];
      const screenY = event.type === 'click' ? event.y : event.xy[1];

      const chartX = screenX - bbox.left; // Offset within container
      const chartY = screenY - bbox.top; // Offset within container

      const chartXDomainValue = xScale.bandwidth
        ? getValueFromBandScale(xScale, chartX)
        : xScale.invert(chartX);

      if (xScale.bandwidth && chartXDomainValue) {
        const dataIndex = data.findIndex(
          (d) => xGetter(d) === chartXDomainValue,
        );
        const dataItem = data[dataIndex];
        const finalX = xScale(xGetter(dataItem)) + xScale.bandwidth() / 2;

        return setHoverProps({
          screenX: screenX,
          screenY: screenY,
          chartOffsetX: bbox.left,
          chartOffsetY: bbox.top,
          chartX,
          chartY,
          x: finalX,
          data: dataItem,
          dataIndex,
        });
      }

      let dataIndex = bisector((d, x) => {
        return xGetter(d) - x;
      }).center(bisectorData, chartXDomainValue);
      dataIndex = Math.min(bisectorData.length - 1, dataIndex);

      const dataItem = bisectorData[dataIndex];
      if (reversed) {
        dataIndex = bisectorData.length - 1 - dataIndex;
      }

      const finalX = xScale(xGetter(dataItem));

      setHoverProps({
        screenX: screenX,
        screenY: screenY,
        chartOffsetX: bbox.left,
        chartOffsetY: bbox.top,
        chartX,
        chartY,
        x: finalX,
        data: dataItem,
        dataIndex,
      });
    },
    [data, xScale, bisectorData, reversed, xGetter, bbox],
  );

  const handleDragMove = useCallback(
    (event) => {
      updateTooltip(event);
    },
    [updateTooltip],
  );

  const handleHover = useCallback((event) => {
    if (!event.hovering) {
      setHoverProps({});
    }
  }, []);

  const handleDragEnd = useCallback(
    (event) => {
      if (SUPPORTS_TOUCH) {
        if (event.distance === 0) {
          updateTooltip(event);
          return;
        } else {
          setHoverProps({});
          return;
        }
      }
      setHoverProps({});
    },
    [updateTooltip],
  );

  useGesture(
    {
      onDrag: handleDragMove,
      onDragEnd: handleDragEnd,
      onMove: handleDragMove,
      onHover: handleHover,
    },
    {
      target: node,
    },
  );

  return hoverProps;
}
