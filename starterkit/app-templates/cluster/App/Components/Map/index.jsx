import {useEffect, useRef, useState, useCallback, useMemo} from 'react';
import ZoomControl from './Components/ZoomControl';
import Geocoder from 'core/components/Geocoder';
import Tooltip from './Components/Tooltip';
import cn from './index.module.scss';

import ReactMapGL, {Source, Layer} from 'react-map-gl';

import VisualArticleSnippet from 'core/components/VisualArticle/FullwidthSnippet';
import {IS_MOBILE} from 'core/utils/env';
import useMoveMarginalia from 'core/hooks/useMoveMarginalia';

import useIsDarkMode from 'core/hooks/useIsDarkMode';
import Loader from 'core/components/Loader';

import {
  getClusterLayerProps,
  getClusterLayerCountProps,
  getUnclusteredPointLayerProps,
} from './layers.js';

import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_API_TOKEN =
  'pk.eyJ1IjoiemVpdG9ubGluZSIsImEiOiJQcFlJLXdvIn0.RdRQOquzTgkvJ_lOV3EhEA';
const MAP_STYLE_LIGHT = 'mapbox://styles/zeitonline/cljgx3s6o00d901qu4hfsar3b';
const MAP_STYLE_DARK = 'mapbox://styles/zeitonline/cljmofof4008201pmfim90kq5';

function Map({data, config}) {
  const isDarkMode = useIsDarkMode();
  const mapRef = useRef();
  useMoveMarginalia();

  const [map, setMap] = useState(null);
  const [initialZoom, setInitialZoom] = useState(null);
  const [currentZoom, setCurrentZoom] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState(null);
  const [tooltipData, setTooltipData] = useState(null);
  const [tooltipPoint, setTooltipPoint] = useState(null);
  const [expandedTooltipData, setExpandedTooltipData] = useState(null); // only for desktop mode
  const [tooltipIsExpanded, setTooltipIsExpanded] = useState(false);
  const [tooltipText, setTooltipText] = useState(null);
  const [lastMarkerClickedId, setLastMarkerClickedId] = useState(null); // only for mobile mode
  const [dimensions, setDimensions] = useState(null);

  const handleLoad = useCallback(() => {
    setMap(mapRef.current.getMap());
    setInitialZoom(mapRef.current.getMap().getZoom());
    setLoaded(true);
  }, []);

  const resetMarkerClickState = useCallback(() => {
    if (!map) {
      return;
    }
    map.setFeatureState(
      {
        source: 'cluster-source',
        id: lastMarkerClickedId,
      },
      {
        click: false,
      },
    );
    setLastMarkerClickedId(null);
  }, [map, lastMarkerClickedId]);

  const handleZoom = useCallback(() => {
    setCurrentZoom(mapRef.current.getMap().getZoom());
    setTooltipData(null);
    setExpandedTooltipData(null);
    // reset click state
    resetMarkerClickState();
  }, [resetMarkerClickState]);

  const handleZoomClick = useCallback(
    (feature, clusterId) => {
      const mapboxSource = map.getSource('cluster-source');
      mapboxSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) {
          return;
        }
        map.easeTo({
          center: feature.geometry.coordinates,
          zoom,
          duration: 500,
        });
      });
    },
    [map],
  );

  const handleMarkerClick = useCallback(
    (feature, point) => {
      const [longitude, latitude] = feature.geometry.coordinates;
      if (currentZoom > initialZoom + 0.5 && !IS_MOBILE) {
        map.easeTo({
          center: [longitude, latitude],
          offset: [-100, 0],
        });
      }
      // reset click state
      resetMarkerClickState();
      // set click state
      map.setFeatureState(
        {
          source: 'cluster-source',
          id: feature.id,
        },
        {
          click: true,
        },
      );
      setLastMarkerClickedId(feature.id);
      setTimeout(() => {
        setTooltipPosition({lng: longitude, lat: latitude});
        setTooltipData(feature.properties);
        setTooltipPoint(point);
        // in desktop mode, expanded tooltip is triggered by click
        // on marker, not on a button inside the tooltip itself
        if (!IS_MOBILE) {
          setExpandedTooltipData(feature.properties);
        }
      }, 25);
    },
    [map, currentZoom, initialZoom, resetMarkerClickState],
  );

  const handleClick = useCallback(
    (event) => {
      setTooltipPosition(null);
      const feature = event.features[0];
      if (!feature) {
        return;
      }
      const clusterId = feature?.properties.cluster_id;
      if (clusterId) {
        handleZoomClick(feature, clusterId);
      } else {
        handleMarkerClick(feature, event.point);
      }
    },
    [handleZoomClick, handleMarkerClick],
  );

  const handleMarkerHover = useCallback((feature, point) => {
    const [longitude, latitude] = feature.geometry.coordinates;
    setTimeout(() => {
      setTooltipPosition({lng: longitude, lat: latitude});
      setTooltipData(feature.properties);
      setTooltipPoint(point);
    }, 25);
  }, []);

  const handleZoomHover = useCallback(
    (feature) => {
      const [longitude, latitude] = feature.geometry.coordinates;
      setTimeout(() => {
        setTooltipPosition({lng: longitude, lat: latitude});
        if (config?.tooltipOptions?.clusterTooltip) {
          setTooltipText(config?.tooltipOptions?.clusterTooltip);
        }
      }, 25);
    },
    [setTooltipPosition, config],
  );

  const handleMouseEnter = useCallback(
    (event) => {
      setTooltipText(null);
      const feature = event?.features?.[0];
      if (!feature) {
        return;
      }
      // set pointer cursor
      map.getCanvas().style.cursor = 'pointer';

      const clusterId = feature?.properties.cluster_id;

      if (clusterId) {
        handleZoomHover(feature, clusterId);
        return;
      }

      // set hover state
      map.setFeatureState(
        {
          source: 'cluster-source',
          id: feature.id,
        },
        {
          hover: true,
        },
      );

      if (clusterId) {
        return;
      }

      handleMarkerHover(feature, event.point);
    },
    [handleMarkerHover, map, handleZoomHover],
  );

  const handleMouseLeave = useCallback(
    (e) => {
      setTooltipPosition(null);
      setTooltipText(null);
      const feature = e?.features?.[0];
      if (!feature) {
        return;
      }
      // set grab cursor
      map.getCanvas().style.cursor = 'grab';
      // unset hover state
      map.setFeatureState(
        {
          source: 'cluster-source',
          id: feature.id,
        },
        {
          hover: false,
        },
      );
    },
    [map],
  );

  const handleGeocode = useCallback(
    (position) => {
      if (!position) {
        map.fitBounds(config?.mapOptions?.bounds);
      } else {
        const [longitude, latitude] = position;
        if (map) {
          map.easeTo({
            center: [longitude, latitude],
            zoom: 8,
            duration: 500,
          });
        }
      }
    },
    [map, config],
  );

  const showBackButton = useMemo(() => {
    if (currentZoom !== null && initialZoom !== null) {
      return (
        // zoomed in
        currentZoom > initialZoom + 0.25 ||
        // zoomed out
        currentZoom < initialZoom - 0.25
      );
    }
    return false;
  }, [currentZoom, initialZoom]);

  useEffect(() => {
    if (!map) return;
    const canvas = map.getCanvas();
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    setDimensions({width, height});
  }, [map]);

  useEffect(() => {
    if (!map) return;
    const layers = map.getStyle().layers;
    if (currentZoom && currentZoom > initialZoom + 0.25) {
      layers.forEach((layer) => {
        if (
          layer.layout &&
          !layer.id.includes('cluster') &&
          !layer.id.includes('bundes') &&
          layer.layout.visibility === 'none'
        ) {
          map.setLayoutProperty(layer.id, 'visibility', 'visible');
        }
      });
    } else if (currentZoom && currentZoom < initialZoom + 0.25) {
      layers.forEach((layer) => {
        if (
          layer.layout &&
          !layer.id.includes('cluster') &&
          !layer.id.includes('bundes') &&
          layer.layout.visibility === 'visible'
        ) {
          map.setLayoutProperty(layer.id, 'visibility', 'none');
        }
      });
    }
  }, [currentZoom, initialZoom, map]);

  useEffect(() => {
    // set event handler on scroll to reset tooltip on mobile
    const handleScroll = () => {
      if (IS_MOBILE) {
        setTooltipPosition(null);
        setExpandedTooltipData(null);
        setTooltipIsExpanded(false);
        resetMarkerClickState();
      }
    };
    document.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [resetMarkerClickState]);

  return (
    <>
      <VisualArticleSnippet />
      <div className={cn.container}>
        <Loader isLoading={!loaded} width="100%" height="100%" />
        {loaded && (
          <>
            {config?.geocoderOptions?.callToAction && (
              <div className={cn.callToAction}>
                {config?.geocoderOptions?.callToAction}
              </div>
            )}
            {config?.geocoderOptions && (
              <Geocoder
                map={map}
                onGeocode={handleGeocode}
                className={cn.geocoder}
                {...config?.geocoderOptions}
              />
            )}
          </>
        )}
        <div
          className={cn.map}
          onClick={() => {
            if (expandedTooltipData && !IS_MOBILE) {
              setTooltipPosition(null);
              setExpandedTooltipData(null);
              setTooltipIsExpanded(false);
              resetMarkerClickState();
            }
          }}
        >
          <ReactMapGL
            initialViewState={{
              bounds: config?.mapOptions?.bounds,
            }}
            mapStyle={
              isDarkMode
                ? config?.mapOptions?.darkStyleUrl || MAP_STYLE_DARK
                : config?.mapOptions?.lightStyleUrl || MAP_STYLE_LIGHT
            }
            // mapboxApiAccessToken={MAPBOX_API_TOKEN}
            mapboxAccessToken={MAPBOX_API_TOKEN}
            interactiveLayerIds={[
              getClusterLayerProps(isDarkMode).id,
              getUnclusteredPointLayerProps(isDarkMode).id,
            ]}
            onClick={handleClick}
            onMouseEnter={IS_MOBILE ? () => {} : handleMouseEnter}
            onMouseLeave={IS_MOBILE ? () => {} : handleMouseLeave}
            onLoad={handleLoad}
            onZoom={handleZoom}
            ref={mapRef}
            cooperativeGestures={true}
            dragRotate={false}
            attributionControl={true}
            minZoom={config?.mapOptions?.minZoom}
            maxZoom={config?.mapOptions?.maxZoom}
            interactive={!tooltipIsExpanded}
            dragPan={!tooltipIsExpanded}
            touchZoom={!tooltipIsExpanded}
            scrollZoom={!tooltipIsExpanded}
            touchZoomRotate={!tooltipIsExpanded}
          >
            <Source
              id="cluster-source"
              type="geojson"
              data={data}
              cluster={true}
              clusterMaxZoom={config?.clusterOptions?.maxZoom}
              clusterRadius={config?.clusterOptions?.radius || 50}
            >
              <Layer {...getClusterLayerProps(isDarkMode)} />
              <Layer {...getClusterLayerCountProps(isDarkMode)} />
              <Layer {...getUnclusteredPointLayerProps(isDarkMode)} />
            </Source>
            <ZoomControl
              isVisible={true}
              map={map}
              showInitialZoomButton={showBackButton}
              onInitialZoom={() => {
                mapRef?.current?.fitBounds(config?.mapOptions?.bounds);
              }}
            />
            {(!expandedTooltipData ||
              tooltipData?.name !== expandedTooltipData?.name ||
              tooltipText) && (
              <Tooltip
                config={config}
                position={tooltipPosition}
                data={tooltipData}
                expandedData={expandedTooltipData}
                setExpandedData={setExpandedTooltipData}
                isExpanded={tooltipIsExpanded}
                setIsExpanded={setTooltipIsExpanded}
                point={tooltipPoint}
                dimensions={dimensions}
                onClose={() => {
                  setTooltipPosition(null);
                  setExpandedTooltipData(null);
                  setTooltipIsExpanded(false);
                  resetMarkerClickState();
                }}
                showInsidePopup={true}
                disableExpandedView={!IS_MOBILE}
                staticText={tooltipText}
              />
            )}
          </ReactMapGL>
          {!IS_MOBILE && expandedTooltipData && (
            <div className={cn.sideTooltip}>
              <Tooltip
                config={config}
                expandedData={expandedTooltipData}
                isExpanded={true}
                showInsidePopup={false}
                onClose={() => {
                  setTooltipPosition(null);
                  setExpandedTooltipData(null);
                  setTooltipIsExpanded(false);
                  resetMarkerClickState();
                }}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Map;
