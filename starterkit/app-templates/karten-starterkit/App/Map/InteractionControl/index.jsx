import React, {useCallback, memo} from 'react';
import cx from 'classnames';
import Toggle from 'react-toggle';

import 'react-toggle/style.css';
import cn from './index.module.scss';

const InteractionControl = memo(
  ({isInteractive, onChange, scrollMapIntoView, isVisible}) => {
    const handleClick = useCallback(() => {
      onChange(!isInteractive);

      if (!isInteractive) {
        scrollMapIntoView();
      }
    }, [isInteractive, onChange, scrollMapIntoView]);

    const labelRightClasses = cx(cn.label, {
      [cn.active]: !isInteractive,
    });

    const labelLeftClasses = cx(cn.label, {
      [cn.active]: isInteractive,
    });

    if (!isVisible) {
      return null;
    }

    return (
      <div className={cn.container}>
        <div className={labelRightClasses} onClick={handleClick}>
          Seite scrollen
        </div>
        <div className={cn.toggleContainer}>
          <Toggle
            className={cn.toggle}
            checked={isInteractive}
            icons={false}
            onChange={handleClick}
          />
        </div>
        <div className={labelLeftClasses} onClick={handleClick}>
          Karte bewegen und zoomen
        </div>
      </div>
    );
  },
);

export default InteractionControl;
