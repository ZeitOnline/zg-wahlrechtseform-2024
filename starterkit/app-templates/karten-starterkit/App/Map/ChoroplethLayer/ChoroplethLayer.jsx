/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useMemo, useCallback, useRef, memo} from 'react';
import {Source, Layer} from 'react-map-gl/maplibre';

import useIsDarkMode from 'core/hooks/useIsDarkMode';
import {IS_MOBILE, SUPPORTS_TOUCH} from 'core/utils/env.js';
import {parseProps} from '../utils.js';
import Overlays from '../Overlays/index.jsx';
import {getChoroplethLayerId} from '../utils.js';

const zoomBasedLineWidth = [
  'interpolate',
  ['exponential', 0.7],
  ['zoom'],
  8,
  0.2,
  10,
  2,
];
const zoomBasedLineWidthHover = [
  'interpolate',
  ['linear'],
  ['zoom'],
  8,
  2,
  10,
  3,
];

const defaultStyles = {
  color: '#fff',
  opacity: 0.3,
  fillColor: ['#f00'],
  fillOpacity: 1,
  weight: zoomBasedLineWidth,
};

const defaultStylesHover = {
  weight: zoomBasedLineWidthHover,
  opacity: 1,
  color: '#fff',
};

const ChoroplethLayer = memo(
  ({
    map,
    id,
    source,
    styles,
    stylesHover,
    onMouseEnter,
    onMouseLeave,
    onMouseMove,
    interactive,
    rawStyles,
    toggleIndex,
    overlays,
    insertBefore,
  }) => {
    const isDark = useIsDarkMode();
    const sourceId = `${getChoroplethLayerId({id})}-source`;
    const choroplethLayerId = getChoroplethLayerId({id});
    const strokeLayerId = `${getChoroplethLayerId({id})}-stroke`;
    const hoverLayerId = `${getChoroplethLayerId({id})}-hover`;
    // const activeLayerId = `${id}-active`;
    const overlaysId = `${getChoroplethLayerId({id})}-overlays`;

    const layerStyles = useMemo(() => {
      return Object.assign(defaultStyles, isDark ? styles.dark : styles.light);
    }, [isDark, styles]);
    const layerStylesHover = useMemo(() => {
      return Object.assign(
        defaultStylesHover,
        isDark ? stylesHover.dark : stylesHover.light,
      );
    }, [isDark, stylesHover]);

    const hoverId = useRef(null);
    const resetHoveredFeature = () => {
      hoverId.current !== null &&
        map.setFeatureState(
          {source: sourceId, sourceLayer: 'data', id: hoverId.current},
          {hover: false},
        );
    };
    const handleMouseMove = useCallback(
      (evt) => {
        if (!evt.features.length) {
          return false;
        }

        const {lngLat, features} = evt;
        const feature = features[0];
        const {properties, id} = feature;

        map.getContainer().classList.add('force-cursor-default');

        if (hoverId.current !== id) {
          resetHoveredFeature();
          map.setFeatureState(
            {source: sourceId, sourceLayer: 'data', id},
            {hover: true},
          );
          onMouseEnter(parseProps(properties));
        }
        hoverId.current = id;

        onMouseMove(lngLat);
      },
      [map, onMouseEnter, onMouseMove, sourceId],
    );

    const handleMouseLeave = useCallback(() => {
      map.getContainer().classList.remove('force-cursor-default');

      resetHoveredFeature();
      hoverId.current = null;
      if (onMouseLeave) {
        onMouseLeave();
      }
    }, [map, sourceId, onMouseLeave]);

    const handleMouseOut = useCallback(() => {
      handleMouseLeave();
    }, [handleMouseLeave]);

    useEffect(() => {
      const activeMouseEvent = IS_MOBILE ? 'click' : 'mousemove';
      const eventToggle = interactive ? 'on' : 'off';
      map[eventToggle](activeMouseEvent, choroplethLayerId, (e) => {
        handleMouseMove(e);
      });
      map[eventToggle]('mouseleave', choroplethLayerId, () => {
        handleMouseLeave();
      });
      map[eventToggle]('_mouseout', handleMouseOut);
      map[eventToggle]('zoomstart', handleMouseOut);
      map[eventToggle](
        'doubleClick',
        SUPPORTS_TOUCH ? handleMouseOut : () => {},
      );
    }, [interactive]);

    const rawStrokeStyles =
      rawStyles && rawStyles.strokeLayer ? rawStyles.strokeLayer : null;
    const rawPaintStyles =
      rawStrokeStyles && rawStyles.paint ? rawStrokeStyles.paint : {};

    return (
      <>
        <Source
          type="vector"
          tiles={[`${source}/{z}/{x}/{y}.pbf`]}
          id={sourceId}
        />
        <Layer
          id={choroplethLayerId}
          type="fill"
          source={sourceId}
          source-layer="data"
          paint={{
            'fill-color': layerStyles.fillColor[toggleIndex],
            'fill-opacity': layerStyles.fillOpacity || 1,
          }}
          beforeId={insertBefore}
        />
        <Layer
          id={strokeLayerId}
          type="line"
          source={sourceId}
          source-layer="data"
          paint={{
            'line-color': layerStyles.color,
            'line-opacity': layerStyles.opacity,
            'line-width': layerStyles.weight,
            ...rawPaintStyles,
          }}
          layout={{'line-join': 'round'}}
          beforeId={insertBefore}
        />
        {overlays && (
          <Overlays
            map={map}
            overlays={overlays}
            id={overlaysId}
            // beforeId={hoverLayerId}
          />
        )}
        <Layer
          id={hoverLayerId}
          type="line"
          source={sourceId}
          source-layer="data"
          paint={{
            'line-color': layerStylesHover.color,
            'line-opacity': [
              'case',
              ['boolean', ['feature-state', 'hover'], false],
              layerStylesHover.opacity,
              0,
            ],
            'line-width': layerStylesHover.weight,
          }}
          beforeId={insertBefore}
        />
        {/* { (
          <Layer
            id={activeLayerId}
            type="line"
            source={sourceId}
            source-layer="data"
            paint={{
              'line-color': [
                'match',
                ['get', 'RS'],
                hoverId.current,
                '#ffffff',
                '#fff',
              ],
              'line-opacity': ['match', ['get', 'RS'], hoverId.current, 1, 0],
              // ['step', ['get', 'RS'], rs, '#b91109', '#fff'],
              'line-width': ['match', ['get', 'RS'], hoverId.current, 2, 0],
              //'fill-color': 'red',
              //'fill-opacity': ['match', ['get', 'RS'], rs, 1, 0.5],
              //'fill-pattern': 'stripes',
            }}
          />
        )} */}
      </>
    );
  },
);

export default ChoroplethLayer;
