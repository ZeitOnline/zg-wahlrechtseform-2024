import React, {useCallback, useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import cn from './index.module.scss';
import FPSMeter from '../FPSMeter';
import {useTimeCode, useVideoProgress} from '../VideoProgressor/store';

function Debugger() {
  const progress = useRef(null);
  const timeCode = useRef(null);
  const progressNode = useRef(null);
  const timeCodeNode = useRef(null);
  useVideoProgress(progress);
  useTimeCode(timeCode);
  const [vheight, setVHeight] = useState(window?.innerHeight || 0);
  // const [innerHeight, setInnerHeight] = useState(window?.innerHeight || 0);
  const measureRef = useRef(null);

  const onScroll = useCallback(() => {
    if (progressNode.current && timeCodeNode.current) {
      progressNode.current.innerHTML = Math.round(progress.current);
      timeCodeNode.current.innerHTML = timeCode.current;
    }
  }, [progress]);

  const onResize = useCallback(() => {
    if (measureRef?.current) {
      setVHeight(measureRef.current?.getBoundingClientRect()?.height);
    }
    // if (typeof window !== 'undefined') {
    //   setInnerHeight(window.innerHeight);
    // }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [onScroll, onResize]);

  return (
    <span className={cn.wrapper}>
      <div ref={measureRef} className={cn.heightMeasurer} />
      Höhe: {vheight}px
      <br />
      Frame: <span ref={progressNode} />
      <br />
      Timecode: <span ref={timeCodeNode} />
      <br />
      Interval: <FPSMeter />
      {/* <br />
      {innerHeight}px Höhe (inner) */}
    </span>
  );
}

Debugger.propTypes = {};

export default Debugger;
