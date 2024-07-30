// import the required modules
import fs from 'fs/promises';
import {existsSync} from 'fs';
import path from 'path';
import {glob} from 'glob';

const rootDir = new URL('../../', import.meta.url);
const docsDir = path.join(rootDir.pathname, 'docs');
const storiesDir = path.join(rootDir.pathname, 'stories');

// if storiesDir does not exist, create it
if (!existsSync(storiesDir)) {
  await fs.mkdir(storiesDir);
}

const getFileContent = (filePath) => {
  const relativePath = filePath.replace(docsDir, '../docs');
  const subFolder = path.dirname(relativePath).split('/').pop();
  const fileName = path.basename(filePath, '.md');

  return `import ReadMe from '${relativePath}?raw';

import {Meta, Markdown} from '@storybook/blocks';

<Meta
  title="${nicelyFormat(subFolder)}/${nicelyFormat(fileName)}"
  parameters={{previewTabs: {canvas: {hidden: true}}}}
/>

<Markdown>{ReadMe}</Markdown>`;
};

// Function to create *.mdx files with the path as content
async function createStoriesFiles(mdFiles) {
  for (const filePath of mdFiles) {
    const fileName = path.basename(filePath, '.md');
    const newFilePath = path.join(storiesDir, `${fileName}.mdx`);
    await fs.writeFile(newFilePath, getFileContent(filePath));
  }
}

// Main execution function
async function main() {
  try {
    // console.log(`Creating stories for all md files in ${docsDir}/...`);
    // empty stories folder
    await fs.rm(storiesDir, {recursive: true});
    await fs.mkdir(storiesDir, {recursive: true});
    const mdFiles = await glob(`${docsDir}/**/*.md`);
    await createStoriesFiles(mdFiles);
    console.log(
      `Successfully created ${mdFiles.length} stories files from docs/**/*.md…`,
    );
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

// Execute the main function
main();

function nicelyFormat(input) {
  input = input.charAt(0).toUpperCase() + input.slice(1);
  return (
    input
      // Replace all non word Characters with spaces
      .replaceAll(/\W/gi, ' ')
      // and convert camelcase to separate words with capital letters
      .replaceAll(/([a-z])([A-Z])/g, '$1 $2')
      // and ae/oe/ue to ä/ö/ü
      .replaceAll(/ae/g, 'ä')
      .replaceAll(/oe/g, 'ö')
      .replaceAll(/ue/g, 'ü')
      .replaceAll(/Ae/g, 'Ä')
      .replaceAll(/Oe/g, 'Ö')
      .replaceAll(/Ue/g, 'Ü')
      .replaceAll(/sz/g, 'ß')
  );
}
