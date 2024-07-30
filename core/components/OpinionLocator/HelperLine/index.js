const Helperline = ({scaleX, scaleY, x, y, color, isVisible, isXAxis}) => {
  if (!isVisible) {
    return null;
  }

  const x1 = isXAxis ? x : scaleX(0);
  const y1 = isXAxis ? scaleY(0) : y;

  const cx = isXAxis ? x : scaleX(0);
  const cy = isXAxis ? scaleY(0) : y;

  return (
    <g>
      <line
        x1={x1}
        x2={x}
        y1={y1}
        y2={y}
        stroke={color}
        strokeDasharray="4 7"
        strokeWidth="2"
      />
      <circle
        r="3"
        strokeWidth="2"
        stroke={color}
        fill="white"
        cx={cx}
        cy={cy}
      />
    </g>
  );
};

export default Helperline;
