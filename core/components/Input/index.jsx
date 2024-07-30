import PropTypes from 'prop-types';
import cx from 'classnames';

import cn from './index.module.scss';
import ClearIcon from 'core/icons/close-circle-filled.svg?react';
import SearchIcon from 'src/static/images/search.svg?react';

const Input = (props) => {
  const {
    onClear,
    className,
    style,
    value = '',
    showSearchIcon,
    innerRef: ref,
    small,
    ...rest
  } = props;

  const clearButtonVisible =
    onClear &&
    typeof value !== 'undefined' &&
    value !== null &&
    value !== false &&
    value.length > 0;

  return (
    <div
      className={cx(cn.container, className, {
        [cn.showSearchIcon]: showSearchIcon,
      })}
      {...{style}}
    >
      {showSearchIcon && <SearchIcon className={cn.searchIcon} />}
      <input
        className={cx(rest.inputClassName, {[cn.small]: small})}
        {...{ref, value, ...rest}}
      />
      {onClear && clearButtonVisible && (
        <button
          onClick={onClear}
          className={cx(cn.clearButton)}
          aria-label="Feld leeren"
        >
          <ClearIcon />
        </button>
      )}
    </div>
  );
};

Input.propTypes = {
  /** You must pass the `value` for the HTML input field (controlled prop) */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** Grab `event.target.value` from the regular HTML `onChange` event yourself */
  onChange: PropTypes.func,
  /** This class will be applied to the html input field */
  inputClassName: PropTypes.string,
  /** Use this function to reset your state, if nothing is passed here, no clear button is shown */
  onClear: PropTypes.func,
  /** Shoudl a magnifying glass be shown on the left of the input */
  showSearchIcon: PropTypes.bool,
  /** If you need access to the ref of the input, pass your ref here */
  innerRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({current: PropTypes.object}),
  ]),
  /** Should the input be rendered in a more compact form? */
  small: PropTypes.bool,
  /** This will be applied to the wrapping div */
  className: PropTypes.string,
  /** This will be applied to the wrapping div */
  style: PropTypes.object,
};

export default Input;
