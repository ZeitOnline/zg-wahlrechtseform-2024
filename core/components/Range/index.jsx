import {useCallback, useRef} from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import cn from './index.module.scss';
import {formatNumber} from '../FormattedNumber';

function Range(props) {
  const {
    value,
    onChange,
    min,
    max,
    minDelta,
    style,
    className,
    trackColor,
    thumbColor,
    lowerColor,
    upperColor,
    height,
    showTooltip,
    numberFormat,
    formatOptions,
    tooltipValue,
    ...rest
  } = props;
  const hasTwoSliders = Array.isArray(value) && value?.length > 1;

  const lowerRef = useRef(null);
  const upperRef = useRef(null);

  const onChangeLower = useCallback(
    (evt) => {
      onChange([Math.min(+evt.target.value, +value[1] - minDelta), +value[1]]);
    },
    [minDelta, onChange, value],
  );
  const onChangeUpper = useCallback(
    (evt) => {
      if (hasTwoSliders) {
        onChange([+value[0], Math.max(+evt.target.value, +value[0] + minDelta)]);
      } else {
        onChange(+evt.target.value);
      }
    },
    [hasTwoSliders, minDelta, onChange, value],
  );

  return (
    <div
      className={cx(cn.container, className, {
        [cn.hasTwoSliders]: hasTwoSliders,
        [cn.disabled]: rest.disabled,
      })}
      style={{
        ...style,
        '--lower': hasTwoSliders ? value[0] : min,
        '--upper': hasTwoSliders ? value[1] : value,
        '--min': min,
        '--max': max,
        '--size': height,
        '--track-color': trackColor,
        '--lower-color': lowerColor || thumbColor,
        '--upper-color': upperColor || thumbColor,
      }}
    >
      {hasTwoSliders && (
        <input
          className={cx(cn.range, cn.lowerRange)}
          type="range"
          ref={lowerRef}
          {...rest}
          min={min}
          max={max}
          value={value[0]}
          onChange={onChangeLower}
        />
      )}
      <input
        className={cx(cn.range, cn.upperRange)}
        type="range"
        ref={upperRef}
        {...rest}
        min={min}
        max={max}
        value={hasTwoSliders ? value[1] : value}
        onChange={onChangeUpper}
      />
      {hasTwoSliders && showTooltip && (
        <div className={cx(cn.tooltip, cn.lowerTooltip)}>
          {formatNumber(
            (tooltipValue || value)[0],
            numberFormat,
            formatOptions,
          )}
        </div>
      )}
      {showTooltip && (
        <div className={cx(cn.tooltip, cn.upperTooltip)}>
          {formatNumber(
            hasTwoSliders ? (tooltipValue || value)[1] : tooltipValue || value,
            formatOptions,
          )}
        </div>
      )}
    </div>
  );
}

Range.propTypes = {
  /** Either one number or two numbers in an array for two thumps (a lower and an upper value) */
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.number),
  ]).isRequired,
  /** Function that stores the new values, usually the second of a `useState` */
  onChange: PropTypes.func.isRequired,
  /** Lower boundary of the range that can be selected */
  min: PropTypes.number.isRequired,
  /** Upper boundary of the range that can be selected */
  max: PropTypes.number.isRequired,
  /** Is passed to the input and defines the distance between the values selectable */
  step: PropTypes.number,
  /** When two values are used, the slider stops when its dragged too close to the second value and this delta is maintained */
  minDelta: PropTypes.number,
  /** The color between or left of the thumb */
  trackColor: PropTypes.string,
  /** The color used for the thumbs */
  thumbColor: PropTypes.string,
  /** When two values are used, color for the lower thumb */
  lowerColor: PropTypes.string,
  /** When two values are used, color for the upper thumb */
  upperColor: PropTypes.string,
  /** Height of the track and also the thumbs and the border radii */
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** Should a tooltip be rendered on hover on top of the thumb? */
  showTooltip: PropTypes.bool,
  /** Defines the number format of the value in the tooltip */
  numberFormat: PropTypes.string,
  /** Additional formatting options for `formatNumber` */
  formatOptions: PropTypes.object,
  /** If you use the slider to set the index in an array, you can pass a different value that is then displayed in the tooltip */
  tooltipValue: PropTypes.number,
  /** Is the input disabled? */
  disabled: PropTypes.bool,
  /** Is passed to the outhermost container, careful with overrides like `padding` */
  style: PropTypes.object,
  /** Is passed to the outhermost container, careful with overrides like `padding` */
  className: PropTypes.string,
};

Range.defaultProps = {
  step: 1,
  minDelta: 1,
  height: '22px',
};

export default Range;
