import {memo} from 'react';
import {Marker} from 'react-map-gl/maplibre';
import cx from 'classnames';

import useIsDarkMode from 'core/hooks/useIsDarkMode';
import labelPresets from './label-presets';
import cn from './index.module.scss';
const defaultStyle = {
  cursor: 'default',
};
const Labels = memo(({data, preset, style, zoom, initialZoom}) => {
  const isDarkMode = useIsDarkMode();
  const mode = isDarkMode ? 'dark' : 'light';
  const styleId = style?.[mode] || style;

  if (zoom >= initialZoom + 0.5) {
    return null;
  }

  let labels = data || [];

  if (preset && labelPresets[preset]) {
    labels = labels.concat(labelPresets[preset]);
  }

  const visibleLabels = labels.filter((l) => {
    return zoom >= l.minZoom && zoom < l.maxZoom;
  });

  return (
    <>
      {visibleLabels.map((label) => {
        const labelStyleId = label.style?.[mode] || styleId;
        return (
          <Marker
            key={label.text}
            latitude={label.position[0]}
            longitude={label.position[1]}
            offset={label.offset}
            anchor={label.anchor}
            style={defaultStyle}
          >
            <span
              className={cx(
                cn.label,
                {
                  [cn.region]: label.type === 'region',
                  [cn.light]: labelStyleId !== 'dark',
                  [cn.dark]: labelStyleId === 'dark',
                },
                cn.textContent,
              )}
              data-content={label.text}
              style={{
                textAlign: label.textAlign,
                width: label.width,
                // marginLeft: '-75px',
                // marginTop: '-7px',
              }}
            >
              {label.text}
            </span>
          </Marker>
        );
      })}
    </>
  );
});

export default Labels;
