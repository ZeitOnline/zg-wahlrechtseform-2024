import Button from './index.jsx';
import BellIcon from 'core/icons/bell.svg?react';

export default {
  title: 'Components/Button',
  component: Button,
};

export const DefaultIsSecondary = () => {
  return <Button>Content</Button>;
};

export const Disabled = () => {
  return <Button disabled>Content</Button>;
};

export const Primary = () => {
  return <Button primary>Content</Button>;
};

export const Tertiary = () => {
  return <Button tertiary>Content</Button>;
};

export const Icon = () => {
  return <Button icon={<BellIcon />}>Content</Button>;
};

export const Small = () => {
  return <Button small>Content</Button>;
};

export const SmallWithIcon = () => {
  return (
    <Button small icon={<BellIcon />}>
      Content
    </Button>
  );
};

export const AlsLink = () => {
  return (
    <Button tagName="a" href="https://www.zeit.de">
      Link
    </Button>
  );
};

export const All = () => {
  return (
    <>
      <Button primary>Content</Button>&nbsp;
      <Button>Content</Button>&nbsp;
      <Button tertiary>Content</Button>
    </>
  );
};
