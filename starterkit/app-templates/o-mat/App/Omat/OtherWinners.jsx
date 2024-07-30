import {Fragment} from 'react';

import {useStore} from './Store.jsx';
import cn from './OtherWinners.module.scss';

function OtherWinners() {
  /*
  Machmal gibt es mehrere Gewinner, dann wird einer zufällig ermittelt. Die restlichen werden von diesem Element
  als kleine Links dargestellt
  */
  const otherWinners = useStore((state) => state.otherWinners);
  const setOtherWinner = useStore((state) => state.setOtherWinner);

  let otherWinnersElement = null;
  if (otherWinners) {
    const otherWinnersArray = otherWinners.map((winner, index) => {
      const fakeLink = (
        <span
          className={cn.otherWinnerLink}
          onClick={() => {
            setOtherWinner(winner);
          }}
        >
          {winner.label}
        </span>
      );

      if (index === 0) {
        return <Fragment key={winner.id}>{fakeLink}</Fragment>;
      } else if (index === otherWinners.length - 1) {
        return <Fragment key={winner.id}> oder {fakeLink}</Fragment>;
      } else {
        return <Fragment key={winner.id}>, {fakeLink}</Fragment>;
      }
    });
    otherWinnersElement = (
      <p className={cn.container}>
        Es gab mehrere Übereinstimmungen. Wir haben eine zufällig für Sie
        ausgewählt, die anderen sind: {otherWinnersArray}.
      </p>
    );
  }

  return otherWinnersElement;
}

export default OtherWinners;
