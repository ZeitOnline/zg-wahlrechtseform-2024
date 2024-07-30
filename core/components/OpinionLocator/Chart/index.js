import {PureComponent} from 'react';
import styled from 'styled-components';
import {geoPath} from 'd3-geo';
import {interpolateLab, interpolateRgb} from 'd3-interpolate';

import Axis from 'core/components/OpinionLocator/Axis';
import Grid from 'core/components/OpinionLocator/Grid';
import HelperLine from 'core/components/OpinionLocator/HelperLine';

const SVG = styled('svg')`
  fill: none;
  display: block;
  overflow: visible !important;
`;

const ContourGroup = styled('g')`
  clip-path: url('#clipInner');
`;

const pathGen = geoPath();

export default class Chart extends PureComponent {
  constructor(props) {
    super();

    const colorMidpoint = interpolateRgb.gamma(5)(props.colorX, props.colorY)(
      0.5,
    );

    const densityMinColor = props.densityMinColor
      ? props.densityMinColor
      : interpolateRgb.gamma(2)(colorMidpoint, '#eee')(0.7);

    const densityMaxColor = props.densityMaxColor
      ? props.densityMaxColor
      : interpolateRgb.gamma(0.5)(colorMidpoint, '#000')(0.3);

    this.colorGen = interpolateLab(densityMinColor, densityMaxColor);
  }

  renderTokenContours() {
    if (!this.props.tokenContours) {
      return null;
    }

    const contourValues = this.props.tokenContours.map((c) =>
      c.contour.map((d) => d.value),
    );
    const maxContourVal = Math.max(
      ...contourValues.reduce((res, item) => res.concat(item), []),
    );

    return this.props.tokenContours.map((item) => {
      const colors = this.props.tokenColors[item.id];
      const colorGen = interpolateLab(colors[0], colors[1]);

      return (
        <ContourGroup>
          {item.contour.map((c, i) => (
            <path
              key={`contour_${i}`}
              stroke="none"
              fill={colorGen(c.value / maxContourVal)}
              fillOpacity={0.1}
              d={pathGen(c)}
            />
          ))}
        </ContourGroup>
      );
    });
  }

  renderTokenPoints() {
    if (!this.props.tokenPoints) {
      return null;
    }

    return this.props.tokenPoints
      .filter((item) => item.color)
      .map((item) => {
        return (
          <circle
            cx={item.coords[0]}
            cy={item.coords[1]}
            fill={item.color}
            stroke="none"
            r="1.5"
          />
        );
      });
  }

  render() {
    const {
      innerSize,
      axisCircleSize,
      scaleX,
      scaleY,
      contour,
      isResultMode,
      colorX,
      colorY,
      hasStarted,
      dragPosX,
      dragPosY,
      showHelperLines,
      hasToken,
      chartMode,
      gradientBackground,
    } = this.props;

    const maxContourVal = contour
      ? Math.max(...contour.map((c) => c.value))
      : null;

    return (
      <SVG width={innerSize} height={innerSize}>
        <g>
          <clipPath id="clipInner">
            <rect width={innerSize} height={innerSize} />
          </clipPath>
          {gradientBackground && (
            <defs>
              <linearGradient id={`gradX-${colorX}`} x1="0%" x2="100%">
                <stop
                  offset="0%"
                  style={`stop-color:${colorX}; stop-opacity:0;`}
                />
                <stop
                  offset="50%"
                  style={`stop-color:${colorX}; stop-opacity:.1;`}
                />
                <stop
                  offset="100%"
                  style={`stop-color:${colorX}; stop-opacity:.3;`}
                />
              </linearGradient>
              <linearGradient id={`gradY-${colorY}`} y1="100%" x2="0%">
                <stop
                  offset="0%"
                  style={`stop-color:${colorY}; stop-opacity:0;`}
                />
                <stop
                  offset="50%"
                  style={`stop-color:${colorY}; stop-opacity:.1;`}
                />
                <stop
                  offset="100%"
                  style={`stop-color:${colorY}; stop-opacity:.3;`}
                />
              </linearGradient>
            </defs>
          )}
          {gradientBackground && (
            <rect
              width={innerSize}
              height={innerSize}
              fill={`url(#gradY-${colorY})`}
              rx="3"
            />
          )}
          {gradientBackground && (
            <rect
              width={innerSize}
              height={innerSize}
              fill={`url(#gradX-${colorX})`}
              rx="3"
              style={{mixBlendMode: 'multiply'}}
            />
          )}
          {!gradientBackground && (
            <rect
              width={innerSize}
              height={innerSize}
              fill="#F0EEEC"
              fillOpacity={0.33}
              stroke="#E4DED8"
              shapeRendering="crispEdges"
            />
          )}
          {!gradientBackground && (
            <Grid
              size={innerSize}
              lines={6}
              isXGrid
              scale={scaleY}
              gradientBackground={gradientBackground}
            />
          )}
          {!gradientBackground && (
            <Grid
              size={innerSize}
              lines={6}
              scale={scaleX}
              gradientBackground={gradientBackground}
            />
          )}
          <Axis
            size={innerSize}
            circleSize={axisCircleSize}
            isXAxis
            scale={scaleY}
            isResultMode={isResultMode}
            color={colorX}
          />
          <Axis
            size={innerSize}
            circleSize={axisCircleSize}
            scale={scaleX}
            isResultMode={isResultMode}
            color={colorY}
          />
          <HelperLine
            x={dragPosX}
            y={dragPosY}
            color={colorY}
            scaleX={scaleX}
            scaleY={scaleY}
            isVisible={showHelperLines && hasStarted && !isResultMode}
          />
          <HelperLine
            x={dragPosX}
            y={dragPosY}
            color={colorX}
            scaleX={scaleX}
            scaleY={scaleY}
            isVisible={showHelperLines && hasStarted && !isResultMode}
            isXAxis
          />
          {!hasToken && chartMode === 'user' && (
            <ContourGroup>
              {contour &&
                contour.map((c, i) => (
                  <path
                    key={`contour_${i}`}
                    stroke="none"
                    fill={this.colorGen(c.value / maxContourVal)}
                    fillOpacity={0.4}
                    d={pathGen(c)}
                  />
                ))}
            </ContourGroup>
          )}
          {chartMode === 'token' && this.renderTokenContours()}
          {chartMode === 'token' && this.renderTokenPoints()}
        </g>
      </SVG>
    );
  }
}
