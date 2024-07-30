export const asPublicUrl = (path) => {
  const publicUrl = __PUBLIC_URL__;
  const isProd = import.meta.env.PROD;
  const isSSR = import.meta.env.SSR;
  const baseUrl =
    isProd || isSSR ? `${publicUrl}` : `http://${window.location.host}/`;
  return `${baseUrl}${path}`;
};

export const cleanData = (data) => {
  // replace latitude by lat and longitude by lng
  const cleaned = data.map((item, i) => {
    return {
      ...item,
      lat: +item?.lat || +item?.latitude,
      lng: +item?.lng || +item?.lon || +item?.longitude,
    };
  });
  return cleaned;
};

export const convertToGeoJSON = (data) => {
  return {
    type: 'FeatureCollection',
    features: data.map((item, i) => {
      return {
        type: 'Feature',
        id: item?.id || i,
        geometry: {
          type: 'Point',
          coordinates: [item.lng, item.lat],
        },
        properties: item,
      };
    }),
  };
};
