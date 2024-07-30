import {getManifest} from '../../utils/manifest-utils.js';
import {readFile, writeFile} from 'fs/promises';
import fs from 'fs';
import {log} from '../../utils/logging.js';
import {getRecord} from './postcss-plugin-track-var.js';
import path from 'path';
import crypto from 'node:crypto';

function checksumFile(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('shake256', {outputLength: 4});
    const stream = fs.createReadStream(filePath);
    stream.on('error', (err) => reject(err));
    stream.on('data', (chunk) => hash.update(chunk));
    stream.on('end', () => resolve(hash.digest('hex')));
  });
}

function renameFile(oldPath, newPath) {
  return new Promise((resolve, reject) => {
    fs.rename(oldPath, newPath, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

function replaceInFiles(dirPath, replaceMap) {
  const validFileTypes = ['.js', '.jsx', '.mjs', '.css', '.html', '.json'];

  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      replaceInFiles(filePath, replaceMap);
    } else if (stat.isFile()) {
      const hasFileEnding = filePath.split('/').slice(-1)[0].includes('.');
      if (
        !validFileTypes.some((fileType) => filePath.endsWith(fileType)) &&
        hasFileEnding
      )
        return;
      let content = fs.readFileSync(filePath, 'utf8');

      Object.entries(replaceMap).forEach(([oldString, newString]) => {
        content = content.replace(new RegExp(oldString, 'g'), newString);
      });

      fs.writeFileSync(filePath, content, 'utf8');
    }
  });
}

function removeCssVar({records}) {
  let config;
  return {
    name: 'remove-css-var',
    apply(config, {command}) {
      // apply only on client build
      return command === 'build' && !config.build.ssr;
    },
    configResolved(resolvedConfig) {
      // store the resolved config
      config = resolvedConfig;
    },
    // runs after rollup is basically done with everything
    async writeBundle() {
      const manifest = getManifest('client');

      const propagateUse = (variable, ignoreList = new Set()) => {
        const record = getRecord(records, variable);
        record.uses++;
        ignoreList.add(variable);

        if (record.dependencies)
          for (const dependency of record.dependencies) {
            if (!ignoreList.has(dependency))
              propagateUse(dependency, ignoreList);
          }
      };

      // walk dependency graph to propagate uses
      for (const [variable, {uses, dependencies}] of records) {
        if (!uses || !dependencies) continue;
        for (const dependency of dependencies) {
          propagateUse(dependency, new Set([variable]));
        }
      }

      // get all css vars that are used
      const varsToKeep = new Set(
        Array.from(records)
          .filter(([, {uses}]) => uses > 0)
          .map(([variable]) => variable),
      );

      // get all css files
      const cssFiles = [
        ...new Set(
          Object.values(manifest)
            .filter((d) => d.file?.includes('.css') || d.css?.length)
            .map((d) => (d.file?.includes('.css') ? d.file : d.css))
            .flat(),
        ),
      ];

      let numberOfRemovedVars = 0;

      // remove all css vars that are not in varsToKeep
      const promises = cssFiles.map(async (cssFile) => {
        const filePath = config.build.outDir + '/' + cssFile;
        const cssContent = (await readFile(filePath)).toString();
        const cssContentWithoutVars = cssContent.replace(
          /(?<!var\()--[A-Za-z0-9-]+?: .*?(;|})/g,
          (match) => {
            const varName = match.split(':')[0];
            if (varsToKeep.has(varName)) {
              return match;
            }
            numberOfRemovedVars++;
            return match.endsWith('}') ? '}' : '';
          },
        );
        writeFile(filePath, cssContentWithoutVars);
      });

      await Promise.all(promises);

      // create new hashes for css files and create an object to track renaming
      const cssFileRenaming = {};
      for (const cssFile of cssFiles) {
        const fileName = cssFile.split('.')[0];

        const oldFilePath = config.build.outDir + '/' + cssFile;
        const newHash = await checksumFile(oldFilePath);

        const newFileName = fileName + '.' + newHash + '.css';
        cssFileRenaming[cssFile] = newFileName;
      }

      // replace old css file names with new ones in all files
      replaceInFiles(path.join(config.build.outDir, '..'), cssFileRenaming);

      Object.entries(cssFileRenaming).forEach(([oldFileName, newFileName]) => {
        const oldFilePath = config.build.outDir + '/' + oldFileName;
        const newFilePath = config.build.outDir + '/' + newFileName;
        renameFile(oldFilePath, newFilePath);
      });

      if (numberOfRemovedVars > 0)
        log(
          `Removed ${numberOfRemovedVars} unused css variables. Keep in mind dynamic css var usages in JSX may not be tracked (e.g. <div style={{background: var(\`--duv-color-party-\${partyId}\`)}} />). Make sure to use such variables elsewhere in your css.`,
        );
    },
  };
}

export default removeCssVar;
