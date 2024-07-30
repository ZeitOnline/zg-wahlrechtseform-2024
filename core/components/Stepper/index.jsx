import {useCallback, useMemo} from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Plus from 'core/icons/plus.svg?react';
import Minus from 'core/icons/minus.svg?react';

import cn from './index.module.scss';
import {formatNumber} from '../FormattedNumber';

const Stepper = (props) => {
  const {
    value,
    onChange,
    min,
    max,
    step,
    numberFormat,
    formatOptions,
    disabled,
    small,
    className,
    style,
    ...rest
  } = props;

  const increase = useCallback(() => {
    onChange(isFinite(max) ? Math.min(value + step, max) : value + step);
  }, [max, onChange, step, value]);
  const decrease = useCallback(() => {
    onChange(isFinite(min) ? Math.max(value - step, min) : value - step);
  }, [min, onChange, step, value]);
  const prefix = useMemo(() => {
    // prettier-ignore
    if (typeof rest?.prefix === 'object' && rest.prefix.singular && rest.prefix.plural)
      return value === 1 ? rest.prefix.singular : rest.prefix.plural;
    return rest.prefix;
  }, [rest.prefix, value]);
  const suffix = useMemo(() => {
    // prettier-ignore
    if (typeof rest?.suffix === 'object' && rest.suffix.singular && rest.suffix.plural)
      return value === 1 ? rest.suffix.singular : rest.suffix.plural;
    return rest.suffix;
  }, [rest.suffix, value]);

  return (
    <div
      className={cx(cn.container, className, {[cn.disabled]: disabled})}
      {...{style, ...rest}}
    >
      <button
        className={cx(cn.button, {[cn.small]: small})}
        onClick={decrease}
        disabled={disabled || value <= min}
      >
        <Minus />
      </button>
      <div className={cx(cn.value, {[cn.small]: small})}>
        {prefix}
        {formatNumber(value, numberFormat, formatOptions)}
        {suffix}
      </div>
      <button
        className={cx(cn.button, {[cn.small]: small})}
        onClick={increase}
        disabled={disabled || value >= max}
      >
        <Plus />
      </button>
    </div>
  );
};

Stepper.propTypes = {
  /** Value, usually the first of a `setState` */
  value: PropTypes.number,
  /** Function to update the value, usually the second of a `setState` */
  onChange: PropTypes.func.isRequired,
  /** Minimum value that the value can take */
  min: PropTypes.number,
  /** Maximum value that the value can take */
  max: PropTypes.number,
  /** By how much should the value be in/decreased */
  step: PropTypes.number,
  /** Format string for the value when it's displayed */
  numberFormat: PropTypes.string,
  /** Is passed to `formatNumber()` */
  formatOptions: PropTypes.shape({
    /** If the number is `null` or `undefined`, show the following string instead */
    nullFormat: PropTypes.string,
    /** If the number is `0`, show the following string instead */
    zeroString: PropTypes.string,
    /** Alternatively, you can also use a d3-format string, e.g. `d` */
    zeroFormat: PropTypes.string,
    /** Should a `+` be displayed in front of numbers above zero? */
    showPlusSign: PropTypes.bool,
  }),
  /** String rendered in front of number */
  prefix: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      singular: PropTypes.string,
      plural: PropTypes.string,
    }),
  ]),
  /** String rendered behind number, either simple string or object with plural/singular */
  suffix: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      singular: PropTypes.string,
      plural: PropTypes.string,
    }),
  ]),
  /** Is the input clickable or disabled? */
  disabled: PropTypes.bool,
  /** Should it be rendered in a more compact form? */
  small: PropTypes.bool,
  /** Will be applied to the outermost container */
  className: PropTypes.string,
  /** Will be applied to the outermost container */
  style: PropTypes.object,
};

Stepper.defaultProps = {
  step: 1,
  numberFormat: ',',
  prefix: '',
  suffix: '',
};

export default Stepper;
