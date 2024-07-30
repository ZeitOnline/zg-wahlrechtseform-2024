import PropTypes from 'prop-types';
import {useCallback, useRef} from 'react';
import cx from 'classnames';
import cn from './index.module.scss';

const Toggle = (props) => {
  const {checked, onChange, small, disabled, style, className, ...rest} = props;
  const previouslyChecked = useRef(checked);
  const inputRef = useRef(null);
  const startX = useRef(null);
  const moved = useRef(false);
  const activated = useRef(false);

  const handleClick = (event) => {
    if (disabled) return;

    const checkbox = inputRef.current;
    if (event.target !== checkbox && !moved.current) {
      previouslyChecked.current = checkbox.checked;
      event.preventDefault();
      checkbox.focus();
      checkbox.click();
      return;
    }

    onChange(!checked);
  };

  const handleTouchStart = useCallback(
    (event) => {
      if (disabled) {
        return;
      }
      startX.current = pointerCoord(event).x;
      activated.current = true;
    },
    [disabled],
  );

  const handleTouchMove = useCallback(
    (event) => {
      if (!activated.current) return;
      moved.current = true;

      if (startX.current) {
        let currentX = pointerCoord(event).x;
        if (checked && currentX + 15 < startX.current) {
          onChange(false);
          startX.current = currentX;
          activated.current = true;
        } else if (currentX - 15 > startX.current) {
          onChange(true);
          startX.current = currentX;
          activated.current = currentX < startX.current + 5;
        }
      }
    },
    [checked, onChange],
  );

  const handleTouchEnd = useCallback(
    (event) => {
      if (!moved.current) return;
      const checkbox = inputRef.current;
      event.preventDefault();

      if (startX.current) {
        let endX = pointerCoord(event).x;
        if (previouslyChecked.current === true && startX.current + 4 > endX) {
          if (previouslyChecked.current !== checked) {
            onChange(false);
            previouslyChecked.current = checked;
            checkbox.click();
          }
        } else if (startX.current - 4 < endX) {
          if (previouslyChecked.current !== checked) {
            onChange(true);
            previouslyChecked.current = checked;
            checkbox.click();
          }
        }

        activated.current = false;
        startX.current = null;
        moved.current = false;
      }
    },
    [checked, onChange],
  );

  return (
    <div className={cx(className, [cn.container])} {...{style}}>
      <div
        className={cx([cn.toggle], {
          [cn.checked]: checked,
          [cn.small]: small,
          [cn.disabled]: disabled,
        })}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <input
          ref={inputRef}
          className={cn.visuallyHidden}
          type="checkbox"
          {...rest}
        />
        <div className={cn.track} />
        <div className={cn.thumb} />
      </div>
    </div>
  );
};

Toggle.propTypes = {
  /** Value for the checkmark as boolean, usually the first of a `setState` */
  checked: PropTypes.bool,
  /** Function to update the value, usually the second of a `setState` */
  onChange: PropTypes.func.isRequired,
  /** Should the toggle be rendered in a more compact form? */
  small: PropTypes.bool,
  /** Will be applied to the outermost container */
  className: PropTypes.string,
  /** Will be applied to the outermost container */
  style: PropTypes.object,
  /** Everything else (so also `disabled`) is passed to the input */
  disabled: PropTypes.bool,
};

export default Toggle;

function pointerCoord(event) {
  // get coordinates for either a mouse click
  // or a touch depending on the given event
  if (event) {
    const changedTouches = event.changedTouches;
    if (changedTouches && changedTouches.length > 0) {
      const touch = changedTouches[0];
      return {x: touch.clientX, y: touch.clientY};
    }
    const pageX = event.pageX;
    if (pageX !== undefined) {
      return {x: pageX, y: event.pageY};
    }
  }
  return {x: 0, y: 0};
}
