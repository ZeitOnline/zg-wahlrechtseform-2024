import React from 'react';
import PropTypes from 'prop-types';
import ArrowIcon from 'core/icons/chevron-down.svg?react';
import cx from 'classnames';
import cn from './index.module.scss';

const Accordion = (props) => {
  const {options, selected, setSelected, showChevron = false} = props;

  return (
    <div>
      {options?.map((c) => (
        <button
          key={c.id}
          className={cx(cn.item, {[cn.active]: selected.id === c.id})}
          onClick={() => setSelected(c)}
        >
          {showChevron && (
            <div className={cx(cn.icon, {[cn.active]: selected.id === c.id})}>
              <ArrowIcon />
            </div>
          )}
          <div
            className={cx(cn.titleWrapper, {[cn.active]: selected.id === c.id})}
          >
            {c.icon && (
              <div
                className={cx(cn.titleIcon, {
                  [cn.active]: selected.id === c.id,
                })}
              >
                {c.icon}
              </div>
            )}
            <span className={cx(cn.title, {[cn.active]: selected.id === c.id})}>
              {c.title}
            </span>
          </div>
          {c.children}
        </button>
      ))}
    </div>
  );
};

Accordion.propTypes = {
  /** Array of items to choose between */
  options: PropTypes.arrayOf(
    PropTypes.shape({
      /** To evaluate whether the item is currently active, the `id`s are compared */
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      /** Is usually a string that will be rendered in big letters right of the icon */
      title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
      /** Can be an image, it will be rendered in a circle left of the title */
      icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
      /** This will be rendered below icon and title */
      children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    }),
  ),
  /** The currently selected item as the whole object (usually the first of a `setState`) */
  selected: PropTypes.object,
  /** The object that is called with the newly selected item (usually the second of a `setState`) */
  setSelected: PropTypes.func,
  /** Pass `false` if you don't want chevrons to be rendered at the top right of each option */
  showChevron: PropTypes.bool,
};

export default Accordion;
