import {load as cheerioLoad} from 'cheerio';
import {cloneDeep} from 'lodash-es';
import {renderToPipeableStream} from 'react-dom/server';
import React from 'react';
import {camelCase, kebabCase} from 'change-case';
import {Writable} from 'stream';

import {encrypt} from '../shared/crypto/node.js';
import {
  DATA_RENDER_ATTR,
  DATA_PROP_ATTR,
  DATA_ID_ATTR,
  PLACEHOLDER_APP_NAME,
  HYDRATION_DATA_PLAINTEXT_KEY,
  HYDRATION_DATA_ENCRYPTED_KEY,
} from '../constants.js';
import {pythonValueToJs} from '../utils/utils.js';
import {log} from '../utils/logging.js';
import {PROJECT_PREFIX} from '../vite/config/vite.config.js';

const IS_SERVER = process.env.SERVER === 'true';
const SHOW_LOGS = !IS_SERVER;
const IS_TESTING = process.env.TESTING === 'true';

const renderRegex = new RegExp(
  `${DATA_RENDER_ATTR}=["|']${
    PROJECT_PREFIX + '-' + PLACEHOLDER_APP_NAME
  }["|']`,
  'g',
);
export function replaceRenderDataProp({html, appId}) {
  return html.replace(renderRegex, `${DATA_RENDER_ATTR}="${appId}"`);
}

export async function getPropsForStaticIncludesHydrationScript({
  appId,
  id,
  staticProps,
  encrypt: encryptStaticProps = false,
}) {
  let staticPropsString = JSON.stringify(staticProps);
  let key = HYDRATION_DATA_PLAINTEXT_KEY;
  if (encryptStaticProps) {
    staticPropsString = await encrypt(staticPropsString);
    staticPropsString = `"${staticPropsString}"`;
    key = HYDRATION_DATA_ENCRYPTED_KEY;
  }
  return `<script>
if (!window.zgStaticPropsHydration) {
   window.zgStaticPropsHydration = {};
   if (!window.zgStaticPropsHydration["${appId}"]) {
     window.zgStaticPropsHydration["${appId}"] = {};
   }
}
window.zgStaticPropsHydration["${appId}"]["${id}"]={"${key}": ${staticPropsString}}
</script>`;
}

const defaultAppId = PROJECT_PREFIX + '-' + PLACEHOLDER_APP_NAME;

async function render({
  appId = defaultAppId,
  html,
  id,
  App,
  addStaticPropsToWindow,
  staticProps: preloadedStaticProps,
  isDocument = false,
}) {
  let staticProps = null;
  if (App.getPropsForStaticIncludes) {
    if (preloadedStaticProps) {
      staticProps = preloadedStaticProps;
    } else if (App.getPropsForStaticIncludes) {
      staticProps = await App.getPropsForStaticIncludes(id);
    }
  }

  // false as third argument enables fragment mode
  // so no html/body tags are added
  const $ = cheerioLoad(
    html,
    {
      decodeEntities: false,
    },
    isDocument,
  );

  const prerenderSelector = `[${DATA_RENDER_ATTR}="${appId}"]`;

  const props = {
    ...(staticProps && cloneDeep(staticProps)), // the react app might tranform the data
    ...(id !== null && {id}),
  };

  const divsToRenderInto = $(prerenderSelector);

  log(
    `prerender ${divsToRenderInto.length} ${
      divsToRenderInto.length === 1 ? 'element' : 'elements'
    }...`,
  );

  const renders = divsToRenderInto.map(async (_, element) => {
    await renderReactAppIntoDiv(element, $, App, id, props);
  });
  await Promise.all(renders);

  if (staticProps && addStaticPropsToWindow) {
    const staticPropsScript = await getPropsForStaticIncludesHydrationScript({
      appId,
      id,
      staticProps,
      encrypt: App?.staticIncludes?.encryptHydrationData,
    });
    if (isDocument) {
      $('head').append(staticPropsScript);
    } else {
      $(prerenderSelector).first().insertBefore(staticPropsScript);
    }
  }

  // cheerio wraps attribute values in double quotes which have been before in single quotes
  // this breaks html attribute values if they contain any double quotes
  const singleQuoteAttributes = App.viviEmbeds
    ?.map((d) => d.props)
    .flat()
    .filter((d) => d?.valueInSingleQuotes)
    .map((d) => `${DATA_PROP_ATTR}-${kebabCase(d.name)}`);

  singleQuoteAttributes?.forEach((d) => {
    $(`[${d}]`).map((_, element) => {
      // replace all double quotes with 0x22 (the asci code but this could be anything)
      element.attribs[d] = element.attribs[d].replaceAll('"', '0x22');
    });
  });

  // transform to html
  let content = $.html();

  // replace the wrapping double quotes with single quotes again
  singleQuoteAttributes?.forEach((d) => {
    content = content.replaceAll(d + '="', d + "='");
    content = content.replace(new RegExp(`(?<=${d}='.*?)"`, 'g'), "'");
  });

  // replace 0x22 with double quotes again
  content = content.replaceAll('0x22', '"');

  return content;
}

async function renderReactAppIntoDiv(element, $, ReactApp, id, props = {}) {
  return new Promise((resolve, reject) => {
    if (id) {
      $(element).attr(DATA_ID_ATTR, id);
    }

    const reactProps = {...props};

    Object.keys(element.attribs)
      .filter((key) => key.includes(DATA_PROP_ATTR))
      .forEach((key) => {
        reactProps[camelCase(key.replace(`${DATA_PROP_ATTR}-`, ''))] =
          pythonValueToJs(element.attribs[key]);
      });

    // use renderToPipeableStream to support Suspense and React.lazy
    const stream = renderToPipeableStream(
      React.createElement(ReactApp, reactProps),
      {
        onAllReady() {
          const writableStream = new Writable();
          const chunks = [];
          writableStream._write = (chunk, encoding, next) => {
            chunks.push(chunk.toString());
            next();
          };

          stream.pipe(writableStream);
          writableStream.end();
          $(element).html(chunks.join(''));
          resolve();
        },
        onError(err) {
          reject(err);
        },
      },
    );
  });
}

export default render;
