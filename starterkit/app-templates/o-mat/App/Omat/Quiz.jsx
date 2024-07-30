import React, {useState} from 'react';
import cx from 'classnames';
import {AnimatePresence, motion} from 'framer-motion';

import {useStore} from './Store.jsx';
import cn from './Quiz.module.scss';
import track from 'core/utils/track.js';

const questionVariants = {
  initial: {
    y: 50,
    position: 'relative',
    transition: {
      when: 'afterChildren',
    },
  },
  animate: {
    y: 0,
    position: 'relative',
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
  },
};

const answerVariants = {
  initial: {opacity: 0, y: 20},
  animate: {opacity: 1, y: 0},
  exit: {opacity: 0}, //, y: -20},
};

function Answer({text, index, onClick, className}) {
  const [clicked, setClicked] = useState(false);
  const trackingId = useStore((state) => state.trackingId);
  const questionIndex = useStore((state) => state.questionIndex);

  return (
    <motion.li
      className={cx(cn.answer, className, {[cn.clicked]: clicked})}
      onClick={() => {
        setClicked(true);
        window.setTimeout(() => onClick(index), 600);
        if (trackingId) {
          track(trackingId, {
            5: `click-answer`,
            8: `${questionIndex}`,
            9: `${index}`,
          });
        }
      }}
      variants={answerVariants}
      layout
    >
      <span className={cn.answerText}>{text}</span>
    </motion.li>
  );
}

function Question({text, answers}) {
  const answerQuestion = useStore((state) => state.answerQuestion);
  const skipQuestion = useStore((state) => state.skipQuestion);

  const answerItems = answers.map((d, i) => (
    <Answer key={i} text={d.text} index={i} onClick={answerQuestion} />
  ));
  return (
    <motion.div
      className={cn.question}
      initial={'initial'}
      animate={'animate'}
      exit={'exit'}
      variants={questionVariants}
      layout
    >
      <p className={cn.questionText}>{text}</p>
      <ul className={cn.answers}>
        {answerItems}
        <Answer
          text="Frage überspringen"
          index={null}
          onClick={skipQuestion}
          className={cn.skip}
        />
      </ul>
    </motion.div>
  );
}

function Quiz() {
  const questionIndex = useStore((state) => state.questionIndex);
  const questions = useStore((state) => state.questions);
  const finished = useStore((state) => state.finished);

  const question =
    questionIndex < questions.length ? (
      <Question {...questions[questionIndex]} key={questionIndex} />
    ) : null;

  const index = finished ? null : (
    <motion.div layout className={cn.index}>
      {questionIndex + 1}/{questions.length}
    </motion.div>
  );

  return (
    <motion.div layout className={cn.container}>
      {index}
      <motion.div className={cn.questionWrapper}>
        <AnimatePresence initial={false} mode="wait">
          {question}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

export default Quiz;
