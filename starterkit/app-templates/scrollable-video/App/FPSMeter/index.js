import useInterval from 'core/hooks/useInterval';
import {min} from 'd3-array';
import {useEffect, useState, useRef, useCallback} from 'react';

function getTime() {
  return window.performance && window.performance.now
    ? window.performance.now()
    : +new Date();
}

function FPSMeter({n = 50}) {
  const fps = useRef([]);
  const isRunning = useRef(false);
  const [output, setOutput] = useState('');

  useEffect(() => {
    // polyfill
    if (typeof window !== 'undefined' && !window.requestAnimationFrame) {
      window.requestAnimationFrame = (() => {
        return (
          window.requestAnimationFrame ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame ||
          function (callback) {
            window.setTimeout(callback, 1000 / 60);
          }
        );
      })();
    }
  }, []);

  const measure = useCallback(() => {
    if (typeof window === 'undefined') return;
    const time = getTime();
    window.requestAnimationFrame(() => {
      fps.current.push(Math.round((1 / (getTime() - time)) * 1000));
      fps.current = fps.current.slice(-n);

      if (isRunning.current) {
        measure();
      }
    });
  }, [n]);

  const start = useCallback(() => {
    if (!isRunning.current) {
      isRunning.current = true;
      measure();
    }
  }, [measure]);

  const pause = useCallback(() => {
    isRunning.current = false;
  }, []);

  const resume = useCallback(() => {
    if (!isRunning.current) {
      isRunning.current = true;
      measure();
    }
  }, [measure]);

  // eslint-disable-next-line no-unused-vars
  const toggle = useCallback(() => {
    isRunning.current ? pause() : resume();
  }, [pause, resume]);

  // eslint-disable-next-line no-unused-vars
  const stop = useCallback(() => {
    if (isRunning.current) {
      isRunning.current = false;
    }
  }, []);

  useInterval(() => {
    setOutput(min(fps.current) + ' fps');
  }, 50);

  useEffect(() => {
    start();
  }, [start]);

  return output;
}

export default FPSMeter;
