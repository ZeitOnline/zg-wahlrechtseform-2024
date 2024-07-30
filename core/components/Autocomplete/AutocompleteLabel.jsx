import cx from 'classnames';

import cn from './AutocompleteLabel.module.scss';

function AutocompleteLabel({
  label,
  small,
  secondaryLabel,
  value,
  className,
  href,
}) {
  let smallElement = null;
  if (small) {
    smallElement = (
      <>
        {' '}
        <small>{small}</small>
      </>
    );
  } else if (value !== null && typeof value !== 'undefined') {
    smallElement = (
      <>
        {' '}
        <small>{value}</small>
      </>
    );
  }
  let secondaryLabelElement = null;
  if (secondaryLabel) {
    secondaryLabelElement = (
      <>
        <br />
        <small className={cn.secondaryLabel}>{secondaryLabel}</small>
      </>
    );
  }

  return (
    <div className={cx(cn.container, className)}>
      {href ? <a href={href}>{label}</a> : <span>{label}</span>}
      {smallElement}
      {secondaryLabelElement}
    </div>
  );
}

export default AutocompleteLabel;
