import PropTypes from 'prop-types';
// import enLocale from 'd3-time-format/locale/en-US.json';
import {useState, useMemo} from 'react';
import {parseISO} from 'date-fns';

import cn from './index.module.scss';
import Controls from './Controls';
import useIsVisible from 'core/hooks/useIsVisible';
import FormattedDateTime from 'core/components/FormattedDateTime';

const PNGAnimation = function ({todayLabel, images, intervalTime, source}) {
  const [isVisibleRef, isVisible] = useIsVisible();

  // Index of which image to show.
  const [currentIndex, setCurrentIndex] = useState(0);

  // Load dates from file names. Naming convention: YYYY-MM-DD.png
  const dates = useMemo(() => {
    const dates = images.map((image) => {
      try {
        return {
          date: parseISO(image.match(/\d{4}-\d{2}-\d{2}/)[0]),
        };
      } catch (e) {
        console.log(e);
      }
    });
    return dates;
  }, [images]);

  // TODO: preload images

  // alle lazy laden außer die ersten und sonst onload
  const imageSrc = images[currentIndex];
  const currentDate = dates[currentIndex].date;

  return (
    <div className={cn.container} ref={isVisibleRef}>
      <span className={cn.date}>
        <FormattedDateTime datetime={currentDate} format="date" />
      </span>
      <img src={imageSrc} alt="" />
      <span className={cn.source}>{source}</span>
      <Controls
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
        dates={dates}
        isVisible={isVisible}
        // locale={enLocale}
        todayLabel={todayLabel}
        dateFormat={'dateWithoutYearShort'}
        intervalTime={intervalTime}
      />
    </div>
  );
};

PNGAnimation.defaultProps = {
  intervalTime: 200,
};

PNGAnimation.propTypes = {
  /** Show last formatted last date or "Aktuell" as last label in timeline */
  todayLabel: PropTypes.string,
  /** import glob with folder for images */
  images: PropTypes.object,
  /** Interval until next png is displayed in autoplay mode. */
  intervalTime: PropTypes.number,
  /** Data source. Can be a string or a react component */
  source: PropTypes.string | PropTypes.func,
};

export default PNGAnimation;
