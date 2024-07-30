import {create} from 'zustand';
import track from 'core/utils/track.js';

function shuffleArray(oldArray) {
  const array = oldArray.slice(0);

  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  return array;
}

let _use = () => {};
let storeCreated = false;

function skipQuestions(questions, questionIndex) {
  const questionsToSkip = questions.length - questionIndex - 1;
  let skippedAnswers = [];
  for (let index = 0; index < questionsToSkip; index++) {
    skippedAnswers.push(null);
  }
  return skippedAnswers;
}

function calculateRanking(questions, answers, outcomes, debugWinner) {
  if ((!answers || !answers.length) && !debugWinner) {
    return null;
  }
  let outcomesById = Object.keys(outcomes).reduce((reducedValue, d) => {
    return {
      ...reducedValue,
      [d]: {
        ...outcomes[d],
        points: 0,
      },
    };
  }, {});
  for (let index = 0; index < answers.length; index++) {
    const answerIndex = answers[index];
    if (answerIndex === null) {
      continue;
    }
    const question = questions[index];
    const points = question.answers[answerIndex].points;

    Object.entries(points).forEach(([key, value]) => {
      outcomesById[key].points += value;
    });
  }

  if (debugWinner) {
    outcomesById[debugWinner].points = 999999;
  }

  const sortedOutcomes = Object.values(outcomesById).sort((a, b) => {
    return b.points - a.points;
  });

  // Shuffle outcomes with same points
  const maxPoints = sortedOutcomes[0].points;
  // const samePoints = sortedOutcomes.slice(0, 6);
  const samePoints = sortedOutcomes.filter((d) => d.points === maxPoints);
  const shuffledWinners = shuffleArray(samePoints);
  const otherWinners =
    shuffledWinners.length > 1 ? shuffledWinners.slice(1) : null;

  const finalOutcome = [
    ...shuffledWinners,
    ...sortedOutcomes.slice(shuffledWinners.length),
  ];

  return [finalOutcome, otherWinners];
}

export function useCreateStoreWithHydrationData({
  skipToResultAfter = {},
  questions,
  outcomes,
  trackingId,
}) {
  if (!storeCreated) {
    _use = create((set) => ({
      questions,
      outcomes,
      questionIndex: 0,
      answers: [],
      otherWinners: 0,
      finished: false,
      skipToResultAfter,
      ranking: [],
      trackingId,
      reset: () => {
        set(() => {
          return {
            questionIndex: 0,
            answers: [],
            finished: false,
            ranking: [],
          };
        });
      },
      answerQuestion: (answer) => {
        set((state) => {
          const newAnswers = [...state.answers, answer];

          let newState = {};

          if (
            Object.hasOwn(state.skipToResultAfter, state.questionIndex) &&
            state.skipToResultAfter[state.questionIndex] === answer
          ) {
            const skippedAnswers = skipQuestions(
              state.questions,
              state.questionIndex,
            );

            newState = {
              answers: [...newAnswers, ...skippedAnswers],
              finished: true,
              questionIndex: state.questions.length,
            };
          } else {
            newState = {
              answers: newAnswers,
              questionIndex: state.questionIndex + 1,
              finished: state.questionIndex + 1 >= state.questions.length,
            };
          }
          const [ranking, otherWinners] = calculateRanking(
            state.questions,
            newState.answers,
            state.outcomes,
          );

          if (newState.finished && state.trackingId) {
            track(state.trackingId, {
              5: `result`,
              9: `${ranking[0].id}`,
            });
          }

          return {
            ...newState,
            ranking,
            otherWinners,
          };
        });
      },
      skipQuestion: () => {
        set((state) => {
          state.answerQuestion(null);
          return {};
        });
      },
      debugSetWinner: (winner) => {
        set((state) => {
          const [ranking, otherWinners] = calculateRanking(
            state.questions,
            state.answers,
            state.outcomes,
            winner,
          );
          return {
            ranking,
            finished: true,
            otherWinners,
            questionIndex: state.questions.length,
          };
        });
      },
      setOtherWinner: (winner) => {
        set((state) => {
          const ranking = state.ranking.slice();
          const otherWinners = state.otherWinners.slice();
          const oldWinner = ranking[0];

          const newWinnerOldPosition = ranking.findIndex(
            (d) => d.id === winner.id,
          );
          const newWinnerOldPositionInOthers = otherWinners.findIndex(
            (d) => d.id === winner.id,
          );

          ranking[0] = winner;
          ranking[newWinnerOldPosition] = oldWinner;
          otherWinners[newWinnerOldPositionInOthers] = oldWinner;

          return {
            ranking,
            otherWinners,
          };
        });
      },
    }));

    storeCreated = typeof window === 'undefined' ? false : true;
  }
}

export function useStore(selector) {
  return _use(selector);
}
