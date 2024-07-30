import chalk from 'chalk';

export const chalkGreen = chalk.hex('#7FB667');
export const chalkBlue = chalk.hex('#1DB3C0');
export const chalkRed = chalk.hex('#F54A2B');

export function log(msg, topic = 'starterkit') {
  console.log(chalkBlue(topic), chalkGreen(msg));
}
