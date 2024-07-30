import {useCallback} from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import ClearIcon from 'core/icons/close-circle-filled.svg?react';
import ChevronDown from 'core/icons/chevron-down-small.svg?react';
import cn from './index.module.scss';

const Select = (props) => {
  const {
    options,
    selected,
    resetValue,
    onSelect,
    placeholder,
    small,
    className,
    style,
    ...rest
  } = props;

  const handleSelect = useCallback(
    (event) => {
      if (!event.target.value || event.target.value === placeholder) {
        onSelect(resetValue || null);
      } else {
        const newlySelected = options.find(
          (d) => d.label === event.target.value,
        );
        onSelect(newlySelected);
      }
    },
    [onSelect, options, placeholder, resetValue],
  );

  return (
    <div className={cx(cn.selectWrapper, className)} {...{style}}>
      <select
        className={cx(cn.select, {[cn.selected]: selected, [cn.small]: small})}
        value={selected ? selected.label : 'placeholder'}
        onChange={handleSelect}
        {...rest}
      >
        {!selected && placeholder && (
          <option value={'placeholder'}>{placeholder}</option>
        )}
        {options.map((option) => {
          return (
            <option value={option.label} key={option.label}>
              {option.label}
            </option>
          );
        })}
      </select>
      <ChevronDown className={cn.chevronDown} />
      {selected && selected.label !== resetValue?.label && (
        <button
          className={cn.clearButton}
          onClick={handleSelect}
          aria-label="Feld leeren"
        >
          <ClearIcon />
        </button>
      )}
    </div>
  );
};

Select.propTypes = {
  /** The possible values that the user choses between */
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
    }),
  ).isRequired,
  /** The object that the user selected */
  selected: PropTypes.shape({
    label: PropTypes.string.isRequired,
  }),
  /** This object will be used when the user clears the selection */
  resetValue: PropTypes.shape({
    label: PropTypes.string.isRequired,
  }),
  /** The callback function that is called with the new selected object */
  onSelect: PropTypes.func.isRequired,
  /** The first option that is then shown on initial render */
  placeholder: PropTypes.string,
  /** Should the input be rendered in a more compact form? */
  small: PropTypes.bool,
  /** Will be passed to the outermost div */
  className: PropTypes.string,
  /** Will be passed to the outermost div */
  style: PropTypes.object,
};

export default Select;
