import styled, {keyframes} from 'styled-components';

import logoSrc from 'src/static/images/z.svg';

const bounce = keyframes`
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.2;
  }

  100% {
    opacity: 1;
  }
`;

const Loader = styled('div')`
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  height: 100%;
  background: rgba(255, 255, 255, 0.5);
`;

const LoaderImage = styled('img')`
  animation: ${bounce} 2s ease infinite;
`;

const LoaderComponent = ({isVisible}) => {
  if (!isVisible) {
    return null;
  }

  return (
    <Loader>
      <LoaderImage src={logoSrc} />
    </Loader>
  );
};

export default LoaderComponent;
