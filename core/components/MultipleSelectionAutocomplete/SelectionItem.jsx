import {useCallback} from 'react';
import cx from 'classnames';

import cn from './index.module.scss';

function SelectionItem({data, onRemove, unRemovable}) {
  const label = data.itemLabel || data.label;
  const labelShortened = label.length > 22 ? `${label.slice(0, 22)}...` : label;
  const handleClick = useCallback(
    (event) => {
      event.stopPropagation();
      onRemove(data);
    },
    [onRemove, data],
  );

  return (
    <div
      style={{
        background: data.color[1],
        borderTop: `3px solid ${data.color[0]}`,
        display: 'flex',
        flexWrap: 'no-wrap',
      }}
      className={cx(cn.item)}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={handleClick}
    >
      <span style={{width: 'max-content'}}>{labelShortened}</span>
      {!unRemovable && <div className={cn.itemRemove}>✕</div>}
    </div>
  );
}

export default SelectionItem;
