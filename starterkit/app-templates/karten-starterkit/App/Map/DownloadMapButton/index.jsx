import React, {useEffect, useState, useRef} from 'react';

import cn from './index.module.scss';

export default function DownloadMapButton({isVisible, isLoading, map}) {
  const [mapImageData, setMapImageData] = useState(null);
  const downloadRef = useRef(null);

  useEffect(() => {
    if (map && !isLoading) {
      window?.setTimeout(() => {
        setMapImageData(map.getCanvas().toDataURL());
      }, 3000);
    }
  }, [map, isLoading]);

  if (!isVisible) {
    return null;
  }

  return (
    mapImageData && (
      <a
        className={cn.mapDownloadButton}
        href={mapImageData}
        ref={downloadRef}
        download={'map.png'}
      >
        Karte runterladen
      </a>
    )
  );
}
