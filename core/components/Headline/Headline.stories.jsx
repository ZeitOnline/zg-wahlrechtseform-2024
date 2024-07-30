import Headline from './index.jsx';
import LoremIpsum from 'starterkit/templates/LoremIpsum.jsx';

export default {
  title: 'Components/Headline',
  component: Headline,
};

export const Default = () => {
  return (
    <>
      <Headline>Überschrift</Headline>
      <LoremIpsum />
    </>
  );
};

export const AlsH3 = () => {
  return (
    <>
      <Headline level={3}>Überschrift h3</Headline>
      <LoremIpsum />
    </>
  );
};

AlsH3.storyName = 'Als h3';
