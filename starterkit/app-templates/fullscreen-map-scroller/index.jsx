/*
Can’t have any exports here or hot reloading might break
*/

import {zonReactApp, viviParameterTypes} from 'starterkit';
import App from './App';
import config from './config';

const options = config.waypoints
  .filter((d) => d.id !== 'initial')
  .map(({id: propValue, label}) => ({
    propValue,
    label,
  }));

zonReactApp({
  App,
  viviEmbeds: [
    {
      name: '<%projectId%>-paywall-header',
      props: [
        viviParameterTypes.static({
          name: 'display',
          value: 'paywall-header',
        }),
        viviParameterTypes.isTruncatedByPaywall(),
      ],
    },
    {
      name: '<%projectId%>-mapbox-karte',
      props: [
        viviParameterTypes.static({
          name: 'display',
          value: 'mapbox-karte',
        }),
      ],
    },
    {
      name: '<%projectId%>-sticky-container-start',
      props: [
        viviParameterTypes.static({
          name: 'display',
          value: 'sticky-container-start',
        }),
        viviParameterTypes.string({
          name: 'stickyElementName',
          label:
            'Pembed Name des sticky Elements (z.B. ein-jahr-ukraine-karte)',
          maxLength: 100,
          required: true,
        }),
        viviParameterTypes.string({
          name: 'top',
          label: 'Abstand des Sticky Element nach Oben',
          defaultValue: '0px',
        }),
        viviParameterTypes.boolean({name: 'fullwidth', label: 'Volle Breite'}),
      ],
    },
    {
      name: '<%projectId%>-sticky-container-ende',
      props: [
        viviParameterTypes.static({
          name: 'display',
          value: 'sticky-container-ende',
        }),
      ],
    },
    {
      name: '<%projectId%>-waypoint-start',
      props: [
        viviParameterTypes.static({
          name: 'display',
          value: 'waypoint-start',
        }),
        viviParameterTypes.oneOf({
          name: 'identifier',
          label: 'Ereignis ID',
          description:
            'Achte darauf, dass jedes Ereignis zwei Mal vorkommt: ein Start und ein Ende',
          options,
        }),
      ],
    },
    {
      name: '<%projectId%>-waypoint-divider',
      props: [
        viviParameterTypes.static({
          name: 'display',
          value: 'waypoint-divider',
        }),
        viviParameterTypes.integer({
          name: 'margin',
          label: 'Abstand',
          description: 'Zur nächsten Karte (100 = eine Bildschirmhöhe)',
          defaultValue: 100,
          min: 1,
          max: 999,
        }),
      ],
    },
    {
      name: '<%projectId%>-waypoint-ende',
      props: [
        viviParameterTypes.static({
          name: 'display',
          value: 'waypoint-ende',
        }),
        viviParameterTypes.integer({
          name: 'margin',
          label: 'Abstand',
          description: 'Zur nächsten Karte (100 = eine Bildschirmhöhe)',
          defaultValue: 100,
          min: 1,
          max: 999,
        }),
      ],
    },
    {
      name: '<%projectId%>-scroll-progressor-setup',
      props: [
        viviParameterTypes.static({
          name: 'display',
          value: 'scroll-progressor-setup',
        }),
        viviParameterTypes.float({
          name: 'windowHeightOffset',
          label:
            'Abspielposition innerhalb Bildschirms (Oben = 0, Mitte = 0.5, Unten = 1)',
          description:
            'Wenn hier 1 gewählt wird, beginnt die Animation mit den ersten Pixeln, die sichtbar sind. Bei 0 erst wenn Progressor ganz im Sichtfeld.',
          defaultValue: 0.5,
        }),
      ],
    },
    {
      name: '<%projectId%>-scroll-progressor-start',
      props: [
        viviParameterTypes.static({
          name: 'display',
          value: 'scroll-progressor-start',
        }),
        viviParameterTypes.string({
          name: 'identifier',
          label: 'Eindeutige Bezeichnung',
          description:
            'Vorsicht! Die Progressor-Elemente müssen vor dem Text-Start und nach dem Text-Ende platziert werden',
          maxLength: 100,
          required: true,
        }),
        viviParameterTypes.float({
          name: 'domainFrom',
          label: 'Abspielzeitpunkt Start',
          description:
            'Diese Zahl wird hochgezählt und an die Karte übergeben während dem Scrollen',
          defaultValue: 0,
        }),
      ],
    },
    {
      name: '<%projectId%>-scroll-progressor-ende',
      props: [
        viviParameterTypes.static({
          name: 'display',
          value: 'scroll-progressor-ende',
        }),
        viviParameterTypes.float({
          name: 'domainTo',
          label: 'Abspielzeitpunkt Ende',
          description:
            'Bis zu dieser Zahl wird hochgezählt während dem Scrollen',
          defaultValue: 1,
        }),
        viviParameterTypes.integer({
          name: 'margin',
          label: 'Abstand',
          description: 'Zur nächsten Karte (100 = eine Bildschirmhöhe)',
          defaultValue: 0,
          min: 0,
          max: 999,
        }),
      ],
    },
  ],
});

export default App;
