import lerp from 'core/utils/lerp';
import toNumber from 'core/utils/toNumber';

export function findStartNodes({
  propName = 'data-prop-display',
  propValue = 'scroll-progressor-start',
}) {
  return [...document.querySelectorAll(`[${propName}="${propValue}"]`)];
}

export function findEndNode({
  startNode,
  propName = 'data-prop-display',
  propValue = 'scroll-progressor-ende',
}) {
  const propNameCamelCase = propName
    .replace(/^data-/, '')
    .replaceAll(/-./g, (match) => match[1].toUpperCase());
  let sibling = startNode.nextElementSibling;

  while (sibling) {
    if (sibling?.dataset?.[propNameCamelCase] === propValue) return sibling;
    sibling = sibling?.nextElementSibling;
  }
}

export function isWithin(scrollY, range, marginBottom) {
  if (!isFinite(range[0]) || !isFinite(range[1])) return false;
  const lower = range[0];
  const upper =
    range[1] +
    // if is present, add marginBottom to upper bound (unit is vh)
    (marginBottom ? (toNumber(marginBottom) / 100) * window.innerHeight : 0);
  return scrollY >= lower && scrollY <= upper;
}

// Wenn die scrollPosition gerade nicht innerhalb eines Progressors ist
// dann retournier trotzdem einfach jenen Progressor, der am nächsten ist
export const findClosestRangeFn = (scrollY) => (_, i, allRanges) => {
  // eh nur eine, also fix am nächsten
  if (allRanges.length === 1) return true;
  // mindestens zwei
  const midPoints = allRanges.reduce((acc, curr, j, a) => {
    const next = a[j + 1];
    if (next) {
      const midpoint = lerp(curr[1], next[0], 0.5);
      acc.push(midpoint);
    }
    return acc;
  }, []);
  const indexOfClosest = midPoints.findIndex((d) => scrollY <= d);
  return indexOfClosest === -1 // wenn größer als alle Midpoints
    ? i === allRanges.length - 1 // dann ist die letzte aktiv
    : i === indexOfClosest; // ansonsten
};

export function getTop(el) {
  return el.offsetTop + (el.offsetParent && getTop(el.offsetParent));
}
