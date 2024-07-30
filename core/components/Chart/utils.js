import {ascending, range} from 'd3-array';

import noop from 'core/utils/noop';

export function getXGetter(data, x) {
  let xGetter = x;
  if (!xGetter && data && data.length) {
    if (data[0].x) {
      xGetter = (d) => d.x;
    } else if (data[0].date) {
      xGetter = (d) => d.date;
    } else {
      xGetter = noop;
    }
  } else if (!xGetter) {
    xGetter = noop;
  }

  return xGetter;
}
export function getYGetter(data, y) {
  let yGetter = y;
  if (!yGetter) {
    if (data && data.length && data[0].y) {
      yGetter = (d) => d.y;
    } else {
      yGetter = noop;
    }
  }

  return yGetter;
}

// Given an array of positions V, offsets positions to ensure the given separation.
function dodge(V, separation, maxiter = 10, maxerror = 1e-1) {
  const n = V.length;
  if (!V.every(isFinite)) throw new Error('invalid position');
  if (!(n > 1)) return V;
  let I = range(V.length);
  for (let iter = 0; iter < maxiter; ++iter) {
    I.sort((i, j) => ascending(V[i], V[j]));
    let error = 0;
    for (let i = 1; i < n; ++i) {
      let delta = V[I[i]] - V[I[i - 1]];
      if (delta < separation) {
        delta = (separation - delta) / 2;
        error = Math.max(error, delta);
        V[I[i - 1]] -= delta;
        V[I[i]] += delta;
      }
    }
    if (error < maxerror) break;
  }
  return V;
}

// Get last elements of each array for creating a line or area object.
export function relax(data, minimumGap = 14) {
  const newPositions = dodge(
    data.map((d) => d.yPos),
    minimumGap,
  );
  return data.map((d, i) => ({
    ...d,
    yPos: newPositions[i],
  }));
}
