import {mesh, merge} from 'topojson-client';
import range from 'core/utils/range.js';

export function getMeshWithoutOutlineFromTopoJson({
  topoJson,
  key,
  geoKeyGetter,
}) {
  if (!(topoJson && key)) {
    return null;
  }
  const comparisonFunction = (a, b) => {
    return geoKeyGetter(a) !== geoKeyGetter(b);
  };

  return mesh(topoJson, topoJson.objects[key], comparisonFunction);
}

export function getBundesländerMeshFromTopoJson({
  topoJson,
  key,
  mergeKey = 'id',
}) {
  if (!(topoJson && key)) {
    return null;
  }

  return mesh(topoJson, topoJson.objects[key], (a, b) => {
    const exteriorBorder = a === b;
    const idA =
      a.properties[mergeKey].length === 5
        ? a.properties[mergeKey].substring(0, 2)
        : a.properties[mergeKey].substring(0, 1);
    const idB =
      b.properties[mergeKey].length === 5
        ? b.properties[mergeKey].substring(0, 2)
        : b.properties[mergeKey].substring(0, 1);

    const sameBundesland = idA === idB;

    return exteriorBorder || !sameBundesland;
  });
}

export function getBundesländerFeaturesFromTopoJson({
  topoJson,
  key,
  mergeKey = 'id',
}) {
  if (!(topoJson && key)) {
    return null;
  }

  return range(1, 17).map(function (i) {
    return {
      ...merge(
        topoJson,
        topoJson.objects[key].geometries.filter(function (d) {
          const ags = parseInt(d.properties[mergeKey].slice(0, -3));
          return parseInt(ags) === i;
        }),
      ),
      properties: {
        [mergeKey]: `${i}`,
      },
    };
  });
}
