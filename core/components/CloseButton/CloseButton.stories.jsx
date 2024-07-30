import {useCallback} from 'react';
import CloseButton from './index.jsx';

export default {
  title: 'Components/CloseButton',
  component: CloseButton,
};

export const Default = () => {
  const onClick = useCallback(() => {
    console.log('close!');
  }, []);

  return <CloseButton {...{onClick}} />;
};
