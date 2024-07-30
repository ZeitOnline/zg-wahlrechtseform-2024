import {useState, useCallback, useMemo, useEffect, useRef} from 'react';

import debounce from 'debounce';

import {parseProps} from '../utils';

// import Geocoder from './Geocoder.jsx';
// import StaticGeocoder from './StaticGeocoder.jsx';
import Geocoder from 'core/components/Geocoder/index.jsx';
import Portal from 'core/components/Portal/index.jsx';
import Tooltip from '../Tooltip/index.jsx';

import {IS_MOBILE} from 'core/utils/env.js';

const GeocoderInnerWrapper = ({
  mapOptions,
  map,
  queryLayers,
  initialZoom,
  setGeocoderPos,
  setMapOptions,
  geocoderPos,
  geocoderRef,
  isAutoscrolling,
  visibleLayer,
  size,
  income,
  segment,
  toggleIndex,
  scrollMapIntoView,
  wrapperDimensions,
}) => {
  const [geocoderResultData, setGeocoderResultData] = useState(null);
  const geocoderHasValue = useRef(false);
  const geocoderWaitingForMoveEnd = useRef(false);
  const dataAccessKey = mapOptions?.dataAccessKeys[toggleIndex];

  const onGeocoderChange = useCallback(
    (position) => {
      // const pos = result?.geometry?.coordinates || result.coordinates;
      const [longitude, latitude] = position;

      if (scrollMapIntoView) {
        scrollMapIntoView();
      }

      // in order to query the features we need to wait until map has updated position
      const onMoveEnd = () => {
        const point = map.project([longitude, latitude]);
        const features = map.queryRenderedFeatures(point, {
          layers: queryLayers,
        });

        if (features.length) {
          setGeocoderResultData(parseProps(features[0].properties));
        }

        map.off('moveend', onMoveEnd);
        map.off('move', debouncedMoveEnd);
        geocoderWaitingForMoveEnd.current = false;
      };

      const debouncedMoveEnd = debounce(onMoveEnd, 500);

      if (mapOptions.interactiveMap) {
        map.on('move', debouncedMoveEnd);

        map.flyTo({
          zoom: initialZoom + 3,
          center: [longitude, latitude],
          transitionDuration: IS_MOBILE ? 0 : 200,
        });

        if (mapOptions.tooltip) {
          setMapOptions((opts) => ({
            ...opts,
            tooltip: {
              ...opts.tooltip,
              isVisible: false,
            },
          }));
        }
      } else {
        onMoveEnd();
      }

      // set the geocoder values after scroll
      // otherwise the tooltip will be instantly closed by the scroll
      setTimeout(
        () => {
          setGeocoderPos(position);
          // setGeocoderValue(result);
          setGeocoderResultData(null);
          geocoderHasValue.current = true;
          geocoderWaitingForMoveEnd.current = true;
        },
        scrollMapIntoView ? 250 : 0,
      );
    },
    [
      setGeocoderPos,
      mapOptions.interactiveMap,
      mapOptions.tooltip,
      map,
      queryLayers,
      initialZoom,
      setMapOptions,
      scrollMapIntoView,
    ],
  );

  const onGeocoderClear = useCallback(() => {
    setGeocoderPos(null);
    geocoderHasValue.current = false;

    if (mapOptions.tooltip) {
      setMapOptions((opts) => ({
        ...opts,
        tooltip: {
          ...opts.tooltip,
          isVisible: true,
        },
      }));
    }
  }, [mapOptions.tooltip, setGeocoderPos, setMapOptions]);

  const debouncedOnScroll = useMemo(() => {
    return debounce(
      () => {
        if (geocoderHasValue.current && !isAutoscrolling.current) {
          onGeocoderClear();
        }
      },
      100,
      true,
    );
  }, [isAutoscrolling, onGeocoderClear]);

  useEffect(() => {
    window.addEventListener('scroll', debouncedOnScroll);

    return () => {
      window.removeEventListener('scroll', debouncedOnScroll);
    };
  }, [debouncedOnScroll]);

  const debouncedOnMoveEnd = useMemo(() => {
    return debounce(
      () => {
        if (geocoderHasValue.current && !geocoderWaitingForMoveEnd.current) {
          onGeocoderClear();
        }
      },
      100,
      true,
    );
  }, [onGeocoderClear]);

  useEffect(() => {
    if (map) {
      map.on('moveend', debouncedOnMoveEnd);
    }

    return () => {
      if (map) {
        map.off('moveend', debouncedOnMoveEnd);
      }
    };
  }, [debouncedOnMoveEnd, map]);

  let geocoderOptions = {...mapOptions.geocoder};
  if (
    geocoderOptions.dynamicOptions?.bbox === 'mapbounds' &&
    mapOptions.bounds
  ) {
    geocoderOptions.dynamicOptions.bbox = mapOptions.bounds;
  }

  return (
    <>
      <Portal portalRef={geocoderRef}>
        <Geocoder onGeocode={onGeocoderChange} map={map} {...geocoderOptions} />
      </Portal>
      <Tooltip
        data={geocoderPos?.length ? geocoderResultData : null}
        onClose={onGeocoderClear}
        position={
          geocoderPos
            ? {
                lng: geocoderPos[0],
                lat: geocoderPos[1],
              }
            : null
        }
        {...mapOptions.tooltip[0]}
        isStatic
        dataAccessKey={dataAccessKey}
        visibleLayer={visibleLayer}
        size={size}
        income={income}
        segment={segment}
        toggleIndex={toggleIndex}
        wrapperDimensions={wrapperDimensions}
        map={map}
      />
    </>
  );
};

function GeocoderWrapper(props) {
  if (!props.mapOptions?.geocoder) {
    return null;
  }

  return <GeocoderInnerWrapper {...props} />;
}

export default GeocoderWrapper;
