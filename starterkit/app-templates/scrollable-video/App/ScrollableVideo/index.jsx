import React, {useRef, useCallback, useEffect, useMemo} from 'react';
import cn from './index.module.scss';
import {
  toString,
  preloadFirstBatch,
  getCachedDirUrl,
  isBefore,
} from './utils.js';
import useBreakpoint from 'core/hooks/useBreakpoint';
import Annotations from '../Annotations';
import Debugger from '../Debugger';
import noop from 'core/utils/noop.js';
import useIsSSR from 'core/hooks/useIsSSR';
import CustomizedLoader from './CustomizedLoader';
import useDebounce from 'core/hooks/useDebounce';
import config from '../../config';
import debug from '../../debug';
import useVideoProgressStore, {
  useCurrentVideo,
  useVideoProgress,
} from '../VideoProgressor/store';

const loadingBatches = 5;

function ScrollableVideo({identifier = 'first', display, ...props}) {
  const {
    nFrames = 1000,
    meta,
    frameRate = 25,
    padLength = 4,
    annotations = false,
    ...video
  } = config.videos.find((d) => d.identifier === identifier);
  if (!meta) console.error(`video with id ${identifier} not found`);

  const progress = useRef(null);
  const videos = useVideoProgressStore((state) => state.videos);
  const currentVideo = useCurrentVideo();
  useVideoProgress(progress);
  const isSSR = useIsSSR();
  const drawingRef = useRef(null);
  const preloadingRef = useRef(null);
  const canvasRef = useRef(null);
  const imageCache = useRef([]);
  const preloadLimit = useRef(Math.ceil(nFrames / loadingBatches)); // start with 20% of frames
  const isTabletMin = useBreakpoint('tablet', 'min');
  const dimensions = useMemo(() => {
    return isTabletMin && !isSSR
      ? video.dimensions.desktop
      : video.dimensions.mobile;
  }, [isSSR, isTabletMin, video.dimensions]);

  const getImageUrl = useCallback(
    (frame = 1, quality, fixedDevice) => {
      const device = fixedDevice || isTabletMin ? 'desktop' : 'mobile';
      const frameAsString = toString(frame, nFrames, padLength);
      const filename = `frame-${frameAsString}.webp`;
      const dir = getCachedDirUrl(meta);
      return [dir, device, quality, filename].join('/');
    },
    [isTabletMin, meta, nFrames, padLength],
  );

  // just one once at start
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(preloadFirstBatch(preloadLimit.current, getImageUrl), []);

  const preloadImages = useCallback(() => {
    const i = imageCache.current.length;
    if (i <= preloadLimit.current) {
      if (!imageCache.current[i]) {
        const img = new Image();
        img.src = getImageUrl(i, 'low');
        imageCache.current[i] = img;
      }
      if (preloadingRef.current) {
        window.cancelAnimationFrame(preloadingRef.current);
      }
      preloadingRef.current = window.requestAnimationFrame(preloadImages);
    }
  }, [getImageUrl]);

  // reset cache as the images are probably the wrong ones for the new device
  useEffect(() => {
    imageCache.current = [];
  }, [isTabletMin]);

  const drawFrame = useCallback(
    (quality = 'low') => {
      if (canvasRef.current) {
        const frame =
          currentVideo.identifier === identifier
            ? Math.round(progress.current)
            : isBefore(currentVideo, identifier, videos)
              ? 0
              : nFrames;
        // reset other onloads so just the latest is drawn
        imageCache.current?.forEach((img) => {
          if (img) img.onload = noop;
        });
        const context = canvasRef.current.getContext('2d');
        // if is cached, use from cache (low quality only)
        if (quality === 'low' && imageCache.current[frame]) {
          const img = imageCache.current[frame];
          if (img.complete) {
            context.drawImage(img, 0, 0, dimensions.width, dimensions.height);
          } else {
            img.onload = function (evt) {
              context.drawImage(
                evt.target,
                0,
                0,
                dimensions.width,
                dimensions.height,
              );
            };
          }
        } else {
          // otherwise fetch image and draw when loaded
          const img = new Image();
          img.src = getImageUrl(frame, quality);
          img.onload = function (evt) {
            context.drawImage(
              evt.target,
              0,
              0,
              dimensions.width,
              dimensions.height,
            );
          };
        }
      }
    },
    [
      currentVideo,
      dimensions.height,
      dimensions.width,
      getImageUrl,
      identifier,
      nFrames,
      videos,
    ],
  );

  const drawHighQuality = useCallback(() => {
    drawFrame('high');
  }, [drawFrame]);

  const drawLowQuality = useCallback(() => {
    drawFrame('low');
  }, [drawFrame]);

  // unfortunately on iOS low-power mode 50 leads to problems, so we use 250
  // as the low power mode is not detectable via javascript we just use it for
  // all small devices
  const debouncedScroll = useDebounce(
    () => {
      drawHighQuality();
    },
    isTabletMin ? 100 : 250,
    [isTabletMin, drawHighQuality],
  );

  // if the user has scrolled 30% of the story, images at 40-60% will be prefetched
  const getPreloadLimit = useCallback(() => {
    const batchSize = Math.round(nFrames / loadingBatches);
    const frame = progress.current + batchSize - 1;
    return Math.round(
      Math.min(nFrames, batchSize * Math.ceil(frame / batchSize)),
    );
  }, [nFrames, progress]);

  const onScroll = useCallback(() => {
    preloadLimit.current = getPreloadLimit();
    drawingRef.current = window.requestAnimationFrame(drawLowQuality);
    preloadingRef.current = window.requestAnimationFrame(preloadImages);
    debouncedScroll();
  }, [getPreloadLimit, drawLowQuality, preloadImages, debouncedScroll]);

  useEffect(() => {
    window.addEventListener('scroll', onScroll);

    drawHighQuality();
    // start preloading of first batch of images
    preloadingRef.current = window.requestAnimationFrame(preloadImages);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.cancelAnimationFrame(preloadingRef.current);
    };
  }, [
    drawFrame,
    drawHighQuality,
    getImageUrl,
    isTabletMin,
    onScroll,
    preloadImages,
  ]);

  return (
    <div className={cn.wrapper} {...props}>
      <canvas {...dimensions} ref={canvasRef} style={{opacity: 1}} />
      <CustomizedLoader {...{imageCache}} />
      {/* this should be pre-rendered and thus show pretty quickly: */}
      <picture>
        <source
          media="(max-width: 767px)"
          srcSet={getImageUrl(1, 'high', 'mobile')}
          type="image/webp"
        />
        <source
          media="(min-width: 768px)"
          srcSet={getImageUrl(1, 'high', 'desktop')}
          type="image/webp"
        />
        <img src={getImageUrl(1, 'high', 'mobile')} alt="" />
      </picture>
      {(debug.videos || debug.annotations) && <Debugger />}
      {annotations?.length && (
        <Annotations
          data={annotations}
          {...{
            nFrames,
            frameRate,
            dimensions,
            isTabletMin,
            progress,
          }}
        />
      )}
    </div>
  );
}

export default ScrollableVideo;
