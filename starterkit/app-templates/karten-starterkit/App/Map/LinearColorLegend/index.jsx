import {useMemo} from 'react';
import PropTypes from 'prop-types';
import cn from './LinearColorLegend.module.scss';

const LinearColorLegend = ({
  scale,
  title = 'Mietpreis',
  minLabel = '4 €',
  maxLabel = '18,88 €',
  noDataLabel = 'Keine Daten',
  subtitle = '(Neuvermietung) pro Quadratmeter',
}) => {
  const background = useMemo(() => {
    const colors = scale.domain().map((t, i, a) => {
      return {color: scale(t), t, step: Math.round((i / a.length) * 100) + '%'};
    });

    return `
    linear-gradient(
      to right,
      ${colors.map(({color, step}) => `${color} ${step}`).join(',\n')}
    )
    `;
  }, [scale]);

  return (
    <div className={cn.wrapper}>
      <div className={cn.title}>
        <strong className={cn.titleBold}>{title}</strong> {subtitle}
      </div>
      <div className={cn.scaleWrapper}>
        <div className={cn.scaleMin}>{minLabel}</div>
        <div className={cn.scale} style={{background}} />
        <div className={cn.scaleMax}>{maxLabel}</div>
        {noDataLabel && (
          <div className={cn.scaleNoData}>
            <div className={cn.scaleNoDataIcon} />
            <div className={cn.scaleNoDataLabel}>{noDataLabel}</div>
          </div>
        )}
      </div>
    </div>
  );
};

LinearColorLegend.propTypes = {
  /** d3.linearScale that returns colors for given values */
  scale: PropTypes.func,
  title: PropTypes.string,
  minLabel: PropTypes.string,
  maxLabel: PropTypes.string,
  noDataLabel: PropTypes.string,
  subtitle: PropTypes.string,
};

export default LinearColorLegend;
