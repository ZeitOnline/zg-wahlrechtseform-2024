import {useState, useMemo, useCallback, useRef, useEffect} from 'react';
import cx from 'classnames';

import Autocomplete, {AutocompleteLabel} from 'core/components/Autocomplete';
import SelectionItem from './SelectionItem.jsx';

import SearchIcon from 'src/static/images/search.svg?react';
import ClearIcon from 'core/icons/close-circle-filled.svg?react';

import PropTypes from 'prop-types';

import cn from './index.module.scss';

const colors = [
  ['#DAB200', '#DAB20077'],
  ['#8148F4', '#8148F477'],
  ['#D68143', '#D6814377'],
  ['#B646A8', '#B646A877'],
  ['#CB5C6F', '#CB5C6F77'],
];

function MultipleSelectionAutocomplete({
  data,
  initiallySelectedValues,
  onChange,
  maxItems = 5,
  ...props
}) {
  const [selectedIds, setSelectedIds] = useState(
    initiallySelectedValues || data[0].value,
  );

  const inputRef = useRef(null);

  const autocompleteOptions = useMemo(() => {
    return data.filter((d) => !selectedIds.includes(d.value));
  }, [data, selectedIds]);

  const selectedOptions = useMemo(() => {
    return data
      .filter((d) => selectedIds.includes(d.value))
      .map((d, i) => ({
        ...d,
        color: colors[i],
      }));
  }, [data, selectedIds]);

  const handleAddItem = useCallback(
    (option) => {
      if (option) {
        setSelectedIds((previousActiveItems) => {
          if (
            previousActiveItems.length < maxItems &&
            !previousActiveItems.includes(option.value)
          ) {
            return previousActiveItems.concat([option.value]);
          }
          return previousActiveItems;
        });
      }
    },
    [maxItems],
  );

  const handleRemoveItem = useCallback(
    (item) => {
      if (item.value !== initiallySelectedValues[0]) {
        setSelectedIds((items) => {
          if (items.length === 1) {
            return initiallySelectedValues;
          }
          return items.filter((d) => d !== item.value);
        });
      }
    },
    [initiallySelectedValues],
  );

  const handleResetItems = useCallback(() => {
    setSelectedIds(initiallySelectedValues);
  }, [initiallySelectedValues]);

  const handleWrapperClick = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  useEffect(() => {
    if (onChange) {
      onChange(selectedOptions);
    }
  }, [selectedOptions, onChange]);

  return (
    <div className={cn.container} onTouchStart={() => {}}>
      <div className={cn.wrapper}>
        <div
          className={cn.activeItems}
          onClick={handleWrapperClick}
          onKeyDown={handleWrapperClick}
          role="button"
          tabIndex="0"
        >
          <div className={cn.items}>
            <SearchIcon className={cn.searchIcon} />
            {selectedOptions?.map((d, i) => (
              <SelectionItem
                key={i}
                data={d}
                onRemove={handleRemoveItem}
                unRemovable={i === 0}
              />
            ))}
            {selectedIds.length < maxItems && (
              <Autocomplete
                data={autocompleteOptions.map((d, i) => {
                  return {
                    ...d,
                    label: (
                      <AutocompleteLabel
                        label={d.label}
                        className={{[cn.hasSeparator]: d.hasSeparator}}
                        key={i}
                      />
                    ),
                  };
                })}
                onChange={handleAddItem}
                showOptionsAtEmptyQuery={true}
                clearOnChange={true}
                placeholder={'Hier tippen und wählen'}
                selected={{value: null}}
                className={cn.autocomplete}
                inputClassName={cn.autocompleteInput}
                innerRef={inputRef}
                showSearchIcon={false}
                {...props}
              />
            )}
          </div>
          {selectedIds?.length > 1 && (
            <ClearIcon
              alt="Auswahl zurücksetzen"
              onClick={handleResetItems}
              className={cn.deleteAllIcon}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default MultipleSelectionAutocomplete;

MultipleSelectionAutocomplete.displayName = 'MultipleSelectionAutocomplete';

MultipleSelectionAutocomplete.propTypes = {
  /** Which option should the user be able to pick from? */
  data: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.any.isRequired,
      itemLabel: PropTypes.string,
      value: PropTypes.string,
      data: PropTypes.shape({
        name: PropTypes.string,
      }).isRequired,
    }),
  ).isRequired,
  /** Which objects (by value) should be initially selected */
  initiallySelectedValues: PropTypes.arrayOf(PropTypes.string).isRequired,
  /** This function will be called with an array including the selected objects */
  onChange: PropTypes.func,
  /** How many items can be selected at most? */
  maxItems: PropTypes.number,
};
