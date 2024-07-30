import {spawn, Pool, Worker} from 'threads';
import {chunk} from 'lodash-es';
import {cpus} from 'os';

import {getCombinationsForProps} from '../../vivi/embed.js';
import {
  getStylesheets,
  getScriptTags,
  getPreloads,
  getHeadScriptTags,
} from '../../utils/manifest-utils.js';
import {trim} from '../../utils/utils.js';
import {DEFAULT_STATIC_ID} from '../../constants.js';

const NUMBER_OF_WORKERS = cpus().length - 2;

export async function generateStaticIncludesForApp(app) {
  const pool = Pool(() => spawn(new Worker('./worker.js')), NUMBER_OF_WORKERS);

  let staticIds = [DEFAULT_STATIC_ID];
  if (app.getIdsForStaticIncludes) {
    staticIds = await app.getIdsForStaticIncludes();
  }
  let propCombinations = getCombinationsForProps(app.staticIncludes.props);

  if (app.filterPropCombinations) {
    propCombinations = propCombinations.filter((combination) => {
      const props = combination.reduce((props, prop) => {
        const value = trim(prop.value, '"');
        return {
          ...props,
          [prop.prop.name]: {
            ...prop.prop,
            value,
          },
        };
      }, {});
      return app.filterPropCombinations(props);
    });
  }
  const {appName, appId} = app;

  const styleTags = getStylesheets(appName);
  const preloadTags = getPreloads(appName);
  const scriptTags = getScriptTags(appName);
  const headScriptTags = getHeadScriptTags(appName);

  const taskIds = chunk(
    staticIds,
    Math.ceil(staticIds.length / NUMBER_OF_WORKERS),
  );

  for (const taskIdChunk of taskIds) {
    pool.queue(async (writeStaticIncludes) => {
      await writeStaticIncludes({
        appName,
        appId,
        propCombinations,
        styleTags,
        scriptTags,
        headScriptTags,
        preloadTags,
        staticIds: taskIdChunk,
      });
    });
  }

  await pool.completed();
  await pool.terminate();

  return true;
}
