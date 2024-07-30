import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({path: `~/.duv/config.env`});
dotenv.config({path: `.env.shared`});

const dirs = {
  data: path.join(new URL('../', import.meta.url).pathname, 'data'),
  onedrive: path.join(
    process.env.ONEDRIVE_PATH,
    process.env.ONEDRIVE_SUBFOLDER,
  ),
};

// Function to list files and folders
const listFilesAndFolders = (dataDir) => {
  // check if the path is a directory and exists
  try {
    fs.statSync(dataDir).isDirectory();
  } catch (err) {
    console.log(`${dataDir} does not exist`);
    return false;
  }
  const items = fs.readdirSync(dataDir);
  const markdownTable = [['Datei', 'Inhalt', 'Quelle']];

  items
    .filter((item) => !item.match(/^[.~]/))
    .sort((a, b) => a.localeCompare(b))
    .forEach((item) => {
      markdownTable.push([item]);
    });

  return markdownTable;
};

// Function to convert array to markdown table
const toMarkdownTable = (
  tableArray,
  withTableHead = false,
  withLinks = false,
) => {
  const header = tableArray[0].join(' | ');
  const separator = tableArray[0].map(() => '---').join(' | ');
  const rows = tableArray
    .slice(1)
    .map((d) => {
      if (withLinks)
        d[0] = [`[${d[0]}](./analysis/data/${encodeURIComponent(d[0])})`];
      return d;
    })
    .map((row) => row.join(' | '));
  const tableHead = withTableHead ? `| ${header} |\n| ${separator} |\n` : '';
  return `${tableHead}| ${rows.join(' | … | … |\n| ')} | … | … |`;
};

// Main function to generate markdown table and copy to clipboard
const generateAndCopyMarkdown = ({data, onedrive}) => {
  const dataTable = listFilesAndFolders(data);
  const onedriveTable = listFilesAndFolders(onedrive);
  console.log('Kopier das in deine Readme:\n');
  console.log(toMarkdownTable(dataTable, true));
  onedriveTable && console.log('| **Onedrive** |||');
  onedriveTable && console.log(toMarkdownTable(onedriveTable));
};

// Call the function with your folder path
generateAndCopyMarkdown(dirs);
