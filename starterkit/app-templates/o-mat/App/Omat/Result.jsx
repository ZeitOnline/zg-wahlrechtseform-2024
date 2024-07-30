import {motion} from 'framer-motion';

import {useStore} from './Store.jsx';
import cn from './Result.module.scss';
import {PrimaryButton} from 'core/components/Button';
import ReplayIcon from 'core/icons/repeat.svg?react';
import track from 'core/utils/track.js';
import OtherWinners from './OtherWinners.jsx';

const imgSize = 300;

function getImageUrlFromBildergruppe(viviLink) {
  console.log(viviLink);
  const id = /https:\/\/vivi.zeit.de\/repository\/(.+?)\/@@/g.exec(viviLink)[1];

  return `https://img.zeit.de/${id}/square__${imgSize}x${imgSize}__mobile__scale_2`;
}

function Result() {
  const finished = useStore((state) => state.finished);
  const ranking = useStore((state) => state.ranking);
  const reset = useStore((state) => state.reset);
  const trackingId = useStore((state) => state.trackingId);

  if (!finished) {
    return null;
  }

  const winner = finished ? ranking[0] : null;

  const imgSrc = getImageUrlFromBildergruppe(winner['Vivi-Bildergruppe']);

  return (
    <motion.div layout className={cn.container}>
      <img
        src={imgSrc}
        className={cn.img}
        alt=""
        width={imgSize}
        height={imgSize}
      />
      <h2 className={cn.title}>
        <span className={cn.kicker}>Ihr Ergebnis:</span>{' '}
        <span className={cn.winner}>{winner.label}</span>
      </h2>
      <p className={cn.text}>{winner.text}</p>

      <OtherWinners />

      <PrimaryButton
        icon={<ReplayIcon />}
        className={cn.replay}
        onClick={() => {
          reset();
          if (trackingId) {
            track(trackingId, {
              5: `click-replay`,
            });
          }
        }}
      >
        Nochmal spielen
      </PrimaryButton>
    </motion.div>
  );
}

export default Result;
