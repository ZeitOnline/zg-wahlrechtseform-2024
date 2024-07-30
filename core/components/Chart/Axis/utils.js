import {useMemo} from 'react';

import {formatDate} from 'core/components/FormattedDateTime';

export function useTicks(customTicks, scale) {
  return useMemo(() => {
    let ticks = [];
    let byHand = false;

    if (customTicks) {
      if (Array.isArray(customTicks)) {
        byHand = true;
        ticks = customTicks.slice(0);
      } else {
        ticks = scale.ticks(customTicks);
      }
    }

    return [ticks, byHand];
  }, [customTicks, scale]);
}

export function figureOutTickLabel(tick, format, index) {
  if (Object.hasOwn(tick, 'text')) {
    return tick.text;
  }
  if (typeof format === 'function') {
    return format(tick, index);
  }
  if (typeof tick === 'number') {
    return tick;
  }
  return formatDate({datetime: tick, format});
}
