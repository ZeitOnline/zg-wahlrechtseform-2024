import React, {useCallback, useEffect, useMemo, useState} from 'react';
import PropTypes from 'prop-types';
import {scaleLinear} from 'd3-scale';
import cx from 'classnames';
import cn from './index.module.scss';
import lerp from 'core/utils/lerp';
import debug from '../../debug';
import {parseAnnotations, timecodeRegex} from '../VideoProgressor/utils';

function Annotations({data, progress, frameRate, isTabletMin, dimensions}) {
  const [frame, setFrame] = useState(0);
  const [scale, setScale] = useState(1);

  // convert timecodes to frames
  const parsedAnnotations = useMemo(() => {
    return data.map(parseAnnotations(frameRate, isTabletMin));
  }, [data, frameRate, isTabletMin]);

  const onScroll = useCallback(() => {
    const newFrame = Math.round(progress.current);
    setFrame(newFrame);
  }, [progress]);

  const onResize = useCallback(() => {
    if (typeof window === 'undefined') return;
    const screenAspectRatio = window.innerWidth / window.innerHeight;
    const movieAspectRatio = dimensions.width / dimensions.height;
    const newIsHeightConstraining = screenAspectRatio < movieAspectRatio;
    const newScale = newIsHeightConstraining
      ? window.innerHeight / dimensions.height
      : window.innerWidth / dimensions.width;
    setScale(newScale);
  }, [dimensions]);

  useEffect(() => {
    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [onScroll, onResize]);

  return (
    <>
      <div className={cn.wrapper}>
        <div className={cn.inner}>
          {parsedAnnotations.map((d, i) => (
            <Annotation
              key={`${i}`}
              {...{frame, scale, ...d}}
              debug={debug.annotations}
            />
          ))}
        </div>
      </div>
    </>
  );
}

function Annotation({
  frame,
  visible,
  style,
  translate,
  offsets,
  scale,
  className,
  children,
  debug,
  textAlign,
}) {
  const opacityScale = useMemo(() => {
    const {from, to, duration = 10} = visible;
    return scaleLinear()
      .domain([from - duration, from, to, to + duration])
      .range([0, 1, 1, 0])
      .clamp(true)
      .unknown(0);
  }, [visible]);

  const translateScale = useMemo(() => {
    if (!offsets?.length) return () => ({x: 0, y: 0}); // no valid offsets
    const start = offsets[0];
    const end = offsets[offsets.length - 1];
    if (offsets.every((d) => d.time)) {
      // will return a value between 0 and 1
      const interpolate = scaleLinear()
        .domain([start.time, end.time])
        .clamp(true)
        .unknown(0);
      return (frame) => ({
        x: lerp(start.x, end.x, interpolate(frame)),
        y: lerp(start.y, end.y, interpolate(frame)),
      });
    } else {
      // no movement
      return () => start;
    }
  }, [offsets]);

  if (typeof window === 'undefined') return null;

  const opacity = opacityScale(frame);
  const {x, y} = translateScale(frame);
  const transform = `translate(${x * scale}px, ${y * scale}px)`;

  return (
    <div
      style={{
        ...style,
        textAlign,
        opacity,
        transform,
      }}
      className={cx(cn.annotation, 'zg-videoscroller-annotation', className)}
    >
      {debug && <div className={cn.debugAnchor} />}
      <div
        className={cx(cn.inner, {[cn.debugInner]: debug})}
        style={{transform: translate}}
      >
        {children}
      </div>
    </div>
  );
}

const anchorPropType = PropTypes.oneOf([
  'top left',
  'left top',
  'top center',
  'center top',
  'top right',
  'right top',
  'center left',
  'left center',
  'center center',
  'center right',
  'right center',
  'bottom left',
  'left bottom',
  'bottom center',
  'center bottom',
  'bottom right',
  'right bottom',
]);

export const timecodePropType = (props, propName, componentName) => {
  const value = props[propName];

  if (
    value == null ||
    (typeof value === 'string' && value.match(timecodeRegex))
  ) {
    return null;
  }

  return new TypeError(
    `Invalid Time Code Prop Value: ${value} for ${propName} in ${componentName}`,
  );
};

const offsetPropType = PropTypes.shape({
  time: timecodePropType,
  x: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  y: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
});

Annotations.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      visible: PropTypes.shape({
        from: timecodePropType,
        to: timecodePropType,
        duration: PropTypes.number,
      }),
      offsets: PropTypes.oneOfType([
        offsetPropType,
        PropTypes.shape({
          desktop: PropTypes.arrayOf(offsetPropType),
          mobile: PropTypes.arrayOf(offsetPropType),
        }),
      ]),
      anchor: PropTypes.oneOfType([
        anchorPropType,
        PropTypes.shape({
          desktop: anchorPropType,
          mobile: anchorPropType,
        }),
      ]),
      className: PropTypes.string,
      style: PropTypes.object,
      children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
        PropTypes.func,
      ]),
    }),
  ),
  progress: PropTypes.shape({
    current: PropTypes.number,
  }),
  frameRate: PropTypes.number,
  isTabletMin: PropTypes.bool,
  dimensions: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
  }),
  debug: PropTypes.bool,
};

export default Annotations;
