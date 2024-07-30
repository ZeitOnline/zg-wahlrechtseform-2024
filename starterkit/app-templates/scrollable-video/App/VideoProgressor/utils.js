import lerp from 'core/utils/lerp';

export function findStartNodes({
  propName = 'data-prop-display',
  propValue = 'scrollable-video-start',
}) {
  return [...document.querySelectorAll(`[${propName}="${propValue}"]`)];
}

export function findEndNode({
  startNode,
  propName = 'data-prop-display',
  propValue = 'scrollable-ende',
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

export function isWithin(scrollY, range) {
  if (!isFinite(range[0]) || !isFinite(range[1])) return false;
  return scrollY >= range[0] && scrollY <= range[1];
}

// Wenn die scrollPosition gerade nicht innerhalb eines Videos ist
// dann retournier trotzdem einfach jenen Video, der am nächsten ist
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

export const timecodeRegex = /^\d{2}:\d{2}:?\d*$/;

export function timecodeToFrame(timecode, frameRate = 30) {
  if (typeof timecode === 'number') return timecode; // it's actually a frame already
  if (typeof timecode !== 'string' || !timecode?.match(timecodeRegex)) {
    console.log(
      `no valid timecode provided, needs format mm:ss(:ff) but got ${timecode}`,
    );
    return;
  }
  const [min, sec, frame = 0] = timecode.split(':').map(Number);
  return min * 60 * frameRate + sec * frameRate + frame;
}

export function frameToTimecode(input, frameRate = 30) {
  if (typeof input !== 'number') {
    console.log(
      `no valid frame provided, needs to be a number, but got ${input}`,
    );
    return;
  }
  const min = Math.floor(input / (frameRate * 60));
  const sec = Math.floor(input / frameRate);
  const frame = Math.floor(input % frameRate);
  return [min, sec, frame].map((d) => d.toString().padStart(2, '0')).join(':');
}

export const parseAnnotations = (frameRate = 30, isTabletMin = false) =>
  function parseAnnotation(d, i, a) {
    const offsets =
      d.offsets.x || Array.isArray(d.offsets)
        ? d.offsets // offsets was defined without breakpoints
        : isTabletMin
          ? d.offsets.desktop
          : d.offsets.mobile || d.offsets.desktop;
    const anchor =
      typeof d.anchor === 'string'
        ? d.anchor // anchor was defined without breakpoints
        : isTabletMin
          ? d.anchor.desktop
          : d.anchor.mobile || d.anchor.desktop;
    return {
      ...d,
      visible: {
        from: timecodeToFrame(d.visible.from, frameRate),
        to: timecodeToFrame(d.visible.to, frameRate),
      },
      offsets: offsets.map((e) => ({
        time: timecodeToFrame(e.time, frameRate),
        x: parseOffset(e.x),
        y: parseOffset(e.y),
      })),
      translate: getTranslateFromAnchor(anchor),
      textAlign: anchor.match(/left/)
        ? 'left'
        : anchor.match(/right/)
          ? 'right'
          : 'center',
      debug: a.debug,
    };
  };

function parseOffset(input) {
  if (typeof input === 'number') return input; // it's actually a number already
  if (typeof input !== 'string' || !input?.match(/^[+-]?\d+px$/)) {
    console.log(
      `no valid offset position provided, needs e.g. +20px but got ${input}`,
    );
    return;
  }
  return +input.replace(/px|[A-Za-z]/, '');
}

export function getTranslateFromAnchor(anchor) {
  switch (anchor) {
    case 'top left':
    case 'left top':
      return 'translate(0, 0)';
    case 'top center':
    case 'center top':
      return 'translate(-50%, 0)';
    case 'top right':
    case 'right top':
      return 'translate(-100%, 0)';
    case 'center left':
    case 'left center':
      return 'translate(0, -50%)';
    case 'center':
    case 'center center':
      return 'translate(-50%, -50%)';
    case 'center right':
    case 'right center':
      return 'translate(-100%, -50%)';
    case 'bottom left':
    case 'left bottom':
      return 'translate(0, -100%)';
    case 'bottom center':
    case 'center bottom':
      return 'translate(-50%, -100%)';
    case 'bottom right':
    case 'right bottom':
      return 'translate(-100%, -100%)';
    default:
      // case 'top left':
      return 'translate(0, 0)';
  }
}
