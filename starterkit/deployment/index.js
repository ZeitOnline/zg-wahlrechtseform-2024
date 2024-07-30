import {rmSync, mkdirSync} from 'fs';
import {join} from 'path';
import {writeFile, mkdir} from 'fs/promises';

import {dist} from '../paths.js';
import {generateViviEmbedsForApp} from '../vivi/embed.js';
import {generateStaticIncludesForApp} from './static-includes/index.js';
import {generateStaticIncludeEmbedsForVivi} from '../vivi/static-include-embed.js';
import {generateStaticPagesForApp} from './pages/index.js';
import {getAppNames} from '../utils/starterkit.js';

function chunkArray(array) {
  const chunkSize = 500;
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

async function writeFiles(files, fileNameKey, writeParameterDefinition) {
  // write files in batches to avoid 'too many open files' error
  const fileBatches = chunkArray(files);
  for (const batch of fileBatches) {
    const promises = batch.map(async (file) => {
      await mkdir(file.localPath, {recursive: true});
      writeFile(join(file.localPath, file[fileNameKey]), file.contentString);
      if (writeParameterDefinition && file.parameterString)
        writeFile(
          join(file.localPath, `${file[fileNameKey]}.parameter_definition.py`),
          file.parameterString,
        );
    });
    await Promise.all(promises);
  }
}

async function startPipeline({app, pages}) {
  let viviEmbeds;

  if (app.viviEmbeds) {
    viviEmbeds = await generateViviEmbedsForApp(app);
  } else if (app.staticIncludes && app.staticIncludes.viviEmbedName) {
    // static embeds use worker threads writing the files directly
    // due to the large number of possible files
    await generateStaticIncludesForApp(app);
    viviEmbeds = await generateStaticIncludeEmbedsForVivi(app);
  }

  if (pages) {
    // pages use worker threads writing the files directly
    // due to the large number of possible files
    await generateStaticPagesForApp({app, pages});
  }

  return {name: app.appName, viviEmbeds};
}

function deploy({responses}) {
  responses.forEach(async (r) => {
    if (r.viviEmbeds) {
      writeFiles(r.viviEmbeds, 'viviName', true);
    }
  });
}

async function go({appNames}) {
  rmSync(join(dist, 'static-html'), {recursive: true, force: true});
  rmSync(join(dist, 'vivi'), {recursive: true, force: true});
  mkdirSync(join(dist, 'static-html'));

  const pipelines = appNames.map(async (appName) => {
    const appModule = await import(join(dist, 'node', `${appName}.mjs`));
    return startPipeline({app: appModule.default, pages: appModule.pages});
  });

  const responses = await Promise.all(pipelines);
  deploy({responses});
}

go({appNames: getAppNames()});
