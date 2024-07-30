import {memo, useMemo, useEffect} from 'react';
import cx from 'classnames';

import {Popup} from 'react-map-gl/maplibre';
import CloseButton from 'core/components/CloseButton';
import cn from './index.module.scss';

const CustomTooltipContentWrapper = memo(({component: Component, ...props}) => {
  return <Component {...props} />;
});

const Tooltip = ({
  data,
  component,
  customProps,
  position,
  onClose = () => {},
  offsetTop = null,
  offsetLeft = null,
  isStatic,
  map,
  wrapperDimensions,
  ...props
}) => {
  // unset focus on close button
  useEffect(() => {
    const closeButton = document.querySelector(`.${cn.closeButton}`);
    if (closeButton) {
      closeButton.blur();
      setTimeout(() => {
        closeButton.blur();
      }, 100);
    }
  }, [data, position]);

  const {anchor, offset} = useMemo(() => {
    if (!position || !map) {
      return 'bottom-left';
    }

    const anchor = ['', ''];
    const offset = [0, 0];

    const {x, y} = map.project(position);
    const {width, height} = wrapperDimensions;

    if (x > width * (2 / 3)) {
      anchor[1] = 'right';
      offset[0] = -(offsetLeft || 10);
    } else {
      anchor[1] = 'left';
      offset[0] = offsetLeft || 10;
    }

    if (y < height * (1 / 3)) {
      anchor[0] = 'top';
      offset[1] = offsetTop || 10;
    } else {
      anchor[0] = 'bottom';
      offset[1] = -(offsetTop || 10);
    }

    return {anchor: anchor.join('-'), offset};
  }, [position, map, wrapperDimensions, offsetTop, offsetLeft]);

  if (!data || !position) {
    return null;
  }

  return (
    <Popup
      latitude={position.lat}
      longitude={position.lng}
      closeButton={false}
      className={cx(cn.tooltip)}
      anchor={anchor}
      tipSize={4}
      offset={offset}
      closeOnClick={false}
    >
      <CloseButton
        className={cx(cn.closeButton, {[cn.forceCloseButtonVisible]: isStatic})}
        onClick={onClose}
      />
      <CustomTooltipContentWrapper
        component={component}
        data={data}
        customProps={customProps}
        {...props}
      />
    </Popup>
  );
};

Tooltip.defaultProps = {
  content: '',
  error: '',
  headline: '',
  contentSwitch: false,
};

export default Tooltip;
