import {Command} from 'commander';
import run from './run.js';

const program = new Command();

program
  .name('html2pembed')
  .description(
    'convert ai2html output to pembed. To use the options via npm run, prepend them with --, e.g.: "npm run html2pembed <project> -- --eager-load".',
  )
  .argument('<project>', 'project name')
  .option(
    '-sp, --scrollytelling-position <scrollytelling>',
    'Pembed should be used inside a scrollytelling. Provide position (first, second or following) via following values: 1, 2, 3+',
    '1',
  )
  .action(run);

program.parse(process.argv);
