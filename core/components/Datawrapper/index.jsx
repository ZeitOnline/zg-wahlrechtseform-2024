import {useEffect, useState, useRef} from 'react';

import Loader from 'core/components/Loader';
import cn from './index.module.scss';
import useWasVisible from 'core/hooks/useWasVisible.js';

const wasVisibleOptions = {
  rootMargin: '100% 0% 100% 0%',
};

const Datawrapper = ({id, hidden, onLoad, lazy = false}) => {
  const [loaded, setLoaded] = useState(false);
  const [shouldLoad, toggleShouldLoad] = useState(!(hidden || lazy));
  const containerRef = useRef();
  const isVisible = useWasVisible(containerRef, wasVisibleOptions);

  useEffect(() => {
    if (isVisible) {
      if (!hidden) {
        toggleShouldLoad(true);
      } else {
        window.setTimeout(() => toggleShouldLoad(true), 200);
      }
    }
  }, [isVisible, toggleShouldLoad, hidden]);

  useEffect(() => {
    if (!shouldLoad) return;

    // check if script has already been inserted
    // if (containerRef.current.querySelector('.datawrapper-script-embed')) return;
    if (containerRef.current.querySelector('.datawrapper-script-embed')) {
      setLoaded(false);
      // remove old script
      containerRef.current.removeChild(
        containerRef.current.querySelector('.datawrapper-script-embed'),
      );
    }

    const script = document.createElement('script');

    script.src = `https://datawrapper.dwcdn.net/${id}/embed.js`;
    script.type = 'text/javascript';
    script.defer = true;
    script.dataset.dark = 'auto';
    script.onload = () => {
      setTimeout(() => setLoaded(true), 250);
      if (onLoad) onLoad();
    };

    containerRef.current.appendChild(script);

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      containerRef.current.removeChild(script);
    };
  }, [shouldLoad, id, onLoad]);

  return (
    <div className={cn.container} ref={containerRef}>
      <Loader className={cn.loader} isLoading={!loaded} />
    </div>
  );
};

export default Datawrapper;
