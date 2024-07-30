import path from 'path';
import chalk from 'chalk';
import {readFileSync} from 'fs';
import starterkitConfig from '../../src/__starterkit_config.json' assert {type: 'json'};
import * as dotenv from 'dotenv';
import clipboardy from 'clipboardy';
dotenv.config();
const green = (...args) => console.log(chalk.hex('#1CDE7E')(...args));
const red = (...args) => console.log(chalk.hex('#F54A2B')(...args));

const friedbertUrl = process.env.FRIEDBERT_URL;
const appName = process.argv[2] || 'index';
const appsDir = new URL('../../src/apps', import.meta.url);
const inputFile = path.join(appsDir.pathname, appName, 'pages', 'index.jsx');
const content = readFileSync(inputFile, 'utf-8');

const templateContentMatch = content.match(
  /<[a-z]+Template[^>]*>([\s\S]*?)<\/[a-z]+Template>/i,
);
if (templateContentMatch) {
  const templateContent = templateContentMatch[1].replace(/\s+/g, ' ');
  const jsxElementPattern =
    /<([^/>]+)([\s\w"'=-]*)\/>|<([^>]+)([\s\w"=-]*)>([\s\S]*?)<\/\3>/gi;
  const jsxElements = [...templateContent.matchAll(jsxElementPattern)]
    .map((match) => {
      const isSelfClosing = !!match[1];
      const text = match[0];
      const tagName = match[0].match(/<([a-z0-9]+)/i)?.[1];
      const attributesString = (isSelfClosing ? match[1] : match[4])
        ?.replace(tagName, '')
        .trim();
      const attributes = [
        ...attributesString.matchAll(/(\w+)=["']([^"']*)["']/g),
      ].reduce((acc, match) => {
        const [, name, value] = match;
        acc.push({name, value});
        return acc;
      }, []);
      const children = match[5]?.trim();
      return {
        text,
        tagName,
        attributes,
        children,
      };
    })
    .filter(Boolean);

  const result = jsxElements.map(({tagName, attributes, children, text}) => {
    switch (tagName.toLowerCase()) {
      case 'viviembed':
        const name = attributes.find(({name}) => name === 'name')?.value;
        return [
          '<rawtext>',
          `  <text_reference type="intern" href="http://xml.zeit.de/administratives/embeds/${starterkitConfig.deploymentPath}/${name}" publication-date="" expires="" />`,
          ...attributes
            .filter(({name}) => name !== 'name')
            .map(({name, value}) => `  <param id="${name}">${value}</param>`),
          '</rawtext>',
        ];
      case 'loremipsum':
        return [
          '<p>',
          `Lorem ipsum dolor sit amet, consectetur adipisici elit, sed eiusmod tempor
          incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
          nostrud exercitation ullamco laboris nisi ut aliquid ex ea commodi
          consequat. Quis aute iure reprehenderit in voluptate velit esse cillum
          dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non
          proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
          '</p>',
        ];
      case 'h2':
      case 'h3':
      case 'h4':
        return [
          `<intertitle>${children.replaceAll(/(&nbsp;|{' '})/gi, ' ')}</intertitle>`,
        ];
      case 'p':
        return [`<p>${children.replaceAll(/(&nbsp;|{' '})/gi, ' ')}</p>`];
      // possible enhancement regarding other elements like video, images or other embeds
    }
  });
  clipboardy.writeSync(result.flat(1).join('\n'));
  green(
    `🎉 The Vivi XML code has been saved to your clipboard!`,
    friedbertUrl
      ? `Go to ${friedbertUrl.replace(
          /friedbert-preview.zeit.de/,
          'vivi.zeit.de/repository',
        )}/@@xml_source_view.html and paste it where the content belongs`
      : '',
  );
} else {
  red('No <Template> tag found');
}
