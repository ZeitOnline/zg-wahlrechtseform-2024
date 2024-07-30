import PropTypes from 'prop-types';
import cx from 'classnames';

const Headline = ({
  level = 2,
  className,
  children,
  tagName = 'h2',
  ...rest
}) => {
  let Tag = tagName;

  if (level) {
    Tag = `h${level}`;
  }

  return (
    <Tag
      className={cx('article__subheading', 'article__item', className)}
      {...rest}
    >
      {children}
    </Tag>
  );
};

export default Headline;

Headline.propTypes = {
  /** Tag name for container */
  tagName: PropTypes.string,
  /** Level for the heading tag (overwrites tagName if used) */
  level: PropTypes.number,
  /** Additional className for element */
  className: PropTypes.string,
};
