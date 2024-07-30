import {isValidElement, memo} from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import cn from './index.module.scss';

const Button = (props) => {
  const {
    children,
    tagName: Tag = 'button',
    primary,
    secondary,
    tertiary,
    look,
    icon: Icon = null,
    type = null,
    small,
    size,
    className,
    ...rest
  } = props;

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
        [cn.primary]: primary || ['primary', 'inky'].includes(look),
        [cn.secondary]:
          (!look && !primary && !tertiary) || // default
          secondary ||
          ['secondary', 'default', 'light'].includes(look),
        [cn.tertiary]: tertiary || ['tertiary', 'transparent'].includes(look),
        [cn.icon]: Icon !== null,
        [cn.link]: Tag === 'a',
        [cn.small]: small || size === 'small',
      })}
      type={buttonType}
      {...rest}
    >
      {renderedIcon}
      {children}
    </Tag>
  );
};

Button.propTypes = {
  /** Tag name for container, e.g. a for links */
  tagName: PropTypes.string,
  /** Colors used for the button, choose `"primary"`, `"secondary"` or `"tertiary"`, deprecated: `"inky"` and `"light"` still work for now */
  look: PropTypes.oneOf([
    // 1)
    'inky',
    'primary',
    // 2)
    'default',
    'light',
    'secondary',
    // 3)
    'transparent',
    'tertiary',
  ]),
  /** Alternative: Should the primary look be used? */
  primary: PropTypes.bool,
  /** Alternative: Should the secondary look be used? */
  secondary: PropTypes.bool,
  /** Alternative: Should the tertiary look be used? */
  tertiary: PropTypes.bool,
  /** Should the button be rendered with less padding (more compact)? */
  small: PropTypes.bool,
  /** Deprecated: alternatively pass "small" as size */
  size: PropTypes.oneOf(['small']),
  /** The html attribute `type` */
  type: PropTypes.oneOf(['button', 'reset', 'submit']),
  /** Additional icon component */
  icon: PropTypes.node,
  /** Additional className for element */
  className: PropTypes.string,
  /** Additional styles and all other props will simply be forwarded */
  style: PropTypes.object,
};

export const PrimaryButton = function (props) {
  return <Button {...props} primary={true} />;
};

export const SecondaryButton = function (props) {
  return <Button {...props} secondary={true} />;
};

export const InkyButton = function (props) {
  return <Button {...props} look="inky" />;
};

export const LightButton = function (props) {
  return <Button {...props} look="light" />;
};

export const TransparentButton = function (props) {
  return <Button {...props} look="transparent" />;
};

export default memo(Button);
