import {useRef, useLayoutEffect} from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import clamp from 'core/utils/clamp';
import cn from './index.module.scss';

/**
 * Renders a tooltip but also positions it in a safe way so it's
 * always completely visible inside the viewport. The Tooltip is
 * positioned `fixed` so please pass `clientX` and `clientY` and
 * not absolutely positioned coordinates.
 */
const Tooltip = ({
  x: originalX,
  y: originalY,
  distance = 10,
  edgeDistance = 6,
  children,
  visible = true,
  align: originalAlign = 'top',
  className,
  style,
}) => {
  const tooltipRef = useRef();
  const dimensions = useRef({width: 1, height: 1});
  let finalX = originalX;
  let finalY = originalY;
  let align = originalAlign;
  let transform = 'translateX(-50%) ';

  useLayoutEffect(() => {
    if (!tooltipRef || typeof window === 'undefined') return;
    const {width, height} = tooltipRef.current.getBoundingClientRect();
    dimensions.current = {width, height};
  }, [distance, originalX, originalY]);

  if (typeof window === 'undefined') return null;

  const {width, height} = dimensions.current;

  finalX = clamp(
    originalX,
    width / 2 + edgeDistance,
    window.innerWidth - edgeDistance - width / 2,
  );

  if (
    originalAlign === 'top' &&
    originalY - distance - height - edgeDistance < 0
  ) {
    align = 'bottom';
  } else if (
    originalAlign === 'button' &&
    originalY + distance + height + edgeDistance > window.innerHeight
  ) {
    align = 'top';
  }

  if (align === 'top') {
    transform += `translateY(-100%) translateY(-${distance}px)`;
  } else {
    transform += `translateY(${distance}px)`;
  }

  return (
    <div
      ref={tooltipRef}
      className={cx(cn.tooltipWrapper, className, {
        [cn.visible]: visible && width > 0 && height > 0,
      })}
      style={{
        ...style,
        transform: `${style?.transform || ''} ${transform}`.trim(),
        left: `${finalX}px`,
        top: `${finalY}px`,
      }}
    >
      {children}
    </div>
  );
};

export default Tooltip;

Tooltip.propTypes = {
  /** Horizontal position of the Tooltip within the viewport (usually `e.clientX`) */
  x: PropTypes.number,
  /** Vertical position of the Tooltip within the viewport (usually `e.clientX`) */
  y: PropTypes.number,
  /** Should the Tooltip be rendered above or belowo the cursor? */
  align: PropTypes.oneOf(['top', 'bottom']),
  /** How much space do you want to have between the cursor and the Tooltip? */
  distance: PropTypes.number,
  /** How much space should be left between the Tooltip and the browser window? */
  edgeDistance: PropTypes.number,
  /** What should be rendered inside tooltip? */
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.func,
  ]),
  /** Should the Tooltip be visible at all? (CSS `visibility` is used here) */
  visible: PropTypes.bool,
  /** `className` and `style` will be added to the outermost div for additional styling */
  className: PropTypes.string,
  style: PropTypes.object,
};
