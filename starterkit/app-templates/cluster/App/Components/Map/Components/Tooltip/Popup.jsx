import {Popup as RglPopup} from 'react-map-gl';

const getAlignment = (point, dimensions) => {
  const {width, height} = dimensions;
  const {x, y} = point;

  const center = [width / 2, height / 2];

  let alignment = 'bottom-left';
  if (x < center[0] && y < center[1]) {
    alignment = 'top-left';
  } else if (x < center[0] && y > center[1]) {
    alignment = 'bottom-left';
  } else if (x > center[0] && y < center[1]) {
    alignment = 'top-right';
  } else if (x > center[0] && y > center[1]) {
    alignment = 'bottom-right';
  }

  return alignment;
};

const getOffset = (point, dimensions) => {
  const {width, height} = dimensions;
  const {x, y} = point;

  const center = [width / 2, height / 2];

  let offset = [0, 0];
  if (x < center[0] && y < center[1]) {
    offset = [10, 10];
  } else if (x < center[0] && y > center[1]) {
    offset = [10, -10];
  } else if (x > center[0] && y < center[1]) {
    offset = [-10, 10];
  } else if (x > center[0] && y > center[1]) {
    offset = [-10, -10];
  }

  return offset;
};

const Popup = (props) => {
  if (!props?.latitude || !props?.longitude) {
    return null;
  }

  return (
    <RglPopup
      anchor={getAlignment(props.referencePoint, props.dimensions)}
      offset={getOffset(props.referencePoint, props.dimensions)}
      {...props}
      // closeOnClick={false}
      // closeOnMove={false}
      onClose={() => props?.onClose?.()}
    >
      {props.children}
    </RglPopup>
  );
};

export default Popup;
