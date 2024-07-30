import {useCallback} from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Icon from 'src/static/images/circle-plus.svg?react';

import cn from './index.module.scss';

const CloseButton = (props) => {
  const {className, onClick, theme, ...rest} = props;

  const handleClick = useCallback(
    (event) => {
      event.stopPropagation();
      onClick();
    },
    [onClick],
  );

  return (
    <button
      className={cx(cn.closeButton, className, {[cn.light]: theme === 'light'})}
      onClick={handleClick}
      {...rest}
    >
      <Icon className={cn.icon} />
    </button>
  );
};

CloseButton.propTypes = {
  /** Callback function that is called on click without any arguments */
  onClick: PropTypes.func.isRequired,
  /** Should the button be rendered in `"light"` or `"dark"`? */
  theme: PropTypes.oneOf(['light', 'dark']),
  /** Is passed down to the `<button />` */
  className: PropTypes.string,
};

export default CloseButton;
