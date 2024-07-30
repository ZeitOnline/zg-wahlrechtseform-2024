import cx from 'classnames';
import cn from './Components.module.scss';

/*
Separate the Tooltip components into their own file,
so they don’t have to import anything that won’t work during SSR
*/

export function TooltipContentContainer({children, className}) {
  return <div className={cx(cn.content, className)}>{children}</div>;
}
export function TooltipHeader({headline, subline, className}) {
  return (
    <div className={cx(cn.header, className)}>
      <h5 className={cn.headline}>{headline}</h5>
      {subline && <p className={cn.subline}>{subline}</p>}
    </div>
  );
}
export function TooltipBody({children, innerRef, className}) {
  return (
    <div className={cx(cn.body, className)} ref={innerRef}>
      {children}
    </div>
  );
}

export {default as TooltipChart} from './Chart.jsx';
