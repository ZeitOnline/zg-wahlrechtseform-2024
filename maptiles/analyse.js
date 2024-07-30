import fs from 'fs';
import path, {dirname} from 'path';
import * as d3Array from 'd3-array';
import {hashElement} from 'folder-hash';
import {fileURLToPath} from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const isDirectory = (dirPath) =>
  fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();

const PROJECTS_PATH = path.resolve(__dirname, 'projects');
const OUTPUT_PATH = path.resolve(__dirname, '..', 'src', 'maptiles');

const PROJECTS = fs
  .readdirSync(PROJECTS_PATH)
  .filter((dir) => isDirectory(path.resolve(PROJECTS_PATH, dir)));

const VALUE_FIELD = 'value';
const COLOR_FIELD = 'color';

(async () => {
  for (let projectName of PROJECTS) {
    await handleProject(projectName);
  }
})();

async function handleProject(projectName) {
  const outputLocation = path.resolve(OUTPUT_PATH, projectName);
  const projectLocation = path.resolve(PROJECTS_PATH, projectName);
  const configLocation = path.resolve(OUTPUT_PATH, `${projectName}.json`);
  const metadataLocation = path.resolve(outputLocation, 'metadata.json');
  const dataPath = path.resolve(PROJECTS_PATH, projectName, 'data.geojson');
  const data = JSON.parse(fs.readFileSync(dataPath).toString());
  const metadata = JSON.parse(fs.readFileSync(metadataLocation).toString());
  console.log(metadata);

  let min = Number.MAX_VALUE;
  let max = -Number.MAX_VALUE;
  let colors = [];

  data.features.forEach((feat) => {
    const value = feat.properties[VALUE_FIELD];
    const color = feat.properties[COLOR_FIELD];

    if (value > max) {
      max = value;
    }

    if (value < min) {
      min = value;
    }

    if (!colors.includes(color)) {
      colors.push(color);
    }
  });

  colors = colors
    .map((color) => {
      const feats = data.features.filter(
        (feat) => feat.properties[COLOR_FIELD] === color,
      );
      const minmax = d3Array.extent(
        feats,
        (feat) => feat.properties[VALUE_FIELD],
      );

      return {
        color,
        minmax,
      };
    })
    .sort((a, b) => a.minmax[0] - b.minmax[0]);

  metadata.bounds = metadata.bounds.split(',').map((coord) => +coord);
  metadata.center = metadata.center.split(',').map((coord) => +coord);
  metadata.min = min;
  metadata.max = max;
  metadata.colors = colors;
  // remove things that might affect the hashing
  delete metadata.description;
  delete metadata.generator;
  delete metadata.generator_options;

  fs.writeFileSync(metadataLocation, JSON.stringify(metadata), (err) => {
    if (err) {
      throw err;
    }
  });

  // generate hash to enable caching when hosted on our servers
  const projectHash = await hashElement(projectLocation, {
    encoding: 'hex',
  });

  const hashedFolderName = `${projectName}.${projectHash.hash}`;

  fs.writeFileSync(
    configLocation,
    JSON.stringify({
      path: `zon-tiles://${hashedFolderName}`,
      min,
      max,
      colors,
      bounds: metadata.bounds,
      center: metadata.center,
    }),
    (err) => {
      if (err) {
        throw err;
      }
    },
  );

  // rimraf.sync(path.resolve(basePath));
  fs.renameSync(
    path.resolve(OUTPUT_PATH, projectName),
    path.resolve(OUTPUT_PATH, hashedFolderName),
  );

  console.log(projectHash.hash);
}
