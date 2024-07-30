import {spawn, Pool, Worker} from 'threads';
import {chunk} from 'lodash-es';
import {cpus} from 'os';
import {DEFAULT_STATIC_ID} from '../../constants.js';
import {
  getStylesheets,
  getScriptTags,
  getPreloads,
  getHeadScriptTags,
} from '../../utils/manifest-utils.js';

const NUMBER_OF_WORKERS = cpus().length - 2;

/**
 Try to split up the work somewhat okayish
 */
function figureOutTaskSplit({module, ids}) {
  let taskIds = [ids];
  if (module.publish === 'all' && ids.length > 10) {
    taskIds = chunk(
      ids,
      Math.max(Math.ceil(ids.length / NUMBER_OF_WORKERS), 5),
    );
  }
  return taskIds;
}

export async function generateStaticPagesForApp({app, pages: allPages}) {
  const pages = Object.entries(allPages)
    .map(([path, module]) => {
      return {
        path,
        module: module.default,
      };
    })
    .filter((page) => page.module.publish);

  if (!pages?.length) {
    return true;
  }

  const pool = Pool(() => spawn(new Worker('./worker.js')), NUMBER_OF_WORKERS);

  let ids = [DEFAULT_STATIC_ID];
  if (app.staticIncludes && app.getIdsForStaticIncludes) {
    ids = await app.getIdsForStaticIncludes();
  }

  const appName = app.appName;
  const styleTags = getStylesheets(appName);
  const preloadTags = getPreloads(appName);
  const scriptTags = getScriptTags(appName);
  const headScriptTags = getHeadScriptTags(appName);

  pages.map(async ({path, module}) => {
    // try to split up the work somewhat
    const taskIds = figureOutTaskSplit({module, ids});

    for (const taskIdChunk of taskIds) {
      pool.queue(async (writePages) => {
        await writePages({
          appName,
          styleTags,
          scriptTags,
          preloadTags,
          headScriptTags,
          staticIds: taskIdChunk,
          path,
        });
      });
    }
  });

  await pool.completed();
  await pool.terminate();

  return true;
}
