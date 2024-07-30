import {Fragment} from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import cn from './index.module.scss';
import {scaleLinear} from 'd3-scale';
import {extent} from 'd3-array';

const ColorLegend = (props) => {
  const {
    colors = [],
    minLabel,
    maxLabel,
    title,
    asGradient,
    asCircles,
    height,
    ...rest
  } = props;

  return (
    <div className={cn.wrapper} {...rest}>
      {title && <div className={cn.title}>{title}</div>}
      <div className={cn.colorsWrapper}>
        {minLabel && <div className={cn.minLabel}>{minLabel}</div>}
        {asGradient ? (
          <GradientDiv {...{colors, height}} className={cn.gradient} />
        ) : (
          colors.map(({color, label}, i, a) => (
            <Fragment key={color}>
              <div
                className={cx(cn.item, {[cn.withPadding]: asCircles})}
                style={{height: asCircles ? undefined : height}}
              >
                <div
                  className={cx(cn.color, {
                    [cn.first]: i === 0,
                    [cn.last]: i === a.length - 1,
                    [cn.circle]: asCircles,
                  })}
                  style={{backgroundColor: color}}
                />
                {label && <div className={cx(cn.label)}>{label}</div>}
              </div>
            </Fragment>
          ))
        )}
        {maxLabel && <div className={cn.maxLabel}>{maxLabel}</div>}
      </div>
    </div>
  );
};

ColorLegend.propTypes = {
  /** Array of colors to display, pass no label if none should be shown */
  colors: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.any,
      color: PropTypes.string.isRequired,
      label: PropTypes.string,
    }),
  ).isRequired,
  /** Height of the color items or gradient strip */
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** Text that is rendered as headline above the color swatches */
  title: PropTypes.string,
  /** Text that is rendered left of the color swatches */
  minLabel: PropTypes.string,
  /** Text that is rendered right of the color swatches */
  maxLabel: PropTypes.string,
  /** Should the colors be rendered in a gradient? */
  asGradient: PropTypes.bool,
  /** Should the colors be rendered as circles instead of rectangles? */
  asCircles: PropTypes.bool,
};

ColorLegend.defaultProps = {
  height: '0.75em',
  asGradient: false,
  asCircles: false,
};

export default ColorLegend;

function GradientDiv({style, className, height, colors}) {
  const percentageScale = scaleLinear()
    .domain(
      extent(
        colors.filter((d) => isFinite(d.value)),
        (d) => d.value,
      ),
    )
    .range([0, 100]);

  // Create the gradient string
  const gradient = colors
    .filter((d) => isFinite(d.value))
    .map((d) => {
      return `${d.color} ${percentageScale(d.value)}%`;
    })
    .join(', ');

  // Return the div with the gradient background
  return (
    <div
      {...{className}}
      style={{
        ...style,
        height,
        background: `linear-gradient(to right, ${gradient})`,
      }}
    >
      {colors
        .filter((d) => d.label)
        .map(({value, label}) => (
          <span
            key={value}
            className={cn.gradientLabel}
            style={{left: percentageScale(value) + '%'}}
          >
            {label}
          </span>
        ))}
    </div>
  );
}
