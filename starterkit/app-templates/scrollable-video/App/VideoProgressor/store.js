import {create} from 'zustand';
import {useCallback, useEffect, useMemo} from 'react';
import config from '../../config';
import {frameToTimecode} from './utils';

const useVideoProgressStore = create((set) => ({
  // Die aktuelle Scrollposition von oben (inkl. offset)
  scrollY: 0,
  setScrollY: (scrollY) => set({scrollY}),
  // Eine Liste aller VideoProgressoren (identifier), die auf der Seite sind
  videos: [],
  setVideos: (videos) => set({videos}),
  // Die identifier des momentan aktiven Videos
  video: null,
  setVideo: (identifier) => set({video: identifier}),
  // Der aktuelle Werte nachdem scrollY mit einer linearScale verrechnet wurde
  progress: 0,
  setProgress: (progress) => set({progress}),
}));

export default useVideoProgressStore;

/**
 * Hook, der die identifier des aktuell aktiven Videos zurückgibt.
 * Sobald sich der aktive VideoProgressor ändert, wird ein Rerender ausgelöst.
 * @returns {string}
 */
export function useCurrentVideo() {
  const video = useVideoProgressStore((state) => state.video);
  const videos = useVideoProgressStore((state) => state.videos);
  const result = useMemo(() => {
    return {
      // scale
      scale: videos.find((item) => item.identifier === video)?.scale,
      // video info
      ...config.videos.find((item) => item.identifier === video),
    };
  }, [video, videos]);
  return result;
}

/**
 * Dieser Hook kann mit einem ref aufgerufen werden als erstes Argument:
 * In dem Fall wird der ref "transiently" mit dem neusten progress Wert überschrieben.
 * Übergibt man keinen, dann erhält man einen state Wert zurück, der Rerender triggert
 * @param {Object} ref
 * @param {number} ref.current
 * @example with rerenders
 * const progress = useVideoProgress();
 * @example without rerenders
 * useVideoProgress(ref);
 */
export function useVideoProgress(ref) {
  if (ref) {
    ref.current = useVideoProgressStore.getState().progress;
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(
      () =>
        useVideoProgressStore.subscribe((state) => {
          ref.current = state.progress;
        }),
      [ref],
    );
    // nothing is returned in this case
  } else {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useVideoProgressStore((state) => state.progress);
  }
}

/**
 * Dieser Hook kann mit einem ref aufgerufen werden als erstes Argument:
 * In dem Fall wird der ref "transiently" mit dem neusten progress Wert überschrieben.
 * Übergibt man keinen, dann erhält man einen state Wert zurück, der Rerender triggert
 * @param {Object} ref
 * @param {number} ref.current
 * @example with rerenders
 * const progress = useTimeCode();
 * @example without rerenders
 * useTimeCode(ref);
 */
export function useTimeCode(ref) {
  const currentVideo = useCurrentVideo();
  const toTime = useCallback(
    (progress) => frameToTimecode(progress, currentVideo?.frameRate),
    [currentVideo?.frameRate],
  );

  if (ref) {
    // TODO: echte Frame Rate
    ref.current = toTime(useVideoProgressStore.getState().progress);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(
      () =>
        useVideoProgressStore.subscribe((state) => {
          ref.current = toTime(state.progress);
        }),
      [ref, toTime],
    );
    // nothing is returned in this case
  } else {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useVideoProgressStore((state) => toTime(state.progress));
  }
}
