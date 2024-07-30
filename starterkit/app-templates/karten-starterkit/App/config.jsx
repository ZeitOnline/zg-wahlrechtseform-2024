import basemapStyle from './basemapStyle.js';
import metaData from 'src/maptiles/pkw-dichte.json';
import overlaySrc from 'src/static/bundeslaender.topo.json?url';
// import geocoderItemsUrl from 'src/static/kreise-centroids.csv?url';
import CustomTooltip from './CustomTooltip.jsx';

const colorsLight = [
  ['#f7efbc', '#f3d498', '#ebba78', '#e2a05b', '#d8863f', '#cc6b22'],
  ['#00429d', '#3e67ae', '#618fbf', '#85b7ce', '#b1dfdb', '#ffffe0'],
];

const colorsDark = [
  ['#505c6e', '#7e776e', '#a7946c', '#d1b26a', '#f3d37d', '#fdfac7'],
  ['#505c6e', '#7e776e', '#a7946c', '#d1b26a', '#f3d37d', '#fdfac7'],
];

export const lightModeColors = [
  [
    colorsLight[0][0],
    398,
    colorsLight[0][1],
    475,
    colorsLight[0][2],
    537,
    colorsLight[0][3],
    583,
    colorsLight[0][4],
    621,
    colorsLight[0][5],
  ],
  [
    colorsLight[1][0],
    398,
    colorsLight[1][1],
    475,
    colorsLight[1][2],
    537,
    colorsLight[1][3],
    583,
    colorsLight[1][4],
    621,
    colorsLight[1][5],
  ],
];
export const darkModeColors = [
  [
    colorsDark[0][0],
    398,
    colorsDark[0][1],
    475,
    colorsDark[0][2],
    537,
    colorsDark[0][3],
    583,
    colorsDark[0][4],
    621,
    colorsDark[0][5],
  ],
  [
    colorsDark[1][0],
    398,
    colorsDark[1][1],
    475,
    colorsDark[1][2],
    537,
    colorsDark[1][3],
    583,
    colorsDark[1][4],
    621,
    colorsDark[1][5],
  ],
];

const config = {
  mapConfig: {
    id: '2022-pkw-x',
    minZoom: 4,
    maxZoom: 12,
    bounds: null,
    zoomControl: true,
    initialZoomButton: true,
    fullwidth: true,
    // height: '300vh',
    scaleControl: false,
    interactiveMap: true,
    screenshots: false,
    autoDimensions: true,
    allowMapRotation: false,
    toggleOptions: ['Private PKW', 'Alle PKW'],
    dataAccessKeys: ['X', 'X'],
    basemap: {
      style: basemapStyle,
      alwaysVisible: false,
      hidden: [],
    },
    metaData: metaData,
    insertLayersBeforeId: 'above_hillshade',
    choropleth: [
      {
        source: metaData.path,
        id: 'pkw-dichte',
        styles: {
          light: {
            color: '#fff',
            fillColor: [
              [
                'case',
                ['has', 'X2021'],
                ['step', ['get', 'X2021'], ...lightModeColors[0]],
                '#ccc',
              ],
              [
                'case',
                ['has', 'X2021'],
                ['step', ['get', 'X2021'], ...lightModeColors[1]],
                '#ccc',
              ],
            ],
            opacity: 0.66,
            fillOpacity: 1,
            // weight: 0.9,
          },
          dark: {
            color: '#1e1c1f',
            fillColor: [
              [
                'case',
                ['has', 'X2021'],
                ['step', ['get', 'X2021'], ...darkModeColors[0]],
                '#ccc',
              ],
              [
                'case',
                ['has', 'X2021'],
                ['step', ['get', 'X2021'], ...darkModeColors[1]],
                '#ccc',
              ],
            ],
            opacity: 0.3,
            fillOpacity: 1,
            // weight: 1.5,
          },
        },
        stylesHover: {
          light: {
            // weight: 2,
            opacity: 1,
            color: '#fff',
          },
          dark: {
            // weight: 2,
            opacity: 1,
            color: '#fff',
          },
        },
      },
    ],
    overlays: [
      {
        file: overlaySrc,
        // styles: {
        //   light: {
        //     color: '#333',
        //     weight: 1,
        //   },
        //   dark: {
        //     color: '#ccc',
        //     weight: 1,
        //   },
        // },
        maxZoom: 7,
      },
    ],
    swoopies: [
      [
        {
          from: [48.85928513762646, 7.362986969764447],
          to: [49.2050771513429, 7.803650794992323],
          text: 'Höchster Anteil: Südwestpfalz (684)',
          style: {light: 'light', dark: 'dark'},
          factor: -0.8,
          textAlign: 'right',
          anchor: 'top-right', // "center" | "top" | "bottom" | "left" | "right" | "top-left" | "top-right" | "bottom-left" | "bottom-right"
          // offset: [0, 0],
          iconSize: [150, 0],
          weight: 1.2,
          minZoom: 5,
          maxZoom: 21,
        },
        {
          from: [50.00279329770476, 13.354483093190559],
          to: [52.542271862959936, 13.373914355837424],
          text: 'Geringster Anteil: Berlin (292)',
          style: {light: 'light', dark: 'dark'},
          factor: -0.8,
          textAlign: 'left',
          anchor: 'top-left', // "center" | "top" | "bottom" | "left" | "right" | "top-left" | "top-right" | "bottom-left" | "bottom-right"
          // offset: [0, 0],
          iconSize: [120, 0],
          weight: 1.2,
          minZoom: 5,
          maxZoom: 21,
        },
      ],
      [
        {
          from: [54.05928513762646, 8.062986969764447],
          to: [52.4238804465132, 10.779642120402563],
          text: 'Höchster Anteil: Wolfsburg (1.020)',
          style: {light: 'light', dark: 'dark'},
          factor: 0.8,
          textAlign: 'right',
          anchor: 'top-right', // "center" | "top" | "bottom" | "left" | "right" | "top-left" | "top-right" | "bottom-left" | "bottom-right"
          // offset: [0, 0],
          iconSize: [120, 0],
          weight: 1.2,
          minZoom: 5,
          maxZoom: 21,
        },
        {
          from: [50.00279329770476, 13.354483093190559],
          to: [52.542271862959936, 13.373914355837424],
          text: 'Geringster Anteil: Berlin (338)',
          style: {light: 'light', dark: 'dark'},
          factor: -0.8,
          textAlign: 'left',
          anchor: 'top-left', // "center" | "top" | "bottom" | "left" | "right" | "top-left" | "top-right" | "bottom-left" | "bottom-right"
          // offset: [0, 0],
          iconSize: [120, 0],
          weight: 1.2,
          minZoom: 5,
          maxZoom: 21,
        },
      ],
    ],
    tooltip: [
      {
        component: CustomTooltip,
        isVisible: true,
        // chartMinY: 300,
        // chartMaxY: 700,
        // @TODO the props below should probably be set on the Chart component,
        // but I didn’t have time yet
        chartBufferY: 50,
        chartColors: {light: lightModeColors[0], dark: darkModeColors[0]},
        chartTitle: 'Private Pkw pro 1.000 Einwohner',
        chartNumberFormat: ',.0f',
        chartNumberSuffix: '',
        comparisonYearsBefore: 4,
      },
      {
        component: CustomTooltip,
        // valueDecimals: {
        //   2020: 0,
        // },
        isVisible: true,
        // chartMinY: 300,
        // chartMaxY: 700,
        // @TODO the props below should probably be set on the Chart component,
        // but I didn’t have time yet
        chartBufferY: 50,
        chartColors: {light: lightModeColors[1], dark: darkModeColors[1]},
        chartTitle: 'Pkw pro 1.000 Einwohner',
        chartNumberFormat: ',.0f',
        chartNumberSuffix: '',
      },
    ],
    labels: {
      preset: 'germanstates',
      style: {light: 'light', dark: 'dark'},
      data: [],
    },
    legend: [
      {
        title: 'Private Pkw pro 100 Einwohner',
        valueDecimals: 0,
        noDataColor: {light: '#ccc', dark: '#ccc'},
        items: [
          {
            color: {light: colorsLight[0][0], dark: colorsDark[0][0]},
            text: <strong>398</strong>,
          },
          {
            color: {light: colorsLight[0][1], dark: colorsDark[0][1]},
            text: '475',
          },
          {
            color: {light: colorsLight[0][2], dark: colorsDark[0][2]},
            text: '537',
          },
          {
            color: {light: colorsLight[0][3], dark: colorsDark[0][3]},
            text: '583',
          },
          {
            color: {light: colorsLight[0][4], dark: colorsDark[0][4]},
            text: '621',
          },
          {
            color: {light: colorsLight[0][5], dark: colorsDark[0][5]},
            text: '1000',
          },
        ],
      },
      {
        title: 'Pkw pro 100 Einwohner',
        valueDecimals: 0,
        noDataColor: {light: '#ccc', dark: '#ccc'},
        items: [
          {
            color: {light: colorsLight[1][0], dark: colorsDark[1][0]},
            text: '398',
          },
          {
            color: {light: colorsLight[1][1], dark: colorsDark[1][1]},
            text: '475',
          },
          {
            color: {light: colorsLight[1][2], dark: colorsDark[1][2]},
            text: '537',
          },
          {
            color: {light: colorsLight[1][3], dark: colorsDark[1][3]},
            text: '583',
          },
          {
            color: {light: colorsLight[1][4], dark: colorsDark[1][4]},
            text: '621',
          },
          {
            color: {light: colorsLight[1][5], dark: colorsDark[1][5]},
            text: '1000',
          },
        ],
      },
    ],
    source: (
      <>
        Quelle:{' '}
        <a
          target="_blank"
          href="https://www.kba.de/DE/Home/home_node.html"
          rel="noreferrer"
        >
          Kraftfahrtbundesamt
        </a>
        , eigene Berechnungen
        <br />
        Kartenmaterial:{' '}
        <a
          href="https://www.bkg.bund.de/DE/Home/home.html"
          target="_blank"
          rel="noreferrer"
        >
          BKG
        </a>
      </>
    ),
    // geocoder: {
    //   placeholder: 'Finden Sie Ihren Kreis',
    //   //country: 'de',
    //   csvURL: `${baseUrl}kreise-centroids.csv`,
    // },
    geocoder: {
      // whether to use the static or dynamic geocoder
      useStaticOrDynamic: 'dynamic',
      // options passed to the static geocoder
      // staticOptions: {
      //   // url to a csv file containing lat, lon and name columns for the autocomplete
      //   // like this import geocoderDataUrl from 'src/static/kreise-centroids.csv?url';
      //   url: geocoderItemsUrl,
      // },
      // options passed to the dynamic geocoder
      // by default the geocoder searchs for countries,
      // regions, postcodes, districts, places, localities
      // and neighbourhoods. For possible options see:
      // https://docs.mapbox.com/api/search/geocoding/
      dynamicOptions: {
        // language expected by the geocoder
        language: 'de',
        // country to limit the search to, e.g.: de
        country: 'de',
        // limit the search to a specific bounding box, e.g.: [5.98865807458, 47.3024876979, 15.1169958839, 54.983104153]
        // or "mapbounds"
        bbox: null,
        // additional geocoder types to include in the search, e.g.: ['poi']
        types: null,
      },
      // call to action displayed above the search bar
      callToAction: '',
      // placeholder text
      placeholder: 'Suchen Sie Ihren Kreis',
    },
    infobox: {
      isVisible: true,
      buttonlabel: 'Methodik',
      headline: '',
      content: (
        <p>
          Der Deutsche Wetterdienst (DWD) stellt die monatliche
          Durchschnittstemperatur in Deutschland in einem feinen Raster
          (1&thinsp;km&thinsp;×&thinsp;1&thinsp;km) zur Verfügung. Die Daten der
          Wetterstationen werden dafür flächendeckend umgerechnet. Über diese
          Werte wurden aktuelle Gemeindegrenzen gelegt und der Durchschnitt der
          Rasterpunkte innerhalb der jeweiligen Region berechnet. Der Karte
          liegen die monatlichen Durchschnitte im Oktober 2022 und alle
          Oktobermonate in der Klimareferenzperiode 1961-1990 zugrunde.
        </p>
      ),
    },
  },
};

export default config;
