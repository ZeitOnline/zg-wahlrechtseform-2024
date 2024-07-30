import IntersectionObserver from './index.jsx';

export default {
  title: 'Components/IntersectionObserver',
  component: IntersectionObserver,
};

export const Default = () => {
  return (
    <IntersectionObserver
      className={'something'}
      onChange={(entry) => console.log(entry)}
      threshold={[0, 0.5]}
    >
      … rest of the embed …
    </IntersectionObserver>
  );
};
