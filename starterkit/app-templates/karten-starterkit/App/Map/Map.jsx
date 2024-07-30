import {useState, useCallback, useEffect, useRef, useMemo} from 'react';
import cx from 'classnames';
import debounce from 'debounce';

import track from 'core/utils/track.js';
import {SUPPORTS_TOUCH} from 'core/utils/env.js';
import useIsVisible from 'core/hooks/useIsVisible.js';

import BasisMap from './BasisMap/index.jsx';
import ChoroplethLayer from './ChoroplethLayer/index.jsx';
import Labels from './Labels/index.jsx';
import HomeMarker from './HomeMarker/index.jsx';
import ZoomControl from './ZoomControl/index.jsx';
import ScaleControl from './ScaleControl/index.jsx';

import Swoopies from './Swoopies/index.jsx';
import Footer from './Footer/index.jsx';

import MapAttribution from './MapAttribution/index.jsx';
import BaseMapLayer from './BaseMapLayer/index.jsx';
import InteractionControl from './InteractionControl/index.jsx';
import Legend from './Legend/index.jsx';
import DownloadMapButton from './DownloadMapButton/index.jsx';
import Geocoder from './Geocoder/index.jsx';
import Switcher from 'core/components/Switcher/index.jsx';
import Loader from 'core/components/Loader/index.jsx';

import {noop, getCurrentMapBounds, getChoroplethLayerId} from './utils.js';

import buffer from '@turf/buffer';
import bboxPolygon from '@turf/bbox-polygon';
import bbox from '@turf/bbox';

import 'maplibre-gl/dist/maplibre-gl.css';
import cn from './Map.module.scss';

const OVERLAY_LAYER_ID = 'overlay-layer';

const MapGL = ({options, metaData, height, onLoad = noop, className}) => {
  const geocoderRef = useRef(null);
  const wrapperRef = useRef(null);
  const isAutoscrolling = useRef(false);
  const isVisible = useIsVisible(wrapperRef, {});

  const [toggleIndex, setToggleIndex] = useState(0);
  const [maptouch, setMapTouch] = useState(false);
  const [map, setMap] = useState(null);
  const [mapOptions, setMapOptions] = useState(options);
  const [initialZoom, setInitialZoom] = useState(5);
  const [viewport, setViewport] = useState({
    zoom: initialZoom,
    latitude: 0,
    longitude: 0,
    width: '100%',
    height,
    isInteractive: false,
  });
  const [geocoderPos, setGeocoderPos] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const wrapperDimensions = useMemo(() => {
    if (wrapperRef.current && isVisible) {
      const {width, height} = wrapperRef.current.getBoundingClientRect();
      return {width, height};
    }
    return {width: 0, height: 0};
  }, [wrapperRef, isVisible]);

  const getInitial = useCallback(() => {
    let options = {};
    if (mapOptions.fullwidth) {
      options = {
        padding: 14,
      };
    }
    const bounds = metaData?.bounds || mapOptions.view?.bounds;
    const view = map.cameraForBounds(bounds, options);
    const hasViewOption = mapOptions.view;

    const latitude =
      hasViewOption && mapOptions.view.lat
        ? mapOptions.view.lat
        : view.center.lat;
    const longitude =
      hasViewOption && mapOptions.view.lng
        ? mapOptions.view.lng
        : view.center.lng;
    const zoom =
      hasViewOption && mapOptions.view.zoom ? mapOptions.view.zoom : view.zoom;

    return {
      latitude,
      longitude,
      zoom,
    };
  }, [map, mapOptions.fullwidth, mapOptions.view, metaData]);

  const setInitialView = useCallback(() => {
    const {latitude, longitude, zoom} = getInitial();

    setViewport((v) => ({
      ...v,
      latitude,
      longitude,
      zoom,
      isInteractive: false,
      transitionDuration: 0,
    }));

    map.setZoom(zoom);
    map.setCenter([longitude, latitude]);

    setInitialZoom(zoom);
    // }, [map, mapOptions.view, metaData]);
  }, [map, getInitial]);

  const setInteractivity = useCallback(
    (isInteractive) => {
      if (viewport.isInteractive !== isInteractive) {
        setViewport((v) => ({
          ...v,
          isInteractive,
        }));
      }
    },
    [viewport, setViewport],
  );

  const onDataLoad = useMemo(
    () =>
      debounce(() => {
        onLoad();
        setIsLoading(false);

        setMap((map) => {
          map.off('data', onDataLoad);
          return map;
        });
      }, 300),
    [onLoad],
  );

  const onLoadMap = useCallback(
    (evt) => {
      if (evt.target) {
        setMap(evt.target);

        evt.target.on('data', onDataLoad);

        evt.target.dragRotate.disable();
        evt.target.touchZoomRotate.disableRotation();
      }
    },
    [onDataLoad],
  );
  console.log(viewport?.isInteractive, isLoading);
  const debouncedOnScroll = useMemo(
    () =>
      debounce(
        () => {
          if (!isAutoscrolling.current && !maptouch) {
            setInteractivity(false);
          }
        },
        100,
        true,
      ),
    [setInteractivity, isAutoscrolling, maptouch],
  );

  const onInteractionChange = useCallback(
    (isInteractive) => {
      setInteractivity(isInteractive);
      track(options.id, {
        5: `interaction-toggle`,
        9: isInteractive ? 'on' : 'off',
      });
    },
    [setInteractivity, options.id],
  );

  const scrollMapIntoView = useCallback(() => {
    if (map) {
      const y = map.getContainer().getBoundingClientRect().top + window.scrollY;
      isAutoscrolling.current = true;
      window.setTimeout(() => {
        isAutoscrolling.current = false;
      }, 1000);
      window.scrollTo({behavior: 'smooth', top: y});
    }
  }, [map, isAutoscrolling]);

  useEffect(() => {
    map && setInitialView();
    if (map) {
      // map.scrollZoom.setZoomRate(20);
      // map.scrollZoom.setWheelZoomRate(1 / 100);
    }
  }, [map, setInitialView]);

  useEffect(() => {
    if (!isVisible) {
      setInteractivity(false);
    }
  }, [isVisible, setInteractivity]);

  useEffect(() => {
    window.addEventListener('scroll', debouncedOnScroll);

    return () => {
      window.removeEventListener('scroll', debouncedOnScroll);
    };
  }, [debouncedOnScroll]);

  useEffect(() => {
    if (geocoderPos) {
      setInteractivity(true);
      track(options.id, {
        5: `geocoder`,
      });
    }
  }, [geocoderPos, setInteractivity, options.id, scrollMapIntoView]);

  const showInitialZoomButton =
    viewport.zoom !== initialZoom && mapOptions.initialZoomButton;
  const dragPanAllowed = mapOptions.interactiveMap || viewport.isInteractive;
  const mapWrapperClasses = cx(cn.mapWrapper, className, {
    [cn.loading]: isLoading,
    [cn.isInteractive]: viewport.isInteractive,
    'map--touch-scroll': !dragPanAllowed,
  });

  const isScreenshotMode = mapOptions.screenshots && import.meta.env.DEV;
  const legendOptions = mapOptions.legend?.[toggleIndex];
  const swoopies = mapOptions.swoopies[toggleIndex];
  const labelStyle = mapOptions.labels.style;

  const [maxBounds, setMaxBounds] = useState(null);

  // set max bounds to view bounds (initial view) or bounds provided by mapOptions (if zoomed in) + offset
  const updateMaxBounds = useCallback(() => {
    console.log('updateMaxBounds', map && mapOptions?.bounds);
    if (map && mapOptions?.bounds) {
      const minBounds = mapOptions?.bounds;
      const currentBounds = getCurrentMapBounds(map);
      const bounds = [
        currentBounds[0] > minBounds[0] ? minBounds[0] : currentBounds[0],
        currentBounds[1] > minBounds[1] ? minBounds[1] : currentBounds[1],
        currentBounds[2] < minBounds[2] ? minBounds[2] : currentBounds[2],
        currentBounds[3] < minBounds[3] ? minBounds[3] : currentBounds[3],
      ];
      const bufferedBounds = bbox(
        buffer(bboxPolygon(bounds), 1, {
          units: 'kilometers',
        }),
      );
      const bufferedOuterBounds = bbox(
        buffer(bboxPolygon(bounds), 15, {
          units: 'kilometers',
        }),
      );
      setMaxBounds(SUPPORTS_TOUCH ? bufferedBounds : bounds);
      map.setMaxBounds(SUPPORTS_TOUCH ? bufferedOuterBounds : bounds);
    }
    // }, [map, mapOptions]);
  }, [map, mapOptions?.bounds]);

  useEffect(() => {
    if (map) {
      updateMaxBounds();
    }
  }, [updateMaxBounds, map]);

  // update max bounds after zoom
  useEffect(() => {
    if (map && mapOptions?.fixedMapBounds) {
      updateMaxBounds();
      map.on('zoomend', updateMaxBounds);

      return () => {
        map.off('zoomend', updateMaxBounds);
      };
    }
  }, [updateMaxBounds, map, mapOptions]);

  // function to bounce map back into max bounds
  const rebounceMap = useCallback(() => {
    const currentBounds = getCurrentMapBounds(map);
    // get center of current view
    const center = [
      currentBounds[0] + (currentBounds[2] - currentBounds[0]) / 2,
      currentBounds[1] + (currentBounds[3] - currentBounds[1]) / 2,
    ];
    // correct center if outside of max bounds
    if (currentBounds[0] < maxBounds[0]) {
      center[0] = center[0] + (maxBounds[0] - currentBounds[0]);
    }
    if (currentBounds[1] < maxBounds[1]) {
      center[1] = center[1] + (maxBounds[1] - currentBounds[1]);
    }
    if (currentBounds[2] > maxBounds[2]) {
      center[0] = center[0] - (currentBounds[2] - maxBounds[2]);
    }
    if (currentBounds[3] > maxBounds[3]) {
      center[1] = center[1] - (currentBounds[3] - maxBounds[3]);
    }
    // update map view
    setViewport((v) => ({
      ...v,
      latitude: center[1],
      longitude: center[0],
    }));
  }, [map, maxBounds]);

  // function to check if map is outside of max bounds
  // if so, bounce map back into max bounds
  const handleMoveEnd = useCallback(() => {
    if (mapOptions?.fixedMapBounds && maxBounds) {
      const currentBounds = getCurrentMapBounds(map);
      // check if map is outside of max bounds
      if (
        currentBounds[0] < maxBounds[0] ||
        currentBounds[1] < maxBounds[1] ||
        currentBounds[2] > maxBounds[2] ||
        currentBounds[3] > maxBounds[3]
      ) {
        rebounceMap();
      }
    }
  }, [mapOptions, maxBounds, map, rebounceMap]);

  // trigger handleMoveEnd on mouseup and touchend
  // trigger also on mouseleave
  useEffect(() => {
    if (map) {
      map.on('mouseup', handleMoveEnd);
      map.on('touchend', handleMoveEnd);
    }
    return () => {
      if (map) {
        map.off('mouseup', handleMoveEnd);
        map.off('touchend', handleMoveEnd);
      }
    };
  }, [handleMoveEnd, map]);

  const handleMouseLeave = useCallback(() => {
    window.addEventListener('mouseup', handleMoveEnd, {once: true});
    window.addEventListener('touchend', handleMoveEnd, {once: true});
  }, [handleMoveEnd]);

  useEffect(() => {
    let copiedWrapper = null;
    if (wrapperRef.current) {
      copiedWrapper = wrapperRef.current;
      wrapperRef.current.addEventListener('mouseleave', handleMouseLeave);
    }
    return () => {
      if (copiedWrapper) {
        copiedWrapper.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [handleMoveEnd, wrapperRef, handleMouseLeave]);

  const geocoderQueryLayers = useMemo(() => {
    if (!mapOptions.choropleth) {
      return [];
    }
    return mapOptions.choropleth.map((choroplethItem) =>
      getChoroplethLayerId(choroplethItem),
    );
  }, [mapOptions.choropleth]);

  const ignoreLayers = useMemo(() => {
    return [OVERLAY_LAYER_ID].concat(
      (mapOptions.choropleth || []).map((choroplethItem) =>
        getChoroplethLayerId(choroplethItem),
      ),
    );
  }, [mapOptions.choropleth]);

  return (
    <div className={cx({[cn.fullwidth]: mapOptions.fullwidth})}>
      {isLoading && (
        <div
          className={cn.loaderContainer}
          style={{
            paddingBottom: `min(85vh)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1000,
            background: 'var(--z-background-primary)',
          }}
        >
          <Loader isLoading={true} height={'100%'} />
        </div>
      )}
      <div
        className={mapWrapperClasses}
        onTouchStart={() => setMapTouch(true)}
        onTouchEnd={() => setMapTouch(false)}
        ref={wrapperRef}
      >
        {isScreenshotMode && (
          <DownloadMapButton
            isVisible={isScreenshotMode}
            map={map}
            isLoading={isLoading}
          />
        )}
        {!!mapOptions.toggleOptions?.length && (
          <div className={cn.buttongroup}>
            <Switcher
              options={mapOptions.toggleOptions.map((o, i) => ({
                label: o,
                id: i,
              }))}
              active={toggleIndex}
              onChange={setToggleIndex}
            />
          </div>
        )}

        <BasisMap
          mapOptions={mapOptions}
          onLoadMap={onLoadMap}
          viewport={viewport}
          initialZoom={initialZoom}
          dragPanAllowed={dragPanAllowed}
          setViewport={setViewport}
          map={map}
          isLoading={isLoading}
        >
          <BaseMapLayer
            map={map}
            visible={
              viewport.zoom >= initialZoom + 0.5 ||
              viewport.zoom > 6 ||
              mapOptions.basemap.alwaysVisible
            }
            ignoreLayers={ignoreLayers}
          />

          {map && (
            <ChoroplethLayer
              map={map}
              mapOptions={mapOptions}
              isAutoscrolling={isAutoscrolling}
              toggleIndex={toggleIndex}
              wrapperDimensions={wrapperDimensions}
            />
          )}
          <Swoopies
            map={map}
            viewport={viewport}
            data={swoopies}
            zoom={viewport.zoom}
            initialZoom={initialZoom}
          />
          <Labels
            data={mapOptions.labels.data}
            preset={mapOptions.labels.preset}
            style={labelStyle}
            zoom={viewport.zoom}
            initialZoom={initialZoom}
          />
          <ZoomControl
            onInitialZoom={setInitialView}
            showInitialZoomButton={showInitialZoomButton}
            isVisible={true}
            map={map}
          />
          <ScaleControl map={map} isVisible={mapOptions.scaleControl} />
          <HomeMarker position={geocoderPos} />
          {mapOptions.geocoder && (
            <Geocoder
              mapOptions={mapOptions}
              map={map}
              queryLayers={geocoderQueryLayers}
              initialZoom={initialZoom}
              setViewport={setViewport}
              setMapOptions={setMapOptions}
              setGeocoderPos={setGeocoderPos}
              geocoderPos={geocoderPos}
              geocoderRef={geocoderRef.current}
              scrollMapIntoView={scrollMapIntoView}
              isAutoscrolling={isAutoscrolling}
              toggleIndex={toggleIndex}
              wrapperDimensions={wrapperDimensions}
            />
          )}
          <MapAttribution map={map} />
        </BasisMap>
      </div>
      <div className={cn.bottomWrapper}>
        {mapOptions.geocoder && (
          <div className={cn.geocoder} ref={geocoderRef} />
        )}

        <Legend isVisible={!!mapOptions.legend} {...legendOptions} />
        {!SUPPORTS_TOUCH ? (
          <InteractionControl
            isVisible={mapOptions.interactiveMap}
            isInteractive={viewport.isInteractive}
            onChange={onInteractionChange}
            map={map}
            scrollMapIntoView={scrollMapIntoView}
          />
        ) : (
          ''
        )}
      </div>
      <Footer source={mapOptions.source} infobox={mapOptions.infobox} />
    </div>
  );
};

export default MapGL;
