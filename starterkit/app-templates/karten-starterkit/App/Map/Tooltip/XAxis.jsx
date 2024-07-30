import {useMemo} from 'react';

import {translate} from './utils';

import cn from './Chart.module.scss';

export default ({data, height, xScale, dataAccessKey, ticks = 5}) => {
  const isEAuto = dataAccessKey === 'EAuto_pro_Auto';

  const gap = useMemo(() => {
    if (!data.length) {
      return 0;
    }
    return ticks >= data.length ? 1 : Math.round(data.length / (ticks - 1));
  }, [data, ticks]);

  return data.map(({date, value}, index) => {
    const year = date.getFullYear().toString();
    const yearYY = year.substr(2, 4);
    const isFirstOrLast = index === 0 || index === data.length - 1;

    if (!isFirstOrLast && index % 2 !== 0 && isEAuto) {
      return null;
    }

    return (
      <g transform={translate(xScale(date), 0)} key={`xaxis_${year}`}>
        {(isFirstOrLast || index % gap === 0) && (
          <>
            <line className={cn.axisLine} x1={0} x2={0} y1={0} y2={height} />
            <text
              textAnchor="middle"
              className={cn.axisLabel}
              x="0"
              y={height + 14}
            >
              {isFirstOrLast ? year : `’${yearYY}`}
            </text>
          </>
        )}
      </g>
    );
  });
};
