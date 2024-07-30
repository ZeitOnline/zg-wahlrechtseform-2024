import {memo, Fragment, useCallback} from 'react';
import cx from 'classnames';

// import {SVGOverlay} from 'react-map-gl/maplibre';
import Overlay from './Overlay';
import useIsDarkMode from 'core/hooks/useIsDarkMode';

import cn from './index.module.scss';

import swoopyArrow from './swoopyArrow';
import defaultSwoopy from './defaultSwoopy';
import Labels from '../Labels';

const Swoopies = ({map, viewport, data, zoom, initialZoom}) => {
  const isDarkMode = useIsDarkMode();
  const mode = isDarkMode ? 'dark' : 'light';
  const visibleSwoopies = data
    ? data
        .map((swoopy) =>
          Object.assign(
            {},
            defaultSwoopy,
            swoopy,
            {position: swoopy.from},
            {
              key: `${swoopy.from.join(',')}-${swoopy.to.join(',')}`,
            },
          ),
        )
        .filter((d) => zoom >= d.minZoom && zoom < d.maxZoom)
    : null;

  const renderSwoopies = useCallback(() => {
    if (zoom > initialZoom + 0.5 || !data || !map?.project) {
      return null;
    }
    return (
      <>
        {visibleSwoopies.map((d) => {
          const from = d.from.slice(0).reverse();
          const to = d.to.slice(0).reverse();

          const sw = swoopyArrow()
            .angle(Math.abs(d.factor))
            .x((d) => d.x)
            .y((d) => d.y);

          const coords =
            d.factor < 0
              ? [map.project(to), map.project(from)]
              : [map.project(from), map.project(to)];
          const pathData = sw(coords);

          return (
            <Fragment key={d.key}>
              {d.displayOutline && (
                <path
                  d={pathData}
                  className={cx(cn.path, cn.outline, {
                    [cn.dark]: d.style[mode],
                  })}
                  style={d.outlineStyle}
                />
              )}
              <path
                d={pathData}
                className={cx(cn.path, {[cn.dark]: d.style[mode]})}
                style={d.pathStyle}
              />
            </Fragment>
          );
        })}
      </>
    );
  }, [visibleSwoopies, map, zoom, initialZoom, data, mode]);

  if (!visibleSwoopies) {
    return null;
  }

  return (
    <>
      <Overlay map={map} viewport={viewport} redraw={renderSwoopies} />
      <Labels data={visibleSwoopies} zoom={viewport.zoom} />
    </>
  );
};

export default memo(Swoopies);
