/*
Can’t have any exports here or hot reloading might break
*/

import {zonReactApp, viviParameterTypes} from 'starterkit';
import App from './App';
import config from './config';

const videoOptions = config.videos.map(({identifier}) => ({
  propValue: identifier,
  label: identifier,
}));

zonReactApp({
  App,
  viviEmbeds: [
    {
      name: '<%projectId%>-scrollable-video-start',
      props: [
        viviParameterTypes.static({
          name: 'display',
          value: 'scrollable-video-start',
        }),
        viviParameterTypes.oneOf({
          name: 'identifier',
          label: 'Video ID',
          options: videoOptions,
        }),
        viviParameterTypes.integer({
          name: 'height',
          label: 'Höhe (100 = eine Bildschirmhöhe)',
          defaultValue: 400,
          min: 2,
          max: 9999,
        }),
        viviParameterTypes.boolean({name: 'fullwidth', label: 'Volle Breite'}),
      ],
    },
    {
      name: '<%projectId%>-scrollable-ende',
      props: [
        viviParameterTypes.static({
          name: 'display',
          value: 'scrollable-ende',
        }),
      ],
    },
    {
      name: '<%projectId%>-video-text-start',
      props: [
        viviParameterTypes.static({
          name: 'display',
          value: 'video-text-start',
        }),
        viviParameterTypes.integer({
          name: 'frameNumber',
          label: 'Frame-Nummer',
          description: 'Bei welchem Frame soll dieser Text erscheinen?',
          min: 0,
          max: 99999,
        }),
      ],
    },
    {
      name: '<%projectId%>-video-text-ende',
      props: [
        viviParameterTypes.static({
          name: 'display',
          value: 'video-text-ende',
        }),
      ],
    },
    {
      name: '<%projectId%>-video-progressor-setup',
      props: [
        viviParameterTypes.static({
          name: 'display',
          value: 'video-progressor-setup',
        }),
        viviParameterTypes.float({
          name: 'windowHeightOffset',
          label:
            'Abspielposition innerhalb Bildschirms (Oben = 0, Mitte = 0.5, Unten = 1)',
          description:
            'Wenn hier 1 gewählt wird, beginnt die Animation mit den ersten Pixeln, die sichtbar sind. Bei 0 erst wenn Progressor ganz im Sichtfeld.',
          defaultValue: 0.75,
        }),
      ],
    },
    {
      name: '<%projectId%>-scrollable-lottie-start',
      props: [
        viviParameterTypes.static({
          name: 'display',
          value: 'scrollable-lottie-start',
        }),
        viviParameterTypes.integer({
          name: 'height',
          label: 'Höhe (100 = eine Bildschirmhöhe)',
          defaultValue: 400,
          min: 2,
          max: 9999,
        }),
        viviParameterTypes.string({
          name: 'identifier',
          label: 'Lottie-Animations ID',
        }),
        viviParameterTypes.integer({
          name: 'totalFrames',
          label: 'Gesamtzahl der Frames',
          defaultValue: 240,
          required: true,
        }),
        viviParameterTypes.boolean({name: 'fullwidth', label: 'Volle Breite'}),
        viviParameterTypes.string({
          name: `lottieJsonUrl`,
          label: `Url zu einer Lottie-Json-Datei`,
        }),
        viviParameterTypes.string({
          name: `lottieJsonUrlDark`,
          label: `Url zu einer Lottie-Json-Datei (Dark-Mode)`,
        }),
      ],
    },
  ],
});

export default App;
