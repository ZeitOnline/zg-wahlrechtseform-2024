import {JSDOM} from 'jsdom';
import {resizerScript, lightDarkModeStyles} from './snippets.js';

/**
 * @param {string} html - html string
 * @param {string} project - project name
 * @param {string} aiFileName - name of the ai file
 * @param {string} timestamp - timestamp
 * @param {string} deploymentPath - deployment path
 * @returns {string} adapted html string
 * @description
 * - add font to css
 * - add meta tag
 * - add support for light- and darkmode
 * - add resizer script
 * - add timestamp to img sources to prevent caching
 * - add gcs prefix to img sources
 * - add lazy loading to img tags
 * - adapt breakpoints
 */
const adaptHtml = ({
  html,
  project,
  aiFileName,
  timestamp,
  deploymentPath,
  addDataSource,
  eagerLoad,
}) => {
  // add font to css
  html = html.replace(
    '</style>',
    `.ai2html p {font-family: TabletGothic, "Helvetica Neue", Helvetica, Arial, FreeSans, sans-serif;font-variant-numeric:tabular-nums;}
  </style>`,
  );

  // add meta tag
  html = `<meta http-equiv="content-type" content="text/html; charset=utf-8"> </meta> ${html}`;

  // add light- and darkmode
  html = html.replace(
    '</style>',
    `
  ${lightDarkModeStyles.replace('AIFILENAME', aiFileName)}
  </style>`,
  );

  // add resizer script
  html = html.replace(
    '</style>',
    `</style>

  ${resizerScript}
`,
  );

  // extend src of images
  const prefix = `https://interactive.zeit.de/g/${deploymentPath}/static/illustrator/${project}/`;
  html = html.replaceAll('src="', `src="${prefix}`);

  // parse html file
  // @TODO use cheerio so that we don’t include two dom parsers
  const doc = new JSDOM(html).window.document;

  // get all div ids containing "AIFILENAME-medium" and "AIFILENAME-schmal"
  const mediumDivs = doc.querySelectorAll(`div[id*="${aiFileName}-medium"]`);
  const smallDivs = doc.querySelectorAll(`div[id*="${aiFileName}-schmal"]`);

  // set data-max-width of smallDivs to 380 and data-min-width of mediumDivs to 381
  smallDivs.forEach((div) => {
    div.setAttribute('data-max-width', '380');
  });
  mediumDivs.forEach((div) => {
    div.setAttribute('data-min-width', '381');
  });

  // add lazy loading to all images
  const images = doc.querySelectorAll('img');
  if (!eagerLoad) {
    images.forEach((img) => {
      img.setAttribute('loading', 'lazy');
    });
  }

  // add timestamp to all image urls
  images.forEach((img) => {
    const src = img.getAttribute('src');
    // replace ending (.svg, .png, .jpg) by -timestamp.ending
    if (src.endsWith('.svg')) {
      img.setAttribute('src', `${src.replace('.svg', '')}-${timestamp}.svg`);
    } else if (src.endsWith('.png')) {
      img.setAttribute('src', `${src.replace('.png', '')}-${timestamp}.png`);
    } else if (src.endsWith('.jpg')) {
      img.setAttribute('src', `${src.replace('.jpg', '')}-${timestamp}.jpg`);
    }
  });

  // if addDataSource, replace img src with data-src-lazy
  if (addDataSource) {
    images.forEach((img) => {
      img.setAttribute('data-src-lazy', img.getAttribute('src'));
      img.removeAttribute('src');
    });
  }

  // reconvert html to string
  return doc.documentElement.innerHTML
    .replace('<head>', '')
    .replace('</head>', '')
    .replace('<body>', '')
    .replace('</body>', '');
};

export default adaptHtml;
