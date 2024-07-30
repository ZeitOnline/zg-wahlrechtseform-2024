import {useCallback, useMemo, useState} from 'react';
import ReactMapGL from 'react-map-gl/maplibre';

import copy from 'core/utils/deepCopy.js';
import {SUPPORTS_TOUCH, iOSVersion, IS_IOS} from 'core/utils/env.js';
import cn from './index.module.scss';
import useIsDarkMode from 'core/hooks/useIsDarkMode';
import {IS_MOBILE} from 'core/utils/env.js';

export default function BasisMap({
  isLoading,
  mapOptions,
  onLoadMap,
  viewport,
  setViewport,
  initialZoom,
  dragPanAllowed,
  isScreenshotMode,
  children,
}) {
  const isDark = useIsDarkMode();
  const [cursor, setCursor] = useState('default');
  const setGrabCursor = useCallback(() => {
    setCursor('grabbing');
  }, []);
  const setDefaultCursor = useCallback(() => {
    setCursor('default');
  }, []);

  const handleMove = useCallback(
    (e) => {
      const {longitude, latitude, zoom} = e.viewState;
      let isInteractive = false;
      if (
        (!isLoading &&
          e?.originalEvent?.touches &&
          e?.originalEvent?.touches.length > 1) ||
        (!SUPPORTS_TOUCH && !isLoading && e?.originalEvent)
      ) {
        isInteractive = true;
      }
      setViewport((v) => ({
        ...v,
        longitude,
        latitude,
        zoom,
        isInteractive: isInteractive,
      }));
    },
    [setViewport, isLoading],
  );

  const handleDoubleClick = useCallback(
    (e) => {
      if (!SUPPORTS_TOUCH) {
        e.target?.on('zoomend', () => {
          setTimeout(() => {
            setViewport((v) => ({
              ...v,
              isInteractive: false,
            }));
          }, 0);
        });
      }
    },
    [setViewport],
  );

  const minZoom = mapOptions.minZoom || initialZoom - 0.5;
  const maxZoom = mapOptions.maxZoom || initialZoom + 3;
  const filteredBasemapStyle = useMemo(() => {
    let styleCopy = copy(mapOptions.basemap.style[isDark ? 'dark' : 'light']);
    styleCopy.layers = styleCopy.layers.filter((d) => {
      return !mapOptions.basemap.hidden.includes(d.type);
    });

    const minzoom = initialZoom + 0.25;

    if (styleCopy.sources.openmaptiles && !mapOptions.basemap.alwaysVisible) {
      // we don't want to load the open map tiles on start up
      styleCopy.layers = styleCopy.layers.map((l) => {
        if (l.source === 'openmaptiles') {
          l.minzoom = minzoom;
        }
        return l;
      });
    }
    if (styleCopy.sources['terrain-rgb'] && !mapOptions.basemap.alwaysVisible) {
      // we don't want to load the open map tiles on start up
      styleCopy.layers = styleCopy.layers.map((l) => {
        if (l.source === 'terrain-rgb') {
          l.minzoom = minzoom;
        }
        return l;
      });
    }

    return styleCopy;
  }, [mapOptions.basemap, initialZoom, isDark]);

  const touchAction =
    (IS_IOS && iOSVersion() < 13) || (!dragPanAllowed && SUPPORTS_TOUCH)
      ? 'pan-y'
      : 'none';
  const touchZoomAllowed =
    (mapOptions.interactiveMap && SUPPORTS_TOUCH) || viewport.isInteractive;

  let transitionDuration;
  if (viewport.transitionDuration && viewport.transitionDuration !== 1) {
    transitionDuration = viewport.transitionDuration;
  } else {
    transitionDuration = IS_MOBILE ? 0 : 0;
  }

  return (
    <ReactMapGL
      onLoad={onLoadMap}
      mapStyle={filteredBasemapStyle}
      style={{
        width: viewport.width,
        height: viewport.height,
      }}
      initialViewState={{
        longitude: viewport.longitude,
        latitude: viewport.latitude,
        zoom: viewport.zoom,
      }}
      onMove={handleMove}
      onDblClick={handleDoubleClick}
      minZoom={minZoom}
      maxZoom={maxZoom}
      maxBounds={mapOptions.maxBounds}
      scrollZoom={viewport.isInteractive}
      dragPan={dragPanAllowed}
      dragRotate={mapOptions.allowMapRotation && viewport.isInteractive}
      doubleClickZoom={mapOptions.interactiveMap}
      touchZoom={touchZoomAllowed}
      touchRotate={mapOptions.allowMapRotation && viewport.isInteractive}
      touchZoomRotate={true}
      cooperativeGestures={
        SUPPORTS_TOUCH && {
          windowsHelpText:
            'Halten Sie die Strg-Taste gedrückt und scrollen Sie, um die Karte zu zoomen',
          macHelpText:
            'Halten Sie die Befehlstaste gedrückt und scrollen Sie, um die Karte zu zoomen',
          mobileHelpText: 'Karte mit zwei Fingern bewegen und zoomen',
        }
      }
      transitionDuration={transitionDuration}
      transitionEasing={viewport.transitionEasing}
      transitionInterpolator={viewport.transitionInterpolator}
      transitionInterruption={viewport.transitionInterruption}
      className={cn.mapDiv}
      preserveDrawingBuffer={isScreenshotMode}
      cursor={cursor}
      onDragStart={setGrabCursor}
      onDragEnd={setDefaultCursor}
      attributionControl={false}
      touchAction={touchAction}
      onTouchMove={(evt) => viewport.isInteractive && evt.preventDefault()}
    >
      {children}
    </ReactMapGL>
  );
}
