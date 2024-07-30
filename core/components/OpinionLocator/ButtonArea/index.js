import {Fragment} from 'react';
import styled from 'styled-components';

import ZON from 'core/utils/zon';
import Share from 'core/components/Share';
import Button from 'core/components/Button';

const {isCp} = ZON;

const ButtonWrapper = styled('div')`
  display: flex;
  justify-content: ${isCp ? 'flex-start' : 'center'};
  margin-top: 1rem;
`;

const ToggleButtonWrapper = styled('div')`
  display: flex;
  justify-content: center;
  margin-top: 1rem;

  button {
    &:first-child {
      border-radius: var(--duv-size-border-radius-m) 0 0
        var(--duv-size-border-radius-m);
    }

    &:last-child {
      border-radius: 0 var(--duv-size-border-radius-m)
        var(--duv-size-border-radius-m) 0;
    }
  }
`;

const ResultText = styled('div')`
  text-align: ${isCp ? 'left' : 'center'};
  font-size: 13px;
  letter-spacing: 0.03em;
  margin: 1rem auto 0 auto;
  width: ${(props) => (props.width && !isCp ? `${props.width}px` : 'auto')};

  a {
    text-decoration: underline;
  }
`;

const ToggleButton = styled('button')`
  display: block;
  border: 0;
  background: ${(props) => (props.isActive ? '#44444c' : '#e2e2e2')};
  color: ${(props) => (props.isActive ? '#fff' : '#222')};
  font-size: 0.8125rem;
  font-weight: 400;
  letter-spacing: 0.05em;
  line-height: 1.125rem;
  margin: 0;
  padding: 0.4375rem 0.9375rem 0.375rem;
  text-align: center;
  cursor: pointer;

  &:focus  {
    outline: none;
  }

  &:hover {
    background: ${(props) => (props.isActive ? '#252525' : '#ccccd0')};
    color: ${(props) => (props.isActive ? '#fff' : '#222')};
  }
`;

const SubmitButton = styled('button')`
  background: ${(props) => (props.isDisabled ? '#bbb' : '#44444c')};
  color: white;
  border: none;
  font-size: 0.8125rem;
  text-transform: uppercase;
  border-radius: var(--duv-size-border-radius-m);
  margin-right: 10px;
  letter-spacing: 0.1em;
  padding: 0.4375rem 0.9375rem 0.375rem;
  text-align: center;
  cursor: ${(props) => (props.isDisabled ? 'default' : 'pointer')};
  opacity: ${(props) => (props.isDisabled ? 0.5 : 1)};
  transition: all 0.2s;
  user-select: none;

  &:hover {
    background-color: ${(props) => (props.isDisabled ? '#bbb' : '#252525')};
  }

  &:focus {
    outline: none;
  }
`;

const ShowResultButton = styled('button')`
  border: none;
  background: transparent;
  color: #777;
  text-decoration: underline;
  font-size: 0.8125rem;
  letter-spacing: 0.03em;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }

  &:focus {
    outline: none;
  }
`;

const CenteredButton = styled(Button)`
  margin: 0 !important;
`;

const ButtonArea = ({
  onSubmit,
  onShowResults,
  isDisabled,
  isVisible,
  hasToken,
  resultText,
  count,
  showChartToggle,
  chartMode,
  setChartMode,
  sharingUrl,
  sharingText,
  sharingHashtags,
  width,
}) => {
  if (!isVisible && hasToken) {
    return <ButtonWrapper>Vielen Dank für Ihre Teilnahme.</ButtonWrapper>;
  }

  let shareButton = null;
  if (isCp && sharingUrl) {
    shareButton = (
      <ButtonWrapper>
        <CenteredButton tagName="a" href={sharingUrl}>
          Zum Artikel
        </CenteredButton>
      </ButtonWrapper>
    );
  } else if (sharingUrl && sharingText) {
    shareButton = (
      <ButtonWrapper>
        <Share url={sharingUrl} text={sharingText} hashtags={sharingHashtags} />
      </ButtonWrapper>
    );
  }

  if (!isVisible) {
    return (
      <Fragment>
        {resultText && (
          <ResultText
            width={width}
            dangerouslySetInnerHTML={{
              __html: resultText.replace('{count}', count.toLocaleString()),
            }}
          />
        )}
        {showChartToggle && (
          <ToggleButtonWrapper>
            <ToggleButton
              isActive={chartMode === 'user'}
              onClick={() => setChartMode('user')}
            >
              Leser
            </ToggleButton>
            <ToggleButton
              isActive={chartMode === 'token'}
              onClick={() => setChartMode('token')}
            >
              Kandidaten
            </ToggleButton>
          </ToggleButtonWrapper>
        )}
        {shareButton}
      </Fragment>
    );
  }

  return (
    <ButtonWrapper>
      <SubmitButton onClick={onSubmit} isDisabled={isDisabled}>
        Abschicken
      </SubmitButton>
      {!hasToken && (
        <ShowResultButton onClick={onShowResults}>
          Nur Ergebnisse anzeigen
        </ShowResultButton>
      )}
    </ButtonWrapper>
  );
};

export default ButtonArea;
