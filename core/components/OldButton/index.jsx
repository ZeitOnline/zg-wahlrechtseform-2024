import {isValidElement} from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import cn from './OldButton.module.scss';

const OldButton = function ({
  children,
  className,
  tagName: Tag,
  look = 'default',
  icon: Icon = null,
  type = null,
  size,
  ...props
}) {
  let buttonType = type;
  if (Tag === 'button' && !type) {
    buttonType = 'button';
  }
  let renderedIcon = null;
  if (Icon) {
    if (isValidElement(Icon)) {
      renderedIcon = Icon;
    } else if (typeof Icon === 'function') {
      renderedIcon = <Icon />;
    }
  }

  return (
    <Tag
      className={cx(className, cn.button, {
        [cn.border]: look === 'default',
        [cn.inky]: look === 'inky',
        [cn.icon]: Icon !== null,
        [cn.small]: size === 'small',
      })}
      type={buttonType}
      {...props}
    >
      {renderedIcon}
      {children}
    </Tag>
  );
};

export default OldButton;

OldButton.defaultProps = {
  tagName: 'button',
};

OldButton.propTypes = {
  /** Tag name for container */
  tagName: PropTypes.string,
  /** OldButton look, "light" or "inky". You can also directly import e. g. InkyOldButton */
  look: PropTypes.oneOf(['inky', 'light']),
  /** OldButton size, "small" or nothing for default */
  size: PropTypes.string,
  /** Additional className for element */
  className: PropTypes.string,
  /** Additional icon component */
  icon: PropTypes.node,
};

export const LightOldButton = function (props) {
  return <OldButton {...props} look="light" />;
};
export const InkyOldButton = function (props) {
  return <OldButton {...props} look="inky" />;
};
