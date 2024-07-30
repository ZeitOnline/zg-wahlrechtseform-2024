import PropTypes from 'prop-types';
import cx from 'classnames';

import {useMap} from './hooks.js';
import cn from './Label.module.scss';

/*
@TODO
- positions (center, left, right, bottom, top, etc)
- styles (all-caps, italic, etc.)
*/

/**
 * HTML label. Position outside the SVG
 */
function Label({children, coordinates, className, theme = 'light'}) {
  const {projection} = useMap();

  let textContent = null;
  if (typeof children === 'string') {
    textContent = children;
  }
  let childElement = children;
  if (textContent) {
    childElement = (
      <div className={cn.label}>
        <span
          className={cx(cn.labelText, cn.labelOutline, {
            [cn.dark]: theme === 'dark',
          })}
        >
          {textContent}
        </span>
        <span className={cx(cn.labelText, {[cn.dark]: theme === 'dark'})}>
          {textContent}
        </span>
      </div>
    );
  }

  const transform = projection(coordinates);

  return (
    <div
      className={cx(cn.container, className)}
      style={{transform: `translate(${transform[0]}px, ${transform[1]}px)`}}
    >
      {childElement}
    </div>
  );
}

Label.propTypes = {
  coordinates: PropTypes.arrayOf(PropTypes.number),
  className: PropTypes.string,
  theme: PropTypes.oneOf(['light', 'dark']),
};

export default Label;
