import {useMemo} from 'react';
import cx from 'classnames';

import {useChart} from 'core/components/Chart/hooks.js';

import cn from './index.module.scss';

function hypotenuse(a, b) {
  return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
}

const SwoopyArrow = ({
  from = null,
  to = null,
  angle = Math.PI / 4,
  clockwise = true,
  text = null,
  textAnchor = 'start',
  textOffset = [0, 0],
  visible = true,
  className,
}) => {
  const {xScale, yScale} = useChart();

  const textLines = useMemo(() => {
    if (!text) {
      return null;
    }
    if (typeof text === 'string' || text instanceof String) {
      return [
        {
          label: text,
          break: false,
          x: '0',
        },
      ];
    }
    return text;
  }, [text]);

  if (!from || !to) {
    return null;
  }

  const angleParsed = Math.min(Math.max(angle, 1e-6), Math.PI - 1e-6);

  // get the chord length ("height" {h}) between points
  var hypo = hypotenuse(
    xScale(to[0]) - xScale(from[0]),
    yScale(to[1]) - yScale(from[1]),
  );

  // get the distance at which chord of height h subtends {angle} radians
  var d = hypo / (2 * Math.tan(angleParsed / 2));

  // get the radius {r} of the circumscribed circle
  var r = hypotenuse(d, hypo / 2);

  /*
    SECOND, compose the corresponding SVG arc.
      read up: http://www.w3.org/TR/SVG/paths.html#PathDataEllipticalArcCommands
      example: <path d = "M 200,50 a 50,50 0 0,1 100,0"/>
                          M 200,50                          Moves pen to (200,50);
                                   a                        draws elliptical arc;
                                     50,50                  following a degenerate ellipse, r1 == r2 == 50;
                                                            i.e. a circle of radius 50;
                                           0                with no x-axis-rotation (irrelevant for circles);
                                             0,1            with large-axis-flag=0 and sweep-flag=1 (clockwise);
                                                 100,0      to a point +100 in x and +0 in y, i.e. (300,50).
    */
  const path =
    'M ' +
    xScale(from[0]) +
    ',' +
    yScale(from[1]) +
    ' a ' +
    r +
    ',' +
    r +
    ' 0 0,' +
    (clockwise ? '1' : '0') +
    ' ' +
    (xScale(to[0]) - xScale(from[0])) +
    ',' +
    (yScale(to[1]) - yScale(from[1]));

  const textTransform = to.map((d, i) =>
    i === 0 ? xScale(d) + textOffset[i] : yScale(d) + textOffset[i],
  );

  return (
    <g className={cx(cn.swoopy, className, {[cn.visible]: visible})}>
      <path
        d={path}
        className={cx(cn.swoopyPath, cn.swoopyOutline)}
        data-x-role="outline"
      />
      {textLines && (
        <g transform={`translate(${textTransform.join(' ')})`}>
          <text
            textAnchor={textAnchor}
            className={cx(cn.swoopyText, cn.swoopyOutline)}
            data-x-role="outline"
          >
            {textLines.map((l, i) =>
              l.break ? (
                <tspan x={l.x} y={15} fill={l.className}>
                  {l.label}
                </tspan>
              ) : (
                <tspan x={'0'} y={i} fill={l.className}>
                  {l.label}
                </tspan>
              ),
            )}
          </text>
        </g>
      )}
      <path d={path} className={cn.swoopyPath} />
      {textLines && (
        <g transform={`translate(${textTransform.join(' ')})`}>
          <text textAnchor={textAnchor} className={cn.swoopyText}>
            {textLines.map((l, i) =>
              l.break ? (
                <tspan x={l.x} y={15} fill={l.className}>
                  {l.label}
                </tspan>
              ) : (
                <tspan x={l.x} y={i} fill={l.className}>
                  {l.label}
                </tspan>
              ),
            )}
          </text>
        </g>
      )}
    </g>
  );
};

export default SwoopyArrow;
