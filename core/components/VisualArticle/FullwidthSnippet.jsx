import scriptContent from './fullwidth-script.js?raw';

import './FullwidthSnippet.scss';

/**
 * Only use once per App.
 * This makes the article fullwidth, with custom header. It loads the CSS and inlines the JS into the page.
 */
function VisualArticleSnippet() {
  return <script dangerouslySetInnerHTML={{__html: scriptContent}} />;
}

export default VisualArticleSnippet;
