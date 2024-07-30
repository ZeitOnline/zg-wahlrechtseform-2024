import OldButton, {LightOldButton, InkyOldButton} from './index.jsx';
import BellIcon from 'core/icons/bell.svg?react';

export default {
  title: 'Components/OldButton',
  component: OldButton,
};

export const Default = () => {
  return <OldButton>Content</OldButton>;
};

export const Light = () => {
  return <LightOldButton>Content</LightOldButton>;
};

export const Inky = () => {
  return <InkyOldButton>Content</InkyOldButton>;
};

export const Icon = () => {
  return <OldButton icon={<BellIcon />}>Content</OldButton>;
};

export const AlsLink = () => {
  return (
    <OldButton tagName="a" href="https://www.zeit.de">
      Link
    </OldButton>
  );
};
