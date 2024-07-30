import cn from './index.module.scss';
import cx from 'classnames';

import ZoomBackControl from './ZoomBackControl';
import ZoomOutControl from './ZoomOutControl';
import ZoomInControl from './ZoomInControl';

const ZoomControl = ({
  onInitialZoom = () => {},
  showInitialZoomButton = true,
  isVisible,
  map,
}) => {
  if (!isVisible) {
    return null;
  }

  const handleZoomIn = () => {
    map.zoomIn();
  };
  const handleZoomOut = () => {
    map.zoomOut();
  };

  return (
    <div className={cx(cn.container)}>
      <ZoomInControl onClick={handleZoomIn} />
      <ZoomOutControl onClick={handleZoomOut} />
      {showInitialZoomButton && <ZoomBackControl onClick={onInitialZoom} />}
    </div>
  );
};

export default ZoomControl;
