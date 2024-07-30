import {PureComponent} from 'react';
import styled from 'styled-components';

function isSmall(props) {
  return props.outerWidth < 660;
}

function hasRotation(props) {
  return (props.pos === 'left' || props.pos === 'right') && isSmall(props);
}

function getTransform(props) {
  const transforms = [];
  const isRotated = hasRotation(props);

  if (isRotated) {
    transforms.push('rotate(-90deg)');
  }

  if ((props.pos === 'top' || props.pos === 'bottom') && isSmall(props)) {
    // top, bottom on mobile
    transforms.push('translate(-50%, 50%)');
  } else if (isRotated) {
    // left, right on mobile
    if (props.pos === 'left') {
      transforms.push('translate(-50%, 70%)');
      transforms.unshift('translateY(-50%)');
    } else {
      transforms.push('translate(-50%, 40%)');
      transforms.unshift('translateY(-50%)');
    }
  } else if (
    (props.pos === 'top' || props.pos === 'bottom') &&
    !isSmall(props)
  ) {
    // top, bottom on desktop
    transforms.push('translate(-50%, 50%)');
  } else {
    // left, right on desktop
    transforms.push('translate(0, -50%)');
  }

  return transforms.length ? transforms.join(' ') : 'none';
}

function getTextAlign(props) {
  if (isSmall(props) || props.pos === 'bottom' || props.pos === 'top') {
    return 'center';
  }

  return props.pos === 'left' ? 'right' : 'left';
}

function getMaxWidth(props) {
  if (isSmall(props)) {
    return 'none';
  }

  return props.maxWidth ? `${props.maxWidth}px` : 'none';
}

const AxisLabel = styled('div')`
  position: absolute;
  left: ${(props) => props.left}px;
  top: ${(props) => props.top}px;
  text-align: ${getTextAlign};
  color: ${(props) => (props.isResultMode ? '#252525' : props.labelColor)};
  line-height: 1.2;
  width: ${getMaxWidth};
  user-select: none;
  font-size: 13px;
  letter-spacing: 0.03em;
  transform: ${getTransform};
  width: ${(props) =>
    hasRotation(props) ? `${props.size}px` : `${getMaxWidth}px`};
  transform-origin: ${(props) => (hasRotation(props) ? 'left' : 'auto')};
  display: block;
`;

const AxisLabelsWrapper = styled('div')`
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
`;

export default class AxisLabels extends PureComponent {
  render() {
    const {
      outerWidth,
      outerHeight,
      isResultMode,
      colorX,
      labelColorX,
      colorY,
      labelColorY,
      margin,
      minXLabel,
      maxXLabel,
      minYLabel,
      maxYLabel,
      scaleX,
      scaleY,
    } = this.props;

    return (
      <AxisLabelsWrapper>
        <AxisLabel
          top={scaleX(0) + margin.y}
          left={-4}
          maxWidth={margin.x}
          color={colorX}
          labelColor={labelColorX}
          isResultMode={isResultMode}
          dangerouslySetInnerHTML={{__html: minXLabel}}
          size={outerHeight}
          pos="left"
          outerWidth={outerWidth}
        />
        <AxisLabel
          top={scaleX(0) + margin.y}
          left={outerWidth - margin.x + 4}
          maxWidth={margin.x}
          color={colorX}
          labelColor={labelColorX}
          isResultMode={isResultMode}
          dangerouslySetInnerHTML={{__html: maxXLabel}}
          size={outerHeight}
          pos="right"
          outerWidth={outerWidth}
        />

        <AxisLabel
          top={outerHeight - margin.y}
          left={scaleY(0) + margin.x}
          color={colorY}
          labelColor={labelColorY}
          isResultMode={isResultMode}
          dangerouslySetInnerHTML={{__html: minYLabel}}
          size={outerWidth}
          pos="bottom"
          outerWidth={outerWidth}
        />
        <AxisLabel
          top={-4}
          left={scaleY(0) + margin.x}
          color={colorY}
          labelColor={labelColorY}
          isResultMode={isResultMode}
          dangerouslySetInnerHTML={{__html: maxYLabel}}
          size={outerWidth}
          pos="top"
          outerWidth={outerWidth}
        />
      </AxisLabelsWrapper>
    );
  }
}
