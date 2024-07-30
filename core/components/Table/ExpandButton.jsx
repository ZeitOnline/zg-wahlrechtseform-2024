import React, {useCallback} from 'react';
import Button from 'core/components/Button';
import cx from 'classnames';
import cn from './ExpandButton.module.scss';
import {useTable} from '.';
import isFinite from 'core/utils/isFinite';
import {isInViewport} from './utils';

function ExpandButton({scrollIntoViewRef, children}) {
  const {nTop, nTopFlop, showExpandButton, isExpanded, setIsExpanded} =
    useTable();

  const onClick = useCallback(() => {
    setIsExpanded(!isExpanded);
    if (!isInViewport(scrollIntoViewRef.current)) {
      scrollIntoViewRef.current.scrollIntoView();
    }
  }, [isExpanded, scrollIntoViewRef, setIsExpanded]);

  if (!isFinite(nTop) && !isFinite(nTopFlop)) return null;
  if (!showExpandButton) return null;

  return (
    <div
      className={cx(cn.expandButtonWrapper, {
        [cn.tableIsCollapsed]: !isExpanded,
        [cn.showsTopFlops]: !isExpanded && isFinite(nTopFlop),
      })}
    >
      <Button {...{onClick}}>{children}</Button>
    </div>
  );
}

export default ExpandButton;
