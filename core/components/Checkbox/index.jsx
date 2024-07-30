import PropTypes from 'prop-types';
import cx from 'classnames';

import cn from './index.module.scss';

const Checkbox = (props) => {
  const {onChange, checked, label, className, style, ...rest} = props;

  return (
    <label
      className={cx(cn.container, className, {[cn.enabled]: !rest.disabled})}
      {...{style}}
    >
      <div className={cn.checkmarkContainer}>
        <input
          onChange={() => void onChange(!checked)}
          type="checkbox"
          checked={checked}
          {...rest}
        />
        <span className={cn.checkmark} />
      </div>
      {label && <div className={cn.label}>{label}</div>}
    </label>
  );
};

Checkbox.propTypes = {
  /** Value for the checkmark as boolean, usually the first of a `setState` */
  checked: PropTypes.bool,
  /** Function to update the value, usually the second of a `setState` */
  onChange: PropTypes.func.isRequired,
  /** Text or Node rendered next to the checkmark (can be clicked to toggle value) */
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  /** Will be applied to the outermost container */
  className: PropTypes.string,
  /** Will be applied to the outermost container */
  style: PropTypes.object,
  /** Everything else (so also `disabled`) is passed to the input */
  disabled: PropTypes.bool,
};

export default Checkbox;
