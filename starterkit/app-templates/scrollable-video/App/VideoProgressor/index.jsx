import {useMemo, useEffect, useRef, useCallback, useReducer} from 'react';
import PropTypes from 'prop-types';
import {scaleLinear} from 'd3-scale';

import cn from './index.module.scss';
import useWindowSize from 'core/hooks/useWindowSize';
import useDebounce from 'core/hooks/useDebounce';

import useVideoProgressStore from './store';
import config from '../../config';
import debug from '../../debug';

import {
  findClosestRangeFn,
  findEndNode,
  findStartNodes,
  getTop,
  isWithin,
} from './utils.js';

function VideoProgressor({windowHeightOffset = 0.5}) {
  const scrollYRef = useRef(useVideoProgressStore.getState().scrollY);
  const progressRef = useRef(useVideoProgressStore.getState().progress);
  const videoRef = useRef(useVideoProgressStore.getState().video);
  const videosRef = useRef(useVideoProgressStore.getState().videos);

  const setScrollY = useVideoProgressStore((state) => state.setScrollY);
  const setProgress = useVideoProgressStore((state) => state.setProgress);
  const setVideo = useVideoProgressStore((state) => state.setVideo);
  const setVideos = useVideoProgressStore((state) => state.setVideos);

  const {height: windowHeight} = useWindowSize();
  const [_, forceUpdate] = useReducer((x) => x + 1, 0);

  // Connect to the store on mount, disconnect on unmount, catch state-changes in a reference
  useEffect(
    () =>
      useVideoProgressStore.subscribe((state) => {
        scrollYRef.current = state.scrollY;
        progressRef.current = state.progress;
        videoRef.current = state.video;
        videosRef.current = state.videos;
      }),
    [],
  );

  useEffect(() => {
    debug.videoProgressor &&
      setTimeout(() => {
        console.log(
          videosRef.current.map((d) => ({
            ...d,
            domain: d.scale?.domain()?.toString(),
            range: d.scale?.range()?.toString(),
          })),
        );
      }, 1000);
  }, []);

  const offset = useMemo(() => {
    if (typeof window === 'undefined' || !isFinite(windowHeight)) return 0;
    return parseFloat(windowHeightOffset) * windowHeight;
  }, [windowHeightOffset, windowHeight]);

  const onScroll = useCallback(() => {
    if (typeof window === 'undefined') return;
    const newScrollY = window.scrollY + offset;
    try {
      // find closest video
      const videoIndex = videosRef.current
        .map(({scale}) => scale.domain())
        .findIndex(findClosestRangeFn(newScrollY));

      // update store with progress
      if (videoIndex >= 0) {
        const newVideo = videosRef.current[videoIndex];
        if (newVideo) {
          setProgress(newVideo.scale(newScrollY));
          setVideo(newVideo.identifier);
        }
      }
    } catch (e) {
      console.log(e);
    }
    setScrollY(newScrollY);
    debug.videoProgressor && forceUpdate();
  }, [offset, setVideo, setProgress, setScrollY]);

  const onResize = useDebounce(() => {
    if (typeof window === 'undefined') return;
    // scroll restoration (store position in variable)
    let restoreToProgress;
    try {
      // only store position if user is within a video
      const previousScale = videosRef.current.find(({scale}) =>
        isWithin(scrollYRef.current - offset, scale.domain()),
      );
      if (typeof previousScale === 'function' && scrollYRef.current > 0) {
        restoreToProgress = previousScale(scrollYRef.current - offset);
      }
    } catch (e) {
      console.log(e);
    }

    // map over both all start nodes of videos
    const videoStartNodes = findStartNodes({
      propName: 'data-prop-display',
      propValue: 'scrollable-video-start',
    }).map((node) => ({node, type: 'video'}));

    const lottieStartNodes = findStartNodes({
      propName: 'data-prop-display',
      propValue: 'scrollable-lottie-start',
    }).map((node) => ({node, type: 'lottie'}));

    // arrays to push values into, that update state below
    const newVideos = [];

    // measure all top and bottom positions of videos
    [...videoStartNodes, ...lottieStartNodes].forEach(
      ({node: startNode, type}) => {
        const stickyContainer = startNode.parentNode;
        const top = getTop(stickyContainer);
        const bottom = top + stickyContainer.offsetHeight;
        const identifier = startNode.dataset?.propIdentifier;

        if (type === 'video') {
          const currentVideo = config.videos.find(
            (d) => d.identifier === identifier,
          );
          const domain = [0, currentVideo.nFrames];
          const scale = scaleLinear()
            .range(domain)
            .domain([top, bottom])
            .clamp(true);

          newVideos.push({
            identifier,
            scale,
          });
        }
        if (type === 'lottie') {
          const domain = [0, startNode.dataset?.propTotalFrames];
          const scale = scaleLinear()
            .range(domain)
            .domain([top, bottom])
            .clamp(true);

          newVideos.push({
            identifier,
            scale,
          });
        }
      },
    );

    newVideos?.length &&
      setVideos(
        newVideos.sort(
          (a, b) => a.scale?.domain()?.[0] - b.scale?.domain()?.[0],
        ),
      );

    // restore scroll position, but not on mobile!
    // There it was just the browser bars that triggered the resize
    if (
      !window.matchMedia('(any-pointer: coarse)').matches &&
      isFinite(restoreToProgress)
    ) {
      // TODO: ist das ok so hier? oder dürfen wir nicht die nächste nehmen?
      const activeScale = newVideos
        .map(({scale}) => scale.domain())
        .find(findClosestRangeFn(scrollYRef.current));
      if (typeof activeScale === 'function') {
        const restoreToPx = activeScale.invert(restoreToProgress);
        window.scrollTo(0, restoreToPx);
      }
    }
    onScroll();
  }, [offset, onScroll, setVideos]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', onResize);
    // also observe body height changes (because of card setup)
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(document.body);
    onResize();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      resizeObserver.disconnect();
    };
  }, [onResize, onScroll]);

  return (
    <>
      {debug.videoProgressor && (
        <div className={cn.scrollIndicator} style={{top: offset}}>
          {JSON.stringify({
            scrollY: Math.round(scrollYRef.current),
            progress: Math.round(progressRef.current),
            identifier: videoRef.current,
          })}
        </div>
      )}
    </>
  );
}

VideoProgressor.propTypes = {
  /** Pass a number that is then multiplied by window.innerHeight (e.g. 0.5 = center of screen) */
  windowHeightOffset: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default VideoProgressor;
