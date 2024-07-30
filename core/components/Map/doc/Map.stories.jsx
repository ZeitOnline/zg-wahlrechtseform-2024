import Map, {
  SVG,
  Outline,
  Border,
  Label,
  InteriorBorder,
  Choropleth,
} from '../index.jsx';
import bundesländer from './bundesländer.topo.json';
import cn from './MapStory.module.scss';

export default {
  title: 'Components/Map',
  component: Map,
  subcomponents: {SVG, Outline, Border, Label, InteriorBorder, Choropleth},
};

export const Default = () => {
  const bremen = [8.7, 53];
  return (
    <div className="article__item">
      <div className={cn.container}>
        <Map topoJson={bundesländer} className={cn.mapContainer}>
          <SVG>
            <Outline className={cn.fill} />
            <Border className={cn.borders} />
            <Outline className={cn.outline} />
          </SVG>
          <Label coordinates={bremen}>Bremen</Label>
        </Map>
      </div>
    </div>
  );
};

export const SSR = () => {
  const viewbox = [0, 0, 660, 840];

  return (
    <div className="article__item">
      <p>
        Beispiel für SSR-gerenderte Karte. Benutzt <code>viewBox</code> und
        skaliert alles via CSS. Außerdem <code>pathPrecision</code>, um den
        SVG-String kleiner werden zu lassen. Und{' '}
        <code>vector-effect: non-scaling-stroke;</code> im CSS, damit die Linien
        immer gleich dick sind und nicht mitskaliert werden.
      </p>
      <Map
        topoJson={bundesländer}
        width={660}
        height={840}
        pathPrecision={1}
        className={cn.ssrMapContainer}
      >
        <svg
          className={cn.map}
          viewBox={`${viewbox[0]} ${viewbox[1]} ${viewbox[2]} ${viewbox[3]}`}
        >
          <Outline className={cn.fill} />
          <Border className={cn.borders} />
          <Outline className={cn.outline} />
        </svg>
      </Map>
    </div>
  );
};
