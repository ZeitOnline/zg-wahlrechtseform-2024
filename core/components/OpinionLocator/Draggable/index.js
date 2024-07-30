import {PureComponent, createRef} from 'react';
import styled, {keyframes, css} from 'styled-components';
import interact from 'interactjs';

import {clamp} from 'core/components/OpinionLocator/utils';
import {SUPPORTS_TOUCH, IS_MOBILE} from 'core/utils/env';

const draggableWidth = 50;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.1);
  }

  100% {
    transform: scale(1);
  }
`;

const DraggableWrapper = styled('div')`
  top: 0;
  left: 50%;
  position: absolute;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  margin-left: -${(props) => props.size / 2}px;
  padding: ${(props) => props.draggableWidth / 2}px;
  cursor: ${(props) =>
    !IS_MOBILE && !props.hasClickedPosition ? 'pointer' : 'default'};
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
`;

function getCursor(props) {
  if (!props.hasClickedPosition) {
    return 'pointer';
  }

  if (props.isVisible && props.hasClickedPosition) {
    return 'move';
  }

  return 'default';
}

const DraggableItem = styled('div')`
  background: transparent;
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 100%;
  border: ${(props) =>
    props.isVisible ? '6px solid rgba(94, 83, 79, 0.3)' : 'none'};
  box-shadow: ${(props) =>
    props.isVisible ? '0 2px 2px 0 rgba(0,0,0,0.39)' : 'none'};
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${(props) =>
    props.hasStarted
      ? 'none'
      : css`
          ${pulse} 2s ease-out infinite
        `};
`;

const DraggableItemOuter = styled('div')`
  left: 0;
  top: 0;
  position: absolute;
  transition: margin-top 0.2s;
  width: ${(props) => props.draggableWidth}px;
  height: ${(props) => props.draggableWidth}px;
  pointer-events: ${(props) =>
    IS_MOBILE || props.hasClickedPosition ? 'all' : 'none'};
  cursor: ${getCursor};
  user-select: none;
  touch-action: pinch-zoom;
`;

const DraggableInner = styled('div')`
  border: 2px solid #5e534f;
  background: white;
  width: 11px;
  height: 11px;
  border-radius: 100%;
  box-shadow: ${(props) =>
    props.hasSubmitted ? 'none' : '0 2px 2px 0 rgba(0,0,0,0.25)'};
`;

const UserLabel = styled('div')`
  position: absolute;
  top: 0;
  font-size: 12px;
  font-weight: 700;
`;

const DraggalbeInfo = styled('div')`
  font-weight: 700;
  width: 92px;
  line-height: 1.2;
  font-size: 12px;
  position: absolute;
  top: ${draggableWidth}px;
  text-align: center;
  color: #555;
  pointer-events: none;
`;

export default class Draggable extends PureComponent {
  constructor() {
    super();
    this.draggable = createRef();
  }

  componentDidMount() {
    interact(this.draggable.current, {styleCursor: false})
      .on('up', this.props.onDragEnd)
      .on('down', this.props.onDragStart)
      .draggable({
        onstart: this.props.onDragStart,
        onmove: this.props.onDragMove,
        onend: this.props.onDragEnd,
        autoScroll: false,
        inertia: false,
        // modifiers: [
        //   interact.modifiers.restrictRect({
        //     restriction: 'parent',
        //   }),
        // ],
      });
  }

  onMouseEnter() {
    if (this.props.hasClickedPosition || SUPPORTS_TOUCH) {
      return false;
    }

    this.props.onMouseEnter();
  }

  onMouseMove(evt) {
    if (this.props.hasClickedPosition || SUPPORTS_TOUCH) {
      return false;
    }

    const rect = evt.target.getBoundingClientRect();
    let x = clamp(
      evt.clientX - rect.left - draggableWidth / 2,
      0,
      this.props.innerSize,
    );
    let y = clamp(
      evt.clientY - rect.top - draggableWidth / 2,
      0,
      this.props.innerSize,
    );

    this.props.onMouseMove(x, y);
  }

  render() {
    const {
      innerSize,
      dragPosX,
      dragPosY,
      hasSubmitted,
      loadedResults,
      isDragging,
      hasClickedPosition,
      hasStarted,
      dragCallToAction,
    } = this.props;

    if (loadedResults) {
      return null;
    }

    return (
      <DraggableWrapper
        size={innerSize + draggableWidth}
        draggableWidth={draggableWidth}
        onMouseEnter={(evt) => this.onMouseEnter(evt)}
        onMouseMove={(evt) => this.onMouseMove(evt)}
        onMouseLeave={(evt) => this.onMouseMove(evt)}
        onClick={this.props.onClick}
        hasClickedPosition={hasClickedPosition}
        id="draggable-wrapper"
      >
        <DraggableItemOuter
          ref={this.draggable}
          dragPosX={dragPosX}
          dragPosY={dragPosY}
          draggableWidth={draggableWidth}
          hasClickedPosition={hasClickedPosition}
          style={{
            transform: `translate(${dragPosX}px, ${dragPosY}px)`,
          }}
        >
          <DraggableItem
            draggableWidth={draggableWidth}
            isVisible={!hasSubmitted}
            isDragging={isDragging}
            hasClickedPosition={hasClickedPosition}
            hasStarted={hasStarted}
          >
            {hasSubmitted && <UserLabel>Sie</UserLabel>}
            <DraggableInner hasSubmitted={hasSubmitted} />
            {!hasStarted && <DraggalbeInfo>{dragCallToAction}</DraggalbeInfo>}
          </DraggableItem>
        </DraggableItemOuter>
      </DraggableWrapper>
    );
  }
}
