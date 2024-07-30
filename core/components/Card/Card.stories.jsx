import Card, {GreyCard, CardContainer} from './index.jsx';

export default {
  title: 'Components/Card',
  component: Card,
  subcomponents: {CardContainer},
};

export const Default = () => {
  return (
    <div className="article__item">
      <Card>Content</Card>
    </div>
  );
};

export const Grey = () => {
  return (
    <div className="article__item">
      <GreyCard>Content</GreyCard>
    </div>
  );
};

export const BlurryBackground = () => {
  return (
    <div
      className="article__item"
      style={{background: 'red', padding: '30px', position: 'relative'}}
    >
      <div
        style={{
          position: 'absolute',
          left: '0',
          right: '0',
          top: '0',
          bottom: '0',
          overflow: 'hidden',
          // color: 'white',
          fontWeight: 'bold',
        }}
      >
        Lorem ipsum dolor sit amet, consectetur adipisici elit, sed eiusmod
        tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquid ex ea
        commodi consequat. Quis aute iure reprehenderit in voluptate velit esse
        cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat
        cupiditat non proident, sunt in culpa qui officia deserunt mollit anim
        id est laborum.
      </div>
      <Card blurryBackground={true}>Content</Card>
    </div>
  );
};

export const AsListItem = () => {
  return (
    <div className="article__item">
      <p>
        Zeigt auch, wie man <code>CardContainer</code> verwendet, damit Schatten
        nicht die anderen Cards überlagern.
      </p>
      <CardContainer
        tagName="ul"
        style={{listStyle: 'none', margin: '0', padding: '0'}}
      >
        <Card tagName="li">Content 1</Card>
        <Card tagName="li">Content 2</Card>
        <Card tagName="li">Content 3</Card>
      </CardContainer>
    </div>
  );
};
