import {useState, useEffect, useCallback, useRef, lazy, Suspense} from 'react';
import ObjectAssignDeep from 'object-assign-deep';
import cx from 'classnames';

import Loader from 'core/components/Loader/index.jsx';

// import config from '../config.jsx';
import {getDefaultOptions, getSourceUrl, getAspectRatio} from './utils.js';

import cn from './index.module.scss';
import Headline from 'core/components/Headline/index.jsx';
import useIsSSR from 'core/hooks/useIsSSR.js';
import useWasVisible from 'core/hooks/useWasVisible.js';

const MapComponent = lazy(() => import('./Map.jsx'));
// import MapComponent from './Map.jsx';

const defaultOptions = getDefaultOptions();
// const {mapConfig} = config;
// const containerStyle = {height: mapConfig.height || '100%'};

const MapWrapper = (props) => {
  const [dimensions, setDimensions] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const containerRef = useRef(null);

  const config = props.config;
  const {mapConfig} = config;
  const containerStyle = {
    minHeight: isLoading ? mapConfig.height || '100%' : 'auto',
  };
  const mapOptions = ObjectAssignDeep({}, defaultOptions, mapConfig, props);
  // mapOptions.choropleth.source = getSourceUrl(mapOptions.choropleth.source);
  mapOptions.choropleth = mapOptions.choropleth
    ? mapOptions.choropleth.map((options) => {
        options.source = getSourceUrl(options.source);
        return options;
      })
    : null;
  const hasViewOption = mapOptions.view;
  let defaultBounds = props?.bounds;
  if (!defaultBounds) {
    defaultBounds = hasViewOption
      ? mapOptions.view.bounds
      : mapOptions.metaData.bounds;
  }
  let metaData = ObjectAssignDeep({}, mapOptions.metaData, {
    bounds: defaultBounds,
  });
  const aspectRatio = getAspectRatio(metaData.bounds);

  const isVisible = useWasVisible(containerRef, {
    rootMargin: '50% 0% 50% 0%',
  });

  useEffect(() => {
    if (containerRef?.current) {
      let {width, height} = containerRef.current.getBoundingClientRect();

      if (
        !mapOptions.autoDimensions &&
        mapOptions.height &&
        width * aspectRatio < height
      ) {
        height = Math.floor(width * aspectRatio);
      }
      
      if (mapOptions.autoDimensions) {
        const maxHeight = Math.floor(window.innerHeight * 0.85);
        height = Math.min(maxHeight, Math.ceil(width * aspectRatio));
      }

      setDimensions({width, height});
    }
  }, [aspectRatio, mapOptions.autoDimensions, mapOptions.height]);

  const onMapLoad = useCallback(() => {
    setLoading(false);
  }, []);

  const loaderContainer = (
    <div
      className={cn.loaderContainer}
      style={{paddingBottom: `min(85vh, ${aspectRatio * 100}%)`}}
    >
      <Loader isLoading={true} height={'100%'} />
    </div>
  );

  const isSSR = useIsSSR();

  let showMap = false;
  if (!isSSR && isVisible && mapOptions && dimensions.height) {
    showMap = true;
  }

  const mapElement = !showMap ? (
    loaderContainer
  ) : (
    <MapComponent
      options={mapOptions}
      height={dimensions.height}
      metaData={metaData}
      onLoad={onMapLoad}
    />
  );

  return (
    <>
      {!!mapOptions.title && <Headline>{mapOptions.title}</Headline>}
      <div
        className={cx(cn.container, {'x-fullwidth': mapOptions.fullwidth})}
        ref={containerRef}
        style={containerStyle}
      >
        <Suspense fallback={loaderContainer}>{mapElement}</Suspense>
      </div>
    </>
  );
};

export default MapWrapper;
