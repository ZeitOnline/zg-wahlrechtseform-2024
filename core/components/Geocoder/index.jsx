import {useState, useCallback, useEffect, useRef, useMemo} from 'react';
import PropTypes from 'prop-types';

import debounce from 'debounce';

import DynamicGeocoder from './DynamicGeocoder.jsx';
import StaticGeocoder from './StaticGeocoder.jsx';

const GeocoderWrapper = ({
  useStaticOrDynamic,
  callToAction,
  placeholder,
  staticOptions,
  dynamicOptions,
  onGeocode,
  className,
  // isAutoscrolling = null,
  map = null,
}) => {
  const [geocoderInputValue, setGeocoderInputValue] = useState('');
  const [geocoderValue, setGeocoderValue] = useState(null);
  const geocoderHasValue = useRef(false);
  const geocoderWaitingForMoveEnd = useRef(false);

  const onGeocoderChange = useCallback(
    (result) => {
      const pos = result?.geometry?.coordinates || result.coordinates;
      if (result?.['place_type']?.[0]) {
        pos.type = result?.['place_type']?.[0];
      }
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

  const debouncedOnScroll = useMemo(() => {
    return debounce(
      () => {
        // if (geocoderHasValue.current && !isAutoscrolling?.current) {
        if (geocoderHasValue.current) {
          onGeocoderClear();
        }
      },
      100,
      true,
    );
  }, [onGeocoderClear]);

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
  }, [geocoderHasValue, geocoderWaitingForMoveEnd, onGeocoderClear]);

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
        <DynamicGeocoder
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

GeocoderWrapper.propTypes = {
  /** Should the geocoder use a static csv or the mapbox api */
  useStaticOrDynamic: PropTypes.oneOf(['static', 'dynamic']),
  /** The call to action text */
  callToAction: PropTypes.string,
  /** The placeholder text */
  placeholder: PropTypes.string,
  /** The options for the static geocoder */
  staticOptions: PropTypes.shape({
    /** The url to the csv */
    url: PropTypes.string,
  }),
  /** The options for the dynamic geocoder */
  dynamicOptions: PropTypes.shape({
    /** language of the results */
    language: PropTypes.string,
    /** The country to limit results to */
    country: PropTypes.string,
    /** The bbox to limit results to */
    bbox: PropTypes.arrayOf(PropTypes.number),
    /** The entity types to include in the search. By default countries,
     * regions, postcodes, districts, places, localities
     * and neighbourhoods */
    types: PropTypes.arrayOf(PropTypes.string),
  }),
  /** The callback function when a geocoder result is selected */
  onGeocode: PropTypes.func,
  /** The className for the wrapper */
  className: PropTypes.string,
  /** If used with a map, pass a ref to the map instance to close the
   * autocomplete on map move */
  map: PropTypes.object,
};

export default GeocoderWrapper;
