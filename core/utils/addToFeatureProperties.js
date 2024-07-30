import emptyGeo from './emptyGeo';

/**
 * Helper function that adds new keys to the properties object of each feature
 * in a given GeoJSON. This useful for joining features with data or e.g. fills:
 * `addToFeatureProperties(geojson, (feat) => ({ fill: fill(feat) }))`.
 * The `mapFn` has to return an object that will be merged with the existing properties.
 * @param {GeoJSON} geojson The input GeoJSON that will be joined with new data
 * @param {function} mapFn a function that takes a feature as an input and returns an object that will be spread onto the feature properties
 * @returns
 */
export const addToFeatureProperties = (geojson, mapFn) =>
  Array.isArray(geojson?.features)
    ? {
        ...geojson,
        features: geojson.features.map((feat) => ({
          ...feat,
          properties: {
            ...feat.properties,
            ...mapFn(feat),
          },
        })),
      }
    : emptyGeo;
