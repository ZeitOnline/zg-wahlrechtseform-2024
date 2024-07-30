import {mkdir, writeFile, readdir, rm, stat} from 'fs/promises';
import {readdirSync} from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import chalk from 'chalk';
import crypto from 'crypto'; //
import ffmpegStatic from 'ffmpeg-static';
import ffmpegLib from 'fluent-ffmpeg';
import gm from 'gm';
ffmpegLib.setFfmpegPath(ffmpegStatic);
const green = (...args) => console.log(chalk.hex('#1CDE7E')(...args));
const red = (...args) => console.log(chalk.hex('#F54A2B')(...args));

/** Hier Auflösung ändern falls gewünscht */
const outputResolutions = [
  {device: 'mobile', width: 400, height: 800},
  {device: 'desktop', width: 1920, height: 1080},
];

/** Hier Webp-Kompressionslevels ändern falls gewünscht */
const outputQualities = [
  {subDir: 'high', percent: 70},
  {subDir: 'low', percent: 30},
];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectDir = path.join(__dirname, '..', '..');
const sourceDir = path.join(projectDir, 'videos');
const destinationDir = path.join(projectDir, 'src', 'public', 'videostills');

// eslint does not know about top level await, but it works
const inputVideoFiles = await Promise.all(
  readdirSync(sourceDir)
    .filter((fileName) => fileName.match(/\.(mp4|m4v|avi|mov)/))
    .map(async (fileName) => {
      const id = slugify(fileName.replace(/\..*?$/, ''));
      const metadata = await ffprobe(path.join(sourceDir, fileName));
      return {
        fileName,
        id,
        frameRate: +metadata['r_frame_rate'].replace(/\/1$/, ''),
        padLength: `${metadata['nb_frames']}`.length,
        hash: [id, crypto.randomUUID()].join('-'),
      };
    }),
);

main();

async function main() {
  const folderStructure = await createFolderStructure();
  await convertVideosToStills(folderStructure);
  await cropAllMobileJpgs();
  await convertJpgsToWebP();
  green('🥳 all done, copy these to your config:');
  const result = await generateResults(folderStructure);
  console.log(result.imports);
  console.log(JSON.stringify(result.config, null, 2));
}

async function createFolderStructure() {
  // create an object to return with full path strings for all subfolders
  const folderStructure = {};

  if (process.argv.includes('--delete-existing')) {
    await emptyDir(destinationDir);
    console.log('Deleted old image files');
  }

  for await (const {id, hash} of inputVideoFiles) {
    const videoDir = path.resolve(path.join(destinationDir, hash));
    // create folder with hash and meta.json with folder name in it
    await writeFile(
      path.join(destinationDir, `${id}.json`),
      JSON.stringify({folder: `videostills/${hash}`}),
    );
    folderStructure[id] = {};
    for await (const {device} of outputResolutions) {
      const deviceDir = path.resolve(videoDir, device);
      folderStructure[id][device] = {};
      // create folders for all devices and qualities plus one called raw for jpgs
      await Promise.all(
        [...outputQualities.map((d) => d.subDir), 'raw'].map(
          async (quality) => {
            const qualityDir = path.resolve(path.join(deviceDir, quality));
            await mkdir(qualityDir, {recursive: true});
            folderStructure[id][device][quality] = qualityDir;
          },
        ),
      );
    }
  }
  console.log('Created folder structure');
  return folderStructure;
}

async function convertVideosToStills(folderStructure) {
  for await (const {
    fileName,
    id,
    frameRate = 25,
    padLength = 4,
  } of inputVideoFiles) {
    for await (const {device, width, height} of outputResolutions) {
      try {
        await ffmpeg({
          input: path.join(sourceDir, fileName),
          output: path.join(
            folderStructure[id][device].raw,
            `frame-%0${padLength}d.jpg`,
          ),
          size: device === 'desktop' ? `${width}x?` : `?x${height}`,
          outputOptions: [`-r ${frameRate}`, `-qscale:v 2`],
        });
        console.log(`Stills stored for video id ${id} and device ${device}`);
      } catch (e) {
        red(e);
      }
    }
  }
}

async function cropAllMobileJpgs() {
  for await (const {id, hash} of inputVideoFiles) {
    const dir = path.join(destinationDir, hash, 'mobile', 'raw');
    await Promise.all(
      readdirSync(dir).map((fileName) => {
        return cropMobileImage(path.join(dir, fileName));
      }),
    ).catch((e) => void red(e));
    console.log(`Cropped mobile images for id ${id}`);
  }
}

async function convertJpgsToWebP() {
  for await (const {id, hash} of inputVideoFiles) {
    for await (const {device} of outputResolutions) {
      for await (const {subDir, percent} of outputQualities) {
        const inputDir = path.join(destinationDir, hash, device, 'raw');
        await Promise.all(
          readdirSync(inputDir).map((fileName) => {
            const inputFilePath = path.join(inputDir, fileName);
            const outputFilePath = path.join(
              path.join(destinationDir, hash, device, subDir),
              path.basename(inputFilePath, '.jpg') + '.webp',
            );
            return saveAsWebP(inputFilePath, outputFilePath, percent);
          }),
        );
        const resultsSize = await dirSize(
          path.join(destinationDir, hash, device, subDir),
        );
        console.log(
          `Converted video id ${id} to webp for device ${device} and quality ${subDir} (${
            (resultsSize / 1024 / 1024).toFixed(2) + 'MB'
          })`,
        );
      }
    }
  }
}

async function generateResults(folderStructure) {
  let imports = '';
  const config = await Promise.all(
    inputVideoFiles.map(async ({id, frameRate, padLength}) => {
      const files = await readdir(folderStructure[id].mobile.low);
      imports += `import ${id}Meta from 'src/public/videostills/${id}.json';\n`;
      return {
        identifier: id,
        meta: `${id}Meta`,
        nFrames: files.length,
        frameRate,
        padLength,
        dimensions: outputResolutions.reduce((a, c) => {
          a[c.device] = {width: c.width, height: c.height};
          return a;
        }, {}),
        annotations: null,
        setup: null,
        debug: null,
      };
    }),
  );
  return {imports, config};
}

async function ffmpeg({
  input,
  inputOptions = [],
  size,
  output,
  outputOptions = [],
}) {
  return new Promise((resolve, reject) => {
    ffmpegLib()
      .input(input)
      .inputOptions(inputOptions)
      .size(size)
      .outputOptions(outputOptions)
      .saveToFile(output)
      .on('end', () => void resolve(true))
      .on('error', (e) => void reject(e));
  });
}

async function ffprobe(pathToFile) {
  return new Promise((resolve, reject) => {
    ffmpegLib.ffprobe(pathToFile, (err, metadata) => {
      if (err) reject(err);
      else resolve(metadata.streams[0]);
    });
  });
}

async function saveAsWebP(inputFilePath, outputFilePath, quality) {
  return new Promise((resolve, reject) => {
    gm(inputFilePath)
      .quality(quality)
      .toBuffer('webp', async function (err, buffer) {
        if (err) {
          reject(err);
        } else {
          await writeFile(outputFilePath, buffer);
          resolve(true);
        }
      });
  });
}

async function cropMobileImage(filePath) {
  const {width, height} = outputResolutions.find((d) => d.device === 'mobile');
  return new Promise((resolve, reject) => {
    gm(filePath)
      .gravity('Center')
      .crop(width, height)
      .write(filePath, function (err) {
        if (err) reject(err);
        resolve(true);
      });
  });
}

async function emptyDir(dir) {
  let items;
  try {
    items = await readdir(dir);
  } catch {
    return mkdir(dir);
  }
  return Promise.all(
    items.map((item) =>
      rm(path.join(dir, item), {recursive: true, force: true}),
    ),
  );
}

async function dirSize(directory) {
  const files = await readdir(directory);
  const stats = files.map((file) => stat(path.join(directory, file)));

  return (await Promise.all(stats)).reduce(
    (accumulator, {size}) => accumulator + size,
    0,
  );
}

function slugify(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '')
    .replace(/\s+/g, '_');
}
