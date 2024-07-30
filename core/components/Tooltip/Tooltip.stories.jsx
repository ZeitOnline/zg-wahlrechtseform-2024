import {useRef} from 'react';
import Tooltip from './index.jsx';
import useMousePos, {isValidPos} from 'core/hooks/useMousePos.js';

export default {
  title: 'Components/Tooltip',
  component: Tooltip,
};

export const Default = () => {
  const parentRef = useRef(null);
  const [mousePos] = useMousePos(parentRef);

  return (
    <div
      ref={parentRef}
      style={{
        position: 'relative',
        height: '80vh',
        background: 'var(--duv-color-background-highlight)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid var(--duv-color-border-primary)',
      }}
    >
      Bewege deinen Cursor über diese Fläche
      {isValidPos(mousePos) && (
        <Tooltip
          x={mousePos.left}
          y={mousePos.top}
          style={{position: 'absolute'}}
        >
          <div>left: {mousePos.left}</div>
          <div>top: {mousePos.top}</div>
        </Tooltip>
      )}
      {isValidPos(mousePos) && (
        <div
          style={{
            position: 'absolute',
            left: mousePos.left,
            top: mousePos.top,
            borderRadius: '50%',
            width: 9,
            height: 9,
            transform: 'translate(-50%, -50%)',
            background: 'red',
          }}
        />
      )}
    </div>
  );
};
