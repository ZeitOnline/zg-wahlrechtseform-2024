import ViewTimeTracker from './index.jsx';

export default {
  title: 'Components/ViewTimeTracker',
  component: ViewTimeTracker,
};

export const Default = () => {
  return (
    <ViewTimeTracker trackingId="check-this-with-audev" className={'something'}>
      <div>test</div>
    </ViewTimeTracker>
  );
};
