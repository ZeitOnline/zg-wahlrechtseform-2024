const Axis = ({size, circleSize, color, isXAxis, scale, isResultMode}) => {
  const transformX = isXAxis ? 0 : scale(0);
  const transformY = isXAxis ? scale(0) : 0;

  const circleMinX = isXAxis ? circleSize : 0;
  const circleMaxX = isXAxis ? size - circleSize : 0;
  const circleMinY = isXAxis ? 0 : circleSize;
  const circleMaxY = isXAxis ? 0 : size - circleSize;

  const lineX2 = isXAxis ? size : 0;
  const lineY2 = isXAxis ? 0 : size;

  const axisColor = isResultMode ? '#99999C' : color;
  const axisWidth = isResultMode ? 1 : 7;
  const axisOpacity = isResultMode ? 1 : 0.17;

  return (
    <g transform={`translate(${transformX}, ${transformY})`}>
      {!isResultMode && (
        <circle cx={circleMinX} cy={circleMinY} fill={color} r={circleSize} />
      )}
      {!isResultMode && (
        <circle cx={circleMaxX} cy={circleMaxY} fill={color} r={circleSize} />
      )}
      <line
        x1="0"
        x2={lineX2}
        y1="0"
        y2={lineY2}
        stroke={axisColor}
        strokeWidth={axisWidth}
        strokeOpacity={axisOpacity}
        shapeRendering="crispEdges"
      />
    </g>
  );
};

export default Axis;
