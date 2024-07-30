import {useState, useCallback, useMemo, useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Input from 'core/components/Input/index.jsx';
import cn from './index.module.scss';
import AutocompleteLabel from './AutocompleteLabel.jsx';
import SearchIcon from 'src/static/images/search.svg?react';
import useDebounce from 'core/hooks/useDebounce';

const KEY_UP = 38;
const KEY_DOWN = 40;
const KEY_ENTER = 13;
const KEY_ESCAPE = 27;
// performance reasons
const MAX_NUMBER_OF_ITEMS_DISPLAYED = 500;

export {AutocompleteLabel};

function AutocompleteOption({
  label,
  value,
  data,
  onSelect,
  onMouseEnter,
  active,
  innerRef,
  index,
  labelClassName,
}) {
  const handleMouseDown = useCallback((event) => {
    event.preventDefault();
  }, []);
  const handleClick = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      onSelect({label, value, data});
    },
    [label, value, data, onSelect],
  );
  const handleMouseEnter = useCallback(() => {
    onMouseEnter(index);
  }, [index, onMouseEnter]);

  return (
    <li data-active={active} className={labelClassName} ref={innerRef}>
      <div
        onMouseEnter={handleMouseEnter}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        role="button"
        tabIndex="0"
        onKeyDown={handleClick}
      >
        {label}
      </div>
    </li>
  );
}

const Autocomplete = (props) => {
  const {
    data,
    onChange,
    onClick,
    className,
    inputClassName,
    labelClassName,
    placeholder,
    selected,
    customFilter,
    customCompletionSelection,
    clearOnChange = false,
    disabled = false,
    clearable = true,
    showOptionsAtEmptyQuery = false,
    showSearchIcon = true,
    id,
    innerRef: ref,
  } = props;

  const [query, setQuery] = useState('');
  const [queryChanged, setQueryChanged] = useState(false);
  const [open, setOpen] = useState(false);
  const [completions, setCompletions] = useState(
    showOptionsAtEmptyQuery ? data : [],
  );
  const [activeIndex, setActiveIndex] = useState(-1);
  const activeRef = useRef();
  const itemContainerRef = useRef();
  const lastInputMethod = useRef();
  const justAutoscrolled = useRef(false);
  const inputRef = useRef(null);
  const selectedRef = useRef(null);
  const customCompletionDebounced = useDebounce(customCompletionSelection, 400);

  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);
  useEffect(() => {
    if (ref) {
      ref.current = inputRef.current;
    }
  });

  useEffect(() => {
    function clickOff(event) {
      const isAutocompleteOption = event.target.closest(`.${cn.container} li`);
      if (!isAutocompleteOption) {
        event.stopPropagation();
        event.preventDefault();
      }
    }

    if (open && document) {
      document.addEventListener('click', clickOff, true);
    }
    return () => {
      if (document) document.removeEventListener('click', clickOff, true);
    };
  }, [open, selected]);

  const handleInput = useCallback(
    (event) => {
      setOpen(
        event.target.value.length || showOptionsAtEmptyQuery ? true : false,
      );
      setActiveIndex(event.target.value.length ? 0 : -1);
      setQuery(event.target.value);
      setQueryChanged(true);
    },
    [showOptionsAtEmptyQuery],
  );
  const handleFocus = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (onClick) {
        onClick();
      }
      if (query?.length || showOptionsAtEmptyQuery) {
        setOpen(true);
      }
      // uses settimeout because of a Bug in Safari
      window.setTimeout(() => event.target.select(), 50);
    },
    [query, showOptionsAtEmptyQuery, onClick],
  );

  const handleSelect = useCallback(
    (option) => {
      setQuery(clearOnChange ? '' : option?.value);
      setOpen(false);
      setActiveIndex(-1);
      onChange(option);
      if (inputRef.current) {
        inputRef.current.blur();
      }
    },
    [onChange, inputRef, clearOnChange],
  );

  const handleMouseEnter = useCallback((index) => {
    if (justAutoscrolled.current) {
      return;
    }
    lastInputMethod.current = 'mouse';
    setActiveIndex(index);
  }, []);

  useEffect(() => {
    if (selected) {
      setQuery(selected.value);
    } else {
      setQuery('');
    }
  }, [selected]);

  useEffect(() => {
    if (customCompletionSelection) return;

    const lowerCasedQuery = query && query.length ? query.toLowerCase() : null;

    if ((selected && selected.value === query) || !lowerCasedQuery) {
      if (data) {
        const d = data.slice(0, MAX_NUMBER_OF_ITEMS_DISPLAYED);
        setCompletions(customFilter ? customFilter(d, d, lowerCasedQuery) : d);
      } else {
        setCompletions([]);
      }
    }
    // First split the value into individual tokens,
    // then check if one *starts with* the query.
    // If there are no results,
    // check if the value *contains* the query
    let filteredData = data.filter((d) => {
      const splitName = d.value.toLowerCase().split(/[-\s]+/i);
      for (const part of splitName) {
        if (part.startsWith(lowerCasedQuery)) {
          return true;
        }
      }
      return false;
    });

    if (!filteredData.length) {
      filteredData = data.filter((d) => {
        if (selected && selected.value === query) {
          return true;
        }
        return d.value.toLowerCase().includes(lowerCasedQuery);
      });
    }

    if (filteredData.length) {
      const fullMatch = filteredData.find(
        (d) => d.data.name.toLowerCase() === query,
      );
      if (fullMatch) {
        filteredData = [
          fullMatch,
          ...filteredData.filter((d) => d.data.name.toLowerCase() !== query),
        ];
      }
    }

    if (customFilter) {
      filteredData = customFilter(data, filteredData, lowerCasedQuery);
    }

    if (!queryChanged) {
      filteredData = data;
    }

    setCompletions(filteredData.slice(0, MAX_NUMBER_OF_ITEMS_DISPLAYED));
  }, [
    data,
    query,
    selected,
    customFilter,
    setCompletions,
    customCompletionSelection,
    queryChanged,
  ]);

  useEffect(() => {
    if (!customCompletionSelection || !queryChanged) return;

    const lowerCasedQuery = query && query.length ? query.toLowerCase() : null;

    customCompletionDebounced(
      lowerCasedQuery,
      setCompletions,
      MAX_NUMBER_OF_ITEMS_DISPLAYED,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, customCompletionDebounced]);

  const handleBlur = useCallback(() => {
    setOpen(false);
    setQueryChanged(false);
    // setQuery('');
    if (selectedRef.current && selectedRef.current.value) {
      setQuery(selectedRef.current.value);
    }
  }, [selectedRef]);

  const handleClear = useCallback(() => {
    setQuery('');
    setOpen(false);
    setActiveIndex(-1);
    onChange(null);
    if (inputRef.current) {
      inputRef.current.blur();
    }
  }, [onChange, inputRef]);

  const handleKeyDown = useCallback(
    (event) => {
      switch (event.keyCode) {
        case KEY_UP:
          if (open) {
            event.preventDefault();
            lastInputMethod.current = 'keyboard';
            setActiveIndex((currentActiveIndex) => {
              return Math.max(currentActiveIndex - 1, -1);
            });
          }
          break;
        case KEY_DOWN:
          if (open) {
            event.preventDefault();
            lastInputMethod.current = 'keyboard';
            setActiveIndex((currentActiveIndex) => {
              return Math.min(currentActiveIndex + 1, completions.length - 1);
            });
          } else {
            setOpen(true);
          }
          break;
        case KEY_ENTER:
          if (activeIndex > -1 && open) {
            if (event) {
              event.preventDefault();
              event.stopPropagation();
              event.target.blur();
            }
            handleSelect(completions[activeIndex]);
          }
          break;
        case KEY_ESCAPE:
          if (open) {
            if (event) {
              event.target.blur();
            }
          }
          break;
        default:
          return;
      }
    },
    [activeIndex, handleSelect, completions, open],
  );

  const items = useMemo(() => {
    return completions.map(({key, ...d}, i) => {
      return (
        <AutocompleteOption
          onSelect={handleSelect}
          onMouseEnter={handleMouseEnter}
          {...d}
          key={key || d.value}
          labelClassName={labelClassName}
          index={i}
          active={i === activeIndex}
          innerRef={i === activeIndex ? activeRef : null}
        />
      );
    });
  }, [
    completions,
    handleSelect,
    activeIndex,
    handleMouseEnter,
    labelClassName,
  ]);

  useEffect(() => {
    if (lastInputMethod.current && lastInputMethod.current === 'mouse') {
      return;
    }

    const container = itemContainerRef.current;
    const item = activeRef.current;

    if (!(activeIndex >= 0 && container && item)) {
      return;
    }

    const unsetAutoscrolled = () => {
      justAutoscrolled.current = false;
    };

    const containerBbox = container.getBoundingClientRect();
    const itemBbox = item.getBoundingClientRect();

    const itemOffset = itemBbox.top - containerBbox.top;
    const itemBottomOffset = itemBbox.top + itemBbox.height - containerBbox.top;

    const visibleRange = [0, containerBbox.height];
    if (itemOffset < visibleRange[0]) {
      container.scrollTop = container.scrollTop + itemOffset;
      justAutoscrolled.current = true;
    } else if (itemBottomOffset > visibleRange[1]) {
      container.scrollTop =
        container.scrollTop + (itemBottomOffset - visibleRange[1]);
      justAutoscrolled.current = true;
    }

    if (justAutoscrolled.current) {
      const timeout = window.setTimeout(unsetAutoscrolled, 100);

      return () => {
        window.clearTimeout(timeout);
      };
    }
  }, [activeRef, activeIndex, itemContainerRef, lastInputMethod]);

  // const completionMenu = !(open && items.length) ? null : (
  //   <ul ref={itemContainerRef}>{items}</ul>
  // );

  // remove everything between triple # before displaying in input field
  // this parts are sometimes necessary for internal search logic but should not be displayed to the user
  const inputValue = useMemo(() => {
    return query?.replace(/###.*###/g, '');
  }, [query]);

  const input = (
    <Input
      className={cx(cn.input, inputClassName)}
      placeholder={placeholder}
      value={inputValue}
      onKeyDown={handleKeyDown}
      onInput={handleInput}
      onFocus={handleFocus}
      onBlur={handleBlur}
      size="20"
      innerRef={inputRef}
      enterKeyHint="go"
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck="false"
      onClear={clearable && handleClear}
      disabled={disabled}
      id={id}
      type="search"
    />
  );

  return (
    <div
      className={cx(cn.container, className, {
        [cn.showSearchIcon]: showSearchIcon,
      })}
    >
      {showSearchIcon && <SearchIcon className={cn.searchIcon} />}

      {input}
      {/* {completionMenu} */}
      <ul
        className={cx({[cn.hidden]: !(open && items.length)})}
        ref={itemContainerRef}
      >
        {items}
      </ul>
    </div>
  );
};

Autocomplete.propTypes = {
  /** Which option should the user be able to pick from? */
  data: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.any.isRequired,
      value: PropTypes.string,
      data: PropTypes.shape({
        name: PropTypes.string,
      }).isRequired,
    }),
  ).isRequired,
  /** This function will be called with the selected object */
  onChange: PropTypes.func,
  /** This class will be applied to the wrapping div */
  className: PropTypes.string,
  /** This class will be applied to the html input field */
  inputClassName: PropTypes.string,
  /** This class will be applied to the html label above the input */
  labelClassName: PropTypes.string,
  /** This will be shown in the input befor the user types anything */
  placeholder: PropTypes.string,
  /** Which object from within `data` was selected by the user? */
  selected: PropTypes.shape({
    value: PropTypes.any,
  }),
  /** A function that will be called with three arguments `data`, `filteredData`, `lowerCasedQuery` */
  customFilter: PropTypes.func,
  /** Should the input field be emptied when a value is selected? */
  clearOnChange: PropTypes.bool,
  /** Should the field be disabled completely? */
  disabled: PropTypes.bool,
  /** Should an X be rendered at the end of the input field to clear it? */
  clearable: PropTypes.bool,
  /** If you need access to the ref of the input, pass your ref here */
  innerRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({current: PropTypes.object}),
  ]),
};

export default Autocomplete;
