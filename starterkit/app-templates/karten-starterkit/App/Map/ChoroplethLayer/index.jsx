import {useCallback, useState, useEffect, Fragment, useMemo, memo} from 'react';
import debounce from 'debounce';

import ChoroplethLayer from './ChoroplethLayer.jsx';
import Tooltip from '../Tooltip/index.jsx';
import {SUPPORTS_TOUCH} from 'core/utils/env.js';
import {getChoroplethLayerId} from '../utils.js';

const InteractiveWrapper = memo(
  ({
    map,
    mapOptions,
    visibleLayer,
    isAutoscrolling,
    toggleIndex,
    wrapperDimensions,
  }) => {
    const [tooltipPosition, setTooltipPosition] = useState(null);
    const [tooltipData, setTooltipData] = useState(null);

    const debouncedOnScroll = useMemo(
      () =>
        debounce(
          () => {
            if (!isAutoscrolling.current) {
              map && map.fire('_mouseout');
              setTooltipData(null);
            }
          },
          100,
          true,
        ),
      [isAutoscrolling, map],
    );

    const debouncedDataUpdate = useMemo(
      () =>
        debounce(
          (data) => {
            setTooltipData(data);
          },
          SUPPORTS_TOUCH ? 50 : 0,
          false,
        ),
      [setTooltipData],
    );
    const debouncedPositionUpdate = useMemo(
      () =>
        debounce(
          (position) => {
            setTooltipPosition(position);
          },
          SUPPORTS_TOUCH ? 50 : 0,
          false,
        ),
      [setTooltipPosition],
    );

    const onMouseEnter = useCallback(
      (data) => debouncedDataUpdate(data),
      [debouncedDataUpdate],
    );
    const onMouseLeave = useCallback(
      () => debouncedDataUpdate(null),
      [debouncedDataUpdate],
    );
    const onMouseMove = useCallback(
      (p) => debouncedPositionUpdate(p),
      [debouncedPositionUpdate],
    );

    useEffect(() => {
      window.addEventListener('scroll', debouncedOnScroll);

      return () => {
        window.removeEventListener('scroll', debouncedOnScroll);
      };
    }, [debouncedOnScroll]);

    if (!mapOptions.choropleth) {
      return null;
    }

    const tooltipOptions = mapOptions.tooltip[toggleIndex];
    const dataAccessKey = mapOptions.dataAccessKeys[toggleIndex];
    const showTooltip = mapOptions.tooltip?.[0]?.isVisible;
    const insertBefore = mapOptions.insertLayersBeforeId;

    return (
      <Fragment>
        {mapOptions.choropleth.map((options, i) => {
          if (i === mapOptions.choropleth.length - 1) {
            return (
              <ChoroplethLayer
                map={map}
                id={getChoroplethLayerId(options)}
                key={getChoroplethLayerId(options)}
                interactive={showTooltip}
                onMouseEnter={onMouseEnter}
                onMouseMove={onMouseMove}
                onMouseLeave={SUPPORTS_TOUCH ? onMouseLeave : onMouseLeave}
                toggleIndex={toggleIndex}
                overlays={mapOptions.overlays}
                insertBefore={insertBefore}
                {...options}
              />
            );
          } else {
            return (
              <ChoroplethLayer
                map={map}
                id={getChoroplethLayerId(options)}
                key={getChoroplethLayerId(options)}
                interactive={false}
                toggleIndex={toggleIndex}
                overlays={null}
                insertBefore={insertBefore}
                {...options}
              />
            );
          }
        })}
        {showTooltip && (
          <Tooltip
            data={tooltipData}
            position={tooltipPosition}
            visibleLayer={visibleLayer}
            onClose={() => setTooltipData(null)}
            isCustom={mapOptions.mapChooser}
            dataAccessKey={dataAccessKey}
            toggleIndex={toggleIndex}
            wrapperDimensions={wrapperDimensions}
            map={map}
            {...tooltipOptions}
          />
        )}
      </Fragment>
    );
  },
);

export default InteractiveWrapper;
