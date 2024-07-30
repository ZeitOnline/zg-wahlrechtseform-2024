import PropTypes from 'prop-types';
import cx from 'classnames';

import zLogo from 'src/static/images/z.svg?url';

import cn from './index.module.scss';

const Loader = ({
  placeholderHTML,
  placeholderImage,
  height,
  width,
  isLoading = false,
  isPlaceholder,
  style,
  className,
}) => {
  const loaderStyle = {
    ...style,
    opacity: isLoading ? 1 : 0,
    height: height ? height : null,
  };

  if (placeholderHTML) {
    return (
      <div
        style={{
          opacity: isLoading ? 1 : 0,
          position: isLoading ? 'relative' : 'absolute',
        }}
        dangerouslySetInnerHTML={{__html: placeholderHTML}}
      />
    );
  }

  const preloadImageStyle = {
    backgroundImage:
      placeholderImage && width ? `url(${placeholderImage})` : 'none',
    height,
    width,
  };

  return (
    <div
      className={cx(cn.container, className, {
        [cn.placeholder]: isPlaceholder,
      })}
      style={loaderStyle}
    >
      <div className={cn.preloadImage} style={preloadImageStyle} />
      <div className={cn.loader}>
        <img className={cn.loadingIcon} src={`${zLogo}`} alt="" />
      </div>
    </div>
  );
};

Loader.propTypes = {
  /** Pass `true` if you want the Loader to be visible */
  isLoading: PropTypes.bool,
  /** If set to true, the container will have `position: relative;` set */
  isPlaceholder: PropTypes.bool,
  /** If you want, you can pass a fixed width – `100%` is the default */
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** If you want, you can pass a fixed height – `100%` is the default */
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** Instead of the logo, you can also pass your own HTML as a string */
  placeholderHTML: PropTypes.string,
  /** You can render an image behind the logo. If you do, also pass width and height */
  placeholderImage: PropTypes.string,
  /** Will be applied to the outermost div */
  style: PropTypes.object,
  /** Will be added to the outermost div */
  className: PropTypes.string,
};

export default Loader;
