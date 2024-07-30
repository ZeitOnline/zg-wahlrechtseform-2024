import cx from 'classnames';
import PropTypes from 'prop-types';

import cn from './index.module.scss';

/**
 * A card component with background color, rounded corners and drop shadow
 */
const Card = ({
  tagName: Tag = 'div',
  children,
  className,
  color,
  blurryBackground = false,
  dangerouslySetInnerHTML,
  innerRef,
  ...rest
}) => {
  return (
    <Tag
      className={cx(cn.card, className, {
        [cn.grey]: color === 'grey',
        [cn.blurryBackground]: blurryBackground,
      })}
      {...rest}
      ref={innerRef}
    >
      {dangerouslySetInnerHTML ? (
        <div
          className={cn.contentWrapper}
          data-element="content"
          {...{dangerouslySetInnerHTML}}
        />
      ) : (
        <div className={cn.contentWrapper} data-element="content">
          {children}
        </div>
      )}
    </Tag>
  );
};

Card.propTypes = {
  /** Tag name for container */
  tagName: PropTypes.string,
  /** Color, "grey" or empty (default). You can also directly import e. g. GreyCard */
  color: PropTypes.string,
  /** Additional className for element */
  className: PropTypes.string,
  /** Blurry background */
  blurryBackground: PropTypes.bool,
  /** If you need access to the ref of the div, pass your ref here */
  innerRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({current: PropTypes.object}),
  ]),
};

export default Card;

/**
 * Use if you use multiple cards so shadows don’t overlap the card contents
 */
export const CardContainer = ({
  children,
  tagName: Tag = 'div',
  className,
  ...rest
}) => {
  return (
    <Tag className={cx(cn.container, className)} {...rest}>
      {children}
    </Tag>
  );
};

CardContainer.propTypes = {
  /** Tag name for container */
  tagName: PropTypes.string,
  /** Additional className for element */
  className: PropTypes.string,
};

export const GreyCard = (props) => {
  const {children, ...rest} = props;
  return (
    <Card color="grey" {...rest}>
      {children}
    </Card>
  );
};
