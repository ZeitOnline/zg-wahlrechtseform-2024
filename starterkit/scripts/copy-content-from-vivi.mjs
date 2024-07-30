import fetch from 'node-fetch';
import chalk from 'chalk';
import path from 'path';
import fs from 'fs';
import * as cheerio from 'cheerio';
import * as dotenv from 'dotenv';
dotenv.config();
const green = (...args) => console.log(chalk.hex('#1CDE7E')(...args));
const red = (...args) => console.log(chalk.hex('#F54A2B')(...args));

const friedbertUrl = process.env.FRIEDBERT_URL;

const appName = process.argv[2] || 'index';
const appsDir = new URL('../../src/apps', import.meta.url);
const outputFile = path.join(appsDir.pathname, appName, 'pages', 'index.jsx');

const ignoreAttrs = ['progressor'];

/**
 * Für dieses Skript, benötigst du dein Single-Sign-On Login-Cookie!
 * Kopier es dir am einfachsten aus dem Browser, indem du die obige URL ansteuerst,
 * den Netzwerk-Tab öffnest, dort das Hauptdokument suchst und dann in den Anfragekopfzeilen
 * nach dem Eintrag `cookie` suchst, diesen Rechts-Klickst und "Wert Kopieren" benutzt.
 * Geh anschließend in die `.env` Datei im Haupt-Projekt-Verzeichnis und kopiere den Inhalt dorthin.
 */
const opts = {
  headers: {
    cookie: process.env.COOKIE,
  },
};

async function main() {
  if (!friedbertUrl) {
    red(`💥 You forgot to enter a Friedbert URL in your .env file`);
    process.exit(0);
  }
  console.log(`will fetch ${friedbertUrl}`);
  const response = await fetch(friedbertUrl, opts);
  const document = await response.text();
  const $ = await cheerio.load(document);
  const elements = $('.article-page').children().toArray();
  if ($('title').text().match('Sign in')) {
    red(
      "💥 You're not authenticated! Copy your Cookie from your Browser and store it in .env first!",
    );
    process.exit(0);
  }
  console.log(`Fetch was successful: Processing ${elements.length} elements`);

  let pembedList = [];

  const result = elements.map((el) => {
    // we can ignore e.g. the visual-article-pembed which is a script if ($(el).prop('tagName') === 'SCRIPT') return;
    const htmlString = $.html(el);
    // map over all entries that have a data-prop attribute
    if (htmlString.match(/<div.*data-render.*/)) {
      // create new JSX Tag for a vivi embed
      let result = '<ViviEmbed ';
      // re-add all the attributes to the newly created embed node
      const attrs = getAllAttributes(el)
        // we don't need data-render
        .filter(({name}) => !['data-render'].includes(name))
        // convert dashes to camelCase to match JSX syntax
        .map(({name, ...d}) => ({
          ...d,
          name: name
            .replace(/^data-prop-(vivi-)?(embed-)?/, '')
            .replace(/-([a-z])/g, function (g) {
              return g[1].toUpperCase();
            }),
        }))
        .filter(({name}) => !ignoreAttrs.includes(name))
        // remove duplicates
        .filter((v, i, a) => a.map((d) => d?.name).indexOf(v?.name) === i)
        .map(({name, value}) => {
          // just a side effect
          result += `${name}="${value}" `;
          return {name, value};
        });
      // close JSX Tag
      result += '/>';
      // is an array of arrays of attributes
      pembedList.push(attrs);
      return result;
    } else {
      return (
        htmlString
          // make line breaks valid JSX
          .replaceAll(/<br\s*>/gim, '<br />')
          // add slash before closing <img>
          .replaceAll(/\s{2,}>\s/gim, '/>')
          .replaceAll(/<source(.*?)>\s/gim, '<source$1 />')
          .replaceAll(/alt="(.*?)">/gim, 'alt="$1" />')
          // html comments to jsx comments
          .replaceAll('<!--', '{/*')
          .replaceAll('-->', '*/}')
          // media tags (usually by ai2html)
          .replaceAll(/<\/style>/gim, '` }} />')
          .replaceAll(
            /<style(.*?)>/gim,
            '<style$1 dangerouslySetInnerHTML={{ __html: `',
          )
          // script tags (usually by ai2html)
          .replaceAll(/<\/script>/gim, '` }} />')
          .replaceAll(
            /<script(.*?)>/gim,
            '<script$1 dangerouslySetInnerHTML={{ __html: `',
          )
          // manual spans
          .replaceAll(/&lt;/g, '<')
          .replaceAll(/&gt;/g, '>')
          // empty styles
          .replaceAll(/ style=""/gim, '')
          // other string styles
          .replaceAll(
            /style="(.*?)"/gim,
            (_, match) => 'style={' + styleStringToObject(match) + '}',
          )
          // replace byline with real BylineSnippet
          .replace(/<div class=".*?byline.*?"><\/div>/gim, '<BylineSnippet />')
          // remove noscript from around videos to have plain old <video tags locally
          .replaceAll(/<noscript>\n\s*<video/gim, '<video')
          .replaceAll(/<\/video>\s*<\/noscript>/gim, '</video>')
          // makes infobox work on a minimum level
          .replaceAll(/js-infobox/gim, 'js')
          // jsx things
          .replaceAll(/class=/gim, 'className=')
          .replaceAll(/srcset="/gim, 'srcSet="')
          .replaceAll(/itemprop="/gim, 'itemProp="')
          .replaceAll(/itemscope="/gim, 'itemScope="')
          .replaceAll(/itemtype="/gim, 'itemType="')
          .replaceAll(/autoplay/gim, 'autoPlay')
          .replaceAll(/playsinline/gim, 'playsInline')
          .replaceAll(/target="_blank"/gim, 'target="_blank" rel="noreferrer"')
          // eslint-disable-next-line no-irregular-whitespace
          .replaceAll(/​/gim, '')
        // TODO: Double Quotes durch &quot; ersetzen, aber nur jene innerhalb des Texts
      );
    }
  });

  checkForDuplicates(pembedList);

  // This function can test whether the order of the pembeds is correct, meaning:
  // no start without an end, no end before a start
  testEmbeds({
    name: 'Waypoint',
    opening: 'projectid-waypoint-start',
    closing: 'projectid-waypoint-ende',
  })(pembedList);

  console.log(`Processing done: ${pembedList.length} pembeds parsed`);

  try {
    const title = $('.article-heading__title').text().trim();
    const teaser = $('.article__intro .summary').text().trim();
    const kicker = $('.article-heading__kicker').text().trim();
    // clipboardy.writeSync(result.join('\n'));
    const before = fs.readFileSync(outputFile, 'utf-8');
    let after = before.replace(
      // /(<[a-z]+Template[^>]*>)[\s\S]*?(<\/[a-z]+Template>)/i,
      /(<[a-z]+Template[\s\S]+?>$)[\s\S]*?(<\/[a-z]+Template>)/gim,
      `$1\n${result.join('\n')}\n$2`,
    );
    after = addMeta(after, {title, teaser, kicker});

    fs.writeFileSync(outputFile, after);

    green(
      `🎉 The JSX code has been written to ${outputFile.replace(
        /.*src/,
        'src',
      )} and will be ran through prettier next`,
    );
  } catch (e) {
    red(e);
  }

  return result;
}

function getAllAttributes(node) {
  return (
    node.attributes ||
    Object.keys(node.attribs).map((name) => ({name, value: node.attribs[name]}))
  );
}

function styleStringToObject(string) {
  const r = /(?<=^|;)\s*([^:]+)\s*:\s*([^;]+)\s*/g,
    o = {};
  string.replace(
    r,
    (m, p, v) => (o[p.replace(/-(.)/g, (_, p) => p.toUpperCase())] = v),
  );
  return JSON.stringify(o);
}

main();

function checkForDuplicates(
  instances,
  idAttrNames = ['waypoint-id', 'identifier'],
) {
  const groups = idAttrNames.map((attrName) => {
    return instances.filter((d) => d.name === attrName).map((d) => d.value);
  });
  let allGood = true;
  groups.forEach((group, j) => {
    group.forEach((d, i, a) => {
      if (i !== a.indexOf(d)) {
        allGood = false;
        red(`⚠️ ID error: duplicate id ${d} in category ${idAttrNames[j]}`);
      }
    });
  });
  if (!allGood) {
    process.exit(0);
  }
}

const testEmbeds =
  ({
    name = 'Static Scrollytelling',
    opening = 'projectid-waypoint-start',
    dividing = null,
    closing = 'projectid-waypoint-ende',
  }) =>
  (pembedList) => {
    if (opening === 'projectid-waypoint-start') {
      red(
        `⚠️ Replace the default opening id with a real one where testEmbeds(…) is called to test if the order of pembeds is correct`,
      );
    }
    const isOpenEnded = pembedList.reduce((hasBeenStarted, d, i) => {
      const current = d.find(({name}) => name === 'name');
      if (!current) return hasBeenStarted;
      if (current.value === opening) {
        if (hasBeenStarted === true)
          red(
            `⚠️ Order error: Opening a ${name} but last one did not end yet (pos ${i})`,
          );
        return true;
      }
      if (current.value === dividing) {
        if (hasBeenStarted !== true)
          red(
            `⚠️ Order error: Dividing a ${name} but none is started (pos ${i})`,
          );
      }
      if (current.value === closing) {
        if (hasBeenStarted !== true)
          red(
            `⚠️ Order error: Closing a ${name} but none is started (pos ${i})`,
          );
        return false;
      }
      return hasBeenStarted;
    }, false);
    if (isOpenEnded) {
      red(`⚠️ Not closed error: ${name} is open ended (not closed)`);
    }
    return isOpenEnded;
  };

function addMeta(content, {title, teaser, kicker}) {
  if (content.includes('title='))
    content = content.replace(/title="[^"]*"/, `title="${title}"`);
  else
    content = content.replace(
      /<([a-z]+)Template/i,
      `<$1Template\ntitle="${title}"`,
    );
  if (content.includes('teaser='))
    content = content.replace(/teaser="[^"]*"/, `teaser="${teaser}"`);
  else
    content = content.replace(
      /<([a-z]+)Template/i,
      `<$1Template\nteaser="${teaser}"`,
    );
  if (content.includes('kicker='))
    content = content.replace(/kicker="[^"]*"/, `kicker="${kicker}"`);
  else
    content = content.replace(
      /<([a-z]+)Template/i,
      `<$1Template\nkicker="${kicker}"`,
    );
  return content;
}
