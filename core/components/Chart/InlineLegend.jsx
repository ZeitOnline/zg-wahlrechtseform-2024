import {memo, useMemo} from 'react';
import cx from 'classnames';
import {useChart} from './hooks.js';
import {relax} from './utils.js';

/**
 * This adds an inline legend like in some Datawrapper charts to the right side of a linechart.
 * In order for the text to be fully visible the ChartContainer needs enough margin on the right side.
 * This can be set via the margin attribute in the ChartContainer.
 *
 * Config example:
 *   {
 *    label: 'Some Label',
 *    yGetter: (d) => d.someValue,
 *    className: cn.containingSomeFillColor
 *   }
 *
 * @param {object} config - a config to describe the name, colour and value getter of the inline Legend.
 * @param {int} minimumGap - Minimum distance between two labels in pixels.
 */
function InlineLegend({config, minimumGap = 30, formatValue}) {
  const {xScale, yScale, data, x: xGetter} = useChart();

  const lastDataPoint = data[data.length - 1];

  /**
   * All the labels are recursively spaced if there is an overlap between them.
   */
  const spacedLabelsConfig = useMemo(() => {
    const labelsConfig = config
      .map((d) => ({
        ...d,
        value: d.yGetter(lastDataPoint),
        yPos: yScale(d.yGetter(lastDataPoint)),
      }))
      .sort((a, b) => b.yPos - a.yPos);

    return relax(labelsConfig, minimumGap);
  }, [config, lastDataPoint, minimumGap, yScale]);

  return (
    <g>
      {spacedLabelsConfig.map((d, i) => {
        const xPos = xScale(xGetter(lastDataPoint));
        const yPos = d.yPos;

        return (
          <text
            x={xPos + 8}
            y={yPos}
            dominantBaseline="middle"
            textAnchor="beginning"
            className={cx(d.className)}
            key={i}
            style={d.style}
          >
            {formatValue ? formatValue(d.value) : d.label}
          </text>
        );
      })}
    </g>
  );
}

export default memo(InlineLegend);
