import {line} from 'd3-shape';
import {scaleTime, scaleLinear} from 'd3-scale';
import {extent} from 'd3-array';
import cx from 'classnames';

import cn from './Chart.module.scss';
import FormattedNumber from 'core/components/FormattedNumber';
import {getStroke, translate, getChangeSign} from './utils';
import {getChartData, getMeanChartData} from './chartUtils';
import XAxis from './XAxis';
import useIsDarkMode from 'core/hooks/useIsDarkMode';
import useDimensions from 'core/hooks/useDimensions';

const margin = {
  top: 70,
  right: 60,
  bottom: 15,
  left: 53,
};

const noDataMargin = {
  top: 70,
  right: 60,
  bottom: 0,
  left: 30,
};

const getPathComponents = (data, xScale, yScale, colorScale) => {
  if (!data) {
    return {};
  }
  const segments = data.reduce((res, curr, i, all) => {
    const next = all[i + 1];
    if (next && next.hasAnyData) {
      res.push([curr, next]);
    }
    return res;
  }, []);

  const circles = data
    .filter((d) => d.hasAnyData)
    .map((d) => {
      return [xScale(d.date), yScale(d.value), colorScale(d.value)];
    });
  const firstValue = data.find((d) => d.hasAnyData);

  const lastValue = data
    .slice(0)
    .reverse()
    .find((d) => d.hasAnyData);
  const lastValueFill = colorScale(lastValue.value);

  const showFirstValue =
    typeof firstValue !== 'undefined' && firstValue.date !== lastValue.date;

  const dataMarkers = data.filter((d) => !d.hasAnyData || !d.hasEnoughData);

  return {
    segments,
    circles,
    firstValue,
    lastValue,
    lastValueFill,
    showFirstValue,
    dataMarkers,
  };
};

const defaultChartColors = {
  light: ['#000'],
  dark: ['#fff'],
};

const TooltipChart = ({
  noData,
  meanData: meanChartData,
  isStatic,
  data: dataFromFeature,
  dataAccessKey,
  meanLabel = '⌀',
  chartMaxY,
  chartMinY,
  chartBufferY,
  chartTitle = null,
  chartColors = defaultChartColors,
  chartNumberFormat = '',
  chartNumberSuffix = '',
  toggleIndex,
  comparisonYearsBefore,
  years,
}) => {
  const isDarkMode = useIsDarkMode();
  const [containerRef, {width: containerWidth}] = useDimensions();

  const outerHeight = 210;

  const data = getChartData(
    dataFromFeature,
    dataAccessKey,
    toggleIndex,
    comparisonYearsBefore,
    years,
  );

  const dataAvailable = data.some((d) => d.hasAnyData);

  if (!data.length) {
    return null;
  }

  const marginsToUse = dataAvailable ? margin : noDataMargin;
  const width =
    containerWidth - (isStatic ? 97 : marginsToUse.right) - marginsToUse.left;
  const height = outerHeight - marginsToUse.top - marginsToUse.bottom;

  const meanData = meanChartData
    ? getMeanChartData(
        meanChartData[toggleIndex],
        dataFromFeature,
        dataAccessKey,
        toggleIndex,
        years,
      )
    : null;

  const xDomain = [data[0].date, data[data.length - 1].date];
  let dataDrivenYDomain = extent(data, (d) => d.value);
  if (meanData) {
    const meanDataDrivenYDomain = extent(meanData, (d) => d.value);
    dataDrivenYDomain = [
      Math.min(dataDrivenYDomain[0], meanDataDrivenYDomain[0]),
      Math.max(dataDrivenYDomain[1], meanDataDrivenYDomain[1]),
    ];
  }
  let yDomain = [];
  if (chartBufferY) {
    yDomain = [
      dataDrivenYDomain[0] - chartBufferY,
      dataDrivenYDomain[1] + chartBufferY,
    ];
  } else {
    yDomain = [
      chartMinY || dataDrivenYDomain[0],
      chartMaxY || dataDrivenYDomain[1],
    ];
  }
  const xScale = scaleTime().domain(xDomain).range([0, width]);
  const yScale = scaleLinear().domain(yDomain).range([height, 0]);

  if (!dataAvailable) {
    return (
      <div className={cx(cn.chartContainer, cn.noData)}>
        <svg className={cn.chart} width={containerWidth} height={outerHeight}>
          <g
            transform={translate(marginsToUse.left, marginsToUse.top)}
            style={{opacity: 0.5}}
          >
            <XAxis data={data} height={height} xScale={xScale} />
          </g>
        </svg>
        <div className={cn.label} style={{}}>
          {noData || 'Keine Daten vorhanden'}
        </div>
      </div>
    );
  }

  const _chartColors = isDarkMode ? chartColors.dark : chartColors.light;

  const colorScale = scaleLinear()
    .domain(_chartColors.filter((_, i) => i % 2 !== 0))
    .clamp(true)
    .range(_chartColors.filter((_, i) => i % 2 === 0));

  const pathgen = line()
    .x((d) => xScale(d.date))
    .y((d) => yScale(d.value))
    .defined((d) => d.hasAnyData);

  const {
    segments,
    circles,
    firstValue,
    lastValue,
    lastValueFill,
    showFirstValue,
    dataMarkers,
  } = getPathComponents(data, xScale, yScale, colorScale);

  const {
    segments: meanSegments,
    circles: meanCircles,
    firstValue: meanFirstValue,
    lastValue: meanLastValue,
    lastValueFill: meanLastValueFill,
    showFirstValue: meanShowFirstValue,
    dataMarkers: meanDataMarkers,
  } = getPathComponents(meanData, xScale, yScale, colorScale);

  const maskId = 'circleMask';

  return (
    <div className={cn.chartContainer} ref={containerRef}>
      <h6>{chartTitle}</h6>
      <svg className={cn.chart} width={containerWidth} height={outerHeight}>
        <defs>
          {segments.map((points, i) => {
            const yValues = points.map((p) => p.value);
            const y1 = yValues[0] >= yValues[1] ? yValues[0] : yValues[1];
            const y2 = yValues[1] > yValues[0] ? yValues[0] : yValues[1];
            const id = `chartGradient__${i}`;

            return (
              <linearGradient id={id} x1={0} x2={0} y1={0} y2={1} key={id}>
                <stop offset="0" stopColor={colorScale(y1)} />
                <stop offset="1" stopColor={colorScale(y2)} />
              </linearGradient>
            );
          })}
          <mask id={maskId} maskUnits="userSpaceOnUse">
            <rect x={0} y={0} width={width} height={height} fill="white" />
            {circles.map((point, i) => (
              <circle
                cx={point[0]}
                cy={point[1]}
                r={4.5}
                fill="black"
                key={`circle_${i}`}
              />
            ))}
          </mask>
        </defs>

        <g transform={translate(marginsToUse.left, marginsToUse.top)}>
          <XAxis
            data={data}
            height={height}
            xScale={xScale}
            dataAccessKey={dataAccessKey}
          />

          {showFirstValue && (
            <g
              transform={translate(
                xScale(firstValue.date),
                yScale(firstValue.value),
              )}
            >
              <text
                x={-5}
                y={5}
                textAnchor="end"
                className={cn.smallAxisValue}
                // style={{fill: colorScale(firstValue.value)}}
              >
                <FormattedNumber
                  number={firstValue.value}
                  format={chartNumberFormat}
                />
                &thinsp;{chartNumberSuffix}
              </text>
            </g>
          )}

          {segments.map((points, i) => (
            <path
              key={`segemtn_${i}`}
              d={pathgen(points)}
              className={cn.chartPath}
              stroke={getStroke(colorScale, points, i)}
              strokeWidth={4}
              mask={`url(#${maskId})`}
            />
          ))}

          {circles.map((point, i) => (
            <circle
              key={`circle_${i}`}
              cx={point[0]}
              cy={point[1]}
              r={3}
              fill={point[2]}
              className={cn.chartCircle}
            />
          ))}

          {lastValue.value && (
            <g
              transform={translate(
                xScale(lastValue.date),
                yScale(lastValue.value),
              )}
            >
              <text
                fill={lastValueFill}
                x={5}
                y={5}
                textAnchor="start"
                className={cn.axisValue}
                style={{fill: colorScale(lastValue.value), fontWeight: 'bold'}}
              >
                <FormattedNumber
                  number={lastValue.value}
                  format={chartNumberFormat}
                />
                {chartNumberSuffix}
              </text>

              {(lastValue.relToLastYear || lastValue.relToLastYear === 0) && (
                <text
                  y={5}
                  dy={15}
                  textAnchor="start"
                  className={cn.axisChange}
                >
                  <tspan x={5}>
                    {getChangeSign(lastValue.relToLastYear)}
                    <FormattedNumber
                      number={Math.abs(lastValue.relToLastYear)}
                      format={',.1f'}
                    />{' '}
                    %
                  </tspan>
                  <tspan x={5} dy="1em" className={cn.axisChange}>
                    seit {lastValue.lastYear.getFullYear()}
                  </tspan>
                </text>
              )}
            </g>
          )}

          {meanData && (
            <>
              <g
                transform={translate(
                  xScale(meanFirstValue.date),
                  yScale(meanFirstValue.value),
                )}
              >
                <text
                  x={-5}
                  y={5}
                  textAnchor="end"
                  className={cn.chartLabelAvg}
                  // style={{fill: colorScale(firstValue.value)}}
                >
                  {meanLabel}
                </text>
              </g>

              {meanSegments.map((points, i) => (
                <path
                  key={`segemtn_${i}`}
                  d={pathgen(points)}
                  className={cn.chartPathAvg}
                  stroke={getStroke(colorScale, points, i)}
                  strokeWidth={4}
                />
              ))}

              {meanCircles.map((point, i) => (
                <circle
                  key={`circle_${i}`}
                  cx={point[0]}
                  cy={point[1]}
                  className={cn.chartCircleAvg}
                  r={2.5}
                />
              ))}
            </>
          )}
        </g>
      </svg>
      {dataMarkers.map((d) => {
        return (
          <span
            key={d.date}
            className={cx(cn.dataMarker, {
              [cn.littleDataMarker]: d.hasAnyData && !d.hasEnoughData,
              [cn.noDataMarker]: !d.hasAnyData,
            })}
            style={{
              left: `${marginsToUse.left + xScale(d.date)}px`,
              top: `${yScale(0) - 6}px`,
            }}
          ></span>
        );
      })}
    </div>
  );
};

export default TooltipChart;
