import React from 'react';
import cx from 'classnames';

import {sortByKey, numberFormat} from '../utils';
import useIsDarkMode from 'core/hooks/useIsDarkMode';

import cn from './index.module.scss';

const createSteps = (data, isDarkMode) => {
  const steps = data.reduce((res, item, i) => {
    const colorMode = isDarkMode ? 'dark' : 'light';
    const color = item.color[colorMode];
    if (!color) {
      return res;
    }

    if (!res[color]) {
      res[color] = {
        color: color,
        text: item.text ? item.text : false,
        min: item?.minmax?.[0],
        max: item?.minmax?.[1],
        id: `${color}__${item?.minmax?.[0] || i}`,
      };
    }

    return res;
  }, {});

  return Object.keys(steps)
    .map((colorKey) => steps[colorKey])
    .sort(sortByKey('min'));
};

const LegendItem = function ({
  min,
  max,
  color,
  text,
  itemCount,
  index,
  valueDecimals,
  children,
}) {
  let label = '';
  if (text) {
    label = (
      <>
        <strong>{text}</strong>
      </>
    );
  } else {
    label = children;
    if (!children) {
      let number = numberFormat(max, valueDecimals);
      // if (index === itemCount - 1) {
      //   const minValue = numberFormat(min, valueDecimals);
      //   label = (
      //     <strong>
      //       {minValue}–{number}
      //     </strong>
      //   );
      // } else {
      label = (
        <>
          bis <strong>{number}</strong>
        </>
      );
      // }
    }
  }

  return (
    <li className={cn.category}>
      <span className={cn.swatch} style={{backgroundColor: color}} />
      <span className={cn.label}>{label}</span>
    </li>
  );
};

const Legend = React.memo(
  ({isVisible, items, title, valueDecimals, noDataLabel, noDataColor}) => {
    const isDark = useIsDarkMode();

    if (!items || !isVisible) {
      return null;
    }

    const legendClasses = cx(cn.container, {
      [cn.noData]: noDataColor[isDark ? 'dark' : 'light'] || noDataColor,
    });
    const titleElement =
      title &&
      ((typeof title === 'string' && title.length > 0) ||
        typeof title === 'object') ? (
        <h5 className={cn.title}>{title}</h5>
      ) : null;
    const legendItems = createSteps(items, isDark);
    const legendElements = legendItems.map((item, i) => {
      return (
        <LegendItem
          {...item}
          index={i}
          itemCount={legendItems.length}
          valueDecimals={valueDecimals}
          key={item.id}
        />
      );
    });

    const noDataElement = noDataColor ? (
      <LegendItem color={noDataColor[isDark ? 'dark' : 'light'] || noDataColor}>
        {noDataLabel}
      </LegendItem>
    ) : null;

    return (
      <div className={legendClasses}>
        {titleElement}
        <ol className={cn.categories}>
          {legendElements}
          {noDataElement}
        </ol>
      </div>
    );
  },
);

Legend.defaultProps = {
  isVisible: true,
  title: '',
  valueDecimals: 1,
  noDataColor: false,
  viewNoData: true,
  noDataLabel: 'keine Daten',
};

export default Legend;
