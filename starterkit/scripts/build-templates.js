import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import chalk from 'chalk';

import {starterkit} from '../paths.js';

const log = console.log;

const chalkBlue = chalk.hex('#00CBDB');
const chalkGreen = chalk.hex('#1CDE7E');
const chalkRed = chalk.hex('#F54A2B');

function logSuccess(text) {
  log(chalkGreen(text));
}
function logError(text) {
  log(chalkRed(text));
}

const replaceReferences = function (html) {
  // html = html.replace(/\/\d.\d+?\//g, '/latest/');
  // html = html.replace(/staging.zeit.de/g, 'zeit.de');
  return html;
};

const privatise = function (html) {
  html = html.replace(
    `<meta name="robots" content="index,follow,noarchive">`,
    `<meta name="robots" content="noindex,nofollow,noarchive">`,
  );
  html = html.replace(
    `<meta name="robots" content="noindex">`,
    `<meta name="robots" content="noindex,nofollow,noarchive">`,
  );
  return html;
};

const removeReplaceNavTeasers = function (html) {
  return html.replace(' class="js-replace-nav-teasers"', '');
};

const headers = {
  'User-Agent': 'curl',
};

async function download(url, prefix) {
  log(chalkBlue(`Downloading article template`));

  const request = await fetch(url, {headers});
  if (request.status !== 200) {
    const errorEmoji = Math.random() > 0.5 ? '🤷‍♀️' : '🤷‍♂️';
    logError(`Error downloading article`);
    log(`Are you in the VPN?`);
    log(`Or maybe the template article has been deleted?`);
    log(
      `${errorEmoji} (This isn’t so bad, you’ll just have to work with a slightly outdated article template.)`,
    );
    return null;
  }
  const rawHtml = await request.text();

  let html = replaceReferences(rawHtml);
  html = privatise(html);
  html = removeReplaceNavTeasers(html);
  html = html.replace(
    /===SPITZMARKE===/g,
    '<!-- slot:start:kicker --><!-- slot:end:kicker -->',
  );
  html = html.replace(
    /===TITEL===/g,
    '<!-- slot:start:title --><!-- slot:end:title -->',
  );
  html = html.replace(
    /===TEASER===/g,
    '<!-- slot:start:teaser --><!-- slot:end:teaser -->',
  );

  html = html.replace(
    '===HEADER-MODUL-OBEN===',
    '<!-- slot:start:header --><!-- slot:end:header -->',
  );
  html = html.replace(
    '<p class="paragraph article__item">===ERSTER-ABSATZ===\n</p>',
    '<!-- slot:start:content --><!-- slot:end:content -->',
  );

  const outputPath = path.join(starterkit, 'templates', 'raw');

  fs.writeFileSync(path.resolve(outputPath, `${prefix}.html`), html);

  logSuccess(`Downloaded article template to ${outputPath}`);
}

async function main() {
  await download(
    'https://www.zeit.de/administratives/embeds/vorlagen/starterkit-vorlage-article',
    'article',
  );
  await download(
    'https://www.zeit.de/administratives/embeds/vorlagen/starterkit-vorlage-visual-article',
    'article-visual',
  );
  await download(
    'https://www.zeit.de/administratives/embeds/vorlagen/starterkit-vorlage-magazin',
    'magazin',
  );
  await download(
    'https://www.zeit.de/administratives/embeds/vorlagen/starterkit-vorlage-campus',
    'campus',
  );
  await download(
    'https://www.zeit.de/administratives/embeds/vorlagen/starterkit-vorlage-arbeit',
    'arbeit',
  );
}

main();
