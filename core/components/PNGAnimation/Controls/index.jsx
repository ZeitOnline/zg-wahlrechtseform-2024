import {useState, useEffect, useMemo, useCallback} from 'react';
import cx from 'classnames';
import Slider from 'rc-slider/lib/Slider';
import 'rc-slider/assets/index.css';

import FormattedDateTime from 'core/components/FormattedDateTime';
import PlayIcon from 'core/icons/play.svg?react';
import RepeatIcon from 'core/icons/repeat.svg?react';
import PauseIcon from 'core/icons/pause.svg?react';
import cn from './index.module.scss';

const SliderHandle = (props) => (
  <div className={cn.sliderInvisibleHandle} style={{left: `${props.offset}%`}}>
    <div className={cn.sliderHandle}></div>
  </div>
);

const Tick = ({date, locale, dateFormat}) => (
  <div className="tick">
    <FormattedDateTime
      datetime={date}
      format={dateFormat || 'dateWithoutYearShort'}
      // locale={locale}
    />
  </div>
);

const Controls = ({
  dates,
  currentIndex,
  setCurrentIndex,
  isVisible,
  locale,
  todayLabel,
  dateFormat,
  sliderWrapperClassName,
  intervalTime = 200,
}) => {
  const [playing, setPlaying] = useState({
    isPlaying: false,
    wasPlaying: false,
  });

  useEffect(() => {
    let intervalId;
    if (playing.isPlaying) {
      intervalId = setInterval(() => {
        setCurrentIndex((index) => {
          const nextIndex = index + 1;
          return nextIndex >= dates.length ? index : nextIndex;
        });
      }, intervalTime);
    } else {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [dates.length, intervalTime, playing.isPlaying, setCurrentIndex]);

  useEffect(() => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= dates.length) setPlaying({isPlaying: false});
  }, [currentIndex, dates.length]);

  useEffect(() => {
    setPlaying({isPlaying: isVisible});
  }, [isVisible]);

  const onReplay = () => {
    setCurrentIndex(0);
    setPlaying({isPlaying: true});
  };

  const onSliderChange = useCallback(
    (value) => {
      requestAnimationFrame(() => {
        setCurrentIndex(value);
      });
    },
    [setCurrentIndex],
  );

  const marks = useMemo(() => {
    const stepSize = Math.round((dates.length - 1) / 3);
    return {
      0: (
        <Tick
          date={dates[0].date}
          /*locale={locale}*/ dateFormat={dateFormat}
        />
      ),
      [stepSize]: (
        <Tick
          date={dates[stepSize].date}
          // locale={locale}
          dateFormat={dateFormat}
        />
      ),
      [stepSize * 2]: (
        <Tick
          date={dates[stepSize * 2].date}
          // locale={locale}
          dateFormat={dateFormat}
        />
      ),
      [dates.length - 1]: (
        <div className="tick">
          <div className="tickLabel">
            {(todayLabel === 'last_date_formatted' && (
              <FormattedDateTime
                datetime={dates[dates.length - 1].date}
                format={dateFormat || 'dateWithoutYearShort'}
                // locale={locale}
              />
            )) ||
              todayLabel ||
              'Aktuell'}
          </div>
        </div>
      ),
    };
  }, [dateFormat, dates, locale, todayLabel]);

  const showPause = playing.isPlaying || playing.wasPlaying;
  const showReplay = currentIndex === dates.length - 1 && !playing.isPlaying;
  const showPlay = !showReplay && !showPause;

  return (
    <div className={cn.container}>
      <button
        className={cx(cn.controlButton, {
          [cn.play]: showPlay,
          [cn.pause]: showPause,
        })}
        onClick={
          showReplay
            ? onReplay
            : () => setPlaying({isPlaying: !playing.isPlaying})
        }
      >
        {showPause ? <PauseIcon /> : showReplay ? <RepeatIcon /> : <PlayIcon />}
      </button>
      <div className={cx(sliderWrapperClassName, cn.sliderWrapper)}>
        <div className={cn.sliderContainer}>
          <Slider
            min={0}
            max={dates.length - 1}
            step={1}
            value={currentIndex}
            handle={SliderHandle}
            onBeforeChange={() => {
              if (playing.isPlaying) {
                setPlaying({isPlaying: false, wasPlaying: true});
              }
            }}
            onChange={onSliderChange}
            onAfterChange={(value) => {
              if (playing.wasPlaying) {
                setCurrentIndex(parseInt(value));
                setPlaying({isPlaying: true});
              }
            }}
            included={false}
            marks={marks}
          />
        </div>
      </div>
    </div>
  );
};

export default Controls;
