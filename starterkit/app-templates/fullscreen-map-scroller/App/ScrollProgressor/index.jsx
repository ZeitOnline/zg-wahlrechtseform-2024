import {useMemo, useEffect, useRef, useCallback, useReducer} from 'react';
import PropTypes from 'prop-types';
import {scaleLinear} from 'd3-scale';

import cn from './index.module.scss';
import useWindowSize from 'core/hooks/useWindowSize';
import useDebounce from 'core/hooks/useDebounce';

import useScrollProgressStore from './store';
import debug from '../../debug';

import {
  findClosestRangeFn,
  findEndNode,
  findStartNodes,
  getTop,
  isWithin,
} from './utils.js';

function ScrollProgressor({windowHeightOffset = 0.5}) {
  const scrollYRef = useRef(useScrollProgressStore.getState().scrollY);
  const progressRef = useRef(useScrollProgressStore.getState().progress);
  const progressorRef = useRef(useScrollProgressStore.getState().progressor);
  const progressorsRef = useRef(useScrollProgressStore.getState().progressors);
  const waypointRef = useRef(useScrollProgressStore.getState().waypoint);
  const waypointsRef = useRef(useScrollProgressStore.getState().waypoints);

  const setScrollY = useScrollProgressStore((state) => state.setScrollY);
  const setProgress = useScrollProgressStore((state) => state.setProgress);
  const setWaypoint = useScrollProgressStore((state) => state.setWaypoint);
  const setWaypoints = useScrollProgressStore((state) => state.setWaypoints);
  const setProgressor = useScrollProgressStore((state) => state.setProgressor);
  const setProgressors = useScrollProgressStore(
    (state) => state.setProgressors,
  );

  const {height: windowHeight} = useWindowSize();
  const [_, forceUpdate] = useReducer((x) => x + 1, 0);

  // Connect to the store on mount, disconnect on unmount, catch state-changes in a reference
  useEffect(
    () =>
      useScrollProgressStore.subscribe((state) => {
        scrollYRef.current = state.scrollY;
        progressRef.current = state.progress;
        waypointRef.current = state.waypoint;
        waypointsRef.current = state.waypoints;
        progressorRef.current = state.progressor;
        progressorsRef.current = state.progressors;
      }),
    [],
  );

  useEffect(() => {
    debug.scrollProgressor &&
      setTimeout(() => {
        console.log({
          progressors: progressorsRef.current,
          waypoints: waypointsRef.current,
        });
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
      // find closest progressor and waypoint
      const progressorIndex = progressorsRef.current
        .map(({scale}) => scale.domain())
        .findIndex(findClosestRangeFn(newScrollY));
      const waypointIndex = waypointsRef.current
        .map(({range}) => range)
        .findIndex(findClosestRangeFn(newScrollY));

      // update store with progress
      if (progressorIndex >= 0) {
        const newProgressor = progressorsRef.current[progressorIndex];
        if (newProgressor) {
          setProgress(newProgressor.scale(newScrollY));
          setProgressor(newProgressor.identifier);
        }
      }
      // and waypoint identifier
      if (waypointIndex > 0) {
        const newWaypoint = waypointsRef.current[waypointIndex];
        setWaypoint(newWaypoint.identifier);
      } else if (waypointIndex === 0) {
        if (newScrollY < waypointsRef.current[0].range[0]) {
          setWaypoint('initial');
        } else {
          // usually default
          setWaypoint(waypointsRef.current[0].identifier);
        }
      }
    } catch (e) {
      console.log(e);
    }
    setScrollY(newScrollY);
    debug.scrollProgressor && forceUpdate();
  }, [offset, setProgressor, setProgress, setScrollY, setWaypoint]);

  const onResize = useDebounce(() => {
    if (typeof window === 'undefined') return;
    // scroll restoration (store position in variable)
    let restoreToProgress;
    try {
      // only store position if user is within a progressor
      const previousScale = progressorsRef.current.find(({scale}) =>
        isWithin(scrollYRef.current - offset, scale.domain()),
      );
      if (typeof previousScale === 'function' && scrollYRef.current > 0) {
        restoreToProgress = previousScale(scrollYRef.current - offset);
      }
    } catch (e) {
      console.log(e);
    }

    // map over both all start nodes of progressors
    const progressorStartNodes = findStartNodes({
      propName: 'data-prop-display',
      propValue: 'scroll-progressor-start',
    }).map((node) => ({node, isProgressor: true}));

    // and texts to measure top and bottom positions of both
    const waypointStartNodes = findStartNodes({
      propName: 'data-prop-display',
      propValue: 'waypoint-start',
    }).map((node) => ({node, isProgressor: false}));

    // arrays to push values into, that update state below
    const newWaypoints = [],
      newProgressors = [];

    // measure all top and bottom positions of both texts and progressors
    [...waypointStartNodes, ...progressorStartNodes].forEach(
      ({node: startNode, isProgressor}, i) => {
        const endNode = findEndNode({
          startNode,
          propName: 'data-prop-display',
          propValue: isProgressor ? 'scroll-progressor-ende' : 'waypoint-ende',
        });

        const top = getTop(startNode);
        if (typeof endNode === 'undefined') {
          console.error('Error! endNode not found');
        } else {
          const bottom = typeof endNode === 'undefined' ? top : getTop(endNode);
          if (isProgressor) {
            const domain = [
              parseFloat(startNode.dataset?.propDomainFrom),
              parseFloat(endNode?.dataset?.propDomainTo),
            ];
            const scale = scaleLinear()
              .range(domain)
              .domain([top, bottom])
              .clamp(true);

            newProgressors.push({
              identifier: startNode.dataset?.propIdentifier,
              scale,
            });
          } else {
            newWaypoints.push({
              identifier: startNode.dataset?.propIdentifier,
              range: [top, bottom],
            });
          }
        }
      },
    );

    newProgressors?.length && setProgressors(newProgressors);
    newWaypoints?.length && setWaypoints(newWaypoints);

    // restore scroll position, but not on mobile!
    // There it was just the browser bars that triggered the resize
    if (
      !window.matchMedia('(any-pointer: coarse)').matches &&
      isFinite(restoreToProgress)
    ) {
      // TODO: ist das ok so hier? oder dürfen wir nicht die nächste nehmen?
      const activeScale = newProgressors
        .map(({scale}) => scale.domain())
        .find(findClosestRangeFn(scrollYRef.current));
      if (typeof activeScale === 'function') {
        const restoreToPx = activeScale.invert(restoreToProgress);
        window.scrollTo(0, restoreToPx);
      }
    }
    onScroll();
  }, [offset, onScroll, setProgressors]);

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
      {debug.scrollProgressor && (
        <div className={cn.scrollIndicator} style={{top: offset}}>
          {JSON.stringify({
            scrollY: Math.round(scrollYRef.current),
            waypoint: waypointRef.current,
            progress: Math.round(progressRef.current),
            progressor: progressorRef.current,
          })}
        </div>
      )}
    </>
  );
}

ScrollProgressor.propTypes = {
  /** Pass a number that is then multiplied by window.innerHeight (e.g. 0.5 = center of screen) */
  windowHeightOffset: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default ScrollProgressor;
