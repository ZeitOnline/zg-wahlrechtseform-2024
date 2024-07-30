import PropTypes from 'prop-types';
import cx from 'classnames';

import cn from './index.module.scss';
import {GreyCard} from '../Card';

function Feedback(props) {
  const {address, className, ...rest} = props;

  return (
    <GreyCard
      className={cx(cn.feedback, 'x-content-column', className)}
      {...rest}
    >
      <p>Haben Sie einen Fehler entdeckt oder eine andere Anmerkung?</p>
      <p>
        Bitte <a href={`mailto:${address}`}>schicken Sie uns eine Mail</a> oder{' '}
        <a href="#comments">hinterlassen Sie einen Kommentar.</a>
      </p>
    </GreyCard>
  );
}

Feedback.defaultProps = {
  address: 'daten-und-visualisierung@zeit.de',
};

Feedback.propTypes = {
  /** E-Mail address thas is opened via mailto */
  address: PropTypes.string,
  /** Is passed to the outermost container */
  className: PropTypes.string,
};

export default Feedback;
