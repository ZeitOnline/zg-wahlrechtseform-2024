import Share from './index.jsx';

export default {
  title: 'Components/Share',
  component: Share,
};

export const Default = () => {
  return (
    <Share
      url="https://www.zeit.de/sport/2015-08/kevin-pannewitz-hansa-rostock-altglienicke"
      text="Der Kühlschrank war sein größter Gegner"
      hashtags={['kühlschrank']}
      via={['zeitonline']}
    />
  );
};

export const WebShare = () => {
  return (
    <Share
      url="https://www.zeit.de/sport/2015-08/kevin-pannewitz-hansa-rostock-altglienicke"
      title="Kevin allein vorm Kühlschrank"
      text="Der Kühlschrank war sein größter Gegner"
      hashtags={['kühlschrank']}
      via={['zeitonline']}
      webShare={true}
    />
  );
};

export const WithOverrides = () => {
  return (
    <Share
      url="https://www.zeit.de/sport/2015-08/kevin-pannewitz-hansa-rostock-altglienicke"
      text="Der Kühlschrank war sein größter Gegner"
      twitter={{
        text: `Was ist dein #Persönlichkeitsplätzchen? Mach den Test: `,
      }}
    />
  );
};
