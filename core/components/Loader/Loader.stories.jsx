import {useState} from 'react';
import LoremIpsum from 'starterkit/templates/LoremIpsum.jsx';
import Loader from './index.jsx';

export default {
  title: 'Components/Loader',
  component: Loader,
};

export const Default = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <div>
        <input
          type="checkbox"
          onChange={() => {
            setIsLoading(!isLoading);
          }}
          id="isLoading"
          checked={isLoading}
        />
        <label htmlFor="isLoading">isLoading</label>
      </div>
      <div className="article__item" style={{position: 'relative'}}>
        <Loader isLoading={isLoading} />
        <LoremIpsum />
      </div>
    </>
  );
};

export const IsPlaceholder = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <div>
        <input
          type="checkbox"
          onChange={() => {
            setIsLoading(!isLoading);
          }}
          id="isLoading"
          checked={isLoading}
        />
        <label htmlFor="isLoading">isLoading</label>
      </div>
      <div className="article__item" style={{position: 'relative'}}>
        <Loader isLoading={isLoading} isPlaceholder={true} height={100} />
        <LoremIpsum />
      </div>
    </>
  );
};

export const PlaceholderHTML = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <div>
        <input
          type="checkbox"
          onChange={() => {
            setIsLoading(!isLoading);
          }}
          id="isLoading"
          checked={isLoading}
        />
        <label htmlFor="isLoading">isLoading</label>
      </div>
      <div className="article__item" style={{position: 'relative'}}>
        <Loader isLoading={isLoading} placeholderHTML="<div>asdf</div>" />
        <LoremIpsum />
      </div>
    </>
  );
};

export const PlaceholderImage = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <div>
        <input
          type="checkbox"
          onChange={() => {
            setIsLoading(!isLoading);
          }}
          id="isLoading"
          checked={isLoading}
        />
        <label htmlFor="isLoading">isLoading</label>
      </div>
      <div className="article__item" style={{position: 'relative'}}>
        <Loader
          isLoading={isLoading}
          placeholderImage="https://img.zeit.de/2022/35/energiesparen-infografik-bilder/energiesparen-energiekosten-haushalt-uebersicht-teaser/wide__350x197__desktop__scale_2"
          width="100%"
          height="100%"
        />
        <LoremIpsum />
      </div>
    </>
  );
};
