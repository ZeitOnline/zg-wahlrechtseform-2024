import {useEffect, useRef, useMemo, useCallback, useState} from 'react';
import ReactMapGL, {AttributionControl} from 'react-map-gl';
import {WebMercatorViewport} from 'viewport-mercator-project';
import debounce from 'debounce';
import cx from 'classnames';

import config from 'src/apps/index/config';
import useSize from 'core/hooks/useSize';
import useBreakpoint from 'core/hooks/useBreakpoint';
import VisualizationLayers from './VisualizationLayers';
import {IS_MOBILE} from 'core/utils/env';

import 'mapbox-gl/dist/mapbox-gl.css';

import cn from './GLMap.module.scss';
import Loader from 'core/components/Loader';
import placeholder from 'src/static/images/placeholder.jpg?url';
import {useWaypoint} from '../ScrollProgressor/store';
import useIsDarkMode from 'core/hooks/useIsDarkMode';
import ZoomControl from '../ZoomControl';
import Debugger from './Debugger';

const MAPBOX_API_TOKEN =
  'pk.eyJ1IjoiemVpdG9ubGluZSIsImEiOiJQcFlJLXdvIn0.RdRQOquzTgkvJ_lOV3EhEA';
const MAP_STYLE = 'mapbox://styles/zeitonline/clrhpocg200kj01r256724ns7';

const defaultWaypoint = config.waypoints.find((d) => d.id === 'default');

function Map({width, height}) {
  const prevBounds = useRef(null);
  const [map, setMap] = useState(null);
  const [halfLoaded, setHalfLoaded] = useState(false);
  const [fullyLoaded, setFullyLoaded] = useState(false);
  const isDarkMode = useIsDarkMode();

  const waypoint = useWaypoint();
  const isTabletMin = useBreakpoint('tablet', 'min');

  const initialViewport = useMemo(() => {
    const viewport = new WebMercatorViewport({width, height});
    const nextV = viewport.fitBounds(
      convertBounds(
        defaultWaypoint.boundsDesktop && defaultWaypoint.boundsMobile
          ? isTabletMin
            ? defaultWaypoint.boundsDesktop
            : defaultWaypoint.boundsMobile
          : defaultWaypoint.bounds,
      ),
    );
    return nextV;
  }, [width, height, isTabletMin]);

  const instantFlyTo = useCallback(
    ({longitude, latitude, zoom}) => {
      if (map) {
        map.flyTo({
          center: [longitude, latitude],
          zoom,
          duration: waypoint?.flyDuration || 2000,
        });
      }
    },
    [map, waypoint?.flyDuration],
  );

  // debounce flyto so that fast scrolling doesn’t make things look too weird
  const debouncedFlyTo = useMemo(
    () => debounce(instantFlyTo, 500),
    [instantFlyTo],
  );

  // use debounced flyto as callback
  const flyTo = useCallback(
    (viewport) => {
      debouncedFlyTo(viewport);
    },
    [debouncedFlyTo],
  );

  const handleHidableMapBoxLayers = useCallback((waypointToUse) => {
    if (
      !config.hidableMapBoxLayers ||
      !waypointToUse.mapBoxLayers ||
      !map
    )
      return;

    config.hidableMapBoxLayers.forEach((layer) => {
      const isVisible = waypointToUse.mapBoxLayers.includes(layer);

      map.setLayoutProperty(
        layer,
        'visibility',
        isVisible ? 'visible' : 'none',
      );
    });
  }, [map]);

  useEffect(() => {
    if (!waypoint) return;

    if (fullyLoaded) handleHidableMapBoxLayers(waypoint);

    const bounds =
      waypoint.boundsDesktop && waypoint.boundsMobile
        ? isTabletMin
          ? waypoint.boundsDesktop
          : waypoint.boundsMobile
        : waypoint.bounds;

    if (prevBounds.current === bounds) return;

    if (Array.isArray(bounds)) {
      const viewport = new WebMercatorViewport({width, height});
      const newViewportBounds = viewport.fitBounds(convertBounds(bounds));
      flyTo(newViewportBounds);
    } else if (typeof bounds === 'object') {
      flyTo(bounds);
    }
    prevBounds.current = bounds;
  }, [
    waypoint,
    isTabletMin,
    width,
    height,
    flyTo,
    instantFlyTo,
    isDarkMode,
    handleHidableMapBoxLayers,
    fullyLoaded,
  ]);

  const onLoad = useCallback((evt) => {
    setMap(evt.target);
    setHalfLoaded(true);

    handleHidableMapBoxLayers(defaultWaypoint);

    evt.target.touchZoomRotate.disableRotation();

    evt.target.once('idle', () => {
      setFullyLoaded(true);
      console.log('Map fully loaded 💸')
    });
  }, [handleHidableMapBoxLayers]);

  return (
    <div
      className={cx(cn.map, {[cn.interactive]: waypoint.interactive})}
      style={{height}}
    >
      <Loader
        placeholderImage={placeholder}
        isLoading={!halfLoaded}
        width="100%"
        height="100%"
      />
      {width > 0 && (
        <ReactMapGL
          onLoad={onLoad}
          initialViewState={initialViewport}
          mapStyle={MAP_STYLE}
          mapboxAccessToken={MAPBOX_API_TOKEN}
          attributionControl={false}
          width={width}
          height={height}
          interactive={true}
          cooperativeGestures={true}
          dragRotate={false}
          scrollZoom={false}
          minZoom={3}
          maxZoom={17}
        >
          <VisualizationLayers />
          <Debugger {...{map}} />
          <AttributionControl
            key={waypoint.customAttribution}
            customAttribution={waypoint.customAttribution}
            compact={!isTabletMin}
            style={{bottom: 0, right: 0, fontSize: '12px'}}
          />
          <ZoomControl
            isVisible={waypoint.interactive}
            {...{map}}
            showInitialZoomButton={false}
            onInitialZoom={() => {
              map?.fitBounds(
                IS_MOBILE
                  ? defaultWaypoint.boundsMobile
                  : defaultWaypoint.boundsDesktop,
              );
            }}
          />
        </ReactMapGL>
      )}
    </div>
  );
}

/** Wrap Map and pass dimensions */
function MapWrapper() {
  const [sizeRef, dimensions] = useSize();
  return (
    <div ref={sizeRef} className={cn.wrapper}>
      {dimensions.width > 300 && <Map {...dimensions} />}
    </div>
  );
}

function convertBounds(array) {
  if (typeof array?.[0] === 'number' && array?.length === 4)
    return [
      [array[0], array[1]],
      [array[2], array[3]],
    ];
  return array;
}

export default MapWrapper;
