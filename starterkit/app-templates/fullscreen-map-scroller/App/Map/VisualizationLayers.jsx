import {memo, useEffect, useMemo, useRef, useState} from 'react';
import {Source, Layer, useMap} from 'react-map-gl';

// import useFetch from 'core/hooks/useCachedFetch';
import useFetchAll from 'core/hooks/useFetchAll';
import config from '../../config';
import debug from '../../debug';
import {
  // useIsWithin,
  useScrollProgress,
  useWaypoint,
} from '../ScrollProgressor/store';
import {bboxToCoords} from './utils';

const urls = config.visualizationLayers.map((d) => d.dataUrl).filter(Boolean);

function VisualizationLayers() {
  const mapRef = useMap();
  const progress = useRef(null);
  // const isWithin = useIsWithin();
  const waypoint = useWaypoint();
  const [isReadyForMore, setReadyForMore] = useState(false);
  const responses = useFetchAll(urls, {}, isReadyForMore);
  useScrollProgress(progress);

  const visualizationLayers = useMemo(() => {
    return (
      config.visualizationLayers
        .map((layer) => {
          const response = responses[urls.indexOf(layer.dataUrl)];
          const data =
            typeof layer.onLoad === 'function' && response
              ? layer.onLoad(response)
              : response;
          if (data) layer.data = data;
          return layer;
        })
        // on first load, only load potentielle
        .filter((layer) => isReadyForMore || layer.id === 'potentielle')
    );
  }, [isReadyForMore, responses]);

  useEffect(() => {
    const map = mapRef.current?.getMap();
    map.once('idle', () => {
      debug.map && console.log('is ready for more');
      setReadyForMore(true);
    });
  }, [mapRef]);

  const visibleLayerIds = useMemo(() => {
    const waypointLayers = waypoint.layers.map((layer) =>
      typeof layer?.id === 'string' ? layer.id : layer,
    );
    const alwaysVisibleLayers = config.visualizationLayers
      .filter((d) => d.alwaysVisible)
      .map((d) => d.id);
    return [...alwaysVisibleLayers, ...waypointLayers];
  }, [waypoint.layers]);

  // uncomment to enable progressor
  // const onScroll = useCallback(() => {
  //   const map = mapRef.current.getMap();
  //   visualizationLayers
  //     .filter((d) => d.isProgressor)
  //     .forEach((layer) => {
  //       if (map && map.isStyleLoaded()) {
  //         if (isWithin && visibleLayerIds.includes(layer.id)) {
  //           if (progress.current !== map.getFilter(layer.id)?.[1]?.[2]) {
  //             map.setFilter(
  //               layer.id,
  //               ['<=', ['get', 'built'], progress.current],
  //               {validate: false},
  //             );
  //           }
  //         }
  //       }
  //     });
  //   if (!map || map.style?.stylesheet?.version === undefined) return;
  //   debug.filters &&
  //     console.log(
  //       map.getStyle()?.layers.find((d) => d.id === 'vergangenheit')?.filter,
  //     );
  // }, [isWithin, mapRef, visibleLayerIds, visualizationLayers]);

  // useEffect(() => {
  //   if (typeof window === 'undefined') return;
  //   window.addEventListener('scroll', onScroll);
  //   return () => {
  //     window.removeEventListener('scroll', onScroll);
  //   };
  // }, [onScroll]);

  return visualizationLayers.map((layer, i, a) => {
    const filter = waypoint.layers.find((d) => d.id === layer.id)?.filter;
    const beforeId = a[i - 1]?.id || config.placeLayersBeneath;
    const visibility = visibleLayerIds.includes(layer.id) ? 'visible' : 'none';
    return (
      <VisualizationLayer
        key={`vislayer_${layer.id}`}
        {...{filter, beforeId, ...layer}}
        paintOverrides={waypoint?.styles?.[layer.id]?.paint}
        layoutOverrides={waypoint?.styles?.[layer.id]?.layout}
        isProgressor={layer.isProgressor}
        willShuffle={layer.willShuffle}
        visibility={visibility}
      />
    );
  });
}

export default memo(VisualizationLayers);

function VisualizationLayer({
  type,
  data,
  tiles,
  url,
  filter,
  id,
  // isProgressor,
  visibility,
  beforeId,
  tolerance = 0.375,
  paintOverrides = {},
  layoutOverrides = {},
  opacityOverrides = {},
  ...props
}) {
  // will be overriden by setFilter onScroll
  // const initialFilter = useMemo(() => {
  //   if (isProgressor) return ['==', ['get', 'built'], 436489200000];
  //   if (willShuffle) return ['==', ['get', 'rand'], 1];
  // }, [isProgressor, willShuffle]);

  const layer = useMemo(() => {
    // add visibility onto the layout object
    const dataLayer = {
      ...props.dataLayer,
      layout: {...props.dataLayer.layout, ...layoutOverrides, visibility},
      paint: {...props.dataLayer.paint, ...paintOverrides, ...opacityOverrides},
    };
    return Array.isArray(filter) ? (
      <Layer {...{filter, id, beforeId, ...dataLayer}} />
    ) : (
      // ) : isProgressor ? (
      // <Layer {...{id, beforeId, ...dataLayer}} filter={initialFilter} />
      <Layer {...{id, beforeId, ...dataLayer}} />
    );
  }, [
    props.dataLayer,
    layoutOverrides,
    visibility,
    paintOverrides,
    opacityOverrides,
    filter,
    id,
    beforeId,
  ]);

  if (type === 'vector' && tiles) {
    return (
      <Source type="vector" tiles={tiles}>
        {layer}
      </Source>
    );
  }

  if (type === 'image' && url) {
    const coordinates =
      props.coordinates.length === 4 && typeof props.coordinates[0] === 'number'
        ? bboxToCoords(props.coordinates)
        : props.coordinates;
    return (
      <Source type="image" url={url} coordinates={coordinates}>
        {layer}
      </Source>
    );
  }

  if (type === 'vector' && url) {
    return (
      <Source type="vector" url={url}>
        {layer}
      </Source>
    );
  }

  if (type === 'geojson' && data) {
    return (
      <Source type="geojson" data={data} tolerance={tolerance}>
        {layer}
      </Source>
    );
  }
}
