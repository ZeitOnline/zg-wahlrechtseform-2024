import express from 'express';
import {join} from 'path';
import {existsSync} from 'fs';
import {writeFile, readFile, mkdir, unlink} from 'fs/promises';
import {copy} from 'fs-extra';
import {merge} from 'lodash-es';
import chalk from 'chalk';

import {getAppNames, getAppTemplates} from '../utils/starterkit.js';
import {src, root, appTemplates as appTemplatesPath} from '../paths.js';
import {replaceStringInDir} from './utils.js';

const chalkRed = chalk.hex('#F54A2B');
const wizardRouter = express.Router();

const starterkitConfigPath = join(src, '__starterkit_config.json');

function createResponse({data = null, success, error}) {
  let successful = !!success || !!data;
  return JSON.stringify({
    data,
    success: successful,
    error: !successful || error,
  });
}

wizardRouter.get('/', (req, res) => {
  res.end('wizard');
});
wizardRouter.get('/app-templates', async (req, res) => {
  const appTemplates = getAppTemplates();
  res.end(createResponse({data: appTemplates}));
});
wizardRouter.get('/apps', async (req, res) => {
  const appNames = getAppNames({all: true});
  res.end(createResponse({data: appNames}));
});
wizardRouter.post('/apps', async (req, res) => {
  const appNames = getAppNames({all: true});
  const appTemplates = getAppTemplates();
  const {name, template, inputValues} = req.body;

  if (appNames.includes(name)) {
    return res.end(createResponse({error: 'Name existiert bereits'}));
  }

  const targetDir = join(src, 'apps', name);
  const templateDir = join(appTemplatesPath, template);
  await mkdir(targetDir);
  await copy(templateDir, targetDir, {
    filter: (src) => !src.includes('dirs-to-copy-into-root'),
  });
  await unlink(join(targetDir, 'template-config.json'));

  // copy public dir from app template
  if (existsSync(join(templateDir, 'dirs-to-copy-into-root'))) {
    await copy(join(templateDir, 'dirs-to-copy-into-root'), root);
  }
  // Wenn es einen projectId gibt, dann ersetzen wir alle <%projectId%> Vorkommen
  const hasProjectId = appTemplates
    .find((d) => d.id === template)
    ?.config?.inputs?.some((d) => d.name === 'projectId');

  if (hasProjectId) {
    if (inputValues.projectId) {
      console.log(
        `will replace <%projectId%> with ${inputValues.projectId} in all files in ${name}`,
      );
      await replaceStringInDir(
        targetDir,
        '<%projectId%>',
        inputValues.projectId,
      );
    } else {
      console.log(chalkRed('projectId is missing in inputValues'));
    }
  }

  res.end(createResponse({data: getAppNames({all: true})}));
});
wizardRouter.get('/starterkit-config', async (req, res) => {
  const oldConfig = JSON.parse(await readFile(starterkitConfigPath, 'utf8'));
  res.end(JSON.stringify(oldConfig));
});
wizardRouter.patch('/starterkit-config', async (req, res) => {
  const configChanges = req.body;
  const oldConfig = JSON.parse(await readFile(starterkitConfigPath, 'utf8'));
  const newConfig = merge(oldConfig, configChanges);
  await writeFile(starterkitConfigPath, JSON.stringify(newConfig));
  res.end(createResponse({data: newConfig}));
});

export default wizardRouter;
