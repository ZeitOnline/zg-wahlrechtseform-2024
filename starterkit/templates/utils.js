import {renderToString} from 'react-dom/server';

export function replaceComments({html, slots}) {
  for (const [key, content] of Object.entries(slots)) {
    if (content) {
      const regex = new RegExp(
        `<!-- slot:start:${key} -->.*?<!-- slot:end:${key} -->`,
        'gis',
      );

      html = html.replace(regex, renderToString(content));
    }
  }
  return html;
}
