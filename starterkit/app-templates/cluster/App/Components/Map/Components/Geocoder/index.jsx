import {useState, useCallback, useEffect, useRef, Fragment} from 'react';

import debounce from 'debounce';

import Geocoder from './Geocoder.jsx';
import StaticGeocoder from './StaticGeocoder.jsx';

const GeocoderWrapper = ({
  // config,
  useStaticOrDynamic,
  callToAction,
  placeholder,
  staticOptions,
  dynamicOptions,
  map,
  onGeocode,
  isAutoscrolling,
  className,
}) => {
  const [geocoderInputValue, setGeocoderInputValue] = useState('');
  const [geocoderValue, setGeocoderValue] = useState(null);
  const geocoderHasValue = useRef(false);
  const geocoderWaitingForMoveEnd = useRef(false);

  const onGeocoderChange = useCallback(
    (result) => {
      const pos = result?.geometry?.coordinates || result.coordinates;
      onGeocode(pos);
    },
    [onGeocode],
  );

  const onGeocoderClear = useCallback(() => {
    onGeocode(null);
    setGeocoderInputValue('');
    setGeocoderValue(null);
    geocoderHasValue.current = false;
  }, [onGeocode]);

  const debouncedOnScroll = useCallback(
    debounce(
      () => {
        if (geocoderHasValue.current && !isAutoscrolling.current) {
          onGeocoderClear();
        }
      },
      100,
      true,
    ),
    [geocoderHasValue, isAutoscrolling],
  );

  useEffect(() => {
    window.addEventListener('scroll', debouncedOnScroll);

    return () => {
      window.removeEventListener('scroll', debouncedOnScroll);
    };
  }, [debouncedOnScroll]);

  const debouncedOnMoveEnd = useCallback(
    debounce(
      () => {
        if (geocoderHasValue.current && !geocoderWaitingForMoveEnd.current) {
          onGeocoderClear();
        }
      },
      100,
      true,
    ),
    [geocoderHasValue, geocoderWaitingForMoveEnd],
  );

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

  return (
    <div className={className}>
      {useStaticOrDynamic === 'static' ? (
        <StaticGeocoder
          onGeocode={onGeocoderChange}
          onClear={onGeocoderClear}
          value={geocoderValue}
          inputValue={geocoderInputValue}
          onInputChange={setGeocoderInputValue}
          callToAction={callToAction}
          placeholder={placeholder}
          {...staticOptions}
        />
      ) : (
        <Geocoder
          onGeocode={onGeocoderChange}
          onClear={onGeocoderClear}
          value={geocoderValue}
          inputValue={geocoderInputValue}
          onInputChange={setGeocoderInputValue}
          callToAction={callToAction}
          placeholder={placeholder}
          {...dynamicOptions}
        />
      )}
    </div>
  );
};

export default GeocoderWrapper;
