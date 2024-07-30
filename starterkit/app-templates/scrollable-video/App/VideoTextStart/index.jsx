import {useEffect, useMemo, useRef} from 'react';
import cx from 'classnames';

import useIsSSR from 'core/hooks/useIsSSR';
import debug from '../../debug';
import cn from './index.module.scss';
import useVideoProgressStore from '../VideoProgressor/store';
import Card from 'core/components/Card';
import useCssVar from 'core/hooks/useCssVar';
import toNumber from 'core/utils/toNumber';
import isFinite from 'core/utils/isFinite';
import useBreakpoint from 'core/hooks/useBreakpoint';
import useViviImages from 'core/hooks/useViviImages';

// Gibt ein Array zurück, über die dann gemappt werden kann
export function getFollowingSiblings(startContainer) {
  let items = [];
  let isLast = false;
  let sibling = startContainer.nextElementSibling;

  while (!isLast && sibling) {
    // TODO: was ist das hier statt propPogressor?
    if (!sibling?.dataset?.propProgressor) {
      items.push(sibling);
    }
    sibling = sibling?.nextElementSibling;
    if (sibling?.dataset?.propDisplay === 'video-text-ende') {
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

function VideoTextStart({frameNumber}) {
  const ref = useRef(null);
  const isSSR = useIsSSR();
  const isTabletMin = useBreakpoint('tablet', 'min');
  const videos = useVideoProgressStore((state) => state.videos);
  const imagesHaveBeenProcessed = useRef(false);
  const navHeight =
    useCssVar('--nav-height', document?.querySelector('header')) || '85px';
  const memoizedNodes = useRef([]);

  useViviImages();

  const video = useMemo(() => {
    if (!ref.current) return {};
    return (
      videos.find(
        (d) =>
          d.identifier ===
          ref.current?.parentElement?.parentElement?.dataset?.propIdentifier,
      ) || {}
    );
  }, [videos]);

  useEffect(() => {
    if (typeof document === 'undefined' || !video.identifier) return;
    const startContainer = document.querySelector(
      `[data-prop-identifier='${video.identifier}']
      [data-prop-frame-number='${frameNumber}'][data-prop-display='video-text-start']`,
    );
    if (!startContainer) return;
    function moveNodesAround() {
      imagesHaveBeenProcessed.current = getImagesHaveBeenProcessed();
      if (memoizedNodes.current.length <= 0) {
        if (imagesHaveBeenProcessed.current) {
          memoizedNodes.current = getFollowingSiblings(startContainer);
        } else {
          window.setTimeout(moveNodesAround, 50);
        }
      }
    }
    moveNodesAround();
  }, [frameNumber, video.identifier]);

  const safeNavHeight = useMemo(() => {
    const asNumber = toNumber(navHeight.replace(/px/, ''));
    return isFinite(asNumber) && isTabletMin ? asNumber : 0;
  }, [isTabletMin, navHeight]);

  return (
    <Card
      innerRef={ref}
      className={cx(cn.card, {[cn.debug]: debug.waypoints})}
      data-frame-number={frameNumber}
      style={{
        top:
          typeof video.scale?.invert === 'function'
            ? video.scale.invert(frameNumber) - safeNavHeight
            : undefined,
      }}
    >
      {!isSSR &&
        memoizedNodes.current.map((node, i) => (
          <RenderNode key={`node-${i}`} {...{node}} />
        ))}
      {debug.waypoints && (
        <span className={cn.debugInfo}>
          video: {video.identifier}, frameNumber: {frameNumber}
        </span>
      )}
    </Card>
  );
}

const RenderNode = ({node}) => {
  const ref = useRef();

  useEffect(() => {
    node.innerHTML = unescapeHtml(node.innerHTML);
    ref.current.appendChild(node);
  }, [node]);

  return <div ref={ref} />;
};

export default VideoTextStart;
