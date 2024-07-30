import {useMemo} from 'react';
import PNGAnimation from './index.jsx';
const imageObjs = import.meta.glob('./example/*.png', {eager: true});

export default {
  title: 'Components/PNGAnimation',
  component: PNGAnimation,
};

export const Default = () => {
  const images = useMemo(() => {
    return Object.values(imageObjs).map((d) => d.default);
  }, []);

  return (
    <div className="article__item">
      <PNGAnimation
        images={images}
        todayLabel="last_date_formatted"
        intervalTime={400}
        source={'Eine herrliche Datenquelle'}
      />
    </div>
  );
};
