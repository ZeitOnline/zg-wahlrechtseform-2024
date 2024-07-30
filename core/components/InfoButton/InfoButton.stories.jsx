import InfoButton from './index.jsx';

export default {
  title: 'Components/InfoButton',
  component: InfoButton,
};

export const Default = () => {
  return (
    <InfoButton placement="right">
      Erläuternde Informationen zu etwas Kompliziertem
    </InfoButton>
  );
};
