import range from 'core/utils/range';

export const bboxToRect = ([min, max]) => {
  return [
    [min[0], min[1]],
    [max[0], min[1]],
    [max[0], max[1]],
    [min[0], max[1]],
    [min[0], min[1]],
  ];
};

export const rectToBbox = ([
  leftBottom,
  // eslint-disable-next-line no-unused-vars
  rightBottom,
  rightTop,
]) => {
  return [leftBottom, rightTop];
};

export const bboxToCoords = (bbox) => {
  return [
    [bbox[0], bbox[1]],
    [bbox[2], bbox[1]],
    [bbox[2], bbox[3]],
    [bbox[0], bbox[3]],
  ];
};

function executeAsaIdle(fn, map) {
  if (map) {
    map.once('idle', fn);
  }
}

// eslint-disable-next-line no-unused-vars
const retries = 10;
export function executeAsap(fn, condition, map, i = 0) {
  if (map && map.isStyleLoaded() && condition(i)) {
    fn();
  } else {
    if (i < retries)
      window.setTimeout(() => executeAsap(fn, condition, map, i + 1), 100);
  }
}

// tests if 2, 4, 6, 8, 10, 12 are equal
export function isEqual(filter1, filter2) {
  if (!filter1?.length || !filter2?.length) return false;
  return range(0, 13, 2).every((i) => {
    return filter1[i] === filter2[i];
  });
}
