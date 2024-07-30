import {useMap} from './hooks.js';
import Border from './Border';

function InteriorBorder({width, height, className, border: customBorder}) {
  const {geoData} = useMap();

  let border = customBorder;
  if (!border && geoData.interiorMesh) {
    border = geoData.interiorMesh;
  }

  return (
    <Border
      className={className}
      border={border}
      width={width}
      height={height}
    />
  );
}

export default InteriorBorder;
