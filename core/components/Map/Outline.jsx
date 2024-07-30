import {useMap} from './hooks.js';
import Border from './Border';

function Outline({width, height, className}) {
  const {geoData} = useMap();

  return (
    <Border
      className={className}
      border={geoData.outline}
      width={width}
      height={height}
    />
  );
}

export default Outline;
