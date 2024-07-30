import {feature, mesh, merge} from 'topojson-client';
import {geoBounds} from 'd3-geo';
import {useMemo} from 'react';

import {getMeshWithoutOutlineFromTopoJson} from 'core/utils/geo.js';

function useTopoJson({topoJson: topoJsonRaw, processTopoJson, geoKeyGetter}) {
  const data = useMemo(() => {
    if (topoJsonRaw) {
      console.time('topojson');

      const topoJson = processTopoJson
        ? processTopoJson(topoJsonRaw)
        : topoJsonRaw;

      const topoKey = Object.keys(topoJson.objects)[0];
      const parsedTopoJson = feature(topoJson, topoKey);
      const topoMesh = mesh(topoJson, topoJson.objects[topoKey]);
      const topoInteriorMesh = geoKeyGetter
        ? getMeshWithoutOutlineFromTopoJson({
            topoJson,
            key: topoKey,
            geoKeyGetter,
          })
        : null;
      const topoOutline = merge(topoJson, topoJson.objects[topoKey].geometries);
      const topoBounds = geoBounds(topoOutline);
      console.timeEnd('topojson');

      return {
        key: topoKey,
        topoJson,
        feature: parsedTopoJson,
        features: parsedTopoJson?.features,
        mesh: topoMesh,
        interiorMesh: topoInteriorMesh,
        outline: topoOutline,
        bounds: topoBounds,
      };
    } else {
      return {};
    }
  }, [geoKeyGetter, processTopoJson, topoJsonRaw]);

  return data;
}

export default useTopoJson;
