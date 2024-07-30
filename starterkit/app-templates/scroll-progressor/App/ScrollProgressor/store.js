import {create} from 'zustand';
import {useCallback, useEffect, useRef, useState} from 'react';
import config from '../../config';
import {isWithin} from './utils';

const useScrollProgressStore = create((set) => ({
  // Soll der Text unter der Grafik durchlaufen?
  isUnderscroll: false,
  setIsUnderscroll: (isUnderscroll) => set({isUnderscroll}),
  // Die aktuelle Scrollposition von oben (inkl. offset)
  scrollY: 0,
  setScrollY: (scrollY) => set({scrollY}),
  // Ein Array mit den Skalen aller ScrollProgressoren
  scales: [],
  setScales: (scales) => set({scales}),
  // Eine Liste aller ScrollProgressoren (Identifier), die auf der Seite sind
  progressors: [],
  setProgressors: (progressors) => set({progressors}),
  // Den Identifier des momentan aktiven ScrollProgressors
  progressor: null,
  setProgressor: (identifier) => set({progressor: identifier}),
  // Der aktuelle Werte nachdem scrollY mit einer linearScale verrechnet wurde
  progress: 0,
  setProgress: (progress) => set({progress}),
  // Array von top/bottom Positionen aller Text-Kärtchen
  waypoints: [],
  setWaypoints: (waypoints) => set({waypoints}),
  // Waypoint, der zurzeit der scrollY Position am nächsten ist
  waypoint: null,
  setWaypoint: (identifier) => set({waypoint: identifier}),
}));

export default useScrollProgressStore;

/**
 * Dieser Hook kann mit einem ref aufgerufen werden als erstes Argument:
 * In dem Fall wird der ref "transiently" mit dem neusten progress Wert überschrieben.
 * Übergibt man keinen, dann erhält man einen state Wert zurück, der Rerender triggert
 * @param {Object} ref
 * @param {number} ref.current
 * @example with rerenders
 * const progress = useScrollProgress();
 * console.log(progress);
 * @example without rerenders
 * const progress = useRef();
 * useScrollProgress(progress);
 * console.log(progress.current);
 */
export function useScrollProgress(ref) {
  if (ref) {
    ref.current = useScrollProgressStore.getState().progress;
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(
      () =>
        useScrollProgressStore.subscribe((state) => {
          ref.current = state.progress;
        }),
      [ref],
    );
    // nothing is returned in this case
  } else {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useScrollProgressStore((state) => state.progress);
  }
}

/**
 * Fast derselbe Hook wie useScrollProgress, nur dass hier
 * die scrollY Position zurückgegeben wird
 * @param {Object} ref
 * @param {number} ref.current
 * @example with rerenders
 * const scrollY = useScrollY();
 * console.log(scrollY);
 * @example without rerenders
 * const scrollY = useRef();
 * useScrollY(scrollY);
 * console.log(scrollY.current);
 */
export function useScrollY(ref) {
  if (ref) {
    ref.current = useScrollProgressStore.getState().scrollY;
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(
      () =>
        useScrollProgressStore.subscribe((state) => {
          ref.current = state.scrollY;
        }),
      [ref],
    );
    // nothing is returned in this case
  } else {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useScrollProgressStore((state) => state.scrollY);
  }
}

/**
 * Hook, der den Identifier des aktuell aktiven ScrollProgressors zurückgibt.
 * Sobald sich der aktive ScrollProgressor ändert, wird ein Rerender ausgelöst.
 * @returns {string}
 */
export function useProgressor() {
  return useScrollProgressStore((state) => state.progressor);
}

export function useIsWithin() {
  const [isWithinProgressor, setIsWithinProgressor] = useState(false);
  const scrollY = useRef();
  useScrollY(scrollY);
  const progressor = useProgressor();

  const onScroll = useCallback(() => {
    if (!scrollY?.current || typeof progressor?.scale?.domain !== 'function')
      return;

    setIsWithinProgressor(
      isWithin(
        scrollY.current,
        progressor.scale.domain(),
        progressor.marginBottom,
      ),
    );
  }, [progressor]);

  useEffect(() => {
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [onScroll]);

  return isWithinProgressor;
}

/**
 * Hook, der den Identifier des aktuell aktiven ScrollProgressors zurückgibt.
 * Sobald sich der aktive ScrollProgressor ändert, wird ein Rerender ausgelöst.
 * @returns {string}
 */
export function useWaypoint() {
  const findById = (id) => (item) => item.id === id;
  const defaultWaypoint = config.waypoints.find(findById('default'));
  const selector = (state) =>
    config.waypoints.find(findById(state.waypoint)) || defaultWaypoint;
  return useScrollProgressStore(selector);
}
