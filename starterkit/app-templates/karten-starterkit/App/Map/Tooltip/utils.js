export const isDefined = (d) => d && d[1];

export const getStroke = (colorScale, points, i) => {
  if (points[0].value === points[1].value) {
    return colorScale(points[0].value);
  }

  return `url(#chartGradient__${i})`;
};

export const translate = (x, y) => `translate(${x},${y})`;

export const getChangeSign = (v) => {
  if (v > 0) {
    return '+';
  } else if (v < 0) {
    return '-';
  } else {
    return '';
  }
};
