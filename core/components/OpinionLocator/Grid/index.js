const Grid = ({lines, isXGrid, size, scale, gradientBackground}) => {
  const transformX = isXGrid ? 0 : 0;
  const transformY = isXGrid ? 0 : 0;
  const stepSize = size / lines;

  return (
    <g transform={`translate(${transformX}, ${transformY})`}>
      {Array.apply(null, Array(lines)).map((d, i) => (
        <line
          key={`line_${i}`}
          x1={isXGrid ? 0 : stepSize * i}
          x2={isXGrid ? size : stepSize * i}
          y1={isXGrid ? stepSize * i : 0}
          y2={isXGrid ? stepSize * i : size}
          stroke={gradientBackground ? 'white' : '#E4DED8'}
          shapeRendering="crispEdges"
          opacity={stepSize * i === scale(0) ? 0 : 1}
        />
      ))}
    </g>
  );
};

export default Grid;
