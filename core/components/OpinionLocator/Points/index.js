import {useEffect, useRef} from 'react';
import styled from 'styled-components';
import {extent} from 'd3-array';
import {scaleLinear} from 'd3-scale';

const Canvas = styled.canvas`
  background: transparent;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
`;

const minColor = 'rgba(0,0,0,0.5)';
const maxColor = 'rgba(0,0,0,1)';

const Points = ({points, size}) => {
  const canvas = useRef(null);

  useEffect(() => {
    if (points && points.length) {
      const countExtent = extent(points, (p) => p.count);
      const opacityScale = scaleLinear()
        .domain(countExtent)
        .range([minColor, maxColor]);
      const ctx = canvas.current.getContext('2d');

      ctx.clearRect(0, 0, size, size);

      points.forEach((point) => {
        ctx.fillStyle = opacityScale(point.count);
        ctx.fillColor = ctx.fillRect(point.x, point.y, 1, 1);
      });
    }
  }, [size, points]);

  if (!points) {
    return null;
  }

  return <Canvas ref={canvas} width={size} height={size} />;
};

export default Points;
