import {join, resolve} from 'path';
import {existsSync} from 'fs';
import {networkInterfaces, homedir} from 'os';
import chalk from 'chalk';

import {src, wizard, appTemplates} from '../paths.js';
import {readFile, readdir, stat, writeFile} from 'fs/promises';

export function isSSRBuild() {
  return !!process.env.SSRBUILD;
}
export function isStaging() {
  return !!process.env.STAGING;
}

export function isProduction() {
  return process.env?.NODE_ENV === 'production';
}

export function getClientScriptTagForUrl(url) {
  const {appPath} = getParamsForUrl(url);

  return `<script type="module" src="/${appPath}"></script>`;
}

export function getPageForUrl(url) {
  let {appName, page, isWizard, isAppTemplate} = getParamsForUrl(url);
  let relativePath = join('apps', appName, 'pages', page);
  if (isWizard) {
    return join(wizard, 'pages', page);
  } else if (isAppTemplate) {
    return join(appTemplates, appName, 'pages', page);
  }
  return join(src, relativePath);
}

export function getParamsForUrl(url) {
  let appName = 'index';
  let page = 'index.jsx';
  let id;
  let isAppTemplate = url.startsWith('/app-templates');
  let isWizard = url.startsWith('/wizard');

  let appPath = url.substring(1); // remove first / from url
  if (isAppTemplate) {
    appPath = appPath.replace('app-templates/', '');
  }

  if (appPath.length) {
    const pathParts = appPath.split('/');
    appName = pathParts[0];

    if (appName.includes(':')) {
      // check if an id has been passed e.g. /gemeinden:1001
      const appNameParts = appName.split(':');
      appName = appNameParts[0];
      id = appNameParts[1];
    }

    if (pathParts.length > 1) {
      page = pathParts.slice(-1)[0].replace(/\..*/, ''); // remove if there is a file ending

      if (!page.length) {
        page = 'index';
      }
      page = `${page}.jsx`;
    }
  }

  appPath = `src/apps/${appName}/index.jsx`;
  let appPathAbsolute = join(src, `apps/${appName}/index.jsx`);
  if (isWizard) {
    isWizard = true;
    appPathAbsolute = join(wizard, `index.jsx`);
    appPath = join('starterkit', 'wizard', 'index.jsx');
  } else if (isAppTemplate) {
    appPathAbsolute = join(appTemplates, appName, `index.jsx`);
    appPath = join('starterkit', 'app-templates', appName, 'index.jsx');
  }
  const hasEntry = existsSync(appPathAbsolute);

  return {
    appName,
    page,
    appPath,
    appPathAbsolute,
    id,
    hasEntry,
    isAppTemplate,
    isWizard,
  };
}

export function getPublicPath(deploymentPath) {
  const server = 'https://interactive.zeit.de/g';

  let publicPath = '/';
  if (isProduction()) {
    if (isStaging()) {
      publicPath = `${server}/staging/${deploymentPath}/static/`;
    } else {
      publicPath = `${server}/${deploymentPath}/static/`;
    }
  }
  return publicPath;
}

export async function getLocalIPs(args = {}) {
  const defaultArgs = {debug: false, nipIo: false};
  const {debug, nipIo} = {...defaultArgs, ...args};

  const ifaces = await networkInterfaces();

  const ips = Object.values(ifaces)
    .flat()
    .filter((value) => {
      if (debug) {
        return true;
      }
      return value.family === 'IPv4' && value.internal === false;
    })
    .map((value) => {
      if (nipIo) {
        return `${value.address}.nip.io`;
      }

      return value.address;
    });

  return ips;
}

export async function replaceStringInDir(dirPath, searchStr, replaceStr) {
  try {
    const files = await readdir(dirPath);
    for (const file of files) {
      const filePath = join(dirPath, file);
      const stats = await stat(filePath);
      if (stats.isDirectory()) {
        await replaceStringInDir(filePath, searchStr, replaceStr);
      } else {
        const data = await readFile(filePath, 'utf8');
        const result = data.replace(new RegExp(searchStr, 'g'), replaceStr);
        await writeFile(filePath, result, 'utf8');
      }
    }
  } catch (err) {
    console.log(err);
  }
}

export function getPathToEnvFile() {
  return resolve(homedir(), '.duv/config.env');
}

export function envFileNotice() {
  const envPath = getPathToEnvFile();
  if (!existsSync(envPath)) {
    console.info(`

💡💡💡💡💡💡💡💡
💡 ${chalk.white.bgBlue.bold('Wusstest du schon?')}
💡
💡 Du kannst eine Datei ~/.duv/config.env erstellen, um das Verhalten des Starterkits zu konfigurieren.
💡
💡 Beispiel-Inhalt:
💡
💡 STARTERKIT_OPEN_IN_BROWSER=false # öffnet den Browser beim Starten des Servers
💡 STARTERKIT_BROWSER="chrome" # siehe https://github.com/sindresorhus/open#readme
💡💡💡💡💡💡💡💡
`);
  }
}
