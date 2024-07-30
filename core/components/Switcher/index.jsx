import PropTypes from 'prop-types';
import cx from 'classnames';

import cn from './index.module.scss';
import noop from 'core/utils/noop';

function Switcher({options, active, onChange, className, small}) {
  return (
    <div className={cx(cn.container, className)} onTouchStart={noop}>
      {options.map((option, i) => {
        const isActive = active === option.id;
        const nextActive = options[i + 1]?.id == active;

        return (
          <button
            key={option.id}
            style={{
              '--switcher-background': option.background,
              '--switcher-color': option.color,
            }}
            className={cx(cn.option, option.className, {
              [cn.isActive]: isActive,
              [cn.isSmall]: small,
              [cn.borderRight]:
                !isActive && i < options.length - 1 && !nextActive,
            })}
            onClick={(e) => onChange(option.id, e)}
            disabled={option.disabled}
          >
            <span className={cx(cn.optionInner)}>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

Switcher.propTypes = {
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

export default Switcher;
