function jsonToPointGeojson(
  csvData,
  {latAcc = (d) => d['lat'], lngAcc = (d) => d['lng']} = {},
) {
  return {
    type: 'FeatureCollection',
    features: csvData.map((d) => {
      const coordinates = [+lngAcc(d), +latAcc(d)];
      const properties = Object.keys(d).reduce((acc, key) => {
        acc[key] = isFinite(+d[key]) ? +d[key] : d[key];

        return acc;
      }, {});

      return {
        type: 'Feature',
        properties,
        geometry: {
          type: 'Point',
          coordinates,
        },
      };
    }),
  };
}

export default jsonToPointGeojson;
