import styled from 'styled-components';

const Credits = styled('div')`
  font-size: 13px;
  letter-spacing: 0.03em;
  color: #69696c;
  margin: 0.6em auto 0 auto;
  border-top: 1px solid #cccccf;
  padding-top: 0.3em;
  max-width: 460px;

  a {
    color: #252525;
    text-decoration: none;

    &:hover,
    &:active,
    &:focus {
      color: #b91109;
    }
  }
`;

const CreditsComponent = (props) => {
  if (!props.isVisible) {
    return null;
  }

  return <Credits dangerouslySetInnerHTML={{__html: props.text}} />;
};

export default CreditsComponent;
