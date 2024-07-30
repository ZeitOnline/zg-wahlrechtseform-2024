import {useState, useCallback} from 'react';
import Geocoder from './index.jsx';

export default {
  title: 'Components/Geocoder',
  component: Geocoder,
};

export const Default = () => {
  const [value, setValue] = useState('');

  const handleGeocode = useCallback((position) => {
    setValue(position);
  }, []);

  return (
    <>
      <h2>Dynamic version (using mapbox geocoding api)</h2>
      <p>Value: {value ? value.join(', ') : value}</p>
      <Geocoder
        onGeocode={handleGeocode}
        useStaticOrDynamic="dynamic"
        callToAction="Finden Sie den Hofladen bei Ihnen vor Ort"
        placeholder="Adresse eingeben..."
        dynamicOptions={{
          language: 'de',
        }}
      />
    </>
  );
};

export const Static = () => {
  const [value, setValue] = useState('');

  const handleGeocode = useCallback((position) => {
    setValue(position);
  }, []);

  const getPublicUrl = useCallback((path) => {
    const isProd = import.meta.env.PROD;
    const isSSR = import.meta.env.SSR;
    const baseUrl =
      isProd || isSSR
        ? `https://infographics.zeit.de/storybook/`
        : `http://${window.location.host}/`;
    return `${baseUrl}${path}`;
  }, []);

  return (
    <>
      <h2>Static version (without any external api)</h2>
      <p>Value: {value ? value.join(', ') : value}</p>
      <Geocoder
        onGeocode={handleGeocode}
        useStaticOrDynamic="static"
        callToAction="Finden Sie den Hofladen bei Ihnen vor Ort"
        placeholder="Adresse eingeben..."
        staticOptions={{
          url: getPublicUrl('kreise-centroids.csv'),
        }}
      />
    </>
  );
};
