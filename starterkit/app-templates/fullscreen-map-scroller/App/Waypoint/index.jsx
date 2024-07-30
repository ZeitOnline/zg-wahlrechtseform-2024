import {useCallback, useEffect, useRef, useState} from 'react';
import useBreakpoint from 'core/hooks/useBreakpoint';
import useIsSSR from 'core/hooks/useIsSSR';
import toNumber from 'core/utils/toNumber';
import {useWaypoint} from '../ScrollProgressor/store';
import debug from '../../debug';
import cn from './index.module.scss';
import Card from 'core/components/Card';
import useViviImages from 'core/hooks/useViviImages';

// Gibt ein Array of Arrays zurück, über die dann gemappt werden kann
export function getFollowingSiblings(startContainer) {
  let items = [[]];
  let isLast = false;
  let sibling = startContainer.nextElementSibling;

  while (!isLast && sibling) {
    if (!sibling?.dataset?.propProgressor) {
      // wenn divider entdeckt wird, beginn neue Gruppe
      if (sibling?.dataset?.propDisplay === 'waypoint-divider') {
        items.push([]);
      }
      items[items.length - 1].push(sibling);
    }
    sibling = sibling?.nextElementSibling;
    if (sibling?.dataset?.propDisplay === 'waypoint-ende') {
      // items[items.length - 1].push(sibling);
      items.lastMargin = sibling.dataset?.propMargin;
      isLast = true;
    }
  }
  return items;
}

function unescapeHtml(unsafe) {
  return unsafe
    .replaceAll(/&lt;/g, '<')
    .replaceAll(/&gt;/g, '>')
    .replaceAll(/&quot;/g, '"')
    .replaceAll(/&#039;/g, "'");
}

function getImagesHaveBeenProcessed() {
  if (typeof document === 'undefined') return false;
  const imagesArray = Array.from(
    document.querySelectorAll('img.article__media-item'),
  );
  return imagesArray.every((imgNode) => {
    return imgNode.dataset.observed;
  });
}

function Waypoint({identifier}) {
  const isSSR = useIsSSR();
  const [error, setError] = useState(null);
  const isTabletMin = useBreakpoint('tablet', 'min');
  const imagesHaveBeenProcessed = useRef(false);
  const memoizedNodes = useRef([]);
  const waypoint = useWaypoint();

  useViviImages();

  useEffect(() => {
    if (typeof document === 'undefined') return [];
    const [startContainer, ...mustBeEmpty] = document.querySelectorAll(
      `[data-prop-identifier='${identifier}'][data-prop-display='waypoint-start']`,
    );
    if (mustBeEmpty.length) {
      setError(`💥 Fehler: Der Waypoint "${identifier}" kommt mehrmals vor`);
    }
    if (!startContainer) return;
    function moveNodesAround() {
      imagesHaveBeenProcessed.current = getImagesHaveBeenProcessed();
      if (memoizedNodes.current.length <= 0) {
        if (imagesHaveBeenProcessed.current) {
          memoizedNodes.current = getFollowingSiblings(startContainer);
          debug.waypoints && console.log(identifier, memoizedNodes.current);
          // forceUpdate();
        } else {
          window.setTimeout(moveNodesAround, 50);
        }
      }
    }
    moveNodesAround();
  }, [identifier]);

  const getMarginBottom = useCallback((marginInNext, isTabletMin) => {
    if (!isFinite(marginInNext)) return;
    return isTabletMin ? marginInNext + 'vh' : `${toNumber(marginInNext)}vh`;
  }, []);

  if (isSSR) return null;

  return (
    <div className={cn.wrapper} id={`section-${identifier}`}>
      {error && <div className={cn.error}>{error}</div>}
      <div className={cn.items}>
        {memoizedNodes.current.map((group, i, a) => {
          const marginInNext =
            a[i + 1]?.[0]?.dataset?.propMargin || // next
            group[group.length - 1]?.dataset?.propMargin ||
            (i === a.length - 1 && a.lastMargin); // last
          return (
            <Card
              key={`${i}-${identifier}`}
              className={cn.card}
              data-active={waypoint?.id === identifier}
              style={{
                marginBottom: getMarginBottom(marginInNext, isTabletMin),
                outline: debug.waypoints ? '1px solid magenta' : undefined,
              }}
            >
              {group.map((node, j) => (
                <RenderNode key={`${i}-${j}`} {...{node, i, j}} />
              ))}
              {debug.waypoints && (
                <span className={cn.debugInfo}>
                  identifier: {identifier}, i: {i}/{a.length}, propMargin:{' '}
                  {group[group.length - 1]?.dataset?.propMargin}, lastMargin:{' '}
                  {a.lastMargin}
                </span>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function removePlaceholders(innerHtml) {
  return innerHtml.replace(
    /(<div.*?>)?\[Farblegende\](<\/div>)?/gi,
    '<div class="visuallyHidden">[Farblegende]</div>',
  );
}

function getReplacement(innerHTML) {
  if (innerHTML.match(/\[Farblegende\]/gi)) {
    return <div className={cn.legend} />;
  }
}

const RenderNode = ({node, i, j}) => {
  const ref = useRef();

  useEffect(() => {
    node.innerHTML = unescapeHtml(removePlaceholders(node.innerHTML));
    ref.current.appendChild(node);
  }, [i, j, node]);

  return (
    <>
      <div ref={ref} />
      {getReplacement(node.innerHTML)}
    </>
  );
};

export default Waypoint;
