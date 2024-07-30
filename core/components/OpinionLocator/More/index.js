import styled from 'styled-components';

const More = styled.div`
  font-size: 13px;
  letter-spacing: 0.03em;
  color: #69696c;
  padding-top: 0.3em;
  max-width: 480px;
  text-align: center;
  margin: 0.6em auto 1.8em auto;

  a {
    color: #252525;
    text-decoration: underline;

    &:hover,
    &:active,
    &:focus {
      color: #b91109;
    }
  }
`;

const MoreComponent = ({isVisible, text}) => {
  if (!isVisible) {
    return null;
  }

  return <More dangerouslySetInnerHTML={{__html: text}} />;
};

export default MoreComponent;
