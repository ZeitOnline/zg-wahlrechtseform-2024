import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import fse from 'fs-extra';
import {fileURLToPath} from 'url';
const {emitWarning} = process;

import adaptHtml from './lib/html.js';

// deactivate experimental warning
process.emitWarning = (warning, ...args) => {
  if (args[0] === 'ExperimentalWarning') {
    return;
  }

  if (
    args[0] &&
    typeof args[0] === 'object' &&
    args[0].type === 'ExperimentalWarning'
  ) {
    return;
  }

  return emitWarning(warning, ...args);
};

import settings from '../../../src/__starterkit_config.json' assert {type: 'json'};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const configs = {
  default: {
    addDataSource: false,
    eagerLoad: false,
  },
  1: {
    addDataSource: false,
    eagerLoad: false,
  },
  2: {
    addDataSource: true,
    eagerLoad: false,
  },
  '3+': {
    addDataSource: true,
    eagerLoad: true,
  },
};

const run = (project, options) => {
  // throw error if no project is given
  if (!project) {
    console.error(
      chalk.red(
        'No project given. Please provide a project as first argument.',
      ),
    );
    process.exit(1);
  }

  // get name of .ai file
  const aiFile = fs
    .readdirSync(path.join(__dirname, `../../illustrator/${project}`))
    .find((file) => file.endsWith('.ai'));
  const aiFileName = aiFile.replace('.ai', '');

  // get current timestamp
  const timestamp = new Date().toISOString().replaceAll(/[-:T.Z]/g, '');

  ///////////////////////////////
  // 1. ADAPT HTML FOR PEMBED  //
  ///////////////////////////////

  // load html file
  let html = fs.readFileSync(
    path.join(
      __dirname,
      `../../illustrator/${project}/ai2html-output/${aiFileName}.html`,
    ),
    'utf8',
  );

  html = adaptHtml({
    html,
    project,
    aiFileName,
    timestamp,
    deploymentPath: settings.deploymentPath,
    ...(configs?.[options?.scrollytellingPosition] || configs.default),
  });

  //////////////////////////////////////////////////////////
  // 2. EXPORT IMAGES TO PUBLIC AND HTML TO STATIC FOLDER //
  //////////////////////////////////////////////////////////

  // create folder for project in src/public/illustrator
  if (
    !fs.existsSync(
      path.join(__dirname, `../../src/public/illustrator/${project}`),
    )
  ) {
    fs.mkdirSync(
      path.join(__dirname, `../../src/public/illustrator/${project}`),
      {
        recursive: true,
      },
    );
  }
  // create folder for project in src/static/illustrator
  if (
    !fs.existsSync(
      path.join(__dirname, `../../src/static/illustrator/${project}`),
    )
  ) {
    fs.mkdirSync(
      path.join(__dirname, `../../src/static/illustrator/${project}`),
      {
        recursive: true,
      },
    );
  }

  // remove old image files
  const oldSvgFiles = fs
    .readdirSync(
      path.join(__dirname, `../../src/public/illustrator/${project}`),
    )
    .filter(
      (f) => f.endsWith('.svg') || f.endsWith('.jpg') || f.endsWith('.png'),
    );
  oldSvgFiles.forEach((file) => {
    fs.unlinkSync(
      path.join(__dirname, `../../src/public/illustrator/${project}/${file}`),
    );
  });

  // copy images to public folder
  const svgFiles = fs
    .readdirSync(
      path.join(__dirname, `../../illustrator/${project}/ai2html-output`),
    )
    .filter(
      (f) => f.endsWith('.svg') || f.endsWith('.jpg') || f.endsWith('.png'),
    );

  svgFiles.forEach((file) => {
    fs.copyFileSync(
      path.join(
        __dirname,
        `../../illustrator/${project}/ai2html-output/${file}`,
      ),
      path.join(
        __dirname,
        `../../src/public/illustrator/${project}/${file.replace(
          /.svg|.jpg|.png/,
          '',
        )}-${timestamp}${file.match(/.svg|.jpg|.png/)[0]}`,
      ),
    );
  });

  // write html file
  fs.writeFileSync(
    path.join(
      __dirname,
      `../../src/static/illustrator/${project}/${aiFileName}.html`,
    ),
    html,
    'utf8',
  );

  //////////////////////
  // 3. CREATE PEMBED //
  //////////////////////

  if (!fs.existsSync(path.join(__dirname, `../../src/apps/${project}`))) {
    fs.mkdirSync(path.join(__dirname, `../../src/apps/${project}`));
  }
  fse.copySync(
    path.join(__dirname, '../../starterkit/app-templates/illustrator'),
    path.join(__dirname, `../../src/apps/${project}`),
  );

  // add project name to index.jsx
  const indexJsx = fs
    .readFileSync(path.join(__dirname, `../../src/apps/${project}/index.jsx`))
    .toString();
  fs.writeFileSync(
    path.join(__dirname, `../../src/apps/${project}/index.jsx`),
    indexJsx.replace('PROJECT', project),
    'utf8',
  );

  // add project and root name to /App/index.jsx
  const appIndexJsx = fs
    .readFileSync(
      path.join(__dirname, `../../src/apps/${project}/App/index.jsx`),
    )
    .toString();
  fs.writeFileSync(
    path.join(__dirname, `../../src/apps/${project}/App/index.jsx`),
    appIndexJsx.replace('PROJECT', project).replace('ROOT', aiFileName),
    'utf8',
  );
};

export default run;
