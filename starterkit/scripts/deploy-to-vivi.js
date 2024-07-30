import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import FormData from 'form-data';
import chalk from 'chalk';
import {getStarterkitConfig} from '../utils/starterkit.js';
import {getManifest} from '../utils/manifest-utils.js';
import {join} from 'path';
import {dist} from '../paths.js';
import {chalkBlue, chalkGreen, chalkRed} from '../utils/logging.js';
import {merge} from 'webpack-merge';

const log = console.log;

const IS_STAGING = process.env.STAGING;

const API_URL = IS_STAGING
  ? 'http://content-storage.staging.zon.zeit.de/internal/api/v1'
  : 'http://content-storage.prod.zon.zeit.de/internal/api/v1';
const VIVI_BASE_PATH = '/administratives/embeds';
const VIVI_DISPLAY_URL = IS_STAGING
  ? 'http://vivi.staging.zeit.de/repository'
  : 'http://vivi.zeit.de/repository';

const DEPLOYMENT_PATH = `${VIVI_BASE_PATH}/${
  getStarterkitConfig().deploymentPath
}`;

function logPublished(viviPath) {
  log(chalkGreen(`✔ ${VIVI_DISPLAY_URL}${viviPath}`));
}
function logError(viviPath) {
  log(chalkRed(`✘ ${VIVI_DISPLAY_URL}${viviPath}`));
}

const DEFAULT_EMBED_PROPS = {
  document: {
    render_as_template: true,
    'last-semantic-change': new Date().toISOString(),
  },
  cmp: {
    has_thirdparty: false,
    thirdparty_vendors: '',
  },
  meta: {
    type: 'embed',
  },
};

async function deploy({
  filename,
  content,
  props = {},
  type,
  viviFolder = DEPLOYMENT_PATH,
  silent = false,
}) {
  const viviPath = `${viviFolder}/${filename}`;
  const resourceUrl = `${API_URL}/resource${viviPath}`;

  let status = 'error';

  // check if embed already exists
  const resExist = await fetch(resourceUrl, {
    method: 'HEAD',
  });

  const body = Buffer.from(content);
  const properties = merge(DEFAULT_EMBED_PROPS, props);

  if (resExist.status === 404) {
    // create embed
    const formData = new FormData();

    formData.append('properties', JSON.stringify(properties));
    formData.append('body', body, 'body');

    const resCreate = await fetch(resourceUrl, {
      method: 'PUT',
      body: formData.getBuffer(),
      headers: {
        ...formData.getHeaders(),
      },
    });

    if (resCreate.status === 201) {
      status = 'created';
    } else {
      logError(viviPath);
    }
  } else if (resExist.status === 200) {
    // update embed
    const resUpdateProperties = await fetch(resourceUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(properties),
    });

    const resUpdateBody = await fetch(resourceUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/octet-stream',
      },
      body,
    });

    if (resUpdateBody.status === 200 && resUpdateProperties.status === 200) {
      status = 'updated';
    } else {
      logError(viviPath);
    }
  } else {
    status = 'error';
    logError(viviPath);
  }

  if (status === 'updated' || status === 'created') {
    // publish embed
    const publishUrl = `${API_URL}/publish${viviPath}`;
    const resPublish = await fetch(publishUrl, {method: 'POST'});

    if (resPublish.status === 200) {
      status = 'published';
      if (!silent) {
        logPublished(viviPath);
      }
    } else {
      status = 'error';
      logError(viviPath);
    }
  }

  return status;
}

function getEmbedConfig(apps) {
  let viviEmbeds = [];

  for (const app of apps) {
    const embeds = [];
    if (app.viviEmbeds) {
      embeds.push(...app.viviEmbeds);
    }
    if (app.staticIncludes && Object.keys(app.staticIncludes).length) {
      embeds.push(app.staticIncludes);
    }
    if (embeds.length === 0) {
      continue;
    }

    for (const embed of embeds) {
      if ('deploy' in embed && !embed.deploy) {
        continue;
      }

      const name = embed.name || embed.viviEmbedName;

      viviEmbeds.push({
        app: app.appName,
        filename: name,
        viviFilename: name,
        viviFolder: embed.viviFolder || null,
        viviMemo: embed.viviMemo,
        viviCss: embed.viviCss,
        thirdpartyVendors: embed.thirdpartyVendors,
      });
    }
  }

  return viviEmbeds;
}

function hasDuplicates(embeds) {
  let embedNames = {};
  for (const embed of embeds) {
    if (!embedNames[embed.viviFilename]) {
      embedNames[embed.viviFilename] = 0;
    }
    embedNames[embed.viviFilename] += 1;
  }
  const duplicates = Object.values(embedNames).filter((d) => d > 1);
  if (duplicates.length) {
    return true;
  }
  return false;
}

const BASE_PATH = dist;

async function main() {
  // get builded apps to access viviEmbeds etc.
  const apps = [];
  const manifest = getManifest('node');
  for (const key of Object.keys(manifest)) {
    const appEntry = manifest[key];
    // continue for common chunks
    if (!appEntry.isEntry) continue;
    const app = (await import(join(dist, 'node', appEntry.file))).default;
    apps.push(app);
  }

  const embeds = getEmbedConfig(apps);
  if (hasDuplicates(embeds)) {
    log(chalkRed(`There are multiple vivi embeds with the same name`));
    return;
  }

  const promises = embeds.map(async (embed) => {
    const embedDir = path.resolve(BASE_PATH, 'vivi', embed.app);
    const fileName = embed.filename;

    const contentPath = path.resolve(embedDir, fileName);
    const content = fs.readFileSync(contentPath, 'utf8');

    const props = {};
    if (!props.document) props.document = {};

    // get parameter definition from file
    const parameterPath = path.resolve(
      embedDir,
      `${fileName}.parameter_definition.py`,
    );
    if (fs.existsSync(parameterPath)) {
      props.document.parameter_definition = fs.readFileSync(
        parameterPath,
        'utf8',
      );
    }

    if (embed.viviMemo) {
      props.document.memo = embed.viviMemo;
    }

    if (embed.viviCss) {
      props.document.vivi_css = embed.viviCss;
    }

    if (embed.thirdpartyVendors && embed.thirdpartyVendors.length) {
      props.cmp.has_thirdparty = true;
      props.cmp.thirdparty_vendors = embed.thirdpartyVendors;
    }

    let viviPath = embed.viviPath
      ? `${VIVI_BASE_PATH}/${embed.viviPath}`
      : null;

    return deploy({
      filename: embed.viviFilename,
      content,
      type: 'embed',
      props,
      viviPath,
    });
  });

  const responses = await Promise.all(promises);

  const successEmojis = [
    '🚀',
    '🤙',
    '👏',
    '🤩',
    '🤜',
    '🎅',
    '😻',
    '💪',
    '🍻',
    '🥇',
    '🎉',
  ];
  const successEmoji =
    successEmojis[Math.floor(Math.random() * successEmojis.length)];
  const failEmojis = [
    '💩',
    '🤮',
    '😱',
    '🙃',
    '☄️',
    '🔥',
    '💥',
    '🕳',
    '💣',
    '💔',
    '😬',
  ];
  const failEmoji =
    failEmojis[Math.floor(Math.random() * successEmojis.length)];

  log('---');
  const errorCount = responses.filter((d) => d === 'error').length;

  if (errorCount) {
    let errorString = errorCount === 1 ? 'error' : 'errors';
    log(
      chalk.white.bgHex('#F54A2B').bold(`${errorCount} ${errorString}.`),
      failEmoji,
      chalk.white(
        `Relax, this happens occasionally. Just try again in a few seconds.`,
      ),
    );
  } else {
    log(
      successEmoji,
      chalk.white('Ding dong done. All deployed to Vivi. Yay!'),
    );
  }
}

log(chalkBlue(`Deploying vivi embeds to ${DEPLOYMENT_PATH}`));
main();
