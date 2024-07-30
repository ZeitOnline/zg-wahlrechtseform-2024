import PropTypes from 'prop-types';
import cx from 'classnames';
import {memo, useMemo, useRef, useCallback, useEffect} from 'react';

import {useMap} from './hooks.js';
import cn from './Choropleth.module.scss';

const defaultDataKeyGetter = (d) => {
  return d.id;
};

function Choropleth({
  features: customFeatures,
  data = [],
  colorScale,
  valueGetter,
  dataKeyGetter = defaultDataKeyGetter,
  className,
  onSelect,
  precision,
}) {
  const {geoData, pathWithReducedPrecision, geoKeyGetter, onHover} = useMap();

  const features = useMemo(() => {
    if (customFeatures?.length) {
      return customFeatures;
    } else if (!customFeatures && geoData?.features?.length) {
      return geoData.features;
    } else {
      return [];
    }
  }, [customFeatures, geoData.features]);

  const dataById = useMemo(() => {
    if (data instanceof Map) {
      return data;
    }
    return new Map(data.map((d) => [dataKeyGetter(d), d]));
  }, [data, dataKeyGetter]);

  const shouldFireScrollMouseLeaveHack = useRef(false);

  const leave = useMemo(() => {
    if (onHover && (!('ontouchstart' in window) || !onSelect)) {
      return () => {
        onHover({});
      };
    }
    return null;
  }, [onHover, onSelect]);

  const onScrollStart = useCallback(() => {
    if (onHover && shouldFireScrollMouseLeaveHack.current) {
      onHover(null);
      shouldFireScrollMouseLeaveHack.current = false;
    }
  }, [onHover]);
  useEffect(() => {
    if ('ontouchstart' in window && onHover && !onSelect) {
      document.addEventListener('scroll', onScrollStart);
    }

    return () => {
      document.removeEventListener('scroll', onScrollStart);
    };
  }, [onHover, onSelect, onScrollStart]);

  const paths = useMemo(
    () =>
      features.map((feature) => {
        const id = geoKeyGetter(feature);
        const data = dataById.get(id) || {};
        const value = valueGetter({feature, data});
        let color = colorScale?.(value) || 'currentColor';
        color = colorScale?.(value) || 'currentColor';

        return (
          <path
            d={pathWithReducedPrecision(feature, precision)}
            fill={color}
            onMouseMove={
              onHover && (!('ontouchstart' in window) || !onSelect)
                ? (event) => {
                    shouldFireScrollMouseLeaveHack.current = true;
                    onHover({event, feature, data});
                  }
                : null
            }
            onMouseOut={leave}
            onClick={onSelect ? (e) => onSelect({e, feature, data}) : null}
            key={id}
          />
        );
      }),
    [
      colorScale,
      dataById,
      features,
      geoKeyGetter,
      leave,
      onHover,
      onSelect,
      pathWithReducedPrecision,
      precision,
      valueGetter,
    ],
  );

  return <g className={cx(cn.container, className)}>{paths}</g>;
}

Choropleth.propTypes = {
  className: PropTypes.string,
  features: PropTypes.array,
  data: PropTypes.oneOfType([PropTypes.instanceOf(Map), PropTypes.array]),
  colorScale: PropTypes.func,
  valueGetter: PropTypes.func,
  dataKeyGetter: PropTypes.func,
  onSelect: PropTypes.func,
  precision: PropTypes.number,
};

export default memo(Choropleth);

/*
to style features without color, set the currentColor
in the component that uses this Choropleth component,
like this:
.choropleth {
  path {
    color: transparent;
  }
}
*/
