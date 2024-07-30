import React, {useEffect, useMemo} from 'react';
import cx from 'classnames';
import {motion, AnimatePresence} from 'framer-motion';

import {parseData} from './utils.js';
import {useStore, useCreateStoreWithHydrationData} from './Store.jsx';
import Quiz from './Quiz.jsx';
import Result from './Result.jsx';
import cn from './index.module.scss';
import useIsSSR from 'core/hooks/useIsSSR.js';

const additionalFields = [];

const debugSetWinnerSelector = (state) => state.debugSetWinner;
const isFinishedSelector = (state) => state.finished;

function Omat({className}) {
  const isSSR = useIsSSR();
  const finished = useStore(isFinishedSelector);
  const debugSetWinner = useStore(debugSetWinnerSelector);

  useEffect(() => {
    if (isSSR) {
      return;
    }
    const params = new URLSearchParams(window.location.search);
    if (params.get('winner') && debugSetWinner) {
      debugSetWinner(params.get('winner'));
    }
  }, [debugSetWinner, isSSR]);

  return (
    <motion.div
      layout
      className={cx(cn.container, className)}
      onTouchStart={() => {}}
    >
      <AnimatePresence initial={false} mode="wait">
        {!finished && <Quiz key={'quiz'} />}
        {finished && <Result key="result" />}
      </AnimatePresence>
    </motion.div>
  );
}

function StoreWrapper({data, trackingId, skipToResultAfter, className}) {
  const hydrationData = useMemo(() => {
    return {
      ...parseData(data, additionalFields),
      skipToResultAfter,
      trackingId,
    };
  }, [data, skipToResultAfter, trackingId]);

  useCreateStoreWithHydrationData(hydrationData);

  return <Omat className={className} />;
}

export default StoreWrapper;
