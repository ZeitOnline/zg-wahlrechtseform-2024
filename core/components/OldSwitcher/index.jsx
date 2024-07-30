import PropTypes from 'prop-types';
import cx from 'classnames';

import noop from 'core/utils/noop';
import cn from './OldSwitcher.module.scss';

/**
 * A list of buttons that the user can click to chose between different options.
 * The buttons are rendered in a compact way on mobile by default and on desktop
 * they are rendered compact if `small` is set to true.
 */
const OldSwitcher = ({
  options = [],
  active,
  onChange,
  className,
  small = false,
}) => {
  return (
    <div
      className={cx(cn.container, className, {[cn.small]: small})}
      onTouchStart={noop}
    >
      {options.map((option) => {
        const isActive = active === option.id;

        return (
          <button
            key={option.id}
            style={{
              '--switcher-background': option.background,
              '--switcher-color': option.color,
            }}
            className={cx(cn.option, option.className, {
              [cn.isActive]: isActive,
            })}
            onClick={(e) => onChange(option.id, e)}
          >
            <span className={cx(cn.optionInner)}>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
};

OldSwitcher.propTypes = {
  /** List of options to choose between */
  options: PropTypes.arrayOf(
    PropTypes.shape({
      /** Uniquely identifying id, the onChange function will be called with this `id` as its first argument */
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      /** Will be rendered as the content of this button */
      label: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.node,
      ]),
      /** Background color of the button when active */
      background: PropTypes.string,
      /** Text color of the button when active */
      color: PropTypes.string,
      /** className that will be appplied to the button */
      className: PropTypes.string,
      /** Another className that will be applied to the span inside of the button */
      optionInner: PropTypes.string,
    }),
  ),
  /** `id` of the option that is currently active, usually the first return value of a `useState` */
  active: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** Function to store the newly chosen `id`, usually the second return value of a `useState`  */
  onChange: PropTypes.func,
  /** Do you want this Switcher to be rendered as very compact or regular? */
  small: PropTypes.bool,
};

export default OldSwitcher;
