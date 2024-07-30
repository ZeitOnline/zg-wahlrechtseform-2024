import {mesh, merge} from 'topojson-client';
import range from 'core/utils/range.js';

export function geoPathReducePrecision(pathString, precision) {
  return pathString.replace(/\d+\.\d+/g, (s) =>
    parseFloat(s).toFixed(precision),
  );
}

export function getCenter(bbox) {
  const a =
    Math.min(bbox[0], bbox[2]) +
    (Math.max(bbox[0], bbox[2]) - Math.min(bbox[0], bbox[2])) / 2;
  const b =
    Math.min(bbox[1], bbox[3]) +
    (Math.max(bbox[1], bbox[3]) - Math.min(bbox[1], bbox[3])) / 2;
  return [a, b];
}

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
