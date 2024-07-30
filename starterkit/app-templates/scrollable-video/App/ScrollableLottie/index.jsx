import {useCallback, useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import lottie from 'lottie-web';

import cn from './index.module.scss';
import {useVideoProgress} from '../VideoProgressor/store';
import clamp from 'core/utils/clamp';

const lottieJson = null; // kann dereinst wieder für ein statisches Lottie verwendet werden

function ScrollableLottie({totalFrames, lottieJsonUrl}) {
  const progress = useRef();
  useVideoProgress(progress);
  const containerRef = useRef();
  const [lottieAnimation, setLottieAnimation] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let animation = null;
    setLoaded(false);

    if (containerRef.current) {
      if (lottieJson || lottieJsonUrl) {
        animation = lottie.loadAnimation({
          container: containerRef.current,
          renderer: 'svg',
          loop: false,
          autoplay: false,
          ...(!lottieJsonUrl && lottieJson && {animationData: lottieJson}),
          ...(lottieJsonUrl && {path: lottieJsonUrl}),
        });
        if (lottieJsonUrl)
          animation.addEventListener('data_ready', () => {
            setLoaded(true);
          });
        else setLoaded(true);
        setLottieAnimation(animation);
      }
    }
    return () => {
      if (animation) {
        animation.destroy();
        setLottieAnimation(null);
      }
    };
  }, [containerRef, lottieJsonUrl]);

  const onScroll = useCallback(() => {
    if (lottieAnimation && isFinite(progress.current)) {
      if (!totalFrames)
        console.error('totalFrames not passed to ScrollableLottie via props');
      lottieAnimation.goToAndStop(
        clamp(progress.current, 0, totalFrames - 1),
        true,
      );
    }
  }, [lottieAnimation, totalFrames]);

  const onResize = useCallback(() => {
    if (typeof window === 'undefined') return;
    const parentElement = containerRef.current.parentElement.parentElement;
    const {height} = parentElement.getBoundingClientRect();
    console.log(parentElement, height, window.innerHeight);
    if (height < window.innerHeight - 10) {
      parentElement.style.top = `${(window.innerHeight - height) / 2}px`;
    }
  }, [containerRef]);

  useEffect(() => {
    window.addEventListener('resize', onResize);
    onResize();
    if (lottieAnimation && loaded) {
      window.addEventListener('scroll', onScroll);

      return () => {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onResize);
      };
    }
  }, [loaded, lottieAnimation, onResize, onScroll]);

  return (
    <div className={cn.container}>
      <div className={cn.lottie} ref={containerRef} />
    </div>
  );
}

ScrollableLottie.propTypes = {
  lottieJsonUrl: PropTypes.string,
  lottieJsonUrlDark: PropTypes.string,
};

export default ScrollableLottie;
